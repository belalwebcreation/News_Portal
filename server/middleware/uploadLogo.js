import multer from "multer";

// ===============================
// Memory Storage
// ===============================

const storage = multer.memoryStorage();

// ===============================
// File Filter
// ===============================

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only PNG, JPG, JPEG and WEBP images are allowed."));
  }

  cb(null, true);
};

// ===============================
// Upload Middleware
// ===============================

const uploadLogo = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default uploadLogo;