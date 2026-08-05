import multer from "multer";


// Memory Storage
const storage = multer.memoryStorage();


// Image Filter
const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image/")) {

    cb(null, true);

  } else {

    cb(
      new Error("Only image files are allowed."),
      false
    );

  }

};


// Top Headline Image Upload

const topHeadlineUpload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize: 2 * 1024 * 1024, // 2MB

  },

});


export default topHeadlineUpload;