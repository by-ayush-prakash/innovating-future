const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

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
  
  // Specific fixes:
  c = c.replace(/text-base sm:text-lg md:text-xl/g, 'text-[18px] md:text-[24px]');
  c = c.replace(/text-lg sm:text-xl/g, 'text-[20px] md:text-[24px]');
  c = c.replace(/text-lg md:text-xl/g, 'text-[20px] md:text-[24px]');
  c = c.replace(/text-base md:text-lg/g, 'text-[18px] md:text-[20px]');
  c = c.replace(/text-xl/g, 'text-[24px]');
  c = c.replace(/text-lg/g, 'text-[20px]');
  
  // Section heading gap check (just make sure we used spacing correctly)
  // Let's replace any `space-y-6` with `space-y-4` inside main containers for tighter content if needed, but 120px gaps is on sections.
  
  // Verify max-w-[620px] on lead text if it's not already
  c = c.replace(/<p className="text-\[20px\] text-ink-70 font-sans leading-relaxed">/g, '<p className="text-[20px] text-ink-70 font-sans leading-relaxed max-w-[620px]">');
  
  fs.writeFileSync(p, c, 'utf8');
});
