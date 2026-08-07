// src/features/pages/DeveloperProfile.jsx

import { Link } from "react-router-dom";
import {
  Code2,
  Mail,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Briefcase,
  Layers,
  CheckCircle2,
  Download,
  FolderGit2,
  Building2,
  Wrench,
  Sparkles,
  Globe,
  Share2,
  Server,
  Layout,
  Cpu,
} from "lucide-react";
import developerPhoto from "../../../image/developer.png";

const displayFont = { fontFamily: "'Noto Serif Bengali', serif" };
const bodyFont = { fontFamily: "'Hind Siliguri', sans-serif" };

// GitHub & LinkedIn Inline SVG Components
const GithubIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const DEVELOPER_DATA = {
  name: "BELAL HOSSAIN",
  title: "Full Stack MERN Developer",
  roleBadges: ["FULL STACK", "MERN", "DEVELOPER"],
  location: "Rajshahi, Bangladesh",
  email: "belalwebcreation@gmail.com",
  github: "https://github.com/belalwebcreation",
  linkedin: "https://www.linkedin.com/in/belalwebcreation/",
  portfolio: "https://belalhossain.dev",
  resumeUrl: "/resume.pdf",
  image: developerPhoto,
  bio: "আমি একজন ফুল-স্ট্যাক ওয়েব ডেভেলপার। এই নিউজ পোর্টালটিসহ আধুনিক ও পারফরম্যান্ট ওয়েব অ্যাপ্লিকেশন তৈরি করতে পছন্দ করি। কোডের রিডাবিলিটি, ডাটাবেজ স্কেলেবিলিটি এবং সিকিউর ইউজার এক্সপেরিয়েন্স নিশ্চিত করা আমার মূল লক্ষ্য।",
  skillsCategorized: {
    frontend: ["React.js", "Redux Toolkit", "Tailwind CSS", "JavaScript (ES6+)", "HTML5 / CSS3"],
    backend: ["Node.js", "Express.js", "MongoDB", "RESTful API Integration", "JWT Authentication"],
    tools: ["Git & GitHub", "Vite / Webpack", "Cloudinary API", "Postman", "Performance Optimization"],
  },
  projects: [
    {
      title: "Online News Portal Platform",
      roleTag: "Client Project",
      desc: "সম্পূর্ণ রেসপন্সিভ এবং রিয়েল-টাইম আর্টিকেলিং সিস্টেমসহ উচ্চ গতিসম্পন্ন নিউজ পোর্টাল। ব্যাকএন্ডে রোল-বেসড অ্যাক্সেস ও ডায়নামিক অ্যাডমিন ড্যাশবোর্ড অন্তর্ভুক্ত।",
      tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
      liveLink: "https://news-portal-90ij.onrender.com/",
      githubLink: "https://github.com/belalwebcreation/News_Portal",
    },
    {
      title: "E-Commerce Management Platform",
      roleTag: "Personal Project",
      desc: "পণ্য সার্চ, অ্যাডভান্সড ফিল্টারিং, কার্ট সিস্টেম এবং সেকিউর পেমেন্ট গেটওয়ে ইন্টিগ্রেশনসহ ফুল-স্ট্যাক ই-কমার্স সলিউশন।",
      tags: ["React", "Redux", "Node.js", "MongoDB", "JWT"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80",
      liveLink: "https://ecommerce-demo.com",
      githubLink: "https://github.com/BelalHossain/e-commerce",
    },
    {
      title: "Task & Workflow Manager",
      roleTag: "Academic Project",
      desc: "টিম কোলাবরেশন ও টাস্ক ট্র্যাকিংয়ের জন্য একটি ড্র্যাগ-অ্যান্ড-ড্রপ ইন্টারফেস ড্যাশবোর্ড।",
      tags: ["React", "Tailwind CSS", "REST API"],
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      liveLink: "https://taskmanager-demo.com",
      githubLink: "https://github.com/BelalHossain/task-manager",
    },
  ],
  experience: [
    {
      role: "Lead Developer (Production News Portal)",
      company: "Independent Client Project",
      period: "২০২৬ — চলমান",
      desc: "প্রথম বাস্তব ক্লায়েন্টভিত্তিক (Production-Level) নিউজ পোর্টাল প্রকল্পের সিস্টেম আর্কিটেকচার, ফ্রন্টএন্ড, ব্যাকএন্ড, অথেন্টিকেশন, অ্যাডমিন ড্যাশবোর্ড এবং ডিপ্লয়মেন্টের সম্পূর্ণ দায়িত্ব পালন।",
    },
    {
      role: "Independent Frontend & MERN Practice",
      company: "Personal & Open Source Projects",
      period: "২০২৪ — ২০২৫",
      desc: "React, Node.js এবং Tailwind CSS ব্যবহার করে একাধিক ওয়েব অ্যাপ্লিকেশন তৈরি, REST API ইন্টিগ্রেশন এবং পারফরম্যান্স অপ্টিমাইজেশন চর্চা।",
    },
  ],
};

export default function DeveloperProfile() {
  return (
    <main style={bodyFont} className="min-h-screen bg-slate-50 text-slate-800 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Back Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={16} />
            আমাদের সম্পর্কে পাতায় ফিরে যান
          </Link>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Official Developer & Engineering Profile
          </span>
        </div>

        {/* Clean Editorial Hero Header */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden border-t-4 border-t-red-600">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
           {/* Left Photo Container - Clean Transparent PNG Floating Portrait */}
<div className="lg:col-span-4 flex justify-center items-center relative py-6">
  
  {/* Solution 4: Centered & Subtly Scaled Glow (Behind Image, Not Overlapping Edges) */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-red-200/40 blur-[70px] -z-10 pointer-events-none" />

  {/* Solution 5: Spaced-out Abstract Newspaper Decorations (No Touching/Overlap) */}
  <div className="absolute -top-4 left-2 h-14 w-14 rounded-full border border-red-200/50 -z-10 pointer-events-none" />
  <div className="absolute -bottom-4 right-0 h-16 w-16 rounded-full border border-dashed border-slate-300/80 -z-10 pointer-events-none" />
  <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-red-500/70 -z-10 pointer-events-none" />
  <div className="absolute bottom-6 left-2 h-2 w-2 rounded-full bg-slate-400/60 -z-10 pointer-events-none" />

  {/* Main Image Wrapper with Balanced Container Width */}
  <div className="relative w-full max-w-[280px] sm:max-w-[320px] flex flex-col items-center group">
    
    {/* Floating PNG Image with Refined Soft Drop-Shadow */}
    <div className="relative w-full transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]">
      <img
        src={DEVELOPER_DATA.image}
        alt={DEVELOPER_DATA.name}
        className="w-full h-auto object-contain bg-transparent drop-shadow-[0_18px_35px_rgba(15,23,42,0.12)] transition-all duration-500"
      />
    </div>

    {/* Clean Spaced Compact Badge */}
    <div className="mt-5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
      <span className="text-[11px] font-bold text-slate-700 tracking-wide">
        Available for Projects
      </span>
    </div>

  </div>
</div>

            {/* Right Info Section */}
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {DEVELOPER_DATA.roleBadges.map((badge, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-red-50 text-red-600 rounded border border-red-100"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <h1
                  style={displayFont}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900"
                >
                  {DEVELOPER_DATA.name}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-red-600">
                  {DEVELOPER_DATA.title}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-600 font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-red-600" />
                  {DEVELOPER_DATA.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={16} className="text-red-600" />
                  {DEVELOPER_DATA.email}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {DEVELOPER_DATA.bio}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href={`mailto:${DEVELOPER_DATA.email}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xs transition-all hover:bg-red-700 active:scale-95"
                >
                  <Mail size={16} />
                  যোগাযোগ করুন (Hire Me)
                </a>

                <a
                  href={DEVELOPER_DATA.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95"
                >
                  <Download size={16} />
                  Download CV
                </a>

                <div className="flex items-center gap-2 pl-0 sm:pl-2">
                  <a
                    href={DEVELOPER_DATA.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub Profile"
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-300 transition-all shadow-2xs"
                  >
                    <GithubIcon size={18} />
                  </a>
                  <a
                    href={DEVELOPER_DATA.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn Profile"
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-300 transition-all shadow-2xs"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Clean 3-Column Skills Section */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="text-red-600" size={20} />
              কারিগরি দক্ষতা ও টেকনোলজি (Technical Expertise)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Frontend Column */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-red-200 transition-all">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4 border-b border-slate-100 pb-2">
                <Layout size={18} className="text-red-600" />
                <span>Frontend Development</span>
              </div>
              <ul className="space-y-2.5">
                {DEVELOPER_DATA.skillsCategorized.frontend.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 size={14} className="text-red-600 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend Column */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-red-200 transition-all">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4 border-b border-slate-100 pb-2">
                <Server size={18} className="text-red-600" />
                <span>Backend & Database</span>
              </div>
              <ul className="space-y-2.5">
                {DEVELOPER_DATA.skillsCategorized.backend.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 size={14} className="text-red-600 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools Column */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-red-200 transition-all">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4 border-b border-slate-100 pb-2">
                <Wrench size={18} className="text-red-600" />
                <span>Tools & Ecosystem</span>
              </div>
              <ul className="space-y-2.5">
                {DEVELOPER_DATA.skillsCategorized.tools.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 size={14} className="text-red-600 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Featured Projects with Screenshots & Categorized Badges */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="text-red-600" size={20} />
              বিশেষায়িত প্রজেক্টসমূহ (Selected Works)
            </h2>
            <span className="text-xs font-semibold text-slate-500">পোর্টফোলিও ও প্রজেক্টসমূহ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEVELOPER_DATA.projects.map((project, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-red-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image Preview Container */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded border border-red-100 shadow-2xs">
                      {project.roleTag}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {project.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-4">
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
                    >
                      <ExternalLink size={13} />
                      Live Demo
                    </a>
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
                    >
                      <GithubIcon size={13} />
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Work Experience Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
            <Briefcase size={18} className="text-red-600" />
            <span>প্রফেশনাল এক্সপেরিয়েন্স (Professional Experience)</span>
          </div>

          <div className="space-y-6 pt-2">
            {DEVELOPER_DATA.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-red-600 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {exp.role}
                  </h3>
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                    {exp.period}
                  </span>
                </div>
                
                <p className="text-xs font-semibold text-slate-700">
                  {exp.company}
                </p>
                
                <p className="text-xs leading-relaxed text-slate-600 pt-1">
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Contact CTA Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 text-center space-y-4 shadow-2xs border-t-4 border-t-red-600">
          <h2 style={displayFont} className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Ready to Build Your Next Project?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            আপনার কোনো আধুনিক নিউজ পোর্টাল, কাস্টম এন্টারপ্রাইজ ওয়েব অ্যাপ্লিকেশন বা বিজনেস ওয়েবসাইট প্রয়োজন হলে সরাসরি যোগাযোগ করতে পারেন।
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
  href={`mailto:${DEVELOPER_DATA.email}?subject=Project%20Inquiry&body=Hello%20Belal,%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20with%20you.%0A%0AProject%20Details:%0A%0ARegards,`}
  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xs transition-all hover:bg-red-700 active:scale-95"
>
  <Mail size={16} />
  Contact Me
</a>
            <a
              href={DEVELOPER_DATA.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition-all hover:bg-slate-100 active:scale-95"
            >
              <GithubIcon size={16} />
              View GitHub Profile
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}