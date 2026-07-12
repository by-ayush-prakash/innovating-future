const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// remove btn-invert rules
css = css.replace(/\s*\.btn-invert\s*\{[^}]+\}/g, '');
css = css.replace(/\s*\.btn-invert:hover\s*\{[^}]+\}/g, '');
css = css.replace(/\s*\.btn-invert-dark\s*\{[^}]+\}/g, '');
css = css.replace(/\s*\.btn-invert-dark:hover\s*\{[^}]+\}/g, '');

fs.writeFileSync('src/index.css', css, 'utf8');
