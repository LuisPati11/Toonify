import chalk from 'chalk';

/**
 * Display a success message in green with ✅ emoji
 * @param message - The success message to display
 */
export function success(message: string): void {
  console.log(chalk.green(`✅ ${message}`));
}

/**
 * Display an error message in red with ❌ emoji
 * @param message - The error message to display
 */
export function error(message: string): void {
  console.error(chalk.red(`❌ ${message}`));
}

/**
 * Display an informational message
 * @param message - The info message to display
 */
export function info(message: string): void {
  console.log(message);
}

/**
 * Format a file name for display
 * @param fileName - The file name to format
 * @returns Formatted file name
 */
export function formatFileName(fileName: string): string {
  return chalk.cyan(fileName);
}

/**
 * Format a file size for display
 * @param bytes - The size in bytes
 * @returns Formatted size string (e.g., "1.5 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * Format a number with thousand separators
 * @param num - The number to format
 * @returns Formatted number string (e.g., "1,234")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a percentage value
 * @param value - The percentage value
 * @returns Formatted percentage string (e.g., "-45.2%")
 */
export function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
