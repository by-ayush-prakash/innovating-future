const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

htmlContent = htmlContent.replace(
  /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Fira\+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700&family=JetBrains\+Mono:ital,wght@0,100\.\.800;1,100\.\.800&display=swap" rel="stylesheet">/,
  ''
);

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
