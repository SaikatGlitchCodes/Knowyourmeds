import chalk from 'chalk';

export const logger = {
  start: (message: string) => console.log(chalk.blue(`🚀 ${message}`)),
  info: (message: string) => console.log(chalk.cyan(`ℹ️ ${message}`)),
  success: (message: string) => console.log(chalk.green(`✅ ${message}`)),
  error: (message: string, error?: any) => console.log(chalk.red(`❌ ${message}`), error || ''),
  warn: (message: string) => console.log(chalk.yellow(`⚠️ ${message}`)),
  progress: (message: string) => console.log(chalk.magenta(`⏳ ${message}`))
};