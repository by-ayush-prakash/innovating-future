const fs = require('fs');

let content = fs.readFileSync('src/News.tsx', 'utf8');

// replace the duplicate className
content = content.replace(/className=\{`([^`]+)`\}\s*className="text-balance"/, 'className={`$1 text-balance`}');

fs.writeFileSync('src/News.tsx', content, 'utf8');
