const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. App.tsx
replaceInFile(path.join(__dirname, 'src', 'App.tsx'), [
  {
    regex: /import \{ motion, AnimatePresence, useReducedMotion \} from "motion\/react";\nimport gargoyleImg from "\.\/assets\/images\/image-3\.png";\n/,
    replacement: `import { motion, AnimatePresence, useReducedMotion } from "motion/react";\nimport gargoyleImg from "./assets/images/image-3.png";\nimport { ScrollReveal } from "./components/ScrollReveal";\n`
  },
  {
    regex: /<section id="properties" className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-20 pb-10 space-y-6">/,
    replacement: `<ScrollReveal id="properties" className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-20 pb-10 space-y-6">`
  },
  {
    regex: /<\/div>\n\n      <\/section>\n\n      \{\/\* 5\. Section III:/,
    replacement: `</div>\n\n      </ScrollReveal>\n\n      {/* 5. Section III:`
  },
  {
    regex: /<section className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-16 pb-20 space-y-6">/,
    replacement: `<ScrollReveal className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-16 pb-20 space-y-6">`
  },
  {
    regex: /<\/div>\n      <\/section>\n\n      <PeopleSection \/>/,
    replacement: `</div>\n      </ScrollReveal>\n\n      <PeopleSection />`
  },
  {
    regex: /className="hover:text-ink transition duration-150"/g,
    replacement: `className="link-hover transition duration-150"`
  },
  {
    regex: /className="hover:text-ink transition duration-150 cursor-pointer uppercase font-mono font-medium tracking-\[0\.25em\]"/g,
    replacement: `className="link-hover transition duration-150 cursor-pointer uppercase font-mono font-medium tracking-[0.25em]"`
  },
  {
    regex: /className="px-6 py-2\.5 border border-white\/40 text-white hover:bg-white hover:text-black transition-colors pointer-events-auto rounded-sm text-sm font-medium tracking-wide uppercase"/g,
    replacement: `className="px-6 py-2.5 border border-white/40 text-white transition-colors pointer-events-auto rounded-sm text-sm font-medium tracking-wide uppercase btn-invert"`
  }
]);

// 2. PeopleSection.tsx
replaceInFile(path.join(__dirname, 'src', 'components', 'PeopleSection.tsx'), [
  {
    regex: /export function PeopleSection\(\) \{\n  return \(\n    <section/,
    replacement: `import { ScrollReveal } from "./ScrollReveal";\n\nexport function PeopleSection() {\n  return (\n    <ScrollReveal`
  },
  {
    regex: /<section id="the-director"/g,
    replacement: `<div id="the-director"`
  },
  {
    regex: /<\/section>\n  \);\n\}/g,
    replacement: `</div>\n    </ScrollReveal>\n  );\n}`
  },
  {
    regex: /hover:text-ink transition/g,
    replacement: `link-hover transition`
  }
]);

// 3. HoldingPatternSection.tsx
replaceInFile(path.join(__dirname, 'src', 'components', 'HoldingPatternSection.tsx'), [
  {
    regex: /import \{ CheckCircle \} from "lucide-react";\n/,
    replacement: `import { CheckCircle } from "lucide-react";\nimport { ScrollReveal } from "./ScrollReveal";\n`
  },
  {
    regex: /export function HoldingPatternSection\(\) \{\n/,
    replacement: `export function HoldingPatternSection() {\n`
  },
  {
    regex: /<section className="bg-paper py-s6 md:py-s8 border-t border-b border-ink-15 px-6 md:px-12 mt-auto">/,
    replacement: `<section className="bg-paper py-s6 md:py-s8 border-t border-b border-ink-15 px-6 md:px-12 mt-auto">\n      <ScrollReveal>`
  },
  {
    regex: /<\/div>\n    <\/section>/,
    replacement: `</div>\n      </ScrollReveal>\n    </section>`
  },
  {
    regex: /<button\n                      type="submit"\n                      className="w-full bg-ink text-paper py-3\.5 text-xs font-mono uppercase tracking-widest font-bold hover:bg-ink-70 transition-colors"/,
    replacement: `<button\n                      type="submit"\n                      className="w-full bg-ink text-paper py-3.5 text-xs font-mono uppercase tracking-widest font-bold transition-colors btn-invert"`
  }
]);

// 4. CorrespondenceSection.tsx
replaceInFile(path.join(__dirname, 'src', 'components', 'CorrespondenceSection.tsx'), [
  {
    regex: /export function CorrespondenceSection\(\) \{\n  return \(\n    <section/,
    replacement: `import { ScrollReveal } from "./ScrollReveal";\n\nexport function CorrespondenceSection() {\n  return (\n    <ScrollReveal`
  },
  {
    regex: /<section id="correspondence"/,
    replacement: `<div id="correspondence"`
  },
  {
    regex: /<\/section>/,
    replacement: `</div>\n    </ScrollReveal>`
  }
]);
