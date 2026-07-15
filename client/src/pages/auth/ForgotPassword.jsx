import { useState } from "react";
import { Mail, Loader2, ArrowRight, ArrowLeft, Globe, CheckCircle2 } from "lucide-react";
// import { baseUrl } from "../../config/Config";
import { Link } from "react-router-dom";

/**
 * ============================================================================
 * NEWS PORTAL — FORGOT PASSWORD PAGE — fully responsive, UI-complete.
 * Backend is NOT wired up yet.
 * ============================================================================
 * Search this file for "BACKEND INTEGRATION POINT" to find every spot that
 * needs a real API call. Summary of backend work required:
 *
 *  1. POST /api/auth/forgot-password  -> accepts { email }, and if an account
 *                                        exists for it, emails a reset link
 *                                        containing a single-use token
 *                                        (e.g. /reset-password?token=...).
 *                                        ALWAYS return a generic success
 *                                        response either way -- never reveal
 *                                        whether the email is registered,
 *                                        to avoid account enumeration.
 *  2. Rate limiting                   -> throttle repeated requests for the
 *                                        same email / IP to prevent abuse.
 *  3. /reset-password page            -> build the page the emailed link
 *                                        points to, where the user sets and
 *                                        confirms a new password using the
 *                                        token from the query string.
 *  4. i18n (EN / bn toggle)           -> same placeholder as Login.jsx; only
 *                                        flips local UI state for now.
 * ============================================================================
 */

const TOP_STORIES = [
  { tag: "Politics", text: "Parliament set to debate new housing bill" },
  { tag: "Business", text: "Markets rally as trade talks resume" },
  { tag: "Sports", text: "National team advances to semifinal" },
];

export default function ForgotPassword() {
  const [language, setLanguage] = useState("en"); // "en" | "bn" -- UI only, see note above
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (fieldError) setFieldError("");
  };

  const validate = () => {
    if (!email.trim()) {
      setFieldError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("Enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setIsLoading(true);

    /* -------------------------------------------------------------------
       BACKEND INTEGRATION POINT -- replace this whole mock block with:

       try {
         const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ email }),
         });
         if (!res.ok) {
           const data = await res.json().catch(() => ({}));
           throw new Error(data?.message || "Something went wrong. Please try again.");
         }

         setIsSubmitted(true);
       } catch (err) {
         setServerError(err.message);
       } finally {
         setIsLoading(false);
       }
    ------------------------------------------------------------------- */
    await new Promise((r) => setTimeout(r, 1100));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleResend = async () => {
    setServerError("");
    setIsLoading(true);

    // BACKEND INTEGRATION POINT -- re-call POST /api/auth/forgot-password
    // with the same `email`. Consider disabling this button for a short
    // cooldown window after each send.
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* ---------- Masthead panel — lg screens and up ---------- */}
      <div className="hidden lg:flex lg:w-2/5 flex-col bg-slate-900 p-10 xl:p-14">
        <div className="border-b border-slate-800 pb-6">
          <p className="text-xs font-semibold tracking-widest text-slate-500">DHAKA EDITION</p>
          <h1 className="mt-2 font-serif text-4xl xl:text-5xl font-bold tracking-tight text-white">
            The Dispatch
          </h1>
        </div>

        <div className="mt-10 flex-1">
          <p className="mb-4 text-xs font-semibold tracking-widest text-slate-500">TOP STORIES</p>
          <ul className="space-y-5">
            {TOP_STORIES.map((story, i) => (
              <li key={i} className="border-b border-slate-800 pb-5 last:border-0">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-red-500">
                  {story.tag}
                </span>
                <p className="mt-1.5 font-serif text-lg leading-snug text-slate-100">{story.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-slate-500">
          Independent journalism, every morning. © {new Date().getFullYear()} The Dispatch.
        </p>
      </div>

      {/* ---------- Form panel ---------- */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => setLanguage((l) => (l === "en" ? "bn" : "en"))}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Globe className="h-3.5 w-3.5" />
              {language === "en" ? "বাংলা" : "English"}
            </button>
          </div>

          {/* mobile-only masthead */}
          <div className="mb-8 lg:hidden">
            <p className="text-xs font-semibold tracking-widest text-slate-500">DHAKA EDITION</p>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-slate-900">
              The Dispatch
            </h1>
          </div>

          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>

          {!isSubmitted ? (
            <>
              <h2 className="font-serif text-2xl font-bold text-slate-900">Forgot your password?</h2>
              <span className="mt-3 block h-1 w-8 rounded-full bg-red-700" />
              <p className="mt-4 text-sm text-slate-500">
                Enter the email address linked to your account and we'll send you a link to reset
                your password.
              </p>

              {serverError && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-red-500/30 ${
                        fieldError
                          ? "border-red-300 focus:border-red-400"
                          : "border-slate-300 focus:border-red-500"
                      }`}
                    />
                  </div>
                  {fieldError && <p className="mt-1.5 text-xs text-red-600">{fieldError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-5 font-serif text-2xl font-bold text-slate-900">Check your email</h2>
              <span className="mt-3 block h-1 w-8 rounded-full bg-red-700" />
              <p className="mt-4 text-sm text-slate-500">
                If an account exists for{" "}
                <span className="font-medium text-slate-700">{email}</span>, we've sent a link to
                reset your password. It should arrive within a few minutes.
              </p>

              {serverError && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Didn't get it? Resend link"
                )}
              </button>

              <p className="mt-6 text-sm text-slate-500">
                Wrong email?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setServerError("");
                  }}
                  className="font-medium text-red-700 hover:text-red-800"
                >
                  Try a different address
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
