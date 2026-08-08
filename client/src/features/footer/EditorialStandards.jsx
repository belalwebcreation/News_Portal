import { Link } from "react-router-dom";
import { ShieldCheck, Scale, Quote, RefreshCcw, AlertTriangle, Mail } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');`;
const displayFont = { fontFamily: "'Noto Serif Bengali', serif" };
const bodyFont = { fontFamily: "'Hind Siliguri', sans-serif" };

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "নির্ভুলতা ও সত্যতা",
    desc: "প্রকাশের আগে প্রতিটি তথ্য একাধিক নির্ভরযোগ্য সূত্র থেকে যাচাই করা হয়। অনিশ্চিত তথ্য কখনো নিশ্চিত সত্য হিসেবে উপস্থাপন করা হয় না।",
  },
  {
    icon: Scale,
    title: "নিরপেক্ষতা ও ভারসাম্য",
    desc: "কোনো রাজনৈতিক, ধর্মীয় বা বাণিজ্যিক পক্ষপাত ছাড়াই সংবাদ পরিবেশন করা হয়। বিতর্কিত বিষয়ে সকল পক্ষের মতামত তুলে ধরার চেষ্টা করা হয়।",
  },
  {
    icon: Quote,
    title: "সূত্রের স্বচ্ছতা",
    desc: "সম্ভব ক্ষেত্রে সংবাদের সূত্র স্পষ্টভাবে উল্লেখ করা হয়। বেনামী সূত্র শুধুমাত্র জনস্বার্থে এবং সম্পাদকীয় অনুমোদন সাপেক্ষে ব্যবহৃত হয়।",
  },
  {
    icon: RefreshCcw,
    title: "সংশোধনী নীতি",
    desc: "কোনো তথ্যগত ভুল ধরা পড়লে দ্রুততম সময়ে তা সংশোধন করে স্পষ্টভাবে উল্লেখ করা হয় যে সংবাদটি সংশোধিত হয়েছে।",
  },
  {
    icon: AlertTriangle,
    title: "স্বার্থের সংঘাত পরিহার",
    desc: "প্রতিবেদক বা সম্পাদকের ব্যক্তিগত আর্থিক বা পেশাগত স্বার্থ কোনো প্রতিবেদনকে প্রভাবিত করে না। বিজ্ঞাপন ও সংবাদ বিভাগ সম্পূর্ণ পৃথক।",
  },
];

function EditorialStandards() {
  return (
    <div style={bodyFont} className="bg-white text-slate-700">
      <style>{FONT_IMPORT}</style>

      {/* Header Band */}
      <div className="bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
            নীতিমালা
          </p>
          <h1
            style={displayFont}
            className="mt-2 text-3xl font-extrabold text-white sm:text-4xl"
          >
            সাংবাদিকতার নীতিমালা
          </h1>
          <p className="mt-4 text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            নির্ভুল, নিরপেক্ষ ও দায়িত্বশীল সাংবাদিকতাই আমাদের মূল অঙ্গীকার। এই
            নীতিমালা আমাদের সংবাদ সংগ্রহ, যাচাই ও প্রকাশনার মূল ভিত্তি।
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {PRINCIPLES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 p-5 shadow-sm hover:border-red-200 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Icon size={20} />
              </div>
              <h3 style={displayFont} className="mt-4 text-base font-bold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* Complaint / Contact */}
        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
          <Mail className="mx-auto text-red-600" size={22} />
          <h4 style={displayFont} className="mt-3 text-base font-bold text-slate-900">
            নীতিমালা সংক্রান্ত অভিযোগ বা মতামত
          </h4>
          <p className="mt-2 text-sm text-slate-600">
            কোনো প্রতিবেদনে ভুল মনে হলে বা সম্পাদকীয় নীতি নিয়ে প্রশ্ন থাকলে
            আমাদের সাথে যোগাযোগ করুন।
          </p>

          <a
            href="mailto:news@example.com"
            className="mt-4 inline-block rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            যোগাযোগ করুন
          </a>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-medium text-red-600 hover:underline">
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EditorialStandards;