const express = require("express");
const { upload, uploadJson } = require("../middlewares/upload.middleware");
const excelController = require("../controllers/excel.controller");

const router = express.Router();

router.post("/excel-to-json", upload.single("file"), excelController.excelToJson);
router.post("/json-to-excel", uploadJson.single("json"), excelController.handleJsonToExcel);

module.exports = router;
