/**
 * FIX (review item #10 — `Object.assign(news, restoredData)` is dangerous):
 * A blind Object.assign copies EVERY key from the old snapshot onto the
 * live document — including keys that no longer mean the same thing, and
 * OMITTING fields the schema has since grown (permissions, workflowState,
 * approvalLevel, etc.), which either get overwritten with stale data or
 * silently vanish depending on how the assign lands.
 *
 * Restoring should be schema-aware: only copy back the fields that are
 * actually part of "content" (the stuff a revision is meant to version),
 * and leave everything else on the live document (lifecycle/permission
 * fields, counters, timestamps) untouched.
 *
 * Add new CONTENT fields here as the schema grows. Deliberately excluded:
 * _id, __v, createdAt, updatedAt, deletedAt, views, likesCount,
 * commentsCount, and anything permission/workflow-related.
 */
const RESTORABLE_FIELDS = [
  'title',
  'slug',
  'blocks',
  'excerpt',
  'category',
  'tags',
  'location',
  'featureImage',
  'galleryImages',
  'writers',
  'status',
  'priority',
  'publishedAt',
  'scheduledAt',
];

export function applyRestorableFields(newsDoc, restoredData) {
  for (const field of RESTORABLE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(restoredData, field)) {
      newsDoc[field] = restoredData[field];
    }
  }
  return newsDoc;
}

export { RESTORABLE_FIELDS };
