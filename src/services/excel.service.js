const XLSX = require("xlsx");

exports.convertToJson = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
  });

  return {
    sheet: sheetName,
    rows: data.length,
    data,
  };
};
