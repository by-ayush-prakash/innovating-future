const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'src', 'App.tsx');
let appContent = fs.readFileSync(appFile, 'utf8');

appContent = appContent.replace(
  /className="px-3 py-1\.5 border border-ink-15 hover:border-ink-15 font-mono text-base font-medium text-ink-70 hover:text-ink hover:bg-ink-08 transition uppercase cursor-pointer"/g,
  'className="px-3 py-1.5 border border-ink-15 hover:border-ink-15 font-mono text-base font-medium text-ink-70 hover:text-paper hover:bg-ink transition uppercase cursor-pointer"'
);

appContent = appContent.replace(
  /className="px-3 py-1\.5 border border-ink-15 hover:border-ink-15 font-mono text-base font-medium text-ink-70 hover:text-ink hover:bg-paper transition uppercase cursor-pointer whitespace-nowrap"/g,
  'className="px-3 py-1.5 border border-ink-15 font-mono text-base font-medium text-ink-70 hover:text-paper hover:bg-ink hover:border-ink transition uppercase cursor-pointer whitespace-nowrap"'
);

fs.writeFileSync(appFile, appContent, 'utf8');
