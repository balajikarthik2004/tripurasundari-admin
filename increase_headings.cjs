const fs = require("fs");
const path = require("path");

const dir =
  "c:\\Users\\KaviyapriyaPerumal\\Desktop\\omg-temple-admin\\omg-temple-admin\\src\\components\\temple\\sections";

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf8");

      // Bump font weight specifically for heading-like classes:
      // 1. uppercase labels (usually text-[10px] or text-xs)
      content = content.replace(/font-semibold(.*?)uppercase/g, "font-bold$1uppercase");
      content = content.replace(/font-medium(.*?)uppercase/g, "font-semibold$1uppercase");

      // 2. text-foreground which are usually titles
      content = content.replace(/font-semibold(.*?)text-foreground/g, "font-bold$1text-foreground");
      content = content.replace(
        /font-medium(.*?)text-foreground/g,
        "font-semibold$1text-foreground",
      );

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);

// Also do it for DashboardSection.tsx explicitly if it's there (it's in the loop)
console.log("Successfully increased heading font weights.");
