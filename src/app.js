const express = require("express");
const cors = require("cors");

const excelRoutes = require("./routes/excel.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/excel", excelRoutes);

module.exports = app;
