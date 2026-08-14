// client/src/pages/auth/ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`/news/api/auth/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMessage(
          data.message || "Invalid or expired reset link. Please request a new one."
        );
        return;
      }

      setStatus("success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="mt-10 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 p-8 transition-colors duration-300">
          {status === "success" ? (
            <div>
              <div className="mb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/40">
                  <CheckCircle2 size={28} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="mt-5 text-3xl font-black text-slate-900 dark:text-white">
                  Password Reset Successful
                </h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Your password has been changed. Redirecting you to login...
                </p>
              </div>

              <Link
                to="/login"
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
                "
              >
                Go to Login
                <ArrowRight size={20} />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  Reset Password
                </h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Enter a new password for your account.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                      disabled={status === "loading"}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border py-4 pl-12 pr-12 outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-300 dark:border-slate-600 focus:border-amber-700 dark:focus:border-amber-500 disabled:opacity-70"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      required
                      disabled={status === "loading"}
                      placeholder="Re-enter your password"
                      className="w-full rounded-xl border py-4 pl-12 pr-4 outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-300 dark:border-slate-600 focus:border-amber-700 dark:focus:border-amber-500 disabled:opacity-70"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
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
                  {status === "loading" ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600 dark:text-slate-300">
                  Remembered your password?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-amber-700 dark:text-amber-500 hover:underline"
                  >
                    Back to login
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;