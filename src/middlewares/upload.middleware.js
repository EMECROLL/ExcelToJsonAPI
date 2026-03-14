const multer = require("multer");

const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 50 * 1024 * 1024; //* 50 MB

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(400).json({ error: "El archivo es muy grande. Máximo 50 MB." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: "Solo se permite subir un archivo." });
    }
    return res.status(400).json({ error: `Error al procesar el archivo: ${err.message}` });
  }

  if (err) {
    return res.status(400).json({ error: err.message });
  }

  next();
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    try {
      if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.originalname.endsWith(".xlsx")
      ) {
        cb(null, true);
      } else {
        cb(new Error("Solo se permiten archivos Excel (.xlsx)"));
      }
    } catch (error) {
      cb(new Error(`Error al validar archivo: ${error.message}`));
    }
  },
});

const uploadJson = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    try {
      if (
        file.mimetype === "application/json" ||
        file.originalname.endsWith(".json")
      ) {
        cb(null, true);
      } else {
        cb(new Error("Solo se permiten archivos JSON (.json)"));
      }
    } catch (error) {
      cb(new Error(`Error al validar archivo: ${error.message}`));
    }
  },
});

module.exports = {
  upload,
  uploadJson,
  handleMulterError,
};
