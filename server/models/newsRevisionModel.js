import mongoose from 'mongoose';

// -------------------------------------------------------------------------
// FIX (review item #1 — the biggest one: unbounded snapshot growth):
// Storing the FULL document on every single revision means a 300KB
// article with 200 edits costs ~60MB in the revisions collection alone —
// that explodes fast across a million articles. Real version-control
// systems (Git included) don't store full snapshots every commit; they
// store a full "checkpoint" occasionally and small diffs in between.
//
// revisionType: 'checkpoint' -> `snapshot` holds the full document state.
// revisionType: 'patch'      -> `patch` holds an RFC 6902 JSON Patch
//                                (via the `fast-json-patch` package)
//                                describing the change from the previous
//                                reconstructed state.
//
// See server/services/revisionService.js for how these are created and
// how a target revision is reconstructed by replaying patches forward
// from the nearest checkpoint.
// -------------------------------------------------------------------------
const newsRevisionSchema = new mongoose.Schema({
  newsId: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  parentRevisionId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewsRevision', default: null },

  revisionType: { type: String, enum: ['checkpoint', 'patch'], required: true },

  // Only populated when revisionType === 'checkpoint'
  snapshot: { type: mongoose.Schema.Types.Mixed, default: undefined },

  // Only populated when revisionType === 'patch' — an array of RFC 6902
  // operations ({ op, path, value? }) produced by fast-json-patch.
  patch: { type: [mongoose.Schema.Types.Mixed], default: undefined },

  commitMessage: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  revisionNumber: { type: Number, required: true }
}, { timestamps: true });

newsRevisionSchema.index({ newsId: 1, revisionNumber: -1 });

const NewsRevision = mongoose.model('NewsRevision', newsRevisionSchema);
export default NewsRevision;
