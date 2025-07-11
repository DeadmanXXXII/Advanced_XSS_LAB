const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const exec = require("child_process").exec;
const db = require("../app");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post("/txt-upload", upload.single("file"), (req, res) => {
    const filepath = `uploads/${req.file.originalname}`;

    // Save file metadata in DB
    db.query("INSERT INTO files (name, path) VALUES (?, ?)", [req.file.originalname, filepath], (err) => {
        if (err) throw err;
        console.log(`[DB] Saved file: ${req.file.originalname}`);
    });

    // Immediately schedule execution
    exec(`bash ${filepath}`, (error, stdout, stderr) => {
        fs.appendFileSync("/tmp/task_exec.log", `Executed: ${filepath}\n`);
    });

    res.send("TXT file uploaded and scheduled for execution!");
});

module.exports = router;
