const express = require("express");
const {
  upload,
  uploadJson,
  handleMulterError,
} = require("../middlewares/upload.middleware");
const excelController = require("../controllers/excel.controller");

const router = express.Router();

router.post(
  "/excel-to-json",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      handleMulterError(err, req, res, next);
    });
  },
  excelController.excelToJson,
);

router.post(
  "/json-to-excel",
  (req, res, next) => {
    uploadJson.single("json")(req, res, (err) => {
      handleMulterError(err, req, res, next);
    });
  },
  excelController.handleJsonToExcel,
);

module.exports = router;
