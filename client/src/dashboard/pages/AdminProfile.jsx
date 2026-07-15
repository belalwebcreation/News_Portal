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
    <div className="max-w-5xl mx-auto">
      {/* Banner + avatar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-500" />

        <div className="px-4 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-14 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center border-2 border-white hover:bg-amber-800 transition"
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
                  <h1 className="text-xl font-bold text-gray-900">{formData.fullName}</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {formData.designation} • Rajshahi College News Portal
                </p>
              </div>
            </div>

            <div className="flex gap-5 sm:gap-6 pb-1">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">128</p>
                <p className="text-xs text-gray-500 whitespace-nowrap">News Managed</p>
              </div>
              <div className="text-center border-l border-gray-100 pl-5 sm:pl-6">
                <p className="text-lg font-bold text-gray-900">Jan 2024</p>
                <p className="text-xs text-gray-500 whitespace-nowrap">Member Since</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback message */}
      {savedMessage && (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
          <FiCheck size={16} />
          {savedMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200 flex gap-6 overflow-x-auto">
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
                ? 'border-amber-700 text-amber-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile information tab */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveInfo} className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleInfoChange('fullName', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleInfoChange('designation', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInfoChange('email', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInfoChange('phone', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100 transition"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => handleInfoChange('bio', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100 transition resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              type="button"
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-700 text-white text-sm font-medium hover:bg-amber-800 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Change password tab */}
      {activeTab === 'security' && (
        <form onSubmit={handleUpdatePassword} className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 max-w-lg">
          {passwordError && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
              {passwordError}
            </div>
          )}

          <div className="space-y-5">
            {PASSWORD_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <div className="relative">
                  <input
                    type={showPassword[field.key] ? 'text' : 'password'}
                    value={passwordData[field.key]}
                    onChange={(e) => handlePasswordChange(field.key, e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword[field.key] ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-700 text-white text-sm font-medium hover:bg-amber-800 transition"
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