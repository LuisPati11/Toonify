/**
 * Estimates the number of tokens in a text string
 * Uses a simple heuristic: 1 token ≈ 4 characters
 * @param text - Text content to estimate tokens for
 * @returns Estimated token count (rounded up to nearest integer)
 */
export function estimateTokens(text: string): number {
  // Use character-to-token ratio: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}
