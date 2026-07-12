const fs = require('fs');
const path = require('path');

function addImport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('import { ScrollReveal } from "./ScrollReveal";')) {
    content = content.replace(/import React/, 'import React');
    content = 'import { ScrollReveal } from "./ScrollReveal";\n' + content;
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

addImport(path.join(__dirname, 'src', 'components', 'HoldingPatternSection.tsx'));
addImport(path.join(__dirname, 'src', 'components', 'PeopleSection.tsx'));
