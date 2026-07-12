const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent = cssContent.replace(/--font-serif: "Newsreader",[^;]+;/, '--font-serif: "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif;');
cssContent = cssContent.replace(/--color-paper: [^;]+;/, '--color-paper: #F4F2EC;');
cssContent = cssContent.replace(/--color-ink: [^;]+;/, '--color-ink: #14130F;');
cssContent = cssContent.replace(/--color-ink-70: [^;]+;/, '--color-ink-70: #46443D;');
cssContent = cssContent.replace(/--text-xs: [^;]+;/, '--text-xs: 13px;');
cssContent = cssContent.replace(/--text-base: [^;]+;/, '--text-base: 18px;');
cssContent = cssContent.replace(/font-weight: 400;/g, 'font-weight: 700;'); 
fs.writeFileSync(cssPath, cssContent, 'utf8');

const htmlPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');
htmlContent = htmlContent.replace(/family=Newsreader[^"]+"/, 'family=Hanken+Grotesk:wght@700&display=swap"');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

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
  
  // Max width
  c = c.replace(/max-w-7xl/g, 'max-w-[1100px]');
  
  // Font weight for serif (which is now sans)
  c = c.replace(/font-light/g, 'font-bold');
  
  // Remove italic
  c = c.replace(/italic /g, '');
  
  // Text sizes for hero
  c = c.replace(/text-4xl sm:text-5xl lg:text-7xl/g, 'text-[36px] md:text-[60px] leading-[1.1]');
  
  // Section headings
  c = c.replace(/text-3xl sm:text-4xl lg:text-5xl/g, 'text-[28px] md:text-[40px]');
  c = c.replace(/text-3xl sm:text-4xl md:text-5xl/g, 'text-[28px] md:text-[40px]');
  c = c.replace(/text-4xl sm:text-5xl md:text-6xl/g, 'text-[28px] md:text-[40px]');
  c = c.replace(/text-4xl sm:text-5xl/g, 'text-[28px] md:text-[40px]');
  c = c.replace(/text-3xl sm:text-4xl/g, 'text-[28px] md:text-[40px]');
  
  // Subheadings (2xl sm:text-3xl)
  c = c.replace(/text-2xl sm:text-3xl md:text-3xl/g, 'text-[20px] md:text-[24px]');
  c = c.replace(/text-2xl/g, 'text-[20px] md:text-[24px]');

  // Paragraph max width
  c = c.replace(/max-w-3xl/g, 'max-w-[620px]');
  c = c.replace(/<p className="text-xs text-ink-70/g, '<p className="text-xs text-ink-70 max-w-[620px]');
  c = c.replace(/<p className="text-base text-ink-70/g, '<p className="text-base text-ink-70 max-w-[620px]');
  c = c.replace(/<p className="text-lg md:text-xl text-ink-70/g, '<p className="text-[20px] text-ink-70 max-w-[620px]');

  // Section gaps: 120px desktop, 72px mobile
  c = c.replace(/py-20 lg:py-28/g, 'py-[72px] md:py-[120px]');
  c = c.replace(/py-20/g, 'py-[72px] md:py-[120px]');
  c = c.replace(/pt-20 pb-10/g, 'pt-[72px] md:pt-[120px] pb-10');
  c = c.replace(/pt-16 pb-20/g, 'pt-16 pb-[72px] md:pb-[120px]');
  c = c.replace(/py-s6 md:py-s8/g, 'py-[72px] md:py-[120px]');
  
  fs.writeFileSync(p, c, 'utf8');
});
