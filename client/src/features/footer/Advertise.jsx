import { useState } from "react";
import {
  Megaphone,
  TrendingUp,
  Users,
  Newspaper,
  Layers,
  Send,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";

// ==========================================================
// Fonts — Footer.jsx এর সাথে সামঞ্জস্যপূর্ণ
// ==========================================================
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');`;

const displayFont = { fontFamily: "'Noto Serif Bengali', serif" };
const bodyFont = { fontFamily: "'Hind Siliguri', sans-serif" };

// ==========================================================
// Static Content
// ==========================================================
const FEATURES = [
  {
    Icon: Users,
    title: "সক্রিয় ও লক্ষ্যভিত্তিক পাঠক",
    desc: "রাজশাহী কলেজের শিক্ষার্থী, প্রাক্তন শিক্ষার্থী এবং স্থানীয় পাঠক সম্প্রদায়ের কাছে সরাসরি পৌঁছান।",
  },
  {
    Icon: Layers,
    title: "বিভাগভিত্তিক প্লেসমেন্ট",
    desc: "জাতীয়, খেলাধুলা, প্রযুক্তি বা বিনোদন — আপনার পণ্যের সাথে মানানসই বিভাগ বেছে নিন।",
  },
  {
    Icon: Newspaper,
    title: "স্পন্সরড কনটেন্ট",
    desc: "সাধারণ বিজ্ঞাপনের বাইরে গিয়ে প্রতিবেদন আকারে আপনার ব্র্যান্ডের গল্প তুলে ধরুন।",
  },
  {
    Icon: TrendingUp,
    title: "সহজ যোগাযোগ ও সাপোর্ট",
    desc: "ক্যাম্পেইন বুকিং থেকে প্রকাশ পর্যন্ত পুরো প্রক্রিয়ায় আমাদের টিম পাশে থাকবে।",
  },
];

const PACKAGES = [
  {
    name: "হোমপেজ ব্যানার",
    tagline: "সবচেয়ে বেশি দৃশ্যমানতা",
    features: [
      "হোমপেজের শীর্ষে প্রদর্শিত",
      "ডেস্কটপ ও মোবাইল — উভয় ভার্সনে অপ্টিমাইজড",
      "সপ্তাহ বা মাস ভিত্তিক মেয়াদ",
    ],
  },
  {
    name: "বিভাগ পাতা বিজ্ঞাপন",
    tagline: "নির্দিষ্ট পাঠকশ্রেণির কাছে",
    features: [
      "খেলাধুলা, প্রযুক্তি, বিনোদন ইত্যাদি বিভাগে",
      "প্রাসঙ্গিক পাঠকের কাছে সরাসরি পৌঁছানো",
      "একাধিক বিভাগে একসাথে বুকিং সম্ভব",
    ],
  },
  {
    name: "স্পন্সরড আর্টিকেল",
    tagline: "গল্প আকারে ব্র্যান্ডিং",
    features: [
      "নিউজরুমের সহায়তায় কনটেন্ট তৈরি",
      "'স্পনসরড' ট্যাগসহ স্বচ্ছ প্রকাশনা",
      "সামাজিক মাধ্যমে শেয়ারযোগ্য",
    ],
  },
];

const FAQS = [
  {
    q: "বিজ্ঞাপন বুক করতে কী কী তথ্য লাগবে?",
    a: "প্রতিষ্ঠানের নাম, যোগাযোগের তথ্য এবং কাঙ্ক্ষিত বিজ্ঞাপনের ধরন জানালেই আমাদের টিম বাকি প্রক্রিয়ায় সাহায্য করবে।",
  },
  {
    q: "সর্বনিম্ন কত সময়ের জন্য বিজ্ঞাপন দেওয়া যায়?",
    a: "প্যাকেজভেদে মেয়াদ ভিন্ন হয়; নির্দিষ্ট চাহিদা অনুযায়ী সময়সীমা নির্ধারণ করা হয়। বিস্তারিত জানতে যোগাযোগ করুন।",
  },
  {
    q: "নিজস্ব ডিজাইন থাকলে কি ব্যবহার করা যাবে?",
    a: "হ্যাঁ, নিজস্ব ব্যানার বা কনটেন্ট থাকলে তা যাচাই করে প্রকাশ করা হয়। ডিজাইন না থাকলে আমাদের টিম সহায়তা করতে পারে।",
  },
];

function Advertise({
  address = "১২৩ প্রেস ক্লাব সড়ক, মতিঝিল, ঢাকা-১০০০",
  phone = "+৮৮০ ১৭০০-০০০০০০",
  email = "ads@example.com",
}) {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    adType: PACKAGES[0].name,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: backend endpoint রেডি হলে এখানে API call বসবে (POST /api/ads/inquiry)
    console.log("Advertise inquiry:", form);
    setSubmitted(true);
  };

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={bodyFont} className="bg-white text-slate-700">
      <style>{FONT_IMPORT}</style>

      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="absolute inset-x-0 top-0 h-1 bg-red-600" />
        <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            <Megaphone size={14} />
            বিজ্ঞাপন দিন
          </span>
          <h1
            style={displayFont}
            className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            আপনার ব্র্যান্ডের গল্প পৌঁছে দিন সঠিক পাঠকের কাছে
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            শিক্ষার্থী, প্রাক্তন শিক্ষার্থী ও স্থানীয় পাঠক সম্প্রদায়ের একটি সক্রিয় দর্শকগোষ্ঠীর সামনে আপনার
            প্রতিষ্ঠান, পণ্য বা আয়োজনের প্রচার করুন — সহজ ও স্বচ্ছ প্রক্রিয়ায়।
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => scrollToId("packages")}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
            >
              প্যাকেজ দেখুন
            </button>
            <button
              onClick={() => scrollToId("contact-form")}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-red-600 hover:text-red-600"
            >
              যোগাযোগ করুন
            </button>
          </div>
        </div>
      </section>

      {/* ================= Why Advertise ================= */}
      <section className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8">
        <h2 style={displayFont} className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          কেন আমাদের সাথে বিজ্ঞাপন দেবেন
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Icon size={20} />
              </div>
              <h3 style={displayFont} className="mt-4 text-sm font-bold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Packages ================= */}
      <section id="packages" className="bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8">
          <h2 style={displayFont} className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            বিজ্ঞাপন প্যাকেজ
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-600">
            আপনার প্রয়োজন ও বাজেট অনুযায়ী নিচের প্যাকেজগুলোর যেকোনো একটি বেছে নিতে পারেন, অথবা কাস্টম প্যাকেজের
            জন্য যোগাযোগ করুন।
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 style={displayFont} className="text-lg font-bold text-slate-900">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-600">
                  {pkg.tagline}
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-red-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToId("contact-form")}
                  className="mt-6 inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-red-600 hover:text-red-600"
                >
                  মূল্য জানতে যোগাযোগ করুন
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8">
        <h2 style={displayFont} className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          সাধারণ জিজ্ঞাসা
        </h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-900">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= Contact Form + Info ================= */}
      <section id="contact-form" className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <h2 style={displayFont} className="text-2xl font-bold text-slate-900">
              বিজ্ঞাপনের জন্য যোগাযোগ করুন
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              নিচের ফর্মটি পূরণ করুন, আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
            </p>

            {submitted ? (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-5">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-800">অনুরোধ পাঠানো হয়েছে</p>
                  <p className="mt-1 text-xs text-green-700">
                    ধন্যবাদ! শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">নাম</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-red-600"
                      placeholder="আপনার নাম"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      প্রতিষ্ঠানের নাম
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={form.organization}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-red-600"
                      placeholder="প্রতিষ্ঠান / ব্র্যান্ডের নাম"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">ইমেইল</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-red-600"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      ফোন নম্বর
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-red-600"
                      placeholder="+৮৮০ ১XXX-XXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    বিজ্ঞাপনের ধরন
                  </label>
                  <select
                    name="adType"
                    value={form.adType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-red-600"
                  >
                    {PACKAGES.map((pkg) => (
                      <option key={pkg.name} value={pkg.name}>
                        {pkg.name}
                      </option>
                    ))}
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">বার্তা</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-red-600"
                    placeholder="আপনার বিজ্ঞাপন সম্পর্কে সংক্ষেপে লিখুন..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
                >
                  <Send size={16} />
                  অনুরোধ পাঠান
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 style={displayFont} className="text-sm font-bold uppercase tracking-wider text-slate-900">
                সরাসরি যোগাযোগ
              </h3>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
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
              <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                সাধারণত ১-২ কার্যদিবসের মধ্যে আমাদের বিজ্ঞাপন টিম আপনার সাথে যোগাযোগ করবে।
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Advertise;
