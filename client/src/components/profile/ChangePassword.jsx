import { useState, useMemo } from "react";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Info,
  Check,
  AlertTriangle,
} from "lucide-react";

/* ==========================================
   1. Helper Component: Custom Input Field (Accessible)
   ========================================== */
const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
  icon: Icon,
  error,
  extraHeaderAction,
  placeholder = "••••••••",
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-base-content/80 flex items-center gap-1.5">
          <Icon size={15} className="text-primary/70" />
          <span>{label}</span>
        </label>
        {extraHeaderAction}
      </div>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input w-full bg-base-200/40 border transition-all duration-200 focus:bg-base-100 pr-11 ${
            error
              ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
              : "border-base-200/80 focus:border-primary focus:ring-2 focus:ring-primary/20"
          }`}
          required
        />

        {/* Accessible Toggle Button (Navigable via Keyboard Tab) */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-base-content/40 hover:text-base-content focus:text-primary transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      {error && (
        <p className="text-xs text-error flex items-center gap-1 pt-0.5 animate-fadeIn">
          <XCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

/* ==========================================
   2. Helper Component: Live Requirements Checklist
   ========================================== */
const PasswordChecklist = ({ requirements }) => {
  return (
    <div className="p-4 rounded-2xl bg-base-200/40 border border-base-200/80 space-y-2.5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50">
        Password Requirements
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {requirements.map((req) => (
          <div
            key={req.id}
            className={`flex items-center gap-2 transition-colors duration-200 ${
              req.met
                ? "text-emerald-600 dark:text-emerald-400 font-medium"
                : "text-base-content/40"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                req.met
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                  : "bg-base-200 text-base-content/30 border border-base-300"
              }`}
            >
              {req.met ? (
                <Check size={11} strokeWidth={3} />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              )}
            </div>
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================
   Main Change Password Component
   ========================================== */
const ChangePassword = ({ onSuccessNotification, onForgotPassword }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Check if user touched any field
  const isDirty = Boolean(
    formData.currentPassword || formData.newPassword || formData.confirmPassword
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const togglePassword = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Requirements List
  const requirements = useMemo(() => {
    const p = formData.newPassword;
    return [
      { id: "length", label: "Minimum 8 characters", met: p.length >= 8 },
      { id: "upper", label: "One uppercase letter", met: /[A-Z]/.test(p) },
      { id: "lower", label: "One lowercase letter", met: /[a-z]/.test(p) },
      { id: "number", label: "One number (0-9)", met: /[0-9]/.test(p) },
      { id: "symbol", label: "One special character", met: /[^A-Za-z0-9]/.test(p) },
    ];
  }, [formData.newPassword]);

  // Strict Policy Check (Must meet ALL requirements)
  const allRequirementsMet = useMemo(
    () => requirements.every((r) => r.met),
    [requirements]
  );

  const metCount = useMemo(
    () => requirements.filter((r) => r.met).length,
    [requirements]
  );

  // Smooth Color Shift
  const strengthInfo = useMemo(() => {
    if (!formData.newPassword) {
      return { label: "Enter Password", color: "bg-base-300", textClass: "text-base-content/40", percent: 0 };
    }
    switch (metCount) {
      case 1:
        return { label: "Very Weak", color: "bg-error", textClass: "text-error", percent: 20 };
      case 2:
        return { label: "Weak", color: "bg-warning", textClass: "text-warning", percent: 40 };
      case 3:
        return { label: "Fair", color: "bg-amber-500", textClass: "text-amber-500", percent: 60 };
      case 4:
        return { label: "Good", color: "bg-teal-500", textClass: "text-teal-500", percent: 80 };
      case 5:
        return { label: "Strong & Secure", color: "bg-emerald-500", textClass: "text-emerald-500", percent: 100 };
      default:
        return { label: "Very Weak", color: "bg-error", textClass: "text-error", percent: 10 };
    }
  }, [formData.newPassword, metCount]);

  const passwordMismatch =
    formData.confirmPassword.length > 0 &&
    formData.newPassword !== formData.confirmPassword;

  const handleReset = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordMismatch) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (!allRequirementsMet) {
      setErrorMessage("Please fulfill all password requirements before submitting.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      // Simulated API Call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      handleReset();

      const successMsg = "Password updated successfully. All other devices signed out.";
      
      // Use parent Toast System for Success
      if (onSuccessNotification) {
        onSuccessNotification(successMsg);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-base-100/80 backdrop-blur-xl border border-base-200/80 shadow-2xl shadow-base-300/10 dark:shadow-none p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-base-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-sm shadow-primary/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Security Settings
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-base-content">
              Change Password
            </h2>
            <p className="text-xs sm:text-sm text-base-content/60">
              Protect your account with a strong and unique password.
            </p>
          </div>
        </div>
      </div>

      {/* Runtime Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-error/10 border border-error/20 flex items-center gap-3 text-xs font-medium text-error animate-fadeIn">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password Field */}
        <PasswordInput
          label="Current Password"
          name="currentPassword"
          icon={KeyRound}
          value={formData.currentPassword}
          onChange={handleChange}
          visible={show.current}
          onToggle={() => togglePassword("current")}
          extraHeaderAction={
            onForgotPassword ? (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-primary font-medium hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            ) : (
              <a
                href="/forgot-password"
                className="text-xs text-primary font-medium hover:underline"
              >
                Forgot password?
              </a>
            )
          }
        />

        <div className="h-px bg-base-200/80" />

        {/* New Password & Indicators */}
        <div className="space-y-4">
          <PasswordInput
            label="New Password"
            name="newPassword"
            icon={Lock}
            value={formData.newPassword}
            onChange={handleChange}
            visible={show.new}
            onToggle={() => togglePassword("new")}
          />

          {/* Dynamic Strength Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-base-content/60 font-medium">Strength:</span>
              <span className={`font-bold ${strengthInfo.textClass}`}>
                {strengthInfo.label}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ease-out ${strengthInfo.color}`}
                style={{ width: `${strengthInfo.percent}%` }}
              />
            </div>
          </div>

          {/* Requirements Checklist */}
          <PasswordChecklist requirements={requirements} />
        </div>

        {/* Confirm Password Field */}
        <PasswordInput
          label="Confirm New Password"
          name="confirmPassword"
          icon={CheckCircle2}
          value={formData.confirmPassword}
          onChange={handleChange}
          visible={show.confirm}
          onToggle={() => togglePassword("confirm")}
          error={passwordMismatch ? "Passwords do not match" : ""}
        />

        {/* Security Warning Box */}
        <div className="p-4 rounded-2xl bg-info/10 border border-info/20 flex items-start gap-3 text-xs text-info-content">
          <Info size={18} className="shrink-0 text-info mt-0.5" />
          <p className="leading-relaxed">
            Changing your password will automatically sign you out from all other active browser sessions for security protection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-base-200/80">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || loading}
            className="btn btn-ghost btn-sm sm:btn-md rounded-2xl gap-2 text-base-content/70 hover:text-base-content disabled:bg-transparent disabled:opacity-40"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            disabled={
              loading ||
              !isDirty ||
              passwordMismatch ||
              !allRequirementsMet ||
              !formData.currentPassword
            }
            className="btn btn-primary btn-sm sm:btn-md rounded-2xl shadow-lg shadow-primary/25 gap-2 disabled:shadow-none"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;