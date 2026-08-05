// src/modules/WriterSectionManagement/modals/BannerModal.jsx

import { useEffect, useState } from "react";
import ImageUploader from "../components/ImageUploader";

const BannerModal = ({
  open,
  banner,
  loading = false,
  onClose,
  onSave,
  onImageUpload,
}) => {
  const [formData, setFormData] = useState({
    image: "",
    link: "",
    alt: "",
    isHidden: false,
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        image: banner.image || "",
        link: banner.link || "",
        alt: banner.alt || "",
        isHidden: banner.isHidden || false,
      });
    }
  }, [banner]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Hero Banner
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update hero advertisement banner.
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
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >

          <ImageUploader
            image={formData.image}
            loading={loading}
            onUpload={onImageUpload}
          />

          <div>

            <label className="block text-sm font-semibold mb-2">
              Banner Link
            </label>

            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
            />

          </div>

          <div>

            <label className="block text-sm font-semibold mb-2">
              Alt Text
            </label>

            <input
              type="text"
              name="alt"
              value={formData.alt}
              onChange={handleChange}
              placeholder="Hero Banner"
              className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
            />

          </div>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="isHidden"
              checked={formData.isHidden}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <span className="text-sm text-slate-700">
              Hide Banner
            </span>

          </label>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t pt-6">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2.5 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Save Banner"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default BannerModal;