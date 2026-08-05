import multer from "multer";


/*
====================================
 Memory Storage
 File will stay in buffer
 Then Cloudinary will upload it
====================================
*/

const storage = multer.memoryStorage();


/*
====================================
 File Filter
 Only Image Allowed
====================================
*/

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];


  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG and WEBP images are allowed"
      ),
      false
    );
  }

};


/*
====================================
 Multer Config
====================================
*/

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

});


export default upload;