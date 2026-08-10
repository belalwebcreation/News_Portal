import { useRef, useState } from "react";
import axios from "axios";
import {
  Upload,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

import { baseUrl } from "../../../../config/Config";
import ConfirmModal from "../../../../dashboard/pages/ConfirmModal";

const TopHeadlineImage = ({
  headlineId,
  image,
  publicId,
  onUpload,
  onDelete,
}) => {
  const inputRef = useRef(null);

  const [preview, setPreview] = useState(image || "");

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  // 🆕 window.confirm replace korar jonno
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Maximum image size is 2MB.");
      return;
    }

    setError("");

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const { data } = await axios.put(
        `${baseUrl}/api/top-headline/${headlineId}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
            const uploadedImage = data.image;

      setPreview(uploadedImage.secure_url);

      if (onUpload) {
        onUpload({
          image: uploadedImage.secure_url,
          imagePublicId: uploadedImage.public_id,
        });
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Image upload failed."
      );

      setPreview(image || "");
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  // Delete button -> ekhon shudhu confirm modal khulbe
  const requestDelete = () => {
    if (!publicId) return;
    setShowDeleteConfirm(true);
  };

  // Asol delete logic — ConfirmModal-e "Confirm" chaple cholbe
  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      await axios.delete(
        `${baseUrl}/api/top-headline/${headlineId}/image`,
        {
          withCredentials: true,
        }
      );

      setPreview("");

      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Image delete failed."
      );
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="w-full h-40 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt="Headline"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400 dark:text-slate-500">
            <ImageIcon size={40} />
            <span className="text-sm mt-2">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* Upload */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleSelect}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white flex items-center gap-2 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={18} />
              {preview ? "Replace Image" : "Upload Image"}
            </>
          )}
        </button>

        {preview && (
          <button
            type="button"
            onClick={requestDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white flex items-center gap-2 disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Delete confirm modal (age window.confirm chilo) */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        type="delete"
        title="Delete Image"
        message="আপনি কি নিশ্চিত এই headline image টি delete করতে চান? এই action ফেরানো যাবে না।"
        isLoading={deleting}
      />
    </div>
  );
};

export default TopHeadlineImage;