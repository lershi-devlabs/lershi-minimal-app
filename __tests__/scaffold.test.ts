import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { scaffoldProject } from '../src/scaffold.js';

describe('scaffoldProject', () => {
  const testProjectName = 'test-app';
  const testProjectPath = path.resolve(process.cwd(), testProjectName);

  afterEach(async () => {
    await fs.remove(testProjectPath);
  });

  it('creates the project structure with all required files', async () => {
    await scaffoldProject(testProjectName);

    // Check if main files exist
    expect(await fs.pathExists(path.join(testProjectPath, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(testProjectPath, 'README.md'))).toBe(true);
    expect(await fs.pathExists(path.join(testProjectPath, 'src', 'index.js'))).toBe(true);
    expect(await fs.pathExists(path.join(testProjectPath, '.gitignore'))).toBe(true);
    expect(await fs.pathExists(path.join(testProjectPath, 'vitest.config.js'))).toBe(true);
  });

  it('replaces template variables with project name', async () => {
    await scaffoldProject(testProjectName);

    const packageJson = await fs.readJson(path.join(testProjectPath, 'package.json'));
    const readme = await fs.readFile(path.join(testProjectPath, 'README.md'), 'utf-8');
    const indexJs = await fs.readFile(path.join(testProjectPath, 'src', 'index.js'), 'utf-8');

    expect(packageJson.name).toBe(testProjectName);
    expect(readme).toContain(testProjectName);
    expect(indexJs).toContain(testProjectName);
  });

  it('throws error if directory already exists', async () => {
    await fs.ensureDir(testProjectPath);
    
    await expect(scaffoldProject(testProjectName)).rejects.toThrow(
      `Directory ${testProjectName} already exists`
    );
  });
}); 