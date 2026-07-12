const fs = require('fs');

let content = fs.readFileSync('src/Home.tsx', 'utf8');

// Remove shouldReduceMotion and useReducedMotion import if not used elsewhere
content = content.replace(/const shouldReduceMotion = useReducedMotion\(\);\s*/, '');
content = content.replace(/,\s*useReducedMotion/, '');

// Remove unused variants
content = content.replace(/const heroContainerVariants = \{[\s\S]*?\}\s*;\s*const heroItemVariants = \{[\s\S]*?\}\s*;\s*/, '');

fs.writeFileSync('src/Home.tsx', content, 'utf8');
