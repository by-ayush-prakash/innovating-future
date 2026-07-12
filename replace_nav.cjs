const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// Add import
if (!content.includes('gargoyleImg')) {
  content = content.replace(
    /import \{ motion, AnimatePresence, useReducedMotion \} from "motion\/react";\n/,
    `import { motion, AnimatePresence, useReducedMotion } from "motion/react";\nimport gargoyleImg from "./assets/images/image-3.png";\n`
  );
}

// Add state for scroll
if (!content.includes('isScrolled')) {
  content = content.replace(
    /const \[isLogoHovered, setIsLogoHovered \] = useState\(false\);\n/,
    `const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);\n\n  const [isLogoHovered, setIsLogoHovered ] = useState(false);\n`
  );
}

// Update useEffect import
content = content.replace(
  /import React, \{ useState \} from "react";\n/,
  `import React, { useState, useEffect } from "react";\n`
);

// Update nav
content = content.replace(
  /<nav className="bg-paper\/75 backdrop-blur-md sticky top-0 z-50 py-5 px-6 md:px-12">[\s\S]*?<\/nav>/,
  `<nav className={\`bg-paper/75 backdrop-blur-md sticky top-0 z-50 py-5 px-6 md:px-12 transition-colors duration-300 \${isScrolled ? 'border-b border-ink-15' : ''}\`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="text-base font-mono tracking-[0.25em] text-ink font-medium flex items-center gap-3 cursor-pointer select-none">
              <img 
                src={gargoyleImg} 
                alt="CIF Gargoyle" 
                className="h-6 w-auto mix-blend-multiply opacity-95 shrink-0" 
                referrerPolicy="no-referrer"
              />
              <span>CIF</span>
            </span>
          </div>

          {/* Navigation Links Desk */}
          <div className="flex items-center font-mono text-xs uppercase font-medium tracking-[0.25em] text-ink-45 select-none gap-6 md:gap-8">
            <button 
              onClick={() => setShowCredo(true)} 
              className="hover:text-ink transition duration-150 cursor-pointer uppercase font-mono font-medium tracking-[0.25em]"
            >
              Credo
            </button>
            <a href="#correspondence" className="hover:text-ink transition duration-150">Contact</a>
          </div>
        </div>
      </nav>`
);

fs.writeFileSync(appPath, content, 'utf8');
