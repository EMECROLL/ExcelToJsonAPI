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

exports.convertToExcel = (jsonData, sheetName = "Sheet1") => {
  const worksheet = XLSX.utils.json_to_sheet(jsonData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return buffer;
};
