import fs from 'fs';

let code = fs.readFileSync('src/pages/website/PublicWebsite.tsx', 'utf8');

// Replace src="/image.jpg" with src="/FrosterGym/image.jpg"
code = code.replace(/src="\/(?!\/)(.*?)"/g, (match, p1) => {
    if (!p1.startsWith('FrosterGym/')) {
        return `src="/FrosterGym/${p1}"`;
    }
    return match;
});

// Replace url('/image.jpg') with url('/FrosterGym/image.jpg')
code = code.replace(/url\('?\/(?!\/)(.*?)'?\)/g, (match, p1) => {
    if (!p1.startsWith('FrosterGym/')) {
        return `url('/FrosterGym/${p1}')`;
    }
    return match;
});

fs.writeFileSync('src/pages/website/PublicWebsite.tsx', code);
console.log('Fixed image paths securely.');
