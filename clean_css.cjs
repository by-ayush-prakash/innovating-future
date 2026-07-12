const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// remove empty media queries
css = css.replace(/@media\s*\([^)]+\)\s*\{\s*\}/g, '');

fs.writeFileSync('src/index.css', css, 'utf8');
