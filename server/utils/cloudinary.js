import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// ==========================================
// Upload Image
// ==========================================

export const uploadToCloudinary = (
  fileBuffer,
  folder = "news-portal"
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

    streamifier
      .createReadStream(fileBuffer)
      .pipe(uploadStream);
  });
};

// ==========================================
// Delete Image
// ==========================================

export const deleteFromCloudinary = async (
  publicId
) => {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(
      publicId
    );
  } catch (error) {
    console.error(
      "Cloudinary Delete Error:",
      error
    );

    return null;
  }
};

export default cloudinary;