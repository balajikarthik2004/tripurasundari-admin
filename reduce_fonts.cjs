const fs = require("fs");
const path = require("path");

const dir =
  "c:\\Users\\KaviyapriyaPerumal\\Desktop\\omg-temple-admin\\omg-temple-admin\\src\\components\\temple";

const weightMap = {
  "font-black": "font-extrabold",
  "font-extrabold": "font-bold",
  "font-bold": "font-semibold",
  "font-semibold": "font-medium",
  "font-medium": "font-normal",
};

const sizeMap = {
  "text-6xl": "text-5xl",
  "text-5xl": "text-4xl",
  "text-4xl": "text-3xl",
  "text-3xl": "text-2xl",
  "text-2xl": "text-xl",
  "text-xl": "text-lg",
  "text-lg": "text-base",
  "text-base": "text-sm",
};

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf8");

      // Replace weights using dictionary to prevent cascading
      content = content.replace(
        /\bfont-(black|extrabold|bold|semibold|medium)\b/g,
        (match) => weightMap[match],
      );

      // Replace sizes using dictionary to prevent cascading
      content = content.replace(
        /\btext-(6xl|5xl|4xl|3xl|2xl|xl|lg|base)\b/g,
        (match) => sizeMap[match],
      );

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);
console.log("Successfully reduced all font sizes and weights globally.");
