const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'HoldingPatternSection.tsx');
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /className="px-6 py-2 bg-ink text-paper font-semibold hover:bg-ink transition text-xs tracking-wider uppercase font-mono flex items-center gap-s1 cursor-pointer shadow-sm animate-none"/,
  'className="px-6 py-2 bg-ink text-paper font-semibold transition text-xs tracking-wider uppercase font-mono flex items-center gap-s1 cursor-pointer shadow-sm animate-none btn-invert-dark border border-ink"'
);
fs.writeFileSync(file, content, 'utf8');

// For App.tsx btn-invert
// The prompt said: "Button hover = invert ink/paper"
// For the primary image overlay buttons:
const appFile = path.join(__dirname, 'src', 'App.tsx');
let appContent = fs.readFileSync(appFile, 'utf8');
appContent = appContent.replace(/hover:bg-paper hover:text-ink hover:border-ink/g, 'hover:bg-paper hover:text-ink hover:border-transparent');
fs.writeFileSync(appFile, appContent, 'utf8');
