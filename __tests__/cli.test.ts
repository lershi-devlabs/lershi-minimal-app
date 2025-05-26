import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Command } from 'commander';
import * as utils from '../src/utils';
import fs from 'fs-extra';
import path from 'path';

vi.spyOn(utils, 'validateProjectName').mockResolvedValue(undefined);

describe('CLI', () => {
  let program: Command;
  let testProjectName: string;
  let testProjectPath: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    program = new Command();
    testProjectName = `test-app-cli-${Math.random().toString(36).slice(2, 8)}`;
    testProjectPath = path.resolve(process.cwd(), testProjectName);
    await fs.remove(testProjectPath);
  });

  afterEach(async () => {
    await fs.remove(testProjectPath);
  });

  it('validates project name before scaffolding', async () => {
    const options = { template: 'default' };

    program
      .name('create-minimal-app')
      .argument('<project-name>')
      .option('-t, --template <template>')
      .action(async (name, opts) => {
        const { scaffoldProject } = await import('../src/scaffold');
        await scaffoldProject(name, opts);
      });

    await program.parseAsync(['node', 'test', testProjectName, '-t', options.template]);

    expect(utils.validateProjectName).toHaveBeenCalledWith(testProjectName);
    // Check that the project was created
    expect(await fs.pathExists(path.join(testProjectPath, 'package.json'))).toBe(true);
  });

  it('handles invalid project names', async () => {
    const invalidName = 'invalid name';
    const error = new Error('Project name can only contain lowercase letters, numbers, and hyphens');
    (utils.validateProjectName as any).mockRejectedValueOnce(error);

    program
      .name('create-minimal-app')
      .argument('<project-name>')
      .action(async (name) => {
        const { scaffoldProject } = await import('../src/scaffold');
        await scaffoldProject(name);
      });

    await expect(program.parseAsync(['node', 'test', invalidName])).rejects.toThrow(error.message);
  });
}); 