import { useEffect, useState } from "react";
import { Globe, Calendar } from "lucide-react";
import logo from "../../../assets/logo.png";

const AuthHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">

      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 xl:px-7 xl:py-5 text-white shadow-xl ring-1 ring-white/10">

        {/* Decorative glow shapes */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl" />

        {/* Top row: Logo + Language */}
        <div className="relative flex items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-xl bg-white p-1.5 shadow-md ring-1 ring-white/20 flex items-center justify-center shrink-0">
              <img
                src={logo}
                alt="Rajshahi College"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-base xl:text-lg font-black leading-tight">
                Rajshahi College
              </h1>
              <p className="text-xs text-slate-400">
                Official News Portal
              </p>
            </div>

          </div>

          <button
            className="flex items-center gap-1.5 xl:gap-2 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 px-2.5 py-1.5 xl:px-4 xl:py-2 text-xs xl:text-sm hover:bg-white/20 transition shrink-0"
          >
            <Globe size={14} />
            <span className="hidden sm:inline">English</span>
          </button>

        </div>

        {/* Welcome message */}
        <div className="relative mt-4 xl:mt-5 border-t border-amber-400/20 pt-3 xl:pt-4">

          <h2 className="text-lg xl:text-xl font-bold">
            Welcome Back <span className="text-amber-400">👋</span>
          </h2>

          <p className="mt-1 text-sm text-slate-300">
            Secure Login for Admin, Writer & Reader
          </p>

          <div className="mt-3 flex flex-wrap gap-2 xl:gap-3">

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs xl:text-sm text-slate-200">
              <Calendar size={13} className="text-amber-400" />
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs xl:text-sm text-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {currentTime.toLocaleTimeString()}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AuthHeader;