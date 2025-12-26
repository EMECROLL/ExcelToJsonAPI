const excelService = require("../services/excel.service");

exports.excelToJson = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Archivo no enviado" });
    }

    const result = excelService.convertToJson(req.file.buffer);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al procesar el Excel",
      error: error.message,
    });
  }
};
