import { useState } from "react";
import { History, Info, AlertTriangle, MapPin, Phone, Mail, ArrowUp } from "lucide-react";

// ==========================================================
// Fonts — সাইটের অন্যান্য পাতার সাথে সামঞ্জস্যপূর্ণ
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
      "নির্ভুল সংবাদ পরিবেশন আমাদের প্রধান অঙ্গীকার। তারপরও প্রতিবেদনে ভুল হতে পারে — এবং তেমন কিছু ঘটলে তা স্বচ্ছভাবে স্বীকার করে দ্রুত সংশোধন করাই আমাদের নীতি।",
      "এই পাতায় ব্যাখ্যা করা হয়েছে, আমরা কীভাবে ভুল শনাক্ত করি, সংশোধন করি এবং পাঠকদের জানাই।",
    ],
  },
  {
    id: "types",
    title: "সংশোধনীর ধরন",
    body: ["ভুলের গুরুত্ব অনুযায়ী আমরা নিম্নলিখিত শ্রেণিতে ভাগ করি:"],
    list: [
      "সংশোধনী (Correction) — তথ্যগত ভুল, যেমন ভুল নাম, তারিখ বা পরিসংখ্যান",
      "স্পষ্টীকরণ (Clarification) — বিভ্রান্তিকর বা অস্পষ্ট বাক্য সহজবোধ্য করে পুনরায় লেখা",
      "হালনাগাদ (Update) — নতুন তথ্য যুক্ত হওয়ায় প্রতিবেদন সম্প্রসারণ",
      "প্রত্যাহার (Retraction) — গুরুতর ভুল বা নীতিমালা লঙ্ঘনের কারণে সম্পূর্ণ প্রতিবেদন সরিয়ে নেওয়া",
    ],
  },
  {
    id: "report",
    title: "কীভাবে ভুল জানাবেন",
    body: [
      "কোনো প্রতিবেদনে ভুল চোখে পড়লে অনুগ্রহ করে আমাদের জানান। দ্রুত পর্যালোচনার জন্য বার্তায় যা উল্লেখ করবেন:",
    ],
    list: [
      "প্রতিবেদনের শিরোনাম ও লিংক",
      "কোন অংশে ভুল আছে তার সংক্ষিপ্ত বিবরণ",
      "সঠিক তথ্য বা সূত্র (যদি জানা থাকে)",
    ],
  },
  {
    id: "process",
    title: "পর্যালোচনা প্রক্রিয়া",
    body: [
      "প্রতিটি অভিযোগ সংশ্লিষ্ট প্রতিবেদক ও সম্পাদকীয় দল যাচাই করে। প্রয়োজনে মূল সূত্রের সাথে পুনরায় যোগাযোগ করা হয়।",
      "যাচাই সম্পন্ন হওয়ার পর নিশ্চিত ভুল যত দ্রুত সম্ভব সংশোধন করা হয়। জটিল বা স্পর্শকাতর বিষয়ে সময় কিছুটা বেশি লাগতে পারে।",
    ],
  },
  {
    id: "publish",
    title: "সংশোধনী প্রকাশের পদ্ধতি",
    body: [
      "ছোটখাটো বানান বা টাইপোগত ভুল নীরবে ঠিক করা হতে পারে। তথ্যগত ভুলের ক্ষেত্রে প্রতিবেদনের নিচে একটি সংশোধনী নোট যুক্ত করা হয়, যেখানে কী পরিবর্তন হয়েছে এবং কবে তা উল্লেখ থাকে।",
      "উল্লেখযোগ্য সংশোধনীর ক্ষেত্রে প্রতিবেদনের শুরুতেও একটি সংক্ষিপ্ত নোটিশ যুক্ত করা হয়, যাতে পাঠক সহজেই তা লক্ষ করতে পারেন।",
    ],
  },
  {
    id: "retraction",
    title: "প্রত্যাহার নীতি",
    body: [
      "কোনো প্রতিবেদন মৌলিকভাবে ভুল তথ্যের ওপর ভিত্তি করে প্রকাশিত হলে, বা নীতিমালা গুরুতরভাবে লঙ্ঘিত হলে, তা প্রত্যাহার করা হতে পারে। প্রত্যাহারের কারণ ব্যাখ্যা করে একটি নোটিশ প্রকাশ করা হয়, প্রতিবেদনটি নীরবে মুছে ফেলা হয় না।",
    ],
  },
  {
    id: "feedback",
    title: "পাঠকের প্রতিক্রিয়া",
    body: [
      "পাঠকদের সতর্ক দৃষ্টিই নির্ভুল সাংবাদিকতার একটি গুরুত্বপূর্ণ অংশ। কোনো প্রতিবেদনে অসঙ্গতি মনে হলে জানাতে দ্বিধা করবেন না — এটি আমাদের কনটেন্টের মান উন্নত রাখতে সাহায্য করে।",
    ],
  },
];

function Corrections({
  lastUpdated = "৮ আগস্ট, ২০২৬",
  address = "১২৩ প্রেস ক্লাব সড়ক, মতিঝিল, ঢাকা-১০০০",
  phone = "+৮৮০ ১৭০০-০০০০০০",
  email = "corrections@example.com",
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
            <History size={14} />
            সংশোধনী নীতি
          </span>
          <h1
            style={displayFont}
            className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl"
          >
            ভুল স্বীকার করি, দ্রুত সংশোধন করি
          </h1>
          <p className="mt-3 text-sm text-slate-500">সর্বশেষ হালনাগাদ: {lastUpdated}</p>
        </div>
      </section>

      {/* ================= Draft Notice ================= */}
      <div className="mx-auto max-w-[1100px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800">
            এই পাতাটি একটি প্রাথমিক খসড়া কাঠামো হিসেবে তৈরি। চূড়ান্তভাবে প্রকাশের আগে সম্পাদকীয় দলের প্রকৃত
            কর্মপ্রবাহ অনুযায়ী কনটেন্ট যাচাই করে নেওয়ার পরামর্শ দেওয়া হচ্ছে।
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

                {/* এই সেকশনেই ভুল রিপোর্টের শর্টকাট CTA */}
                {section.id === "report" && (
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent("প্রতিবেদনে ভুল সংক্রান্ত রিপোর্ট")}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
                  >
                    <AlertTriangle size={16} />
                    ভুল রিপোর্ট করুন
                  </a>
                )}
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
                সংশোধনী নীতি সম্পর্কিত কোনো প্রশ্ন বা প্রতিবেদন সংক্রান্ত অভিযোগ থাকলে নিচের যেকোনো মাধ্যমে
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

export default Corrections;
