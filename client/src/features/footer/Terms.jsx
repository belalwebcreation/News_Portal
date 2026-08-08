import { useState } from "react";
import { Scale, Info, MapPin, Phone, Mail, ArrowUp } from "lucide-react";

// ==========================================================
// Fonts — Footer.jsx / Advertise.jsx / Privacy.jsx এর সাথে সামঞ্জস্যপূর্ণ
// ==========================================================
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');`;

const displayFont = { fontFamily: "'Noto Serif Bengali', serif" };
const bodyFont = { fontFamily: "'Hind Siliguri', sans-serif" };

// ==========================================================
// Sections — ক্রম গুরুত্বপূর্ণ, তাই নম্বরিং সার্থক এখানে
// ==========================================================
const SECTIONS = [
  {
    id: "acceptance",
    title: "শর্তাবলী গ্রহণ",
    body: [
      "এই ব্যবহারের শর্তাবলী (“শর্তাবলী”) এই ওয়েবসাইট ব্যবহারের ক্ষেত্রে প্রযোজ্য। ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি এই শর্তাবলীর সাথে সম্মত হচ্ছেন বলে গণ্য হবে।",
      "এই শর্তাবলীর কোনো অংশের সাথে অসম্মত হলে অনুগ্রহ করে ওয়েবসাইট ব্যবহার থেকে বিরত থাকুন।",
    ],
  },
  {
    id: "service",
    title: "সেবার বর্ণনা",
    body: [
      "এই প্ল্যাটফর্ম সংবাদ, প্রতিবেদন ও সংশ্লিষ্ট কনটেন্ট বিভিন্ন বিভাগে (জাতীয়, রাজনীতি, খেলাধুলা, প্রযুক্তি ইত্যাদি) প্রকাশ করে এবং ব্যবহারকারী অ্যাকাউন্ট, মন্তব্য ও অন্যান্য ইন্টারঅ্যাকটিভ ফিচার প্রদান করে।",
      "পূর্ব নোটিশ ছাড়াই সেবার যেকোনো অংশ পরিবর্তন, সীমিত বা বন্ধ করার অধিকার আমরা সংরক্ষণ করি।",
    ],
  },
  {
    id: "account",
    title: "অ্যাকাউন্ট ও ব্যবহারকারীর দায়িত্ব",
    body: ["অ্যাকাউন্ট তৈরি বা ব্যবহারের ক্ষেত্রে আপনি নিম্নলিখিত বিষয়ে দায়বদ্ধ থাকবেন:"],
    list: [
      "সঠিক ও হালনাগাদ তথ্য প্রদান করা",
      "নিজের লগইন তথ্য ও পাসওয়ার্ড গোপন রাখা",
      "নিজের অ্যাকাউন্টের মাধ্যমে সংঘটিত সকল কার্যকলাপের জন্য দায়ী থাকা",
      "অননুমোদিত ব্যবহার শনাক্ত হলে অবিলম্বে আমাদের জানানো",
    ],
  },
  {
    id: "conduct",
    title: "গ্রহণযোগ্য ব্যবহার",
    body: ["এই ওয়েবসাইট ব্যবহারের সময় নিম্নলিখিত কার্যক্রম নিষিদ্ধ:"],
    list: [
      "মিথ্যা, মানহানিকর বা আইনবিরোধী কনটেন্ট পোস্ট করা",
      "অন্য ব্যবহারকারী, লেখক বা প্রতিষ্ঠানকে হয়রানি বা ভয়ভীতি প্রদর্শন করা",
      "স্বয়ংক্রিয় স্ক্র্যাপিং, বট বা অন্য কোনো অননুমোদিত পদ্ধতিতে তথ্য সংগ্রহ করা",
      "লিখিত অনুমতি ছাড়া কপিরাইটকৃত কনটেন্ট পুনঃপ্রকাশ করা",
      "সাইটের নিরাপত্তা ব্যবস্থা ভাঙার বা এড়িয়ে যাওয়ার চেষ্টা করা",
    ],
  },
  {
    id: "content",
    title: "ব্যবহারকারী-উৎপাদিত কনটেন্ট",
    body: [
      "মন্তব্য বা অন্য কোনো কনটেন্ট পোস্ট করলে, তা প্ল্যাটফর্মে প্রাসঙ্গিকভাবে প্রদর্শনের জন্য একটি অ-এক্সক্লুসিভ, রয়্যালটি-মুক্ত অধিকার আমাদের দেওয়া হয় বলে গণ্য হবে।",
      "নীতিমালা লঙ্ঘনকারী যেকোনো কনটেন্ট পূর্ব নোটিশ ছাড়াই পর্যালোচনা, সম্পাদনা বা অপসারণ করার অধিকার আমরা সংরক্ষণ করি।",
    ],
  },
  {
    id: "ip",
    title: "মেধাসম্পত্তি অধিকার",
    body: [
      "এই ওয়েবসাইটের সকল মূল কনটেন্ট — প্রতিবেদন, লোগো, ডিজাইন ও গ্রাফিক্স — এর মালিকানা এই প্রতিষ্ঠানের। লিখিত অনুমতি ছাড়া বাণিজ্যিক উদ্দেশ্যে পুনঃপ্রকাশ, অনুলিপি বা পুনর্বিতরণ নিষিদ্ধ।",
      "ব্যক্তিগত ও অ-বাণিজ্যিক ব্যবহারের ক্ষেত্রে যথাযথ সূত্র উল্লেখ করে সীমিত অংশ শেয়ার করা যেতে পারে।",
    ],
  },
  {
    id: "links",
    title: "তৃতীয় পক্ষের লিংক",
    body: [
      "সুবিধার জন্য ওয়েবসাইটে তৃতীয় পক্ষের লিংক অন্তর্ভুক্ত থাকতে পারে। সেসব ওয়েবসাইটের কনটেন্ট, নীতিমালা বা প্র্যাকটিসের জন্য আমরা দায়ী নই এবং তা পরিদর্শন সম্পূর্ণ আপনার নিজ ঝুঁকিতে।",
    ],
  },
  {
    id: "liability",
    title: "দায় সীমাবদ্ধতা",
    body: [
      "এই ওয়েবসাইট “যেমন আছে” ভিত্তিতে প্রদান করা হয়, কোনো প্রকার স্পষ্ট বা অন্তর্নিহিত ওয়ারেন্টি ছাড়া। ওয়েবসাইট ব্যবহারজনিত কোনো প্রত্যক্ষ বা পরোক্ষ ক্ষতির জন্য, প্রযোজ্য আইনের সর্বোচ্চ সীমা পর্যন্ত, আমরা দায়ী থাকব না।",
    ],
  },
  {
    id: "termination",
    title: "সেবা স্থগিত বা বাতিল",
    body: [
      "এই শর্তাবলী লঙ্ঘন হলে পূর্ব নোটিশ ছাড়াই যেকোনো ব্যবহারকারীর অ্যাকাউন্ট বা প্রবেশাধিকার সাময়িক অথবা স্থায়ীভাবে স্থগিত বা বাতিল করার অধিকার আমরা সংরক্ষণ করি।",
    ],
  },
  {
    id: "changes",
    title: "শর্তাবলীর পরিবর্তন",
    body: [
      "সময়ে সময়ে এই শর্তাবলী হালনাগাদ করা হতে পারে। পরিবর্তনের পর ওয়েবসাইট ব্যবহার অব্যাহত রাখাকে হালনাগাদকৃত শর্তাবলীতে সম্মতি হিসেবে গণ্য করা হবে।",
    ],
  },
  {
    id: "law",
    title: "প্রযোজ্য আইন",
    body: [
      "এই শর্তাবলী বাংলাদেশের প্রচলিত আইন অনুযায়ী পরিচালিত ও ব্যাখ্যাযোগ্য। সংশ্লিষ্ট যেকোনো বিরোধ বাংলাদেশের এখতিয়ারভুক্ত আদালতের অধীনে নিষ্পত্তি হবে।",
    ],
  },
];

