const XLSX = require("xlsx");

exports.convertToJson = (buffer) => {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error("El buffer del archivo está vacío");
    }

    const workbook = XLSX.read(buffer, { type: "buffer" });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("El archivo Excel no contiene hojas");
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error("No se pudo leer la hoja del Excel");
    }

    const data = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
    });

    return {
      sheet: sheetName,
      rows: data.length,
      data,
    };
  } catch (error) {
    throw new Error(`Error al convertir Excel a JSON: ${error.message}`);
  }
};

exports.convertToExcel = (jsonData, sheetName = "Sheet1") => {
  try {
    if (!jsonData) {
      throw new Error("Los datos JSON no pueden estar vacíos");
    }

    if (!Array.isArray(jsonData)) {
      throw new Error("Los datos deben ser un array de objetos");
    }

    if (jsonData.length === 0) {
      throw new Error("El array de objetos no puede estar vacío");
    }

    const worksheet = XLSX.utils.json_to_sheet(jsonData);

    if (!worksheet) {
      throw new Error("No se pudo crear la hoja de Excel");
    }

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    if (!buffer) {
      throw new Error("No se pudo generar el buffer del Excel");
    }

    return buffer;
  } catch (error) {
    throw new Error(`Error al convertir JSON a Excel: ${error.message}`);
  }
};
