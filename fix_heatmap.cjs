const fs = require("fs");
const path = require("path");

const file =
  "c:\\Users\\KaviyapriyaPerumal\\Desktop\\omg-temple-admin\\omg-temple-admin\\src\\components\\temple\\sections\\HeatmapSection.tsx";
let content = fs.readFileSync(file, "utf8");

// 1. replace_lg.cjs logic
content = content.replace(/rounded-md/g, "rounded-lg");

// 2. tighten.cjs logic
content = content.replace(/\bp-([456])\b/g, (match, p1) => `p-${parseInt(p1) - 1}`);
content = content.replace(/\bgap-([456])\b/g, (match, p1) => `gap-${parseInt(p1) - 1}`);
content = content.replace(/\bspace-y-([568])\b/g, (match, p1) => `space-y-${parseInt(p1) - 1}`);
content = content.replace(/\bmb-([345])\b/g, (match, p1) => `mb-${parseInt(p1) - 1}`);
content = content.replace(/\bmt-([345])\b/g, (match, p1) => `mt-${parseInt(p1) - 1}`);

// 3. reduce_fonts.cjs logic
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
content = content.replace(
  /\bfont-(black|extrabold|bold|semibold|medium)\b/g,
  (match) => weightMap[match],
);
content = content.replace(/\btext-(6xl|5xl|4xl|3xl|2xl|xl|lg|base)\b/g, (match) => sizeMap[match]);

// 4. remove_lines.cjs logic (CAREFUL not to flatten spaces)
content = content.replace(/\bdivide-y\s+divide-border\b/g, "");
content = content.replace(/\bdivide-y\b/g, "");
content = content.replace(
  /thead className="([^"]*)\bborder-b\s+border-border\b([^"]*)"/g,
  'thead className="$1$2"',
);

// Fix empty classNames safely
content = content.replace(/className="\s+"/g, 'className=""');

fs.writeFileSync(file, content);
console.log("Fixed HeatmapSection!");
