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
    // Replace <something style={{ textWrap: "balance" }}> with <something className="text-balance">
    let newContent = content.replace(/style=\{\{\s*textWrap:\s*"balance"\s*\}\}/g, 'className="text-balance"');
    
    // There could be a case where we now have two classNames: className="..." className="text-balance"
    // Let's just use regex to merge them if they appear.
    newContent = newContent.replace(/className="([^"]+)"\s*className="([^"]+)"/g, 'className="$1 $2"');
    newContent = newContent.replace(/className="([^"]+)"\s*className="([^"]+)"/g, 'className="$1 $2"');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
