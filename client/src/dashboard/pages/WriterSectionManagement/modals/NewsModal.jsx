// src/modules/WriterSectionManagement/modals/NewsModal.jsx

import ImageUploader from "../components/ImageUploader";
import CategorySelect from "../components/CategorySelect";

const NewsModal = ({
  open,
  mode = "add",
  title = "",
  formData,
  setFormData,
  categories = [],
  loading = false,
  onClose,
  onSubmit,
  onImageUpload,
}) => {
  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold">

              {title ||
                (mode === "edit"
                  ? "Edit News"
                  : "Add News")}

            </h2>

            <p className="text-sm text-slate-500 mt-1">

              Manage section news content.

            </p>

          </div>

          <button
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-red-500"
          >
            ×
          </button>

        </div>

        {/* Body */}

        <form
          onSubmit={onSubmit}
          className="p-6 overflow-y-auto max-h-[75vh]"
        >

          <div className="grid lg:grid-cols-2 gap-8">

            {/* LEFT */}

            <div className="space-y-5">

              <ImageUploader
                image={formData.image}
                onUpload={onImageUpload}
                loading={loading}
              />

              <CategorySelect
                value={formData.categorySlug}
                options={categories}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    categorySlug: value,
                  }))
                }
              />

              <div>

                <label className="font-medium text-sm">

                  Headline

                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* RIGHT */}

            <div className="space-y-5">

              <div>

                <label className="font-medium text-sm">

                  Description

                </label>

                <textarea
                  rows={8}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

              </div>

              <div>

                <label className="font-medium text-sm">

                  Tags

                </label>

                <input
                  type="text"
                  name="tags"
                  value={formData.tags || ""}
                  onChange={handleChange}
                  placeholder="education, rajshahi"
                  className="mt-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  name="isHidden"
                  checked={formData.isHidden}
                  onChange={handleChange}
                />

                <span className="text-sm">

                  Hide from Homepage

                </span>

              </label>

            </div>

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t mt-8 pt-6">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : mode === "edit"
                ? "Update News"
                : "Publish News"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default NewsModal;