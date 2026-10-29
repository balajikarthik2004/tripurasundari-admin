const fs = require("fs");

const file =
  "c:\\Users\\KaviyapriyaPerumal\\Desktop\\omg-temple-admin\\omg-temple-admin\\src\\components\\temple\\TempleShell.tsx";
let content = fs.readFileSync(file, "utf8");

// Add icons
content = content.replace(
  /Megaphone, BarChart3, Siren, Bell, LogOut, ChevronDown, Ticket,/,
  "Megaphone, BarChart3, Siren, Bell, LogOut, ChevronDown, Ticket, ChevronLeft, ChevronRight,",
);

// Add state
content = content.replace(
  /const \[section, setSection\] = useState<SectionId>\(/,
  "const [sidebarExpanded, setSidebarExpanded] = useState(true);\n  const [section, setSection] = useState<SectionId>(",
);

// Update sidebar class
content = content.replace(
  /<aside className="fixed left-0 top-0 z-30 flex h-screen w-\[260px\] flex-col border-r border-border bg-white text-sidebar-foreground shadow-\[0_8px_30px_rgb\(0,0,0,0\.02\)\]">/,
  '<aside className={`fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-border bg-white text-sidebar-foreground shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 ${sidebarExpanded ? "w-[260px]" : "w-[72px]"}`}>',
);

// Add toggle button near the logo
content = content.replace(
  /<div className="text-\[10px\] uppercase tracking-widest text-sidebar-muted font-medium">\s*Admin Portal\s*<\/div>\s*<\/div>\s*<\/div>/,
  '<div className="text-[10px] uppercase tracking-widest text-sidebar-muted font-medium">Admin Portal</div></div>)}</div>\n            <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-sm hover:bg-surface text-muted-foreground hover:text-foreground z-40 transition-transform hover:scale-110">{sidebarExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}</button>',
);
// Fix the logo area to hide text
content = content.replace(
  /<div>\s*<div className="text-lg font-semibold tracking-tight text-sidebar-foreground">\s*OMG\s*<\/div>/,
  '{sidebarExpanded && (<div><div className="text-lg font-semibold tracking-tight text-sidebar-foreground">OMG</div>',
);

// Fix nav items text
content = content.replace(
  /\{item\.label\}\s*<\/button>/g,
  "{sidebarExpanded && <span>{item.label}</span>}</button>",
);

// Fix user profile area
content = content.replace(
  /<div className="min-w-0 flex-1 text-left">\s*<div className="truncate text-sm font-medium text-sidebar-foreground">\s*Santhosh Kumar\s*<\/div>\s*<div className="truncate text-\[10px\] uppercase tracking-wider text-sidebar-muted">\s*Executive Officer\s*<\/div>\s*<\/div>/,
  '{sidebarExpanded && <div className="min-w-0 flex-1 text-left"><div className="truncate text-sm font-medium text-sidebar-foreground">Santhosh Kumar</div><div className="truncate text-[10px] uppercase tracking-wider text-sidebar-muted">Executive Officer</div></div>}',
);
content = content.replace(
  /<LogOut\s*size=\{16\}\s*className="text-sidebar-muted group-hover:text-sidebar-foreground transition-colors"\s*\/>/g,
  '{sidebarExpanded && <LogOut size={16} className="text-sidebar-muted group-hover:text-sidebar-foreground transition-colors" />}',
);

// Update Header left margin
content = content.replace(
  /<header className="fixed left-\[260px\] right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white\/90 px-8 backdrop-blur-md shadow-\[0_4px_24px_rgba\(0,0,0,0\.015\)\]">/,
  '<header className={`fixed right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white/90 px-8 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.015)] transition-all duration-300 ${sidebarExpanded ? "left-[260px]" : "left-[72px]"}`}>',
);

// Update Main left margin
content = content.replace(
  /<main className="flex-1 ml-\[260px\] pt-16">/,
  '<main className={`flex-1 pt-16 transition-all duration-300 ${sidebarExpanded ? "ml-[260px]" : "ml-[72px]"}`}>',
);

// Update shimmer loader position
content = content.replace(
  /className="fixed top-16 left-\[260px\] right-0 bottom-0 z-50/,
  'className={`fixed top-16 right-0 bottom-0 z-50 ${sidebarExpanded ? "left-[260px]" : "left-[72px]"}`',
);

fs.writeFileSync(file, content);
console.log("Sidebar expand/collapse implemented!");
