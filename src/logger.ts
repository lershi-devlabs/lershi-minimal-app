import chalk from 'chalk';
import ora from 'ora';
import type { Ora } from 'ora';

export class Logger {
  private spinner: Ora;

  constructor() {
    this.spinner = ora();
  }

  start(message: string): void {
    this.spinner.start(message);
  }

  succeed(message: string): void {
    this.spinner.succeed(chalk.green(message));
  }

  fail(message: string): void {
    this.spinner.fail(chalk.red(message));
  }

  info(message: string): void {
    console.log(chalk.blue(message));
  }

  error(message: string): void {
    console.error(chalk.red(message));
  }

  warn(message: string): void {
    console.warn(chalk.yellow(message));
  }
}

export const logger = new Logger(); 