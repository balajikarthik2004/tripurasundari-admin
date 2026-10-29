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

      // Reduce padding
      content = content.replace(/\bp-([456])\b/g, (match, p1) => `p-${parseInt(p1) - 1}`);
      // Reduce grid gaps
      content = content.replace(/\bgap-([456])\b/g, (match, p1) => `gap-${parseInt(p1) - 1}`);
      // Reduce vertical section spacing
      content = content.replace(
        /\bspace-y-([568])\b/g,
        (match, p1) => `space-y-${parseInt(p1) - 1}`,
      );
      // Reduce margin bottoms
      content = content.replace(/\bmb-([345])\b/g, (match, p1) => `mb-${parseInt(p1) - 1}`);
      // Reduce margin tops
      content = content.replace(/\bmt-([345])\b/g, (match, p1) => `mt-${parseInt(p1) - 1}`);

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);
console.log("Successfully tightened all spacing (paddings, gaps, margins) globally.");
