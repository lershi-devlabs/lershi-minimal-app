#!/usr/bin/env node

import { Command } from 'commander';
import updateNotifier from 'update-notifier';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { scaffoldProject } from './scaffold.js';
import enquirer from 'enquirer';
import { logger } from './logger.js';
const { prompt } = enquirer;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

// Check for updates
const notifier = updateNotifier({ pkg });
notifier.notify();

const program = new Command();

const promptTemplates = ['default']; // Add more template names as needed

program
  .name('create-minimal-app')
  .description('A CLI tool to scaffold minimal project structures')
  .usage('<project-name> [options]')
  .version(pkg.version, '-v, --version', 'output the current version')
  .addHelpText('before', `
Minimal App Scaffolder

Usage Examples:
  $ create-minimal-app my-app
  $ create-minimal-app my-app -t html
  $ create-minimal-app my-app -y
`)
  .addHelpText('after', `
For more info, visit: https://github.com/lershi-devlabs/create-minimal-app
`)
  .argument('<project-name>', 'Name of the project')
  .option('-t, --template <template>', 'Project template to use', 'default')
  .option('-y, --yes', 'Skip prompts and use default values')
  .action(async (projectName, options) => {
    let shouldInstall = false;
    let packageManager = 'npm';
    let shouldInitGit = false;

    if (promptTemplates.includes(options.template) && !options.yes) {
      const { install, pm, git } = await prompt<any>([
        {
          type: 'confirm',
          name: 'install',
          message: 'Run package manager install after scaffolding?',
          initial: false
        },
        {
          type: 'select',
          name: 'pm',
          message: 'Which package manager?',
          choices: ['npm', 'yarn', 'pnpm', 'bun'],
          skip: (prev: { install?: boolean }) => !prev.install
        },
        {
          type: 'confirm',
          name: 'git',
          message: 'Initialize a git repository?',
          initial: true
        }
      ]);
      shouldInstall = install;
      packageManager = pm || 'npm';
      shouldInitGit = git;
    } else if (options.yes && promptTemplates.includes(options.template)) {
      shouldInstall = false;
      packageManager = 'npm';
      shouldInitGit = false; // or true, your default
    }

    logger.start('Scaffolding project...');
    
    try {
      await scaffoldProject(projectName, options);
      logger.succeed('Project created successfully!');

      if (shouldInitGit) {
        logger.start('Initializing git repository...');
        try {
          const { execa } = await import('execa');
          await execa('git', ['init'], { cwd: projectName });
          logger.succeed('Git repository initialized!');
        } catch (error) {
          logger.fail('Failed to initialize git repository.');
          logger.warn((error as Error).message);
        }
      }

      if (shouldInstall) {
        logger.start(`Running ${packageManager} install...`);
        const { execa } = await import('execa');
        await execa(packageManager, ['install'], { cwd: projectName, stdio: 'inherit' });
        logger.succeed(`${packageManager} install complete!`);
      }

      logger.info('\nNext steps:');
      logger.info(`  cd ${projectName}`);
      if (!shouldInstall) {
        logger.info('  npm install');
      }
      logger.info('  npm start\n');
    } catch (error) {
      logger.fail('Failed to create project');
      logger.error((error as Error).message);
      process.exit(1);
    }
  });

program.exitOverride((err) => {
  if (err.code === 'commander.missingArgument') {
    console.error("error: missing required argument 'project-name'");
    console.error('Usage: create-minimal-app <project-name> [options]');
    process.exit(1);
  }
  // Exit cleanly for help/version
  if (err.code === 'commander.helpDisplayed' || err.code === 'commander.version') {
    process.exit(0);
  }
  throw err;
});

program.configureOutput({
  writeErr: () => {} // Suppress default error output from Commander
});

program.parse(process.argv); 