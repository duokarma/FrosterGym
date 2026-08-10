import fs from 'fs';

let code = fs.readFileSync('src/pages/website/PublicWebsite.tsx', 'utf8');

// Fix src paths
code = code.replace(/src="\/(.*?\.(png|jpg))"/g, 'src="/FrosterGym/$1"');

// Fix url() paths in styles or classes
code = code.replace(/url\(\/(.*?\.(png|jpg))\)/g, 'url(/FrosterGym/$1)');

fs.writeFileSync('src/pages/website/PublicWebsite.tsx', code);
console.log('Fixed image paths in PublicWebsite.tsx');
