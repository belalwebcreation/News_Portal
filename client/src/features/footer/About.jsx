// src/features/pages/About.jsx

import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Scale,
  Zap,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Newspaper,
  BookOpen,
  Check,
  Code2,
  ExternalLink,
} from "lucide-react";

import developerPhoto from "../../../image/developer.png";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');`;

const displayFont = { fontFamily: "'Noto Serif Bengali', serif" };
const bodyFont = { fontFamily: "'Hind Siliguri', sans-serif" };

const HERO_BADGES = [
  "স্বাধীন সাংবাদিকতা",
  "ফ্যাক্ট চেকড",
  "২৪/৭ আপডেট",
  "নিরপেক্ষ সংবাদ",
];

const DEFAULT_TIMELINE = [
  {
    year: "২০১৮",
    title: "যাত্রার শুরু",
    description: "সীমিত জনবল নিয়ে একটি ডিজিটাল নিউজরুম হিসেবে প্রথম আত্মপ্রকাশ।",
  },
  {
    year: "২০২০",
    title: "লাইভ কভারেজ ও সম্প্রসারণ",
    description: "২৪/৭ রিয়েল-টাইম নিউজ আপডেট এবং জেলাভিত্তিক প্রতিনিধি নিয়োগ।",
  },
  {
    year: "২০২৩",
    title: "ফ্যাক্ট চেক সেল",
    description: "ভুল তথ্য রোধ ও সত্য অনুসন্ধানে স্বতন্ত্র সম্পাদকীয় বিভাগ গঠন।",
  },
  {
    year: "২০২৬",
    title: "আধুনিক ডিজিটাল মাধ্যম",
    description: "১০ লাখের বেশি নিয়মিত পাঠকের কাছে বস্তুনিষ্ঠ সংবাদের নির্ভরযোগ্য ঠিকানা।",
  },
];

const DEFAULT_VALUES = [
  {
    Icon: ShieldCheck,
    title: "তথ্য যাচাই ও নির্ভুলতা",
    description: "প্রকাশের আগে প্রতিটি তথ্য একাধিক স্বাধীন সূত্রে যাচাই করা হয়। কোনো অসঙ্গতি ধরা পড়লে তা স্পষ্ট সংশোধনীসহ জানানো হয়।",
  },
  {
    Icon: Scale,
    title: "নিরপেক্ষ দৃষ্টিভঙ্গি",
    description: "কোনো রাজনৈতিক, বাণিজ্যিক বা সামাজিক চাপের কাছে নতি স্বীকার না করে সব পক্ষের বক্তব্য বস্তুনিষ্ঠভাবে উপস্থাপন করা হয়।",
  },
  {
    Icon: Zap,
    title: "দ্রুত কিন্তু দায়িত্বশীল",
    description: "সবার আগে খবর দেওয়ার প্রতিযোগিতার চেয়ে সংবাদের সত্যতা ও সামাজিক প্রভাব বিবেচনা করাকে আমরা বেশি গুরুত্ব দিই।",
  },
  {
    Icon: Users,
    title: "পাঠকের প্রতি দায়বদ্ধতা",
    description: "পাঠক ও সমাজের ক্ষমতাহীন মানুষের কণ্ঠস্বর হিসেবে কাজ করা এবং পাবলিক ইন্টারেস্ট রক্ষা করাই আমাদের সাংবাদিকতার মূল উদ্দেশ্য।",
  },
];

const TRUST_CARDS = [
  {
    title: "Fact Checking",
    desc: "প্রতিটি সংবাদে ন্যূনতম ২টি স্বতন্ত্র সূত্রের সত্যতা নিশ্চিতকরণ।",
  },
  {
    title: "Editorial Independence",
    desc: "বাণিজ্যিক বা রাজনৈতিক প্রভাবমুক্ত স্বাধীন সম্পাদকীয় সিদ্ধান্ত।",
  },
  {
    title: "Corrections Policy",
    desc: "ভুল বা অসম্পূর্ণ সংবাদের জন্য দ্রুত ও প্রকাশ্যে সংশোধনী প্রকাশ।",
  },
  {
    title: "Copyright Protection",
    desc: "কপিরাইট এবং এডিটরিয়াল গাইডলাইন কঠোরভাবে মেনে চলা।",
  },
];

const SKILLS = ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"];

