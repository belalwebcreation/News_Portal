/**
 * FIX (review item #6 — gallery reorder requires reindexing 1,2,3,4...):
 *
 * Instead of sequential integers (which force you to rewrite every row's
 * `order` whenever one image moves), new items are assigned a key roughly
 * midway between their neighbours, with a large gap (GAP) between
 * originally-inserted items. Moving an image between two others only ever
 * touches THAT ONE row.
 *
 * This is a simpler cousin of the fractional-indexing / LexoRank technique
 * used by Notion, Linear, Jira, etc. Those use base-36 STRING keys so the
 * key space never runs out; this uses plain floats, which is easier to
 * reason about and fast enough for the list sizes a news gallery actually
 * has (a handful to a few dozen images). If a gallery ever needs to
 * support thousands of reorderable items, swap this for the
 * `fractional-indexing` npm package using the same keyBetween() call
 * signature.
 */

const GAP = 1000;
const MIN_GAP = 1e-6; // below this, there's no usable room left — rebalance

/** Key for inserting between `prevKey` and `nextKey` (either may be null/undefined for start/end). */
export function keyBetween(prevKey, nextKey) {
  const hasPrev = prevKey !== null && prevKey !== undefined;
  const hasNext = nextKey !== null && nextKey !== undefined;

  if (!hasPrev && !hasNext) return GAP;
  if (!hasPrev) return nextKey / 2;
  if (!hasNext) return prevKey + GAP;
  return (prevKey + nextKey) / 2;
}

/** True when there's no floating-point room left to insert between the two keys. */
export function needsRebalance(prevKey, nextKey) {
  if (prevKey === null || prevKey === undefined) return false;
  if (nextKey === null || nextKey === undefined) return false;
  return Math.abs(nextKey - prevKey) < MIN_GAP;
}

/** Evenly-spaced keys for a full rebalance pass (run occasionally, e.g. via an admin action or background job). */
export function rebalance(count) {
  return Array.from({ length: count }, (_, i) => (i + 1) * GAP);
}
