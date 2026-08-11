import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

const replacements = [
  // Backgrounds
  { regex: /bg-\[\#050505\]/g, replacement: 'bg-[#000000]' },
  { regex: /bg-\[\#0a0f1c\]/g, replacement: 'bg-[#0a0a0a]' },
  { regex: /bg-\[\#131b2f\]/g, replacement: 'bg-zinc-900' },
  { regex: /to-\[\#0a0f1c\]/g, replacement: 'to-[#0a0a0a]' },
  { regex: /from-\[\#131b2f\]/g, replacement: 'from-zinc-900' },
  
  // Custom Cyans to Gold (using hex values directly)
  { regex: /cyan-400/g, replacement: '[#E5D3B3]' },
  { regex: /cyan-500/g, replacement: '[#D4AF37]' },
  { regex: /cyan-600/g, replacement: '[#B8972E]' },
  
  // Custom Blues to Gold
  { regex: /blue-400/g, replacement: '[#E5D3B3]' },
  { regex: /blue-500/g, replacement: '[#D4AF37]' },
  { regex: /blue-600/g, replacement: '[#B8972E]' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css'))) {
      if (fullPath.includes('Login.tsx')) continue; // Skip Login.tsx since we just redesigned it with exact colors
      
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

console.log('Starting color replacement...');
processDirectory(SRC_DIR);
console.log('Done.');
