import { useRef } from "react";
import { ImagePlus, UploadCloud, Trash2 } from "lucide-react";

const ImageUploader = ({
  label = "Featured Image",
  image,
  onChange,
  onRemove,
  accept = "image/*",
  disabled = false,
  helperText = "PNG, JPG, JPEG or WEBP",
}) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onChange?.(file);

    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Label */}

      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {/* Upload Area */}

      {!image ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="
            flex
            min-h-[240px]
            w-full
            flex-col
            items-center
            justify-center
            rounded-2xl
            border-2
            border-dashed
            border-slate-300
            bg-slate-50
            px-6
            py-10
            transition
            hover:border-blue-500
            hover:bg-blue-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ImagePlus className="h-12 w-12 text-slate-400" />

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            Upload Image
          </h3>

          <p className="mt-2 text-center text-sm text-slate-500">
            Click here to choose an image
          </p>

          <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            <UploadCloud className="h-4 w-4" />
            Select Image
          </span>

          <p className="mt-4 text-xs text-slate-400">
            {helperText}
          </p>
        </button>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <img
            src={typeof image === "string" ? image : URL.createObjectURL(image)}
            alt="Preview"
            className="
              aspect-video
              w-full
              object-cover
            "
          />

          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-slate-200
              p-4
              sm:flex-row
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="
                rounded-lg
                border
                border-slate-300
                px-4
                py-2
                text-sm
                font-medium
                transition
                hover:bg-slate-100
              "
            >
              Change Image
            </button>

            <button
              type="button"
              onClick={onRemove}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-red-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-red-700
              "
            >
              <Trash2 className="h-4 w-4" />

              Remove
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
        accept={accept}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;