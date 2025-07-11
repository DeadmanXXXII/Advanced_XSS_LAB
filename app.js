const express = require("express");
const app = express();
const asciiBoot = require("./utils/asciiBoot");
const txtUpload = require("./routes/upload");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

// DB connection (real world ready)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_db_password",
    database: "xsslab"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL connected!");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/uploads", txtUpload);

// Startup privilege overwrite
asciiBoot();

app.get("/", (req, res) => {
    res.send("<h2>Advanced XSS Lab Running! Upload endpoint at /uploads/txt-upload</h2>");
});

app.listen(3000, () => {
    console.log("Lab running on port 3000");
});

// Export DB for other modules
module.exports = db;
