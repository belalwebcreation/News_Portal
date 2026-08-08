import { useState } from "react";
import { ShieldCheck, Info, MapPin, Phone, Mail, ArrowUp } from "lucide-react";

// ==========================================================
// Fonts — Footer.jsx / Advertise.jsx এর সাথে সামঞ্জস্যপূর্ণ
// ==========================================================
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');`;

const displayFont = { fontFamily: "'Noto Serif Bengali', serif" };
const bodyFont = { fontFamily: "'Hind Siliguri', sans-serif" };

// ==========================================================
// Sections — ক্রম গুরুত্বপূর্ণ, তাই নম্বরিং সার্থক এখানে
// ==========================================================
const SECTIONS = [
  {
    id: "intro",
    title: "ভূমিকা",
    body: [
      "এই ওয়েবসাইট (এখানে “আমরা”, “আমাদের” বলতে এই নিউজ পোর্টালকে বোঝানো হয়েছে) ব্যবহারকারীদের গোপনীয়তাকে গুরুত্বের সাথে বিবেচনা করে। এই নীতিমালায় ব্যাখ্যা করা হয়েছে — আপনি যখন আমাদের ওয়েবসাইট ব্যবহার করেন, তখন আমরা কী তথ্য সংগ্রহ করি, কীভাবে তা ব্যবহার করি এবং আপনার তথ্য সুরক্ষার জন্য কী ব্যবস্থা নিই।",
      "ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি এই নীতিমালায় বর্ণিত শর্তাবলীর সাথে সম্মত হচ্ছেন বলে বিবেচিত হবে।",
    ],
  },
  {
    id: "collect",
    title: "আমরা যে তথ্য সংগ্রহ করি",
    body: [
      "আপনি নিজে যে তথ্য প্রদান করেন: অ্যাকাউন্ট তৈরি, মন্তব্য করা বা নিউজলেটার সাবস্ক্রাইব করার সময় নাম, ইমেইল ঠিকানা ও প্রোফাইল সংক্রান্ত তথ্য।",
      "স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য: আইপি ঠিকানা, ব্রাউজার ও ডিভাইসের ধরন, পরিদর্শিত পৃষ্ঠা এবং ওয়েবসাইটে অতিবাহিত সময়।",
      "কুকি ও অনুরূপ প্রযুক্তির মাধ্যমে সংগৃহীত তথ্য — বিস্তারিত নিচের “কুকি ও ট্র্যাকিং প্রযুক্তি” অংশে।",
    ],
  },
  {
    id: "use",
    title: "তথ্যের ব্যবহার",
    body: [
      "সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করা হয়:",
    ],
    list: [
      "সেবা প্রদান ও নিয়মিত উন্নত করা",
      "আগ্রহ অনুযায়ী প্রাসঙ্গিক সংবাদ ও কনটেন্ট সুপারিশ করা",
      "ওয়েবসাইটের নিরাপত্তা বজায় রাখা ও অপব্যবহার প্রতিরোধ করা",
      "প্রয়োজনে অ্যাকাউন্ট বা সেবা সংক্রান্ত বিষয়ে ব্যবহারকারীর সাথে যোগাযোগ করা",
    ],
  },
  {
    id: "cookies",
    title: "কুকি ও ট্র্যাকিং প্রযুক্তি",
    body: [
      "সাইটের সঠিক কার্যকারিতা বজায় রাখতে, লগইন সেশন মনে রাখতে এবং ব্যবহারের ধরন বুঝতে আমরা কুকি ব্যবহার করি।",
      "আপনি চাইলে ব্রাউজার সেটিংস থেকে কুকি নিয়ন্ত্রণ বা সম্পূর্ণ বন্ধ করে দিতে পারেন, তবে এতে কিছু ফিচার সঠিকভাবে কাজ নাও করতে পারে। বিস্তারিত জানতে আমাদের কুকি নীতি দেখুন।",
    ],
  },
  {
    id: "sharing",
    title: "তথ্য শেয়ারিং ও তৃতীয় পক্ষ",
    body: [
      "আমরা ব্যবহারকারীর ব্যক্তিগত তথ্য বিক্রি করি না। বিজ্ঞাপনদাতা বা অ্যানালিটিক্স পার্টনারদের সাথে শুধুমাত্র সমষ্টিগত (aggregated), অ-শনাক্তযোগ্য তথ্য শেয়ার করা হতে পারে, যা প্ল্যাটফর্ম উন্নয়নে সহায়ক হয়।",
      "আইনি বাধ্যবাধকতা, আদালতের নির্দেশ বা প্রতারণা প্রতিরোধের প্রয়োজনে সংশ্লিষ্ট কর্তৃপক্ষের সাথে তথ্য শেয়ার করা হতে পারে।",
    ],
  },
  {
    id: "security",
    title: "তথ্য সংরক্ষণ ও নিরাপত্তা",
    body: [
      "ব্যবহারকারীর তথ্য সুরক্ষিত রাখতে আমরা যুক্তিসঙ্গত প্রযুক্তিগত ও প্রশাসনিক ব্যবস্থা গ্রহণ করি। তবে ইন্টারনেটে তথ্য আদান-প্রদান সম্পূর্ণরূপে ঝুঁকিমুক্ত নয় — তাই আমরা শতভাগ নিরাপত্তার নিশ্চয়তা দিতে পারি না।",
    ],
  },
  {
    id: "rights",
    title: "ব্যবহারকারীর অধিকার",
    body: ["আপনার নিজের তথ্যের ক্ষেত্রে আপনার নিম্নলিখিত অধিকারগুলো রয়েছে:"],
    list: [
      "আপনার সংরক্ষিত তথ্য দেখার অনুরোধ করা",
      "ভুল বা অসম্পূর্ণ তথ্য সংশোধনের অনুরোধ করা",
      "অ্যাকাউন্ট ও সংশ্লিষ্ট তথ্য মুছে ফেলার অনুরোধ করা",
      "মার্কেটিং যোগাযোগ থেকে অপ্ট-আউট করা",
    ],
  },
  {
    id: "children",
    title: "শিশুদের গোপনীয়তা",
    body: [
      "এই ওয়েবসাইট সাধারণ পাঠকদের জন্য তৈরি এবং সচেতনভাবে অপ্রাপ্তবয়স্কদের কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করে না। এমন কোনো তথ্য অসাবধানতাবশত সংগৃহীত হলে অনুগ্রহ করে আমাদের জানান, যাতে তা দ্রুত অপসারণ করা যায়।",
    ],
  },
  {
    id: "changes",
    title: "নীতিমালার পরিবর্তন",
    body: [
      "সময়ে সময়ে এই গোপনীয়তা নীতি হালনাগাদ করা হতে পারে। কোনো উল্লেখযোগ্য পরিবর্তন হলে তা এই পৃষ্ঠায় প্রকাশ করা হবে এবং “সর্বশেষ হালনাগাদ”-এর তারিখ পরিবর্তন করা হবে।",
    ],
  },
];

