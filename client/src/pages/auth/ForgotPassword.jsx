import { useState } from "react";
import { Mail, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * ============================================================================
 * FORGOT PASSWORD PAGE — restyled to match LoginForm's card UI, full dark mode.
 * Backend WIRED UP:
 *   POST /news/api/auth/forgot-password  -> { email }
 *
 * NOTE: This app's Express server mounts ALL auth routes under
 * "/news/api/auth/..." (see server.js -> app.use("/news/api/auth", authRoutes)).
 * Every fetch call in this file MUST include that "/news" prefix, or it
 * will 404 even though the route exists.
 * ============================================================================
 */

export default function ForgotPassword() {
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

    try {
      const res = await fetch("/news/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || "Something went wrong. Please try again."
        );
      }

      setIsSubmitted(true);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setServerError("");
    setIsLoading(true);

    try {
      const res = await fetch("/news/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || "Could not resend. Please try again."
        );
      }
    } catch (err) {
      setServerError(err.message || "Could not resend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="mt-10 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 p-8 transition-colors duration-300">
          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 transition hover:text-amber-700 dark:hover:text-amber-500"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>

          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  Forgot Password?
                </h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {serverError && (
                <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full rounded-xl border py-4 pl-12 pr-4 outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                        fieldError
                          ? "border-red-400 dark:border-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:border-amber-700 dark:focus:border-amber-500"
                      }`}
                    />
                  </div>
                  {fieldError && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                      {fieldError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full
                    h-14
                    rounded-xl
                    bg-amber-700
                    hover:bg-amber-800
                    dark:bg-amber-600
                    dark:hover:bg-amber-700
                    text-white
                    font-semibold
                    text-lg
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition-all
                    duration-300
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div>
              <div className="mb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/40">
                  <CheckCircle2 size={28} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="mt-5 text-3xl font-black text-slate-900 dark:text-white">
                  Check Your Email
                </h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  If an account exists for{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {email}
                  </span>
                  , we've sent a link to reset your password. It should arrive within a few
                  minutes.
                </p>
              </div>

              {serverError && (
                <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3">
                  {serverError}
                </div>
              )}

              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="w-full h-14 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold flex items-center justify-center gap-2 transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Didn't get it? Resend link"
                )}
              </button>

              <div className="mt-8 text-center">
                <p className="text-slate-600 dark:text-slate-300">
                  Wrong email?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setServerError("");
                    }}
                    className="font-semibold text-amber-700 dark:text-amber-500 hover:underline"
                  >
                    Try a different address
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}