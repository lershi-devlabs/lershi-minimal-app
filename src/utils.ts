import fs from 'fs-extra';
import path from 'path';

export interface ProjectOptions {
  template?: string;
  yes?: boolean;
}

export async function validateProjectName(name: string): Promise<void> {
  if (!name) {
    throw new Error('Project name is required');
  }

  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error('Project name can only contain lowercase letters, numbers, and hyphens');
  }

  const projectPath = path.resolve(process.cwd(), name);
  if (await fs.pathExists(projectPath)) {
    throw new Error(`Directory ${name} already exists`);
  }
}