/**
 * ==========================================================
 * Cloudinary Image Upload Service
 * ==========================================================
 * Handles:
 * - Image validation
 * - File size validation
 * - Image type validation
 * - Upload
 * - Error handling
 * - Returns full image metadata
 * ==========================================================
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export const uploadImageToCloudinary = async (
  file,
  folder = "news"
) => {
  if (!file) {
    throw new Error("No image selected.");
  }

  if (!(file instanceof File)) {
    throw new Error("Invalid image file.");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Only JPG, JPEG, PNG and WEBP images are allowed."
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "Image size cannot exceed 5 MB."
    );
  }

  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary environment variables are missing."
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "upload_preset",
    uploadPreset
  );

  formData.append("folder", folder);

  formData.append(
    "resource_type",
    "image"
  );

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        error.error?.message ||
          "Cloudinary upload failed."
      );
    }

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error(
        "Image URL not returned from Cloudinary."
      );
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
      originalName: file.name,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Upload request timed out.",
        { cause: error }
      );
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : String(error) || "Image upload failed.";

    throw new Error(errorMessage, { cause: error });
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Optional Helper
 */

export const isValidImage = (file) => {
  if (!file) return false;

  return (
    ALLOWED_TYPES.includes(file.type) &&
    file.size <= MAX_FILE_SIZE
  );
};