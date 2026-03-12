const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos Excel (.xlsx)"));
    }
  },
});

const uploadJson = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/json") {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos JSON (.json)"));
    }
  },
});

module.exports = {
  upload,
  uploadJson,
};
