import { useState } from "react";
import {
  Save,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

const GroupManager = ({
  title,
  description,
  fields = [],
  currentData = {},
  onSave,
}) => {

  const [formData, setFormData] =
    useState(currentData);

  const [visible, setVisible] =
    useState(
      currentData.visible ?? true
    );

  const handleChange = (
    key,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFormData(currentData);

    setVisible(
      currentData.visible ?? true
    );
  };

  const handleSave = () => {

    if (onSave) {

      onSave({
        ...formData,
        visible,
      });

    }

  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h2 className="text-3xl font-black text-slate-800">
          {title}
        </h2>

        <p className="mt-2 text-slate-500">
          {description}
        </p>

      </div>

            {/* Dynamic Fields */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {fields.map((field) => (

          <div
            key={field.name}
            className={
              field.type === "textarea"
                ? "md:col-span-2"
                : ""
            }
          >

            <label className="block mb-2 text-sm font-semibold text-slate-700">

              {field.label}

            </label>

            {/* Text */}

            {field.type === "text" && (

              <input
                type="text"
                value={formData[field.name] || ""}
                onChange={(e) =>
                  handleChange(
                    field.name,
                    e.target.value
                  )
                }
                placeholder={field.placeholder}
                className="
                  w-full
                  h-12
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  outline-none
                  focus:border-amber-600
                "
              />

            )}

            {/* Textarea */}

            {field.type === "textarea" && (

              <textarea
                rows={5}
                value={formData[field.name] || ""}
                onChange={(e) =>
                  handleChange(
                    field.name,
                    e.target.value
                  )
                }
                placeholder={field.placeholder}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  p-4
                  outline-none
                  resize-none
                  focus:border-amber-600
                "
              />

            )}

            {/* Select */}

            {field.type === "select" && (

              <select
                value={formData[field.name] || ""}
                onChange={(e) =>
                  handleChange(
                    field.name,
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-12
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  outline-none
                  focus:border-amber-600
                "
              >

                {field.options.map((option) => (

                  <option
                    key={option.value}
                    value={option.value}
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

      <div className="rounded-2xl border border-slate-200 p-6 bg-white">

        <div className="flex items-center justify-between">

          <div>

            <h3 className="font-bold text-slate-800">
              Visibility
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Show or hide this section.
            </p>

          </div>

          <button
            onClick={() =>
              setVisible(!visible)
            }
            className={`h-11 px-6 rounded-xl text-white flex items-center gap-2 transition ${
              visible
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
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

        </div>

      </div>

            {/* Footer Actions */}

      <div className="flex flex-wrap items-center justify-end gap-4 border-t border-slate-200 pt-6">

        <button
          type="button"
          onClick={handleReset}
          className="
            h-12
            px-6
            rounded-xl
            border
            border-slate-300
            hover:bg-slate-100
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