const fs = require('fs');
const path = require('path');

const FONTS_DEF = `
    const headings = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif' };
    const body = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };
    const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };
    return (`.trim();

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

    // Skip Login.jsx as we manually restored it
    if (file.includes('Login.jsx') || file.includes('TriangulateMark.jsx') || file.includes('Sidebar.jsx') || file.includes('index.css')) {
        return;
    }

    // 1. Restore font definitions before return (
    if (!content.includes('const headings = {')) {
        // Find the return ( of the main component.
        // It's usually the first 'return (' after 'export default function' or 'const ... = () => {'
        content = content.replace(/return\s*\(/, `    const headings = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif' };\n    const body = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };\n    const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };\n    return (`);
    }

    // 2. Restore main wrapper background
    content = content.replace(/className="min-h-screen w-full" style=\{\{\s*\}\}/g, `className="min-h-screen w-full" style={{ background: 'radial-gradient(1200px 600px at 20% -10%, rgba(0,242,254,0.06), transparent 60%), #0B0F19', color: '#F8FAFC', ...body }}`);
    
    // In some pages, style might not be empty but lacking background
    // Let's manually target App.jsx and NotFound.jsx if they have specific patterns.
    if (file.includes('App.jsx') || file.includes('NotFound.jsx')) {
        content = content.replace(/style=\{\{\s*minHeight:\s*'100vh', display:\s*'flex'/g, `style={{ background: 'radial-gradient(1200px 600px at 20% -10%, rgba(0,242,254,0.06), transparent 60%), #0B0F19', color: '#F8FAFC', minHeight: '100vh', display: 'flex'`);
    }

    // 3. Restore cyan dots and headers
    content = content.replace(/color:\s*'#94A3B8'/g, "color: '#00F2FE'");
    content = content.replace(/bg-\[#94A3B8\]/g, "bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]");

    // 4. Restore ...headings to h1 elements
    content = content.replace(/style=\{\{\s*fontWeight:\s*600\s*\}\}/g, "style={{ ...headings, fontWeight: 600 }}");

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Restored', file);
    }
});
