import { useEffect, useState } from "react";
import axios from "axios";
import { Upload, Trash2, Eye, EyeOff } from "lucide-react";
import { baseUrl } from "../../../../config/Config";

const ImageManager = ({
  title,
  uploadText,
  currentImage,
  currentVisibility = true,
  uploadUrl,
  fieldName,
  recommendedSize,
  maxFileSize = 2,
  allowHide = true,
  allowDelete = true,
  onSaveSuccess,
}) => {
  const [image, setImage] = useState(currentImage || "");
  const [preview, setPreview] = useState(currentImage || "");
  const [visible, setVisible] = useState(currentVisibility);

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    setImage(currentImage || "");
    setPreview(currentImage || "");
  }, [currentImage]);

  useEffect(() => {
    setVisible(currentVisibility);
  }, [currentVisibility]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      return setError("Please select an image.");
    }

    if (selected.size > maxFileSize * 1024 * 1024) {
      return setError(`Maximum ${maxFileSize}MB allowed.`);
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const uploadImage = async () => {
    if (!file) return image;

    const formData = new FormData();
    formData.append(fieldName, file);

    const { data } = await axios.put(
      `${baseUrl}${uploadUrl}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return data.settings.logo;
  };
    // ==========================================
  // Save
  // ==========================================

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      let logoUrl = image;

      if (file) {
        logoUrl = await uploadImage();
        setImage(logoUrl);
      }

      await axios.put(
        `${baseUrl}/api/site-settings`,
        {
          logoVisible: visible,
        },
        {
          withCredentials: true,
        }
      );

      setImage(logoUrl);
      setPreview(logoUrl);
      setFile(null);

      if (onSaveSuccess) {
        await onSaveSuccess();
      }

      alert("Saved successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to save settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Delete
  // ==========================================

  const handleDelete = async () => {
    if (!window.confirm("Delete this image?")) return;

    try {
      setDeleteLoading(true);

      await axios.delete(
        `${baseUrl}${uploadUrl}`,
        {
          withCredentials: true,
        }
      );

      setImage("");
      setPreview("");
      setFile(null);

      if (onSaveSuccess) {
        await onSaveSuccess();
      }

      alert("Image deleted.");
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete image."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================================
  // Visibility
  // ==========================================

  const handleVisibility = async () => {
    try {
      const newValue = !visible;

      setVisible(newValue);

      await axios.put(
        `${baseUrl}${uploadUrl}/visibility`,
        {
          visible: newValue,
        },
        {
          withCredentials: true,
        }
      );

      if (onSaveSuccess) {
        await onSaveSuccess();
      }
    } catch (err) {
      console.error(err);

      setVisible(!visible);

      setError(
        err?.response?.data?.message ||
          "Failed to update visibility."
      );
    }
  };  return (
    <div className="space-y-6">

      {/* Title */}

      <div>
        <h2 className="text-xl font-bold">{title}</h2>

        {recommendedSize && (
          <p className="text-sm text-slate-500 mt-1">
            Recommended Size: {recommendedSize}
          </p>
        )}
      </div>

      {/* Preview */}

      <div className="border rounded-xl p-6 flex justify-center bg-slate-50">

        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="max-h-32 object-contain"
          />
        ) : (
          <div className="text-slate-400">
            No Image Selected
          </div>
        )}

      </div>

      {/* Upload */}

      <div>

        <label className="cursor-pointer inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-lg">

          <Upload size={18} />

          {uploadText}

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

        </label>

      </div>

      {/* Visibility */}

      {allowHide && (

        <button
          type="button"
          onClick={handleVisibility}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            visible
              ? "bg-green-600 text-white"
              : "bg-slate-300"
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

      {/* Error */}

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Buttons */}

      <div className="flex gap-3">

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {allowDelete && image && (

          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-60"
          >

            <Trash2 size={18} />

            {deleteLoading
              ? "Deleting..."
              : "Delete"}

          </button>

        )}

      </div>

    </div>
  );
};

export default ImageManager;