function Terms({
  lastUpdated = "৮ আগস্ট, ২০২৬",
  address = "১২৩ প্রেস ক্লাব সড়ক, মতিঝিল, ঢাকা-১০০০",
  phone = "+৮৮০ ১৭০০-০০০০০০",
  email = "legal@example.com",
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
            <Scale size={14} />
            ব্যবহারের শর্তাবলী
          </span>
          <h1
            style={displayFont}
            className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl"
          >
            ওয়েবসাইট ব্যবহারের নিয়মকানুন
          </h1>
          <p className="mt-3 text-sm text-slate-500">সর্বশেষ হালনাগাদ: {lastUpdated}</p>
        </div>
      </section>

      {/* ================= Draft Notice ================= */}
      <div className="mx-auto max-w-[1100px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800">
            এই পাতাটি একটি প্রাথমিক খসড়া কাঠামো হিসেবে তৈরি। চূড়ান্তভাবে প্রকাশের আগে প্রতিষ্ঠানের প্রকৃত নীতি
            অনুযায়ী কনটেন্ট যাচাই করে এবং সম্ভব হলে একজন আইন উপদেষ্টার মাধ্যমে পর্যালোচনা করিয়ে নেওয়ার পরামর্শ
            দেওয়া হচ্ছে।
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
                এই শর্তাবলী সম্পর্কিত কোনো প্রশ্ন থাকলে নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করতে পারেন।
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

export default Terms;
