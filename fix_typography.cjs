const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent = cssContent.replace(
  /--font-serif: "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif;/, 
  '--font-display: "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif;\n  --font-serif: ui-serif, Georgia, serif;'
);
cssContent = cssContent.replace(/font-family: var\(--font-serif\);/g, 'font-family: var(--font-display);');
cssContent = cssContent.replace(
  /p \{\n    font-family: var\(--font-display\);\n    color: var\(--color-ink-70\);\n    line-height: 1\.55;\n  \}/, 
  'p {\n    font-family: var(--font-sans);\n    color: var(--color-ink-70);\n    line-height: 1.55;\n  }'
);

fs.writeFileSync(cssPath, cssContent, 'utf8');

const files = [
  'src/App.tsx',
  'src/components/PeopleSection.tsx',
  'src/components/HoldingPatternSection.tsx',
  'src/components/CorrespondenceSection.tsx',
  'src/components/CredoSection.tsx'
];

files.forEach(f => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) return;
  
  let c = fs.readFileSync(p, 'utf8');
  
  c = c.replace(/font-serif/g, 'font-display');
  c = c.replace(/<span([^>]*)font-display/g, '<span$1font-sans');
  c = c.replace(/<div([^>]*)font-display/g, '<div$1font-sans');
  c = c.replace(/<p([^>]*)font-display/g, '<p$1font-sans');
  c = c.replace(/<a([^>]*)font-display/g, '<a$1font-sans');

  fs.writeFileSync(p, c, 'utf8');
});
