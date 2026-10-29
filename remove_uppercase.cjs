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

      // Remove uppercase, capitalize, tracking-wider, tracking-widest classes
      content = content.replace(/\buppercase\b/g, "");
      content = content.replace(/\bcapitalize\b/g, "");
      content = content.replace(/\btracking-wider\b/g, "");
      content = content.replace(/\btracking-widest\b/g, "");

      // Clean up multiple spaces that might have been left
      // IMPORTANT: use [ \t] instead of \s to preserve newlines!
      content = content.replace(/[ \t]{2,}/g, " ");
      // Fix potential `className=" "` issue
      content = content.replace(/className="\s+"/g, 'className=""');
      content = content.replace(/className=" /g, 'className="');
      content = content.replace(/ "/g, '"');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);
console.log("Successfully removed all uppercase/capitalize styling globally.");
