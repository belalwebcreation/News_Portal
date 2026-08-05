import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // 'NEWS_PUBLISH', 'USER_LOGIN', etc.
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
  meta: {
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    deviceFingerprint: { type: String, default: null },
    country: { type: String, default: 'Unknown' },
    reason: { type: String, default: '' }
  }
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });
const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
