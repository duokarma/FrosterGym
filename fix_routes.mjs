import fs from 'fs';
import path from 'path';

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
};

const replaceInFile = (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace navigate('/path') with navigate('/app/path') if not already /app
  // Matches navigate('/something') but excludes navigate('/app...') and navigate('/')
  content = content.replace(/navigate\(['"]\/(?!app\/?)(?!$)(.*?)['"]\)/g, "navigate('/app/$1')");

  // Replace navigate(`/path`) with navigate(`/app/path`) if not already /app
  content = content.replace(/navigate\(`\/(?!app\/?)(?!$)(.*?)`\)/g, "navigate(`/app/$1`)");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed routes in: ${filePath}`);
  }
};

walk('./src/pages', replaceInFile);
walk('./src/components', replaceInFile);
