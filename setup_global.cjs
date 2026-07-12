const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const additions = `
@layer base {
  @media (max-width: 768px) {
    :root {
      --spacing-s8: 96px;
      --spacing-s7: 64px;
    }
  }
  
  *:focus-visible {
    outline: 1px solid var(--color-ink);
    outline-offset: 2px;
  }
}

@layer utilities {
  .link-hover {
    position: relative;
    display: inline-block;
  }
  .link-hover::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: currentColor;
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 200ms ease-out;
  }
  @media (prefers-reduced-motion: no-preference) {
    .link-hover:hover::after {
      transform: scaleX(1);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .link-hover:hover {
      text-decoration: underline;
    }
  }

  .btn-invert {
    transition: background-color 200ms, color 200ms, border-color 200ms;
  }
  @media (prefers-reduced-motion: no-preference) {
    .btn-invert:hover {
      background-color: var(--color-ink) !important;
      color: var(--color-paper) !important;
      border-color: var(--color-ink) !important;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .btn-invert:hover {
      background-color: var(--color-ink) !important;
      color: var(--color-paper) !important;
      border-color: var(--color-ink) !important;
      transition: none;
    }
  }
}
`;

cssContent += additions;
fs.writeFileSync(cssPath, cssContent, 'utf8');

// Update index.html for fonts
const htmlPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');
htmlContent = htmlContent.replace(
  /<link rel="preconnect" href="https:\/\/fonts.googleapis.com">/,
  `<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap" />
    <link rel="preconnect" href="https://fonts.googleapis.com">`
);
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
