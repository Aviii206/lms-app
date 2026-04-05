import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFiles(dir, allFilesList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, allFilesList);
        } else {
            allFilesList.push(name.replace(/\\/g, '/'));
        }
    }
    return allFilesList;
}

const allFiles = getFiles(path.join(__dirname, 'src'));
let errors = 0;

function checkImports(file) {
    const content = fs.readFileSync(file, 'utf8');
    const importRegex = /import\s+.*?from\s+['"](.+?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            const dir = path.dirname(file);
            let resolved = path.resolve(dir, importPath).replace(/\\/g, '/');
            
            const existsPerfectly = allFiles.find(f => {
               if (f === resolved) return true;
               if (f === resolved + '.js') return true;
               if (f === resolved + '.jsx') return true;
               if (f === resolved + '/index.js') return true;
               if (f === resolved + '/index.jsx') return true;
               return false;
            });

            if (!existsPerfectly) {
                const existsCaseBlind = allFiles.find(f => {
                   const fLower = f.toLowerCase();
                   const rLower = resolved.toLowerCase();
                   if (fLower === rLower) return true;
                   if (fLower === rLower + '.js') return true;
                   if (fLower === rLower + '.jsx') return true;
                   if (fLower === rLower + '/index.js') return true;
                   if (fLower === rLower + '/index.jsx') return true;
                   return false;
                });

                if (existsCaseBlind) {
                    console.log(`🚨 CASE MISMATCH FOUND in file: ${file}`);
                    console.log(`🚨 You wrote: import from '${importPath}'`);
                    console.log(`🚨 Did you mean: ${existsCaseBlind}`);
                    errors++;
                } else {
                    console.log(`🚨 MISSING FILE: ${resolved} imported in ${file}`);
                    errors++;
                }
            }
        }
    }
}

allFiles.filter(f => f.endsWith('.js') || f.endsWith('.jsx')).forEach(checkImports);

if (errors === 0) {
    console.log("✅ No import casing mismatches or missing files found!");
}
