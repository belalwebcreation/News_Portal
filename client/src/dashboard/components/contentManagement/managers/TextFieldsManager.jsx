import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { baseUrl } from "../../../../config/Config";
import ConfirmModal from "../../../../dashboard/pages/ConfirmModal";

// fields: [{ name, label, type: "text" | "textarea" | "url" | "tel" | "email", placeholder, maxLength }]
// values: { [field.name]: currentValue }
const TextFieldsManager = ({
  title,
  description,
  fields,
  values = {},
  visibilityKey,        // na dile visibility toggle dekhabe na
  currentVisibility = true,
  updateUrl = "/api/site-settings",
  onSaveSuccess,
  onClose,
  autoCloseDelay = 900,
}) => {
  const buildForm = () =>
    fields.reduce((acc, field) => {
      acc[field.name] = values[field.name] || "";
      return acc;
    }, {});

  const [form, setForm] = useState(buildForm);
  const [visible, setVisible] = useState(currentVisibility);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);

  useEffect(() => {
    setForm(buildForm());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  useEffect(() => {
    setVisible(currentVisibility);
  }, [currentVisibility]);

  const handleChange = (name) => (e) => {
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const body = {};

      fields.forEach((field) => {
        body[field.name] = (form[field.name] || "").trim();
      });

      if (visibilityKey) {
        body[visibilityKey] = visible;
      }

      await axios.put(`${baseUrl}${updateUrl}`, body, {
        withCredentials: true,
      });

      if (onSaveSuccess) {
        await onSaveSuccess();
      }

      setSuccessInfo({ title: "Saved", message: "Changes saved successfully." });

      setTimeout(() => {
        setSuccessInfo(null);
        onClose?.();
      }, autoCloseDelay);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleVisibility = async () => {
    if (!visibilityKey) return;

    try {
      const newValue = !visible;
      setVisible(newValue);

      await axios.put(
        `${baseUrl}${updateUrl}`,
        { [visibilityKey]: newValue },
        { withCredentials: true }
      );

      if (onSaveSuccess) {
        await onSaveSuccess();
      }
    } catch (err) {
      console.error(err);
      setVisible(!visible);
      setError(err?.response?.data?.message || "Failed to update visibility.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {field.label}
            </label>

            {field.type === "textarea" ? (
              <textarea
                value={form[field.name]}
                onChange={handleChange(field.name)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                rows={4}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-600 dark:focus:border-amber-500 focus:outline-none resize-none"
              />
            ) : (
              <input
                type={field.type || "text"}
                value={form[field.name]}
                onChange={handleChange(field.name)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-600 dark:focus:border-amber-500 focus:outline-none"
              />
            )}

            {field.maxLength && (
              <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
                {(form[field.name] || "").length}/{field.maxLength}
              </p>
            )}
          </div>
        ))}
      </div>

      {visibilityKey && (
        <button
          type="button"
          onClick={handleVisibility}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            visible
              ? "bg-green-600 dark:bg-green-700 text-white"
              : "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
          }`}
        >
          {visible ? (
            <>
              <Eye size={18} />
              Visible
            </>
          ) : (
            <>
              <EyeOff size={18} />
              Hidden
            </>
          )}
        </button>
      )}

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 dark:hover:bg-amber-500 text-white px-6 py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <ConfirmModal
        isOpen={!!successInfo}
        onClose={() => setSuccessInfo(null)}
        type="success"
        hideCancel
        confirmText="OK"
        title={successInfo?.title}
        message={successInfo?.message}
      />
    </div>
  );
};

export default TextFieldsManager;