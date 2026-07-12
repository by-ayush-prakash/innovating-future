const fs = require('fs');
const path = require('path');

let pPath = path.join(__dirname, 'src', 'components', 'PeopleSection.tsx');
let pContent = fs.readFileSync(pPath, 'utf8');

pContent = pContent.replace(/space-y-4/g, 'space-y-s3');
pContent = pContent.replace(/space-y-3.5/g, 'space-y-s2');
pContent = pContent.replace(/gap-2/g, 'gap-s1');
pContent = pContent.replace(/gap-4/g, 'gap-s2');
pContent = pContent.replace(/py-5 sm:py-6/g, 'py-s3 sm:py-s4');
pContent = pContent.replace(/pt-6 pb-2/g, 'pt-s4 pb-s1');
pContent = pContent.replace(/p-2 sm:p-4/g, 'p-s2 sm:p-s3');

fs.writeFileSync(pPath, pContent, 'utf8');

let hPath = path.join(__dirname, 'src', 'components', 'HoldingPatternSection.tsx');
let hContent = fs.readFileSync(hPath, 'utf8');

hContent = hContent.replace(/space-y-4/g, 'space-y-s3');
hContent = hContent.replace(/space-y-2/g, 'space-y-s2');
hContent = hContent.replace(/gap-2/g, 'gap-s1');
hContent = hContent.replace(/gap-4/g, 'gap-s2');
hContent = hContent.replace(/p-4/g, 'p-s3');
hContent = hContent.replace(/pt-1/g, 'pt-s1');

fs.writeFileSync(hPath, hContent, 'utf8');
