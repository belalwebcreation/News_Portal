import {
  Save,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

import { useEffect, useState } from "react";

const GroupManager = ({
  title,
  description,
  fields = [],
  currentData = {},
  onSave,
}) => {

  const [formData, setFormData] = useState({});

  const [visible, setVisible] = useState(
    currentData.visible ??
    currentData.logoVisible ??
    true
  );

  // ===========================
  // Sync Props Data
  // ===========================

  useEffect(() => {
    setFormData(currentData);
    setVisible(
      currentData.visible ??
      currentData.logoVisible ??
      true
    );
  }, [currentData]);

  // ===========================
  // Handle Input Change
  // ===========================

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ===========================
  // Reset
  // ===========================

  const handleReset = () => {
    setFormData(currentData);
    setVisible(
      currentData.visible ??
      currentData.logoVisible ??
      true
    );
  };

  // ===========================
  // Save
  // ===========================

  const handleSave = () => {
    if (!onSave) return;

    onSave({
      ...formData,
      // backend compatible
      logoVisible: visible,
      // backward compatibility
      visible,
    });
  };

  // Shared input/textarea/select styling — light + dark
  const controlClasses = `
    w-full
    h-12
    rounded-xl
    border
    border-slate-300
    dark:border-slate-600
    bg-white
    dark:bg-slate-800
    text-slate-900
    dark:text-slate-100
    placeholder-slate-400
    dark:placeholder-slate-500
    px-4
    outline-none
    focus:border-amber-600
    dark:focus:border-amber-500
  `;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      {/* Dynamic Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.type === "textarea" ? "md:col-span-2" : ""}
          >
            <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {field.label}
            </label>

            {/* Text Input */}
            {field.type === "text" && (
              <input
                type="text"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={controlClasses}
              />
            )}

            {/* Textarea */}
            {field.type === "textarea" && (
              <textarea
                rows={5}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`${controlClasses} !h-auto p-4 resize-none`}
              />
            )}

            {/* Select */}
            {field.type === "select" && (
              <select
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className={controlClasses}
              >
                {field.options?.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Visibility */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">
              Visibility
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Show or hide this section.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className={`
              h-11
              px-6
              rounded-xl
              text-white
              flex
              items-center
              gap-2
              transition
              ${
                visible
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
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
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-end gap-4 border-t border-slate-200 dark:border-slate-700 pt-6">
        <button
          type="button"
          onClick={handleReset}
          className="
            h-12
            px-6
            rounded-xl
            border
            border-slate-300
            dark:border-slate-600
            text-slate-700
            dark:text-slate-200
            hover:bg-slate-100
            dark:hover:bg-slate-700
            transition
            flex
            items-center
            gap-2
          "
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="
            h-12
            px-8
            rounded-xl
            bg-amber-700
            hover:bg-amber-800
            dark:bg-amber-600
            dark:hover:bg-amber-700
            text-white
            transition
            flex
            items-center
            gap-2
          "
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default GroupManager;