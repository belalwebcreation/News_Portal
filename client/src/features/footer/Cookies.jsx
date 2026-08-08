import { useState } from "react";
import { Cookie, Info, MapPin, Phone, Mail, ArrowUp } from "lucide-react";

// ==========================================================
// Fonts — সাইটের অন্যান্য পাতার সাথে সামঞ্জস্যপূর্ণ
// ==========================================================
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');`;

const displayFont = { fontFamily: "'Noto Serif Bengali', serif" };
const bodyFont = { fontFamily: "'Hind Siliguri', sans-serif" };

// ==========================================================
// কুকির ধরন — টেবিল আকারে দেখানো হবে
// ==========================================================
const COOKIE_TYPES = [
  {
    name: "প্রয়োজনীয় কুকি",
    purpose: "লগইন সেশন ও সাইটের মৌলিক কার্যকারিতা বজায় রাখতে আবশ্যক",
    duration: "সেশন / সাইন-আউট পর্যন্ত",
  },
  {
    name: "কার্যকরী কুকি",
    purpose: "ভাষা, লে-আউট বা পঠন সংক্রান্ত পছন্দ মনে রাখে",
    duration: "সর্বোচ্চ ১ বছর",
  },
  {
    name: "বিশ্লেষণধর্মী কুকি",
    purpose: "পাঠকরা কীভাবে সাইট ব্যবহার করছেন তা বুঝে কনটেন্ট উন্নত করতে সাহায্য করে",
    duration: "সর্বোচ্চ ২ বছর",
  },
  {
    name: "বিজ্ঞাপন কুকি",
    purpose: "প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শন ও বিজ্ঞাপনের কার্যকারিতা পরিমাপে ব্যবহৃত",
    duration: "প্রদানকারী অনুযায়ী ভিন্ন হতে পারে",
  },
];

// ==========================================================
// Sections — ক্রম গুরুত্বপূর্ণ, তাই নম্বরিং সার্থক এখানে
// ==========================================================
const SECTIONS = [
  {
    id: "intro",
    title: "কুকি কী",
    body: [
      "কুকি হলো ছোট টেক্সট ফাইল, যা আপনি এই ওয়েবসাইট পরিদর্শন করলে আপনার ব্রাউজারে সংরক্ষিত হয়। এর মাধ্যমে সাইট আপনাকে মনে রাখতে পারে এবং পরবর্তী পরিদর্শনগুলো সহজ ও দ্রুততর করতে পারে।",
    ],
  },
  {
    id: "why",
    title: "আমরা কেন কুকি ব্যবহার করি",
    body: ["আমরা মূলত নিম্নলিখিত উদ্দেশ্যে কুকি ব্যবহার করি:"],
    list: [
      "আপনাকে লগইন অবস্থায় রাখা ও সেশন সচল রাখা",
      "ভাষা, লে-আউট বা পঠন সংক্রান্ত পছন্দ মনে রাখা",
      "কোন সংবাদ বা বিভাগ বেশি পঠিত হচ্ছে তা বুঝে কনটেন্ট উন্নত করা",
      "প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শন করা",
    ],
  },
  {
    id: "types",
    title: "কুকির ধরন",
    body: ["আমরা যে ধরনের কুকি ব্যবহার করি, তার সংক্ষিপ্ত বিবরণ নিচে দেওয়া হলো:"],
    table: true,
  },
  {
    id: "third-party",
    title: "তৃতীয় পক্ষের কুকি",
    body: [
      "অ্যানালিটিক্স টুল, বিজ্ঞাপন নেটওয়ার্ক বা সোশ্যাল মিডিয়া এমবেড (যেমন ইউটিউব ভিডিও, ফেসবুক পোস্ট) থেকেও কুকি সেট হতে পারে। এসব কুকি সংশ্লিষ্ট তৃতীয় পক্ষের নিজস্ব গোপনীয়তা নীতি দ্বারা পরিচালিত হয়, যার ওপর আমাদের সরাসরি নিয়ন্ত্রণ নেই।",
    ],
  },
  {
    id: "manage",
    title: "কুকি নিয়ন্ত্রণ ও বন্ধ করা",
    body: ["বেশিরভাগ ব্রাউজার থেকে আপনি কুকি দেখতে, মুছতে বা ব্লক করতে পারেন। মনে রাখবেন:"],
    list: [
      "কিছু কুকি (যেমন লগইন সেশন) বন্ধ করলে সাইটের নির্দিষ্ট ফিচার ঠিকভাবে কাজ নাও করতে পারে",
      "প্রাইভেট বা ইনকগনিটো মোডে ব্রাউজ করলে সেশন শেষে বেশিরভাগ কুকি স্বয়ংক্রিয়ভাবে মুছে যায়",
      "ব্রাউজারের সেটিংস মেনুতে সাধারণত “গোপনীয়তা” বা “কুকি” সংক্রান্ত অপশনের অধীনে এই নিয়ন্ত্রণ পাওয়া যায়",
    ],
  },
  {
    id: "changes",
    title: "নীতিমালার পরিবর্তন",
    body: [
      "সময়ে সময়ে এই কুকি নীতি হালনাগাদ করা হতে পারে। কোনো উল্লেখযোগ্য পরিবর্তন হলে তা এই পৃষ্ঠায় প্রকাশ করা হবে এবং “সর্বশেষ হালনাগাদ”-এর তারিখ পরিবর্তন করা হবে।",
    ],
  },
];

function Cookies({
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
            <Cookie size={14} />
            কুকি নীতি
          </span>
          <h1
            style={displayFont}
            className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl"
          >
            আমরা যেভাবে কুকি ব্যবহার করি
          </h1>
          <p className="mt-3 text-sm text-slate-500">সর্বশেষ হালনাগাদ: {lastUpdated}</p>
        </div>
      </section>

      {/* ================= Draft Notice ================= */}
      <div className="mx-auto max-w-[1100px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800">
            এই পাতাটি একটি প্রাথমিক খসড়া কাঠামো হিসেবে তৈরি। সাইটে প্রকৃতপক্ষে যে অ্যানালিটিক্স, বিজ্ঞাপন বা
            তৃতীয় পক্ষের টুল ব্যবহৃত হবে তার সাথে মিলিয়ে কুকির তালিকা যাচাই করে নেওয়ার পরামর্শ দেওয়া হচ্ছে।
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

                  {/* কুকির ধরন — টেবিল */}
                  {section.table && (
                    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">
                              ধরন
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">
                              উদ্দেশ্য
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">
                              মেয়াদ
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {COOKIE_TYPES.map((row, i) => (
                            <tr key={row.name} className={i % 2 === 1 ? "bg-slate-50/60" : ""}>
                              <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-800 align-top">
                                {row.name}
                              </td>
                              <td className="border-b border-slate-100 px-4 py-3 text-slate-600 align-top">
                                {row.purpose}
                              </td>
                              <td className="border-b border-slate-100 px-4 py-3 text-slate-600 align-top whitespace-nowrap">
                                {row.duration}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                কুকি নীতি সম্পর্কিত কোনো প্রশ্ন থাকলে নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করতে পারেন।
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

export default Cookies;
