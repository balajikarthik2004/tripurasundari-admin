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

      // Dashboard KpiCard
      content = content.replace(
        /text-xs font-normal text-muted-foreground/g,
        "text-xs font-semibold text-muted-foreground",
      );

      // StatCard in Heatmap, Staff, Operations, etc.
      content = content.replace(
        /text-\[10px\] font-bold text-muted-foreground/g,
        "text-[10px] font-extrabold text-muted-foreground",
      );
      content = content.replace(
        /text-\[11px\] font-bold text-muted-foreground/g,
        "text-[11px] font-extrabold text-muted-foreground",
      );

      // DarshanSection
      content = content.replace(
        /text-\[10px\] font-medium text-muted-foreground/g,
        "text-[10px] font-semibold text-muted-foreground",
      );

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);
console.log("Successfully increased font weight for stat card headings.");
