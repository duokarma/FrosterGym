import fs from 'fs';
import path from 'path';

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      if (fullPath.includes('PublicWebsite.tsx') || fullPath.includes('index.css') || fullPath.includes('refactor_colors.mjs')) {
         continue; // don't touch website
      }

      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Color replacements map (Old -> New)
      const colorMap = [
        // Backgrounds
        { rx: /bg-black/g, repl: 'bg-[#0B0B0A]' },
        { rx: /bg-zinc-950/g, repl: 'bg-[#0B0B0A]' },
        { rx: /bg-zinc-900\/50/g, repl: 'bg-[#11110F]' },
        { rx: /bg-zinc-900\/80/g, repl: 'bg-[#11110F]' },
        { rx: /bg-zinc-900/g, repl: 'bg-[#11110F]' },
        { rx: /bg-\[\#111\]/g, repl: 'bg-[#11110F]' },
        { rx: /bg-white\/5/g, repl: 'bg-[rgba(255,255,255,0.02)]' },
        { rx: /bg-\[\#1a1a1a\]/g, repl: 'bg-[#171613]' },
        { rx: /bg-zinc-800/g, repl: 'bg-[#171613]' },
        { rx: /bg-\[\#0a0a0a\]/g, repl: 'bg-[#0B0B0A]' },

        // Hovers
        { rx: /hover:bg-white\/10/g, repl: 'hover:bg-[#1D1B17]' },
        { rx: /hover:bg-zinc-800/g, repl: 'hover:bg-[#1D1B17]' },
        { rx: /hover:bg-\[\#1a1a1a\]/g, repl: 'hover:bg-[#1D1B17]' },

        // Borders
        { rx: /border-white\/10/g, repl: 'border-[rgba(255,255,255,0.08)]' },
        { rx: /border-white\/5/g, repl: 'border-[rgba(255,255,255,0.04)]' },
        { rx: /border-zinc-800/g, repl: 'border-[rgba(255,255,255,0.08)]' },
        { rx: /border-zinc-700/g, repl: 'border-[rgba(255,255,255,0.12)]' },
        { rx: /border-\[\#d4af37\]\/20/g, repl: 'border-[#C9A24D]/20' },
        { rx: /border-\[\#d4af37\]\/30/g, repl: 'border-[#C9A24D]/30' },
        { rx: /border-\[\#d4af37\]\/50/g, repl: 'border-[#C9A24D]/50' },

        // Text Colors
        { rx: /text-white/g, repl: 'text-[#F4F1E8]' },
        { rx: /text-slate-100/g, repl: 'text-[#F4F1E8]' },
        { rx: /text-zinc-100/g, repl: 'text-[#F4F1E8]' },
        { rx: /text-slate-400/g, repl: 'text-[#A7A39A]' },
        { rx: /text-zinc-400/g, repl: 'text-[#A7A39A]' },
        { rx: /text-gray-400/g, repl: 'text-[#A7A39A]' },
        { rx: /text-slate-500/g, repl: 'text-[#706D66]' },
        { rx: /text-zinc-500/g, repl: 'text-[#706D66]' },
        { rx: /text-gray-500/g, repl: 'text-[#706D66]' },
        
        // Old Golds -> New Golds
        { rx: /text-\[\#D4AF37\]/g, repl: 'text-[#C9A24D]' },
        { rx: /bg-\[\#D4AF37\]/g, repl: 'bg-[#C9A24D]' },
        { rx: /from-\[\#D4AF37\]/g, repl: 'from-[#C9A24D]' },
        { rx: /to-\[\#D4AF37\]/g, repl: 'to-[#C9A24D]' },
        { rx: /text-\[\#E5D3B3\]/g, repl: 'text-[#E2C46B]' },
        { rx: /bg-\[\#E5D3B3\]/g, repl: 'bg-[#E2C46B]' },
        { rx: /text-\[\#B8972E\]/g, repl: 'text-[#8E7135]' },
        { rx: /bg-\[\#B8972E\]/g, repl: 'bg-[#8E7135]' },

        // Generic Colors to Semantics (Cards & Icons)
        // Success -> Muted Green
        { rx: /text-emerald-400/g, repl: 'text-[#4D6B5A]' },
        { rx: /bg-emerald-500\/10/g, repl: 'bg-[#4D6B5A]/20' },
        { rx: /border-emerald-500\/20/g, repl: 'border-[#4D6B5A]/30' },
        { rx: /text-green-400/g, repl: 'text-[#4D6B5A]' },

        // Danger -> Muted Red
        { rx: /text-red-400/g, repl: 'text-[#8B4B4B]' },
        { rx: /text-red-500/g, repl: 'text-[#8B4B4B]' },
        { rx: /bg-red-500\/10/g, repl: 'bg-[#8B4B4B]/20' },
        { rx: /bg-red-500\/20/g, repl: 'bg-[#8B4B4B]/20' },
        { rx: /hover:text-red-400/g, repl: 'hover:text-[#8B4B4B]' },
        { rx: /hover:bg-red-500\/10/g, repl: 'hover:bg-[#8B4B4B]/20' },
        { rx: /border-red-500\/20/g, repl: 'border-[#8B4B4B]/30' },

        // Warning -> Muted Amber / Gold
        { rx: /text-amber-400/g, repl: 'text-[#8E7135]' },
        { rx: /text-yellow-400/g, repl: 'text-[#8E7135]' },
        { rx: /bg-amber-500\/10/g, repl: 'bg-[#8E7135]/20' },
        { rx: /bg-yellow-500\/10/g, repl: 'bg-[#8E7135]/20' },

        // Info / Other -> Muted Blue-Gray / Default
        { rx: /text-purple-400/g, repl: 'text-[#5A6B7C]' },
        { rx: /bg-purple-500\/10/g, repl: 'bg-[#5A6B7C]/20' },
        { rx: /text-blue-400/g, repl: 'text-[#5A6B7C]' },
        { rx: /bg-blue-500\/10/g, repl: 'bg-[#5A6B7C]/20' },
        
        // Remove heavy shadows
        { rx: /shadow-2xl/g, repl: 'shadow-lg shadow-black/20' },
        { rx: /shadow-xl/g, repl: 'shadow-lg shadow-black/20' }
      ];

      for (const mapping of colorMap) {
        content = content.replace(mapping.rx, mapping.repl);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Refactored colors in ${fullPath}`);
      }
    }
  }
}

console.log('Starting global color refactoring...');
processDirectory('./src/pages');
processDirectory('./src/components');
console.log('Done.');
