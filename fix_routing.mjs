import fs from 'fs';
import path from 'path';

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && fullPath.endsWith('.tsx')) {
      if (fullPath.includes('PublicWebsite.tsx') || fullPath.includes('App.tsx') || fullPath.includes('Login.tsx') || fullPath.includes('Sidebar.tsx')) {
         continue; // don't mess with root router or login or public or sidebar
      }

      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Fix navigate('/something') to navigate('/app/something')
      // but avoid double prepending like navigate('/app/app/something')
      content = content.replace(/navigate\('\/([a-zA-Z0-9_-]+)([\/?a-zA-Z0-9_=-]*?)'\)/g, (match, p1, p2) => {
        if (p1 === 'app') return match;
        if (p1 === 'login') return match;
        return `navigate('/app/${p1}${p2}')`;
      });

      // Fix Link to="/something"
      content = content.replace(/to="\/([a-zA-Z0-9_-]+)([\/?a-zA-Z0-9_=-]*?)"/g, (match, p1, p2) => {
        if (p1 === 'app') return match;
        if (p1 === 'login') return match;
        return `to="/app/${p1}${p2}"`;
      });

      // Fix Dashboard quickActions paths
      if (fullPath.includes('Dashboard.tsx')) {
        content = content.replace(/path: '\/([a-zA-Z0-9_-]+)([\/?a-zA-Z0-9_=-]*?)'/g, (match, p1, p2) => {
          if (p1 === 'app') return match;
          if (p1 === 'login') return match;
          return `path: '/app/${p1}${p2}'`;
        });
      }

      // Special cases
      content = content.replace(/navigate\(`\/([a-zA-Z0-9_-]+)([\/?a-zA-Z0-9_=-]*?)`\)/g, (match, p1, p2) => {
        if (p1 === 'app') return match;
        if (p1 === 'login') return match;
        return `navigate(\`/app/${p1}${p2}\`)`;
      });
      content = content.replace(/navigate\(`\/([a-zA-Z0-9_-]+)\$\{/g, (match, p1) => {
        if (p1 === 'app') return match;
        if (p1 === 'login') return match;
        return `navigate(\`/app/${p1}\${`;
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated routing in ${fullPath}`);
      }
    }
  }
}

console.log('Starting routing fix...');
processDirectory('./src/pages');
processDirectory('./src/components');
console.log('Done.');
