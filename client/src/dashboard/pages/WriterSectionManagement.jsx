import { useMemo, useState } from "react";
import { Film, LayoutTemplate, Newspaper } from "lucide-react";

import HeroManager from "./WriterSectionManagement/managers/HeroManager";
import LatestNewsManager from "./WriterSectionManagement/managers/LatestNewsManager";
import VideoManager from "./WriterSectionManagement/managers/VideoManager";

const SECTION_TABS = [
  { id: "hero", label: "হিরো সেকশন", description: "প্রধান নিউজ ও ব্যানার", icon: LayoutTemplate, Component: HeroManager },
  { id: "latest", label: "সর্বশেষ সংবাদ", description: "সব সংবাদ স্লট", icon: Newspaper, Component: LatestNewsManager },
  { id: "video", label: "ভিডিও গ্যালারি", description: "ভিডিও পুল ও স্লট", icon: Film, Component: VideoManager },
];

const WriterSectionManagement = ({ initialSection = "hero" }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const activeTab = useMemo(
    () => SECTION_TABS.find((tab) => tab.id === activeSection) ?? SECTION_TABS[0],
    [activeSection]
  );
  const ActiveManager = activeTab.Component;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-3 sm:p-5 lg:p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">Writer workspace</p>
        <h1 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">সেকশন ম্যানেজমেন্ট</h1>
        <p className="mt-1 text-sm text-slate-500">এক জায়গা থেকে হোমপেজের সব সম্পাদকীয় সেকশন নিয়ন্ত্রণ করুন।</p>
      </header>

      <nav
        className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
        aria-label="কন্টেন্ট সেকশন নির্বাচন"
        role="tablist"
      >
        {SECTION_TABS.map(({ id, label, description, icon: Icon }) => {
          const isActive = id === activeTab.id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`section-panel-${id}`}
              onClick={() => setActiveSection(id)}
              className={`min-w-44 flex-1 rounded-lg px-3 py-2.5 text-left transition sm:min-w-52 ${
                isActive ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-2 text-xs font-black">
                <Icon size={15} aria-hidden="true" /> {label}
              </span>
              <span className={`mt-1 block text-[11px] ${isActive ? "text-slate-300" : "text-slate-400"}`}>{description}</span>
            </button>
          );
        })}
      </nav>

      <section id={`section-panel-${activeTab.id}`} role="tabpanel" aria-label={activeTab.label}>
        <ActiveManager />
      </section>
    </main>
  );
};

export default WriterSectionManagement;

