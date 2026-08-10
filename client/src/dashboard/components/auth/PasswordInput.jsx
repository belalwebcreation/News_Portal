import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = ({
  label = "Password",
  name = "password",
  value,
  onChange,
  error,
  placeholder = "Enter your password",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
        {label}
      </label>

      <div className="relative">

        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />

        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border py-4 pl-12 pr-12 outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500

          ${
            error
              ? "border-red-400 dark:border-red-500"
              : "border-slate-300 dark:border-slate-600 focus:border-amber-700 dark:focus:border-amber-500"
          }
          `}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>

      </div>

      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
          {error}
        </p>
      )}

    </div>
  );
};

export default PasswordInput;