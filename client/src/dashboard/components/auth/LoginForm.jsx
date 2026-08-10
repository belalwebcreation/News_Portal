import { useState } from "react";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import PasswordInput from "./PasswordInput";
import SocialLogin from "./SocialLogin";

import { useAuth } from "../../../context/AuthContext";
import { baseUrl } from "../../../config/Config";
import { getRoleHomePath } from "../../../constants/roles";

const LoginForm = () => {
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState("");

  // ===========================
  // Handle Input
  // ===========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ===========================
  // Validation
  // ===========================

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ===========================
  // Login Submit
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${baseUrl}/api/auth/login`,
        formData
      );

      // ===========================
      // Save Session
      // ===========================

      loginUser(data.user);

      // ===========================
      // Redirect By Role
      // ===========================

      console.log("Backend theke asha role:", data.user.role); // ✅ ekbar check kore verify kore nin, tarpor line ta mucha felben

      const homePath = getRoleHomePath(data.user.role);
      navigate(`/dashboard/${homePath}`);
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 p-8 transition-colors duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          Sign In
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Login to access your dashboard.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3">
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Email Address
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full rounded-xl border py-4 pl-12 pr-4 outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                errors.email
                  ? "border-red-400 dark:border-red-500"
                  : "border-slate-300 dark:border-slate-600 focus:border-amber-700 dark:focus:border-amber-500"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-2">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        {/* Remember */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() =>
                setRememberMe(!rememberMe)
              }
              className="accent-amber-700"
            />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Remember Me
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-amber-700 dark:text-amber-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
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
          {loading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin"
              />
              Signing In...
            </>
          ) : (
            <>
              Login
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      {/* Social Login */}
      <SocialLogin />

      {/* Register */}
      <div className="mt-8 text-center">
        <p className="text-slate-600 dark:text-slate-300">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="
              font-semibold
              text-amber-700
              dark:text-amber-500
              hover:underline
            "
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;