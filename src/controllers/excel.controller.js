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
  const fs = require("fs");
  let filePathToDelete = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo JSON" });
    }

    let jsonData;

    try {
      if (req.file.buffer) {
        const fileContent = req.file.buffer.toString("utf-8");
        jsonData = JSON.parse(fileContent);
      } else if (req.file.path) {
        filePathToDelete = req.file.path;
        const fileContent = fs.readFileSync(req.file.path, "utf-8");
        jsonData = JSON.parse(fileContent);
      } else {
        throw new Error("No se pudo acceder al contenido del archivo");
      }

      if (!jsonData) {
        throw new Error("El archivo JSON está vacío");
      }
    } catch (parseError) {
      throw new Error(`Error al procesar el JSON: ${parseError.message}`);
    }

    if (!Array.isArray(jsonData)) {
      throw new Error("El JSON debe ser un array de objetos");
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
  } finally {
    if (filePathToDelete) {
      try {
        if (fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
        }
      } catch (deleteError) {
        console.warn("Advertencia: No se pudo eliminar archivo temporal", deleteError.message);
      }
    }
  }
};

exports.convertToExcel = (jsonData, sheetName = "Sheet1") => {
  try {
    if (!Array.isArray(jsonData)) {
      throw new Error("El cuerpo debe ser un arreglo de objetos");
    }

    if (jsonData.length === 0) {
      throw new Error("El array no puede estar vacío");
    }

    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    
    const workbook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    return XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
  } catch (error) {
    throw new Error(`Error al procesar Excel: ${error.message}`);
  }
};
