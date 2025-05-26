import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { validateProjectName } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function walkSync(dir: string, filelist: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkSync(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
}

export async function scaffoldProject(projectName: string, options = {}) {
  await validateProjectName(projectName);
  const projectPath = path.resolve(process.cwd(), projectName);
  const templateName = (options as { template?: string }).template || 'default';
  const templatePath = path.resolve(__dirname, `../templates/${templateName}`);

  // Copy all template files to the new project directory
  await fs.copy(templatePath, projectPath);

  // Replace placeholders in all files
  const allFiles = walkSync(projectPath);
  for (const file of allFiles) {
    // Only replace in text files
    if (!file.endsWith('.png') && !file.endsWith('.jpg') && !file.endsWith('.jpeg') && !file.endsWith('.gif') && !file.endsWith('.ico')) {
      let content = await fs.readFile(file, 'utf-8');
      const replaced = content.replace(/\$\{name\}/g, projectName);
      if (replaced !== content) {
        await fs.writeFile(file, replaced);
      }
    }
  }

  return projectPath;
} 