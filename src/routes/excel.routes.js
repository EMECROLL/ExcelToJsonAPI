const express = require("express");
const upload = require("../middlewares/upload.middleware");
const excelController = require("../controllers/excel.controller");

const router = express.Router();

router.post("/to-json", upload.single("file"), excelController.excelToJson);

module.exports = router;
