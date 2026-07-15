import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { Newspaper } from "lucide-react";

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
  { icon: FaGithub, href: "#", label: "GitHub" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

const AuthFooter = () => {
  return (
    <footer className="mt-4 xl:mt-6 w-full">

      {/* Accent bar — ties visually back to the top banner */}
      <div className="h-1 w-full rounded-full bg-linear-to-r from-amber-700 to-orange-500 mb-3 xl:mb-4 opacity-80" />

      <div className="rounded-2xl bg-slate-900 px-5 py-4 xl:px-6 xl:py-5 shadow-xl">

        {/* Top */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3 text-center sm:text-left">

            <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center shrink-0">
              <Newspaper size={18} />
            </div>

            <div>
              <h3 className="font-bold text-white text-sm xl:text-base">
                Rajshahi College News Portal
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Trusted • Secure • Modern Digital Campus News Platform
              </p>
            </div>

          </div>

          {/* Social */}
          <div className="flex items-center gap-2">

            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="
                  w-8 h-8 xl:w-9 xl:h-9
                  rounded-lg
                  bg-slate-800
                  text-slate-300
                  hover:bg-amber-700
                  hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-amber-500
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                "
              >
                <Icon size={14} />
              </a>
            ))}

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-4 border-t border-slate-800 pt-3 flex flex-col-reverse sm:flex-row justify-between items-center gap-2">

          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} Rajshahi College News Portal. All Rights Reserved.
          </p>

          <div className="flex gap-4 text-xs text-slate-400">
            {footerLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="hover:text-amber-500 transition"
              >
                {label}
              </a>
            ))}
          </div>

        </div>

      </div>

    </footer>
  );
};

export default AuthFooter;