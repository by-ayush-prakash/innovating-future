const fs = require('fs');
const path = require('path');

let pPath = path.join(__dirname, 'src', 'components', 'PeopleSection.tsx');
let pContent = fs.readFileSync(pPath, 'utf8');

pContent = pContent.replace(/py-10 space-y-12 mt-0/g, 'py-s6 md:py-s8 space-y-s5 mt-0');
pContent = pContent.replace(/mt-8/g, 'mt-s5');
pContent = pContent.replace(/gap-8 items-start pt-4/g, 'gap-s5 items-start pt-s2');
pContent = pContent.replace(/space-y-5/g, 'space-y-s3');
pContent = pContent.replace(/pt-8 border-t border-ink-15 mt-s5/g, 'pt-s5 border-t border-ink-15 mt-s5');

fs.writeFileSync(pPath, pContent, 'utf8');

let hPath = path.join(__dirname, 'src', 'components', 'HoldingPatternSection.tsx');
let hContent = fs.readFileSync(hPath, 'utf8');

hContent = hContent.replace(/pt-20 pb-8 space-y-16/g, 'py-s6 md:py-s8 space-y-s6');
hContent = hContent.replace(/gap-8 items-start/g, 'gap-s5 items-start');
hContent = hContent.replace(/lg:col-span-7 space-y-6/g, 'lg:col-span-7 space-y-s4');
hContent = hContent.replace(/pt-10 flex flex-col sm:flex-row items-start gap-8 lg:gap-10/g, 'pt-s5 flex flex-col sm:flex-row items-start gap-s4 lg:gap-s5');
hContent = hContent.replace(/p-6 sm:p-8 space-y-6/g, 'p-s4 md:p-s5 space-y-s4');
hContent = hContent.replace(/p-6 md:p-8 space-y-6/g, 'p-s4 md:p-s5 space-y-s4'); // interactive form

fs.writeFileSync(hPath, hContent, 'utf8');
