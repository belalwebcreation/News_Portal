import AuditLog from '../models/auditLogModel.js';

/**
 * FIX (review item #3 — too many writes inside one transaction):
 * News + Revision writes need to be atomic with each other, but the audit
 * trail does not need to be atomic with the content change — and forcing
 * it into the same transaction only makes the transaction bigger, slower,
 * and more likely to conflict/abort under load.
 *
 * This is intentionally fire-and-forget: call it AFTER the main
 * transaction commits. If you need guaranteed delivery, replace the body
 * with a queue publish (BullMQ) that retries independently of the
 * request lifecycle, instead of writing directly to Mongo here.
 */
export function logAuditAsync({ action, actor, targetId, meta }) {
  AuditLog.create({ action, actor, targetId, meta }).catch((err) => {
    // Never let an audit-log failure surface as a request failure.
    console.error(`[audit-log] failed to record "${action}" for ${targetId}:`, err.message);
    // TODO: forward to a dead-letter queue / error tracker (Sentry, etc.)
  });
}

/**
 * Outbox-pattern stub (review item #7 mentions Outbox explicitly).
 * Call AFTER the transaction commits. In production this should push to
 * a durable queue (BullMQ/Redis Streams) that a worker drains to do
 * cache invalidation, search reindexing, and notifications — not run
 * those side effects synchronously inside the request.
 */
export async function enqueueOutboxEvent(eventName, payload) {
  // Replace with: await outboxQueue.add(eventName, payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
  console.log(`[outbox] queued event "${eventName}"`, payload);
}
