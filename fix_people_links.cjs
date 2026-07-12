const fs = require('fs');
const path = require('path');

const peoplePath = path.join(__dirname, 'src', 'components', 'PeopleSection.tsx');
let peopleContent = fs.readFileSync(peoplePath, 'utf8');

peopleContent = peopleContent.replace(/className="text-ink hover:text-ink font-medium underline underline-offset-4 transition-colors inline-block"/g, 'className="text-ink font-medium link-hover transition-colors inline-block"');

fs.writeFileSync(peoplePath, peopleContent, 'utf8');
