const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// PeopleSection
replaceInFile(path.join(__dirname, 'src', 'components', 'PeopleSection.tsx'), [
  {
    regex: /<div id="the-director"/,
    replacement: `<ScrollReveal id="the-director"`
  }
]);

// CorrespondenceSection
replaceInFile(path.join(__dirname, 'src', 'components', 'CorrespondenceSection.tsx'), [
  {
    regex: /<div id="correspondence"/,
    replacement: `<ScrollReveal id="correspondence"`
  },
  {
    regex: /<\/div>\n    <\/ScrollReveal>/,
    replacement: `</ScrollReveal>`
  }
]);

// HoldingPatternSection
replaceInFile(path.join(__dirname, 'src', 'components', 'HoldingPatternSection.tsx'), [
  {
    regex: /<section className="bg-paper py-s6 md:py-s8 border-t border-b border-ink-15 px-6 md:px-12 mt-auto">\n      <ScrollReveal>/,
    replacement: `<ScrollReveal className="bg-paper py-s6 md:py-s8 border-t border-b border-ink-15 px-6 md:px-12 mt-auto">`
  },
  {
    regex: /<\/div>\n      <\/ScrollReveal>\n    <\/section>/,
    replacement: `</div>\n    </ScrollReveal>`
  }
]);

// App.tsx
replaceInFile(path.join(__dirname, 'src', 'App.tsx'), [
  {
    regex: /<\/div>\n\n      <\/ScrollReveal>\n\n      \{\/\* 5\. Section III:/,
    replacement: `</ScrollReveal>\n\n      {/* 5. Section III:`
  },
  {
    regex: /<\/div>\n      <\/ScrollReveal>\n\n      <PeopleSection \/>/,
    replacement: `</ScrollReveal>\n\n      <PeopleSection />`
  }
]);