function About({
  siteName = "সংবাদ প্রবাহ",
  eyebrow = "আমাদের পরিচয়",
  title = "আমাদের সম্পর্কে",
  editorialQuote = "সত্য প্রকাশই আমাদের প্রথম দায়িত্ব; দ্রুত নয়, নির্ভুল সংবাদই আমাদের অঙ্গীকার।",
  storyParagraphs = [
    "অনলাইন সাংবাদিকতার ক্রমবর্ধমান ভিড়ে বস্তুনিষ্ঠ, নিরপেক্ষ এবং তথ্যসমৃদ্ধ সংবাদের ঘাটতি পূরণের লক্ষ্য নিয়ে আমাদের যাত্রা শুরু হয়েছিল। প্রতিষ্ঠালগ্ন থেকেই আমরা সংবাদ পরিবেশনে সর্বোচ্চ নৈতিকতা বজায় রাখতে বদ্ধপরিকর।",
    "প্রযুক্তির দ্রুত পরিবর্তনের সাথে সাথে সংবাদের মাধ্যম বদলেছে, কিন্তু সত্য উন্মোচনে আমাদের একাগ্রতা অপরিবর্তিত রয়েছে। দেশের শীর্ষস্থানীয় অভিজ্ঞ সাংবাদিক এবং তরুণ প্রমিজিং নিউজরুম টিমের সমন্বয়ে আমরা প্রতিদিন পাঠকের সামনে নির্ভরযোগ্য তথ্য তুলে আনছি।",
  ],
  timeline = DEFAULT_TIMELINE,
  values = DEFAULT_VALUES,
  trustCards = TRUST_CARDS,
  editorName = "বেলাল হোসেন",
  editorRole = "প্রকাশক ও প্রধান সম্পাদক",
  editorImage = null,
  editorBio = "দুই দশকেরও বেশি সময় ধরে মূলধারার সাংবাদিকতা ও সম্পাদকীয় নেতৃত্বে যুক্ত। দেশীয় ও আন্তর্জাতিক সংবাদ নীতিমালায় অভিজ্ঞ এই সাংবাদিক সার্বিক সম্পাদনার দায়িত্ব পালন করছেন।",
  contactRouteExists = true,
  
  // Developer Props
  developerName = "Belal Hossain",
  developerRole = "Full Stack MERN Developer",
  developerLocation = "Rajshahi, Bangladesh",
  developerImage = developerPhoto,
}) {
  return (
    <main style={bodyFont} className="bg-white text-slate-800">
      <style>{FONT_IMPORT}</style>

      {/* ===================================================
          1. Hero Section - Newspaper Masthead Style
          =================================================== */}
      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-red-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            {eyebrow}
          </div>

          <h1
            style={displayFont}
            className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl"
          >
            {title}
          </h1>

          <div className="my-6 flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-slate-300" />
            <Newspaper size={18} className="text-red-600" />
            <div className="h-[1px] w-12 bg-slate-300" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {HERO_BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
              >
                <Check size={13} className="text-red-600" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          2. Editorial Quote Banner
          =================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6 lg:px-8">
          <blockquote
            style={displayFont}
            className="text-xl font-bold italic leading-relaxed text-slate-900 sm:text-2xl"
          >
            “{editorialQuote}”
          </blockquote>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-red-600">
            — {siteName} সম্পাদকীয় বোর্ড
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 space-y-16">

        {/* ===================================================
            3. Our Story Section
            =================================================== */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-6 w-1.5 rounded-full bg-red-600" />
            <h2 style={displayFont} className="text-2xl font-bold text-slate-900">
              আমাদের গল্প
            </h2>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-4 text-slate-700 text-base leading-relaxed">
              {storyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="first-letter:float-left first-letter:text-4xl first-letter:font-bold first-letter:text-red-600 first-letter:mr-2.5 first-letter:font-serif"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm border-l-4 border-l-red-600">
                <div className="flex items-center gap-3 text-red-600 font-bold text-sm">
                  <Award size={20} />
                  <span>আমাদের মূল অঙ্গীকার</span>
                </div>
                <h3 style={displayFont} className="mt-3 text-lg font-bold text-slate-900">
                  পাঠকের আস্থা অর্জনই আমাদের সাফল্য
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  সংবাদ পরিবেশনে আমরা সংবেদনশীলতা এবং পেশাদারিত্বকে অগ্রাধিকার দিই। কোনো গুঞ্জন বা ভিত্তিহীন খবর প্রচার না করে তথ্যভিত্তিক সাংবাদিকতায় বিশ্বাস করি।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            4. Timeline Journey
            =================================================== */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="h-6 w-1.5 rounded-full bg-red-600" />
            <h2 style={displayFont} className="text-2xl font-bold text-slate-900">
              আমাদের অগ্রযাত্রার টাইমলাইন
            </h2>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-6 z-0" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              {timeline.map((item, idx) => (
                <div
                  key={item.year}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-600/40 hover:shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span style={displayFont} className="text-2xl font-extrabold text-red-600">
                      {item.year}
                    </span>
                    <span className="h-7 w-7 flex items-center justify-center rounded-full bg-slate-100 text-xs font-mono font-bold text-slate-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 style={displayFont} className="mt-4 text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================
            5. Editorial Principles
            =================================================== */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="h-6 w-1.5 rounded-full bg-red-600" />
            <h2 style={displayFont} className="text-2xl font-bold text-slate-900">
              সম্পাদকীয় নীতি ও মূল্যবোধ
            </h2>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title: valueTitle, description }) => (
              <div
                key={valueTitle}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-600/30 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                  <Icon size={22} />
                </div>
                <h3 style={displayFont} className="mt-4 text-lg font-bold text-slate-900">
                  {valueTitle}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
            6. Editor Spotlight & Trust Cards
            =================================================== */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-6 w-1.5 rounded-full bg-red-600" />
              <h2 style={displayFont} className="text-2xl font-bold text-slate-900">
                সম্পাদকীয় নেতৃত্ব
              </h2>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:p-8 flex flex-col items-center text-center">
              {editorImage ? (
                <img
                  src={editorImage}
                  alt={editorName}
                  className="h-24 w-24 rounded-full object-cover border-2 border-red-600 shadow"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400 border border-slate-200 shadow-inner">
                  <svg className="h-14 w-14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}

              <h3 style={displayFont} className="mt-4 text-xl font-bold text-slate-900">
                {editorName}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-red-600 mt-1">
                {editorRole}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {editorBio}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-6 w-1.5 rounded-full bg-red-600" />
              <h2 style={displayFont} className="text-2xl font-bold text-slate-900">
                পাঠকের আস্থার ভিত্তি
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trustCards.map((card) => (
                <div
                  key={card.title}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-600/30 hover:bg-white hover:shadow"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
                    <CheckCircle2 size={16} />
                    <span>{card.title}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ===================================================
            7. Contact CTA
            =================================================== */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 text-white shadow-md sm:p-10">
          <div className="absolute top-0 left-0 h-1 w-full bg-red-600" />
          
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500">
                <BookOpen size={16} />
                আপনার মতামত গুরুত্বপূর্ণ
              </div>
              <h3 style={displayFont} className="mt-2 text-xl font-bold sm:text-2xl">
                কোনো প্রশ্ন, তথ্য বা সংশোধনের প্রস্তাব আছে?
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                আমাদের নিউজ রুম বা সম্পাদকীয় বোর্ডের সাথে সরাসরি যোগাযোগ করতে নিচের বাটনে ক্লিক করুন।
              </p>
            </div>

            {contactRouteExists ? (
              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow transition-all duration-300 hover:bg-red-700 hover:shadow-lg"
              >
                যোগাযোগ পাতায় যান <ArrowRight size={16} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => alert("যোগাযোগ পাতাটি শীঘ্রই আসছে!")}
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow transition-all duration-300 hover:bg-red-700"
              >
                যোগাযোগ করুন <ArrowRight size={16} />
              </button>
            )}
          </div>
        </section>

        {/* ===================================================
            8. Premium Website Developer Spotlight & CTA
            =================================================== */}
        <section className="pt-8 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-6 w-1.5 rounded-full bg-slate-800" />
            <h2 style={displayFont} className="text-xl font-bold text-slate-900">
              ওয়েবসাইট ডেভেলপমেন্ট
            </h2>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Photo & Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* Developer Headshot */}
                <div className="relative shrink-0">
                  <img
                    src={developerImage}
                    alt={developerName}
                    className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-slate-200"
                  />
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-slate-900 p-1 text-white shadow">
                    <Code2 size={12} />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Designed & Developed by
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 style={displayFont} className="text-xl font-extrabold text-slate-900">
                      {developerName}
                    </h3>
                    <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {developerRole}
                    </span>
                  </div>

                  {/* Skills Badges */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                    <span className="text-xs text-slate-500 font-medium mr-1">Specialized in:</span>
                    {SKILLS.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Independent Developer Declaration */}
                  <p className="text-xs text-slate-500 pt-1 italic">
                    This website was independently designed and developed by <strong className="text-slate-700 font-semibold">{developerName}</strong>. ({developerLocation})
                  </p>
                </div>
              </div>

              {/* Big CTA Button to Internal Profile Page */}
              <div className="shrink-0 w-full md:w-auto text-center">
                <Link
                  to="/developer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-red-600 hover:shadow-lg w-full md:w-auto"
                >
                  View Professional Profile
                  <ExternalLink size={15} />
                </Link>
              </div>

            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

export default About;