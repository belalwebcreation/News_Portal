import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Globe,
} from "lucide-react";

import { baseUrl } from "../../../config/Config";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({});

  const [serverError, setServerError] = useState("");

  const [loading, setLoading] = useState(false);

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Confirm password is required";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (!agree) {
      newErrors.agree =
        "You must accept Terms & Conditions";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

    // ===========================
  // Register Submit
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);

      await axios.post(
        `${baseUrl}/api/auth/register`,
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }
      );

      navigate("/verify-email-notice", {
        state: {
          email: formData.email,
        },
      });
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 p-8">

      {/* Heading */}

      <div className="mb-8">

        <h2 className="text-3xl font-black text-slate-900">

          Create Account

        </h2>

        <p className="mt-2 text-slate-500">

          Join Rajshahi College News Portal

        </p>

      </div>

      {/* Server Error */}

      {serverError && (

        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">

          {serverError}

        </div>

      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Full Name */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Full Name

          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full rounded-xl border py-4 pl-12 pr-4 outline-none transition ${
                errors.fullName
                  ? "border-red-400"
                  : "border-slate-300 focus:border-amber-700"
              }`}
            />

          </div>

          {errors.fullName && (

            <p className="mt-2 text-sm text-red-500">

              {errors.fullName}

            </p>

          )}

        </div>

        {/* Email */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Email Address

          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full rounded-xl border py-4 pl-12 pr-4 outline-none transition ${
                errors.email
                  ? "border-red-400"
                  : "border-slate-300 focus:border-amber-700"
              }`}
            />

          </div>

          {errors.email && (

            <p className="mt-2 text-sm text-red-500">

              {errors.email}

            </p>

          )}

        </div>

                {/* Password */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Password

          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={`w-full rounded-xl border py-4 pl-12 pr-12 outline-none transition ${
                errors.password
                  ? "border-red-400"
                  : "border-slate-300 focus:border-amber-700"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password}
            </p>
          )}

        </div>

        {/* Confirm Password */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            Confirm Password

          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className={`w-full rounded-xl border py-4 pl-12 pr-12 outline-none transition ${
                errors.confirmPassword
                  ? "border-red-400"
                  : "border-slate-300 focus:border-amber-700"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}

        </div>

        {/* College / Company */}

        <div>

          <label className="mb-2 block text-sm font-semibold">

            College / Organization (Optional)

          </label>

          <div className="relative">

            <Globe
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Rajshahi College"
              className="w-full rounded-xl border border-slate-300 py-4 pl-12 pr-4 outline-none focus:border-amber-700"
            />

          </div>

        </div>

        {/* Terms */}

        <div>

          <label className="flex items-start gap-3">

            <input
              type="checkbox"
              checked={agree}
              onChange={() =>
                setAgree(!agree)
              }
              className="mt-1 accent-amber-700"
            />

            <span className="text-sm text-slate-600">

              I agree to the Terms & Conditions and
              Privacy Policy.

            </span>

          </label>

          {errors.agree && (
            <p className="mt-2 text-sm text-red-500">
              {errors.agree}
            </p>
          )}

        </div>

        {/* Register Button */}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-lg flex items-center justify-center gap-2 transition disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin"
              />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={20} />
            </>
          )}
        </button>

      </form>

      <div className="mt-8 text-center">

        <p className="text-slate-600">

          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-amber-700 hover:underline"
          >
            Sign In
          </Link>

        </p>

      </div>

    </div>
  );
};

export default RegisterForm;