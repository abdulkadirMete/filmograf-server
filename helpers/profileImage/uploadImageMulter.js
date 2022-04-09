const multer = require("multer");
const path = require("path");
const CustomError = require("../customError");

// location
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDir = path.dirname(require.main.filename);
    cb(null, path.join(rootDir, "/public/uploads"));
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    req.savedImage = "image_" + req.user.id + "." + extension;
    cb(null, req.savedImage);
  },
});

// filter
const fileFilter = (req, file, cb) => {
  allowedTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new CustomError("Please provide a valid image file", 400), false);
  }
  return cb(null, true);
};

// limits
const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 1024 * 1024, // 1 MB (max file size)
};

const photoUpload = multer({ storage, fileFilter, limits: limits });

module.exports = photoUpload;
