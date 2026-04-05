import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceInDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            if (content.includes('import.meta.env.VITE_API_URL')) {
                content = content.replace(/\(import\.meta\.env\.VITE_API_URL \|\| "http:\/\/localhost:5000"\) \+ "/g, '"https://lms-app-backend-ruzu.onrender.com');
                content = content.replace(/`\$\{import\.meta\.env\.VITE_API_URL \|\| "http:\/\/localhost:5000"\}/g, '`https://lms-app-backend-ruzu.onrender.com');
                changed = true;
            }

            if (content.includes('http://localhost:5000')) {
                content = content.replace(/http:\/\/localhost:5000/g, 'https://lms-app-backend-ruzu.onrender.com');
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated ' + fullPath);
            }
        }
    });
}

replaceInDir(path.join(__dirname, 'src'));
