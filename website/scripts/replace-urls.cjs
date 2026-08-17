// Replace all vibe-coding-wiki.example.com with real GitHub Pages URL
const fs = require('fs');
const path = require('path');

const newUrl = 'https://xiangbianpangde.github.io/vibe-coding-wiki';
const oldUrl = 'https://xiangbianpangde.github.io/vibe-coding-wiki';
const base = path.join(__dirname, '..');

function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === 'node_modules' || item.startsWith('.')) continue;
    const fp = path.join(dir, item);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      walk(fp);
    } else if (/\.(html|cjs|js|json|md)$/.test(item)) {
      let content = fs.readFileSync(fp, 'utf8');
      if (content.includes(oldUrl)) {
        content = content.split(oldUrl).join(newUrl);
        fs.writeFileSync(fp, content);
        console.log('  ✓', fp.replace(base + '/', ''));
      }
    }
  }
}

walk(base);
console.log(`Replaced ${oldUrl} → ${newUrl}`);
