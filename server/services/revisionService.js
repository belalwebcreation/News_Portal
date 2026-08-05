import jsonpatch from 'fast-json-patch';
import NewsRevision from '../models/newsRevisionModel.js';

// Every Nth revision is a full checkpoint; the rest are small diffs against
// the previously reconstructed state. Tune this: lower = more storage,
// faster restores; higher = less storage, more patches to replay.
const CHECKPOINT_INTERVAL = 20;

/**
 * Creates the next revision for a News document, choosing checkpoint vs
 * patch automatically. Must be called with the SAME mongoose `session`
 * used for the News save, so the revision is consistent with it.
 *
 * @param {Object} params
 * @param {String} params.newsId
 * @param {Object} params.currentDoc - plain object (news.toObject()) of the state AFTER this save
 * @param {String} params.commitMessage
 * @param {String} params.author
 * @param {import('mongoose').ClientSession} params.session
 */
export async function createRevision({ newsId, currentDoc, commitMessage, author, session }) {
  const lastRev = await NewsRevision.findOne({ newsId }).sort({ revisionNumber: -1 }).session(session);
  const nextRevNum = lastRev ? lastRev.revisionNumber + 1 : 1;
  const isCheckpoint = !lastRev || nextRevNum % CHECKPOINT_INTERVAL === 0;

  const doc = {
    newsId,
    parentRevisionId: lastRev ? lastRev._id : null,
    commitMessage,
    author,
    revisionNumber: nextRevNum,
  };

  if (isCheckpoint) {
    doc.revisionType = 'checkpoint';
    doc.snapshot = currentDoc;
  } else {
    const previousState = await reconstructSnapshot(newsId, lastRev._id, session);
    doc.revisionType = 'patch';
    doc.patch = jsonpatch.compare(previousState, currentDoc);
  }

  const [revision] = await NewsRevision.create([doc], { session });
  return revision;
}

/**
 * Reconstructs the full document state at a given revision by walking
 * back to the nearest checkpoint, then replaying patches forward.
 */
export async function reconstructSnapshot(newsId, revisionId, session) {
  const chain = [];
  let current = await NewsRevision.findOne({ _id: revisionId, newsId }).session(session);
  if (!current) throw new Error('Revision not found');

  while (current) {
    chain.unshift(current);
    if (current.revisionType === 'checkpoint') break;
    if (!current.parentRevisionId) {
      throw new Error('Corrupt revision chain: reached the start without finding a checkpoint');
    }
    current = await NewsRevision.findOne({ _id: current.parentRevisionId, newsId }).session(session);
  }

  if (!chain.length || chain[0].revisionType !== 'checkpoint') {
    throw new Error('Corrupt revision chain: no checkpoint found');
  }

  let state = JSON.parse(JSON.stringify(chain[0].snapshot));
  for (let i = 1; i < chain.length; i++) {
    state = jsonpatch.applyPatch(state, chain[i].patch, false, false).newDocument;
  }
  return state;
}
