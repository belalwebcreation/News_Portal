import React, { useRef, useState } from 'react';
import { FiCamera, FiCheck, FiEye, FiEyeOff, FiMail, FiPhone } from 'react-icons/fi';

const TABS = [
  { id: 'info', label: 'Profile Information' },
  { id: 'security', label: 'Change Password' },
];

const PASSWORD_FIELDS = [
  { key: 'current', label: 'Current Password' },
  { key: 'newPassword', label: 'New Password' },
  { key: 'confirm', label: 'Confirm New Password' },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const fileInputRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState(
    'https://ui-avatars.com/api/?name=Belal+Hossain&background=D97706&color=fff&size=200&bold=true'
  );

  const [formData, setFormData] = useState({
    fullName: 'Belal Hossain',
    email: 'belal@rajshahicollege.edu.bd',
    phone: '+880 1XXX-XXXXXX',
    designation: 'Administrator',
    bio: 'Managing news content and writers for Rajshahi College News Portal.',
  });

  const [passwordData, setPasswordData] = useState({ current: '', newPassword: '', confirm: '' });
  const [showPassword, setShowPassword] = useState({ current: false, newPassword: false, confirm: false });

  const [savedMessage, setSavedMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleInfoChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveInfo = (e) => {
    e.preventDefault();
    setSavedMessage('Profile updated successfully.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordData.current || !passwordData.newPassword || !passwordData.confirm) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirm) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setSavedMessage('Password updated successfully.');
    setPasswordData({ current: '', newPassword: '', confirm: '' });
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto font-meta">
      {/* Banner + avatar */}
      <div className="bg-paper dark:bg-ink rounded-xl border border-ink/10 dark:border-paper/10 shadow-sm overflow-hidden">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-[var(--accent)] via-[var(--accent)]/80 to-[var(--accent)]/40" />

        <div className="px-4 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-14 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-paper dark:border-ink shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--accent)] text-paper flex items-center justify-center border-2 border-paper dark:border-ink transition hover:brightness-110 active:brightness-95"
                >
                  <FiCamera size={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl font-medium tracking-tight text-ink dark:text-paper">{formData.fullName}</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
                <p className="text-sm text-graphite dark:text-paper/60 mt-0.5">
                  {formData.designation} • Rajshahi College News Portal
                </p>
              </div>
            </div>

            <div className="flex gap-5 sm:gap-6 pb-1">
              <div className="text-center">
                <p className="font-display text-lg font-medium text-ink dark:text-paper">128</p>
                <p className="text-[11px] uppercase tracking-wider text-graphite dark:text-paper/50 whitespace-nowrap">News Managed</p>
              </div>
              <div className="text-center border-l border-ink/10 dark:border-paper/10 pl-5 sm:pl-6">
                <p className="font-display text-lg font-medium text-ink dark:text-paper">Jan 2024</p>
                <p className="text-[11px] uppercase tracking-wider text-graphite dark:text-paper/50 whitespace-nowrap">Member Since</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback message */}
      {savedMessage && (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
          <FiCheck size={16} />
          {savedMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 border-b border-ink/10 dark:border-paper/10 flex gap-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setPasswordError('');
            }}
            className={`pb-3 px-1 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-graphite hover:text-ink dark:text-paper/50 dark:hover:text-paper'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile information tab */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveInfo} className="mt-6 bg-paper dark:bg-ink rounded-xl border border-ink/10 dark:border-paper/10 shadow-sm p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-graphite dark:text-paper/60 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleInfoChange('fullName', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-ink/15 dark:border-paper/15 bg-paper dark:bg-ink text-ink dark:text-paper outline-hidden focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-graphite dark:text-paper/60 mb-1.5">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleInfoChange('designation', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-ink/15 dark:border-paper/15 bg-paper dark:bg-ink text-ink dark:text-paper outline-hidden focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-graphite dark:text-paper/60 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite dark:text-paper/40" size={16} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInfoChange('email', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ink/15 dark:border-paper/15 bg-paper dark:bg-ink text-ink dark:text-paper outline-hidden focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-graphite dark:text-paper/60 mb-1.5">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite dark:text-paper/40" size={16} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInfoChange('phone', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ink/15 dark:border-paper/15 bg-paper dark:bg-ink text-ink dark:text-paper outline-hidden focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-graphite dark:text-paper/60 mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => handleInfoChange('bio', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-ink/15 dark:border-paper/15 bg-paper dark:bg-ink text-ink dark:text-paper outline-hidden focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-ink/10 dark:border-paper/10">
            <button
              type="button"
              className="px-5 py-2.5 rounded-lg border border-ink/15 dark:border-paper/15 text-sm font-bold text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-paper/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-paper text-sm font-bold shadow-lg shadow-[var(--accent)]/25 hover:brightness-110 active:brightness-95 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Change password tab */}
      {activeTab === 'security' && (
        <form onSubmit={handleUpdatePassword} className="mt-6 bg-paper dark:bg-ink rounded-xl border border-ink/10 dark:border-paper/10 shadow-sm p-5 sm:p-6 max-w-lg">
          {passwordError && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30">
              {passwordError}
            </div>
          )}

          <div className="space-y-5">
            {PASSWORD_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-graphite dark:text-paper/60 mb-1.5">{field.label}</label>
                <div className="relative">
                  <input
                    type={showPassword[field.key] ? 'text' : 'password'}
                    value={passwordData[field.key]}
                    onChange={(e) => handlePasswordChange(field.key, e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-ink/15 dark:border-paper/15 bg-paper dark:bg-ink text-ink dark:text-paper outline-hidden focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite hover:text-ink dark:text-paper/50 dark:hover:text-paper"
                  >
                    {showPassword[field.key] ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-ink/10 dark:border-paper/10">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-(--accent) text-paper text-sm font-bold shadow-lg shadow-[var(--accent)]/25 hover:brightness-110 active:brightness-95 transition"
            >
              Update Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;