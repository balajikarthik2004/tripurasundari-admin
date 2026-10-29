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

      // Remove divide-y and divide-border classes
      content = content.replace(/\bdivide-y\s+divide-border\b/g, "");
      content = content.replace(/\bdivide-y\b/g, "");

      // Clean up multiple spaces that might have been left
      content = content.replace(/\s{2,}/g, " ");
      // Fix potential `className=" "` issue
      content = content.replace(/className="\s+"/g, 'className=""');
      content = content.replace(/className=" /g, 'className="');
      content = content.replace(/ "/g, '"');

      // Also remove border-b border-border from thead
      // Using a regex to find thead with those classes
      content = content.replace(
        /thead className="([^"]*)\bborder-b\s+border-border\b([^"]*)"/g,
        'thead className="$1$2"',
      );

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);
console.log("Successfully removed table/list hr lines globally.");
