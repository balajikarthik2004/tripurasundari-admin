const fs = require("fs");
const path = require("path");

const dir =
  "c:\\Users\\KaviyapriyaPerumal\\Desktop\\omg-temple-admin\\omg-temple-admin\\src\\components\\temple";

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(/rounded-(lg|xl|2xl|3xl|full|\[\d+px\])/g, "rounded-md");
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);
console.log("Done replacing rounded classes");
