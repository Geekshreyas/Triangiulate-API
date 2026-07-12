const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Remove font object definitions
    content = content.replace(/const headings\s*=\s*\{[^}]+\};\s*/g, '');
    content = content.replace(/const body\s*=\s*\{[^}]+\};\s*/g, '');
    content = content.replace(/const mono\s*=\s*\{[^}]+\};\s*/g, '');

    content = content.replace(/const FONT_DISPLAY\s*=\s*[^;]+;\s*/g, '');
    content = content.replace(/const FONT_BODY\s*=\s*[^;]+;\s*/g, '');
    content = content.replace(/const FONT_MONO\s*=\s*[^;]+;\s*/g, '');

    // Remove inline style spreads
    content = content.replace(/,\s*\.\.\.body/g, '');
    content = content.replace(/,\s*\.\.\.headings/g, '');
    content = content.replace(/,\s*\.\.\.mono/g, '');
    content = content.replace(/\.\.\.body,\s*/g, '');
    content = content.replace(/\.\.\.headings,\s*/g, '');
    content = content.replace(/\.\.\.mono,\s*/g, '');

    // Remove radial-gradient backgrounds in inline styles
    content = content.replace(/background:\s*'radial-gradient[^']+',?/g, '');
    
    // Clean up empty style objects style={{ }}
    content = content.replace(/style=\{\{\s*\}\}/g, '');
    
    // Remove leftover color definitions in root wrappers if they are redundant now
    // e.g. style={{ color: '#F8FAFC' }}
    content = content.replace(/color:\s*'#F8FAFC',?/g, '');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated', file);
    }
});
