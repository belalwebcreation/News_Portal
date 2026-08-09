import TextFieldsManager from "./TextFieldsManager";

const FIELDS = [
  {
    name: "contactAddress",
    label: "ঠিকানা (Address)",
    type: "textarea",
    placeholder: "১২৩ প্রেস ক্লাব সড়ক, মতিঝিল, ঢাকা-১০০০",
    maxLength: 200,
  },
  { name: "contactPhone", label: "ফোন (Phone)", type: "tel", placeholder: "+৮৮০ ১৭০০-০০০০০০" },
  { name: "contactEmail", label: "ইমেইল (Email)", type: "email", placeholder: "news@example.com" },
];

const ContactManager = ({ settings, refreshSettings, onClose }) => (
  <TextFieldsManager
    title="যোগাযোগের তথ্য"
    description="ফুটারের ডান পাশে দেখানো যোগাযোগ কার্ড।"
    fields={FIELDS}
    values={{
      contactAddress: settings?.contactAddress,
      contactPhone: settings?.contactPhone,
      contactEmail: settings?.contactEmail,
    }}
    visibilityKey="contactVisible"
    currentVisibility={settings?.contactVisible ?? true}
    onSaveSuccess={refreshSettings}
    onClose={onClose}
  />
);

export default ContactManager;