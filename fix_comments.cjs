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
    
    // Remove {/* ... */}
    let newContent = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    
    // Remove // comments that are at the beginning of a line or after spaces
    newContent = newContent.replace(/^\s*\/\/.*$/gm, '');
    
    // Clean up multiple newlines resulting from removing comments
    newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
