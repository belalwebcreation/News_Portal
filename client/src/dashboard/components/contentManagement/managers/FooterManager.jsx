import TextFieldsManager from "./TextFieldsManager";

const FIELDS = [
  {
    name: "siteName",
    label: "সাইটের নাম (Site Name)",
    type: "text",
    placeholder: "সংবাদ প্রবাহ",
    maxLength: 60,
  },
  {
    name: "tagline",
    label: "ট্যাগলাইন (Tagline)",
    type: "text",
    placeholder: "নির্ভরযোগ্য খবর, প্রতিটি মুহূর্তে",
    maxLength: 120,
  },
  {
    name: "aboutText",
    label: "সংক্ষিপ্ত পরিচিতি (About Text)",
    type: "textarea",
    placeholder: "পত্রিকা সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন...",
    maxLength: 400,
  },
];

const FooterManager = ({ settings, refreshSettings, onClose }) => (
  <TextFieldsManager
    title="ফুটার ব্র্যান্ড তথ্য"
    description="ফুটারের বাম পাশে দেখানো সাইটের নাম, ট্যাগলাইন ও পরিচিতি।"
    fields={FIELDS}
    values={{
      siteName: settings?.siteName,
      tagline: settings?.tagline,
      aboutText: settings?.aboutText,
    }}
    visibilityKey="footerVisible"
    currentVisibility={settings?.footerVisible ?? true}
    onSaveSuccess={refreshSettings}
    onClose={onClose}
  />
);

export default FooterManager;