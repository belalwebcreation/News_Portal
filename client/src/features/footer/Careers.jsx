import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  TrendingUp,
  HeartHandshake,
  MapPin,
  Clock,
  ArrowRight,
  Mail,
} from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');`;
const displayFont = { fontFamily: "'Noto Serif Bengali', serif" };
const bodyFont = { fontFamily: "'Hind Siliguri', sans-serif" };

// 📝 এখানে আপাতত ডামি/placeholder পোস্ট দেওয়া হলো।
// পরবর্তীতে চাইলে এটা backend API থেকে dynamic ভাবে fetch করা যাবে।
const OPEN_POSITIONS = [
  {
    title: "স্টাফ রিপোর্টার (রাজনীতি)",
    type: "ফুল-টাইম",
    location: "ঢাকা",
    dept: "সংবাদ বিভাগ",
  },
  {
    title: "সাব-এডিটর",
    type: "ফুল-টাইম",
    location: "ঢাকা",
    dept: "সম্পাদনা বিভাগ",
  },
  {
    title: "ভিডিও জার্নালিস্ট",
    type: "ফুল-টাইম",
    location: "ঢাকা",
    dept: "মাল্টিমিডিয়া",
  },
  {
    title: "সোশ্যাল মিডিয়া এক্সিকিউটিভ",
    type: "পার্ট-টাইম",
    location: "রিমোট",
    dept: "ডিজিটাল বিভাগ",
  },
];

const WHY_US = [
  {
    icon: TrendingUp,
    title: "প্রবৃদ্ধির সুযোগ",
    desc: "দক্ষতা বাড়ানোর প্রশিক্ষণ ও ক্যারিয়ারে এগিয়ে যাওয়ার সুস্পষ্ট পথ।",
  },
  {
    icon: Users,
    title: "চমৎকার টিম",
    desc: "অভিজ্ঞ সাংবাদিক ও সম্পাদকদের সাথে কাজ করার সুযোগ।",
  },
  {
    icon: HeartHandshake,
    title: "সুস্থ কর্ম-পরিবেশ",
    desc: "স্বচ্ছতা, সম্মান ও পারস্পরিক সহযোগিতার সংস্কৃতি।",
  },
];

function Careers() {
  return (
    <div style={bodyFont} className="bg-white text-slate-700">
      <style>{FONT_IMPORT}</style>

      {/* Header Band */}
      <div className="bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
            ক্যারিয়ার
          </p>
          <h1
            style={displayFont}
            className="mt-2 text-3xl font-extrabold text-white sm:text-4xl"
          >
            আমাদের টিমে যোগ দিন
          </h1>
          <p className="mt-4 text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            নির্ভীক ও নির্ভরযোগ্য সাংবাদিকতার এই যাত্রায় আমরা খুঁজছি
            আগ্রহী ও দক্ষ মানুষদের, যারা মানসম্মত সংবাদ পাঠকের কাছে পৌঁছে
            দিতে চান।
          </p>
        </div>
      </div>

      {/* Why Join Us */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 style={displayFont} className="text-xl font-bold text-slate-900 text-center">
          কেন আমাদের সাথে কাজ করবেন
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {WHY_US.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Icon size={20} />
              </div>
              <h3 style={displayFont} className="mt-3 text-sm font-bold text-slate-900">
                {title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <div className="mt-14">
          <h2 style={displayFont} className="text-xl font-bold text-slate-900 text-center">
            বর্তমান শূন্য পদসমূহ
          </h2>

          <div className="mt-6 space-y-3">
            {OPEN_POSITIONS.map((job) => (
              <div
                key={job.title}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between hover:border-red-200 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={15} className="text-red-600 shrink-0" />
                    <h3 className="text-sm font-semibold text-slate-900">
                      {job.title}
                    </h3>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {job.type}
                    </span>
                    <span>{job.dept}</span>
                  </div>
                </div>

                
                <a
                  href={`mailto:careers@example.com?subject=${encodeURIComponent(
                    "আবেদন: " + job.title
                  )}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 shrink-0"
                >
                  আবেদন করুন <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* General Contact */}
        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
          <Mail className="mx-auto text-red-600" size={22} />
          <h4 style={displayFont} className="mt-3 text-base font-bold text-slate-900">
            উপযুক্ত পদ খুঁজে পাননি?
          </h4>
          <p className="mt-2 text-sm text-slate-600">
            আপনার সিভি পাঠিয়ে রাখুন, ভবিষ্যতে উপযুক্ত সুযোগ এলে আমরা
            যোগাযোগ করব।
          </p>
          
          <a
            href="mailto:careers@example.com"
            className="mt-4 inline-block rounded-lg border border-red-600 px-5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
          >
            careers@example.com
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

export default Careers;