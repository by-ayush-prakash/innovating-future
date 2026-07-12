const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace(/bg-\[#FBFAF6\]/g, 'bg-paper-raised');
fs.writeFileSync(appPath, appContent, 'utf8');

const hpPath = path.join(__dirname, 'src', 'components', 'HoldingPatternSection.tsx');
let hpContent = fs.readFileSync(hpPath, 'utf8');

hpContent = hpContent.replace(/className="lg:col-span-5 bg-paper/g, 'className="lg:col-span-5 bg-paper-raised');
hpContent = hpContent.replace(/border border-ink-15 bg-paper  p-s4/g, 'border border-ink-15 bg-paper-raised p-s4');
hpContent = hpContent.replace(/className="bg-paper border border-ink-15 p-s3 min-h-\[140px\] flex flex-col justify-between  relative overflow-hidden"/g, 'className="bg-paper-raised border border-ink-15 p-s3 min-h-[140px] flex flex-col justify-between relative overflow-hidden"');

fs.writeFileSync(hpPath, hpContent, 'utf8');

const credoPath = path.join(__dirname, 'src', 'components', 'CredoSection.tsx');
let credoContent = fs.readFileSync(credoPath, 'utf8');
// look for certificate box in CredoSection
credoContent = credoContent.replace(/className="mt-12 p-8 md:p-12 border border-ink-15 bg-paper text-center/g, 'className="mt-12 p-8 md:p-12 border border-ink-15 bg-paper-raised text-center');
fs.writeFileSync(credoPath, credoContent, 'utf8');
