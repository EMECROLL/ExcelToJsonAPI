const excelService = require("../services/excel.service");
const XLSX = require("xlsx");

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

exports.handleJsonToExcel = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo JSON" });
    }

    let jsonData;

    if (req.file.buffer) {
      const fileContent = req.file.buffer.toString("utf-8");
      jsonData = JSON.parse(fileContent);
    } else if (req.file.path) {
      const fs = require("fs");
      const fileContent = fs.readFileSync(req.file.path, "utf-8");
      jsonData = JSON.parse(fileContent);
      fs.unlinkSync(req.file.path);
    }

    const excelBuffer = exports.convertToExcel(jsonData);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=archivo.xlsx");
    
    return res.send(excelBuffer);

  } catch (error) {
    console.error("Error detallado:", error);
    return res.status(500).json({ 
      error: "Error al procesar el JSON", 
      details: error.message 
    });
  }
};

exports.convertToExcel = (jsonData, sheetName = "Sheet1") => {
  if (!Array.isArray(jsonData)) {
    throw new Error("El cuerpo debe ser un arreglo de objetos");
  }

  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  
  const workbook = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
};
