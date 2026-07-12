const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace className="..." style={{ textWrap: "balance" }}
    let newContent = content.replace(/className="([^"]+)"\s*style=\{\{\s*textWrap:\s*"balance"\s*\}\}/g, 'className="$1 text-balance"');
    // Replace style={{ textWrap: "balance" }} className="..."
    newContent = newContent.replace(/style=\{\{\s*textWrap:\s*"balance"\s*\}\}\s*className="([^"]+)"/g, 'className="text-balance $1"');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
