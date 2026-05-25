const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'client', 'src');

function walk(dir) {
  const res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) res.push(...walk(full));
    else if (e.isFile() && full.endsWith('.js')) res.push(full);
  }
  return res;
}

const files = walk(root);

const importLineRegex = /^\s*import\s+(.+?)\s+from\s+['\"](\.{1,2}\/[^'\"]+)['\"];?\s*$/;

function resolveModule(fromFile, importPath) {
  // try .js, /index.js
  const base = path.resolve(path.dirname(fromFile), importPath);
  const candidates = [base + '.js', path.join(base, 'index.js'), base];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

const mismatches = [];

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(importLineRegex);
    if (!m) continue;
    const importClause = m[1].trim();
    const importPath = m[2];
    const target = resolveModule(file, importPath);
    if (!target) continue;
    const targetSrc = fs.readFileSync(target, 'utf8');

    // Determine default vs named
    const isNamed = importClause.startsWith('{') || importClause.includes('{');
    if (isNamed) {
      // extract names
      const names = importClause.replace('{','').replace('}','').split(',').map(s=>s.trim().split(' as ')[0]);
      for (const name of names) {
        const namedExportRegex = new RegExp(`export\s+(const|function|class)\\s+${name}\\b`);
        const exportListRegex = new RegExp(`export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`);
        if (!namedExportRegex.test(targetSrc) && !exportListRegex.test(targetSrc)) {
          mismatches.push({from: file, importPath, importClause, target, missing: name, type:'named'});
        }
      }
    } else {
      // default import might be like: Component or Component, {x}
      const parts = importClause.split(',').map(s=>s.trim());
      const defaultName = parts[0] && !parts[0].startsWith('{') ? parts[0] : null;
      if (defaultName) {
        const defaultRegex = /export\s+default/;
        if (!defaultRegex.test(targetSrc)) {
          mismatches.push({from: file, importPath, importClause, target, missing: 'default export', type:'default'});
        }
      }
      // also handle possible named part after comma
      if (parts.length>1 && parts[1].startsWith('{')) {
        const names = parts[1].replace('{','').replace('}','').split(',').map(s=>s.trim().split(' as ')[0]);
        for (const name of names) {
          const namedExportRegex = new RegExp(`export\s+(const|function|class)\\s+${name}\\b`);
          const exportListRegex = new RegExp(`export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`);
          if (!namedExportRegex.test(targetSrc) && !exportListRegex.test(targetSrc)) {
            mismatches.push({from: file, importPath, importClause, target, missing: name, type:'named'});
          }
        }
      }
    }
  }
}

if (mismatches.length===0){
  console.log('No import/export mismatches found.');
} else {
  console.log('Found mismatches:');
  for (const mm of mismatches) {
    console.log(`- ${mm.type.toUpperCase()} missing in ${mm.target} imported by ${mm.from}: ${mm.missing} (import clause: ${mm.importClause}, importPath: ${mm.importPath})`);
  }
  process.exitCode = 1;
}
