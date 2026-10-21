import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const publicDir = path.resolve('public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Find CSS file
const cssMatch = html.match(/<link rel="stylesheet"[^>]*href="\/assets\/([^"]+)"[^>]*>/);
if (cssMatch) {
  const cssFileName = cssMatch[1];
  const cssPath = path.join(distDir, 'assets', cssFileName);
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    html = html.replace(cssMatch[0], `<style>\n${cssContent}\n</style>`);
  }
}

// Find JS file
const jsMatch = html.match(/<script type="module"[^>]*src="\/assets\/([^"]+)"[^>]*><\/script>/);
if (jsMatch) {
  const jsFileName = jsMatch[1];
  const jsPath = path.join(distDir, 'assets', jsFileName);
  if (fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, 'utf-8');
    html = html.replace(jsMatch[0], `<script type="module">\n${jsContent}\n</script>`);
  }
}

// Save to public and dist
const outFilePublic = path.join(publicDir, 'VongQuay_Lop7A1.html');
const outFileDist = path.join(distDir, 'VongQuay_Lop7A1.html');

fs.writeFileSync(outFilePublic, html, 'utf-8');
fs.writeFileSync(outFileDist, html, 'utf-8');

console.log('Successfully bundled standalone single-file HTML to:');
console.log(' - ' + outFilePublic);
console.log(' - ' + outFileDist);
console.log('File size:', (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1), 'KB');
