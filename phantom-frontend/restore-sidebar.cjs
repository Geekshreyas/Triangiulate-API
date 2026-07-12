const fs = require('fs');

let c = fs.readFileSync('src/components/Sidebar.jsx', 'utf8');

c = c.replace(/border-\[#94A3B8\]\/30/g, 'border-[#00F2FE]/30');
c = c.replace(/border-\[#94A3B8\]\/20/g, 'border-[#00F2FE]/20');
c = c.replace(/border-\[#94A3B8\]\/10/g, 'border-[#00F2FE]/10');
c = c.replace(/className="text-\[#94A3B8\]"/g, 'className="text-[#00F2FE]"');
c = c.replace(/transition-opacity text-\[#94A3B8\]"/g, 'transition-opacity text-[#00F2FE]"');
c = c.replace(/w-11 h-11/g, 'w-10 h-10');

fs.writeFileSync('src/components/Sidebar.jsx', c);
