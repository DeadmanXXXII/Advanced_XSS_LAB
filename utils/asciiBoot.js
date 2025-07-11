const fs = require("fs");

function binaryBootPrivilegeOverwrite() {
    const binaryPayload = "01010100 01101000 01100101 00100000 01101101 01100001 01101100 01100101 01100010 01101111 01101111 01110100";
    const ascii = binaryPayload.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join("");
    fs.writeFileSync("/tmp/admin_override.log", `Boot overwrite executed: ${ascii}`);
    console.log("[+] Privileges overwritten by binary boot sequence.");
}

module.exports = binaryBootPrivilegeOverwrite;
