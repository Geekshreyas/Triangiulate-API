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

    // Replace the specific glowing dot header style
    content = content.replace(/color:\s*'#00F2FE'/g, "color: '#94A3B8'");
    content = content.replace(/bg-\[#00F2FE\] shadow-\[0_0_10px_#00F2FE\]/g, "bg-[#94A3B8]");

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated cyan in', file);
    }
});
