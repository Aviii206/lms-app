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
            if (name.endsWith('.js') || name.endsWith('.jsx')) {
                allFilesList.push(name);
            }
        }
    }
    return allFilesList;
}

const allFiles = getFiles(path.join(__dirname, 'src'));

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes('import.meta.env.VITE_API_BASE_URL')) {
        content = content.replace(/\(import\.meta\.env\.VITE_API_BASE_URL \|\| "http:\/\/localhost:5000"\) \+ "/g, '"https://lms-app-backend-ruzu.onrender.com');
        content = content.replace(/`\$\{import\.meta\.env\.VITE_API_BASE_URL \|\| "http:\/\/localhost:5000"\}/g, '`https://lms-app-backend-ruzu.onrender.com');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log("Forced PROD URL inside " + file);
    }
});
