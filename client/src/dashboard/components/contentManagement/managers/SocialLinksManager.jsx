import TextFieldsManager from "./TextFieldsManager";

const FIELDS = [
  { name: "socialFacebook", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/yourpage" },
  { name: "socialX", label: "X (Twitter) URL", type: "url", placeholder: "https://x.com/yourpage" },
  { name: "socialYoutube", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/@yourchannel" },
  { name: "socialInstagram", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/yourpage" },
];

const SocialLinksManager = ({ settings, refreshSettings, onClose }) => (
  <TextFieldsManager
    title="সোশ্যাল লিংক"
    description="ফুটারে দেখানো সোশ্যাল মিডিয়া আইকনগুলোর লিংক।"
    fields={FIELDS}
    values={{
      socialFacebook: settings?.socialFacebook,
      socialX: settings?.socialX,
      socialYoutube: settings?.socialYoutube,
      socialInstagram: settings?.socialInstagram,
    }}
    visibilityKey="socialLinksVisible"
    currentVisibility={settings?.socialLinksVisible ?? true}
    onSaveSuccess={refreshSettings}
    onClose={onClose}
  />
);

export default SocialLinksManager;