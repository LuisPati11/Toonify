import * as fs from 'fs';

/**
 * Read input from a file path or stdin
 * @param filePath - Optional file path to read from. If not provided, reads from stdin
 * @returns The content of the file or stdin as a string
 * @throws Error if file is not found or cannot be read
 */
export function readInput(filePath?: string): string {
  try {
    if (filePath) {
      // Read from file
      return fs.readFileSync(filePath, 'utf-8');
    } else {
      // Read from stdin
      return fs.readFileSync(0, 'utf-8');
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    throw new Error(`Failed to read input: ${(error as Error).message}`);
  }
}

/**
 * Write content to a file
 * @param filePath - Path to the output file
 * @param content - Content to write to the file
 * @throws Error if file cannot be written
 */
export function writeOutput(filePath: string, content: string): void {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write output: ${(error as Error).message}`);
  }
}

/**
 * Detect format from file extension or content
 * @param filePath - Path to the file
 * @param content - Content of the file (used for fallback detection)
 * @returns 'json' or 'toon' based on detection
 */
export function detectFormat(filePath: string, content: string): 'json' | 'toon' {
  // Check file extension first
  if (filePath.endsWith('.json')) {
    return 'json';
  }
  if (filePath.endsWith('.toon')) {
    return 'toon';
  }

  // Fallback: try to detect from content
  // TOON format starts with pattern: key[count]{fields}:
  const toonHeaderPattern = /^\w+\[\d+\]\{[^}]+\}:/;
  if (toonHeaderPattern.test(content.trim())) {
    return 'toon';
  }

  // Try to parse as JSON
  try {
    JSON.parse(content);
    return 'json';
  } catch {
    // Default to toon if can't determine
    return 'toon';
  }
}