function Privacy({
  lastUpdated = "৮ আগস্ট, ২০২৬",
  address = "১২৩ প্রেস ক্লাব সড়ক, মতিঝিল, ঢাকা-১০০০",
  phone = "+৮৮০ ১৭০০-০০০০০০",
  email = "privacy@example.com",
}) {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={bodyFont} className="bg-white text-slate-700">
      <style>{FONT_IMPORT}</style>

      {/* ================= Header ================= */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="absolute inset-x-0 top-0 h-1 bg-red-600" />
        <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            <ShieldCheck size={14} />
            গোপনীয়তা নীতি
          </span>
          <h1
            style={displayFont}
            className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl"
          >
            আপনার তথ্যের গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ
          </h1>
          <p className="mt-3 text-sm text-slate-500">সর্বশেষ হালনাগাদ: {lastUpdated}</p>
        </div>
      </section>

      {/* ================= Draft Notice ================= */}
      <div className="mx-auto max-w-[1100px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800">
            এই পাতাটি একটি প্রাথমিক খসড়া কাঠামো হিসেবে তৈরি। চূড়ান্তভাবে প্রকাশের আগে প্রতিষ্ঠানের প্রকৃত ডেটা
            প্র্যাকটিস অনুযায়ী কনটেন্ট যাচাই করে এবং সম্ভব হলে একজন আইন উপদেষ্টার মাধ্যমে পর্যালোচনা করিয়ে নেওয়ার
            পরামর্শ দেওয়া হচ্ছে।
          </p>
        </div>
      </div>

      {/* ================= Content ================= */}
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          {/* Sticky TOC */}
          <aside className="lg:col-span-1">
            <nav className="lg:sticky lg:top-24">
              <h2
                style={displayFont}
                className="text-xs font-bold uppercase tracking-wider text-slate-900"
              >
                অধ্যায়সমূহ
              </h2>
              <ul className="mt-4 space-y-1 border-l border-slate-200">
                {SECTIONS.map((section, idx) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToId(section.id)}
                      className={`-ml-px block border-l-2 py-1.5 pl-4 text-left text-sm transition-colors ${
                        activeId === section.id
                          ? "border-red-600 font-semibold text-red-600"
                          : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                      }`}
                    >
                      {idx + 1}. {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Sections */}
          <div className="lg:col-span-3 space-y-12">
            {SECTIONS.map((section, idx) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2
                  style={displayFont}
                  className="flex items-baseline gap-2 text-xl font-bold text-slate-900 sm:text-2xl"
                >
                  <span className="text-red-600">{idx + 1}.</span>
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                  {section.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  {section.list && (
                    <ul className="space-y-2 pl-1">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}

            {/* Contact */}
            <section id="contact" className="scroll-mt-24">
              <h2
                style={displayFont}
                className="flex items-baseline gap-2 text-xl font-bold text-slate-900 sm:text-2xl"
              >
                <span className="text-red-600">{SECTIONS.length + 1}.</span>
                যোগাযোগ
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                এই গোপনীয়তা নীতি সম্পর্কিত কোনো প্রশ্ন বা অনুরোধ থাকলে নিচের যেকোনো মাধ্যমে আমাদের সাথে
                যোগাযোগ করতে পারেন।
              </p>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm space-y-3 text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-red-600" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="shrink-0 text-red-600" />
                  <a href={`tel:${phone}`} className="hover:text-red-600 transition-colors">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="shrink-0 text-red-600" />
                  <a href={`mailto:${email}`} className="hover:text-red-600 transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            </section>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-red-600"
            >
              <ArrowUp size={14} />
              উপরে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
