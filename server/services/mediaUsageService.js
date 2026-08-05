import Media from '../models/mediaModel.js';

/** Pulls every Media ObjectId referenced by a News document (feature + gallery), as strings. */
export function extractMediaIds(news) {
  const ids = [];
  if (news?.featureImage?.media) ids.push(String(news.featureImage.media));
  if (Array.isArray(news?.galleryImages)) {
    news.galleryImages.forEach((g) => {
      if (g?.media) ids.push(String(g.media));
    });
  }
  return [...new Set(ids)];
}

export async function addReference(mediaIds = [], newsId, session) {
  if (!mediaIds.length) return;
  await Media.updateMany(
    { _id: { $in: mediaIds } },
    { $addToSet: { referencedBy: newsId } },
    { session }
  );
}

export async function removeReference(mediaIds = [], newsId, session) {
  if (!mediaIds.length) return;
  await Media.updateMany(
    { _id: { $in: mediaIds } },
    { $pull: { referencedBy: newsId } },
    { session }
  );
}

/**
 * Diff-aware sync: given the media IDs referenced BEFORE an edit and
 * AFTER an edit, only touches the rows that actually changed instead of
 * blindly removing then re-adding every reference.
 */
export async function syncReferences({ oldMediaIds = [], newMediaIds = [], newsId, session }) {
  const toAdd = newMediaIds.filter((id) => !oldMediaIds.includes(id));
  const toRemove = oldMediaIds.filter((id) => !newMediaIds.includes(id));
  await Promise.all([
    addReference(toAdd, newsId, session),
    removeReference(toRemove, newsId, session),
  ]);
}

/**
 * Call this from the media-delete endpoint BEFORE deleting a file.
 * Returns which (if any) articles are still using it, so the UI can show
 * "Used in: <titles>" instead of silently breaking those articles.
 */
export async function canDeleteMedia(mediaId) {
  const media = await Media.findById(mediaId)
    .select('referencedBy')
    .populate('referencedBy', 'title slug')
    .lean();

  if (!media) return { deletable: false, reason: 'Media not found.' };
  if (media.referencedBy?.length) {
    return {
      deletable: false,
      reason: `Still referenced by ${media.referencedBy.length} article(s).`,
      usedBy: media.referencedBy,
    };
  }
  return { deletable: true };
}
