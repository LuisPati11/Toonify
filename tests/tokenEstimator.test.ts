import { describe, it, expect } from 'vitest';
import { estimateTokens } from '../src/core/tokenEstimator';

describe('estimateTokens', () => {
  it('should return 0 tokens for empty string', () => {
    const result = estimateTokens('');
    
    expect(result).toBe(0);
  });

  it('should estimate tokens for short text', () => {
    const text = 'Hello';
    const result = estimateTokens(text);
    
    // 5 characters / 4 = 1.25, rounded up = 2
    expect(result).toBe(2);
  });

  it('should estimate tokens for text with exactly 4 characters', () => {
    const text = 'Test';
    const result = estimateTokens(text);
    
    // 4 characters / 4 = 1
    expect(result).toBe(1);
  });

  it('should estimate tokens for longer text', () => {
    const text = 'This is a longer text with multiple words';
    const result = estimateTokens(text);
    
    // 42 characters / 4 = 10.5, rounded up = 11
    expect(result).toBe(11);
  });

  it('should estimate tokens for JSON format', () => {
    const json = JSON.stringify({
      users: [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' }
      ]
    });
    const result = estimateTokens(json);
    
    // Should return a positive integer
    expect(result).toBeGreaterThan(0);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should estimate tokens for TOON format', () => {
    const toon = `users[2]{id,name,role}:
1,Alice,admin
2,Bob,user`;
    const result = estimateTokens(toon);
    
    // Should return a positive integer
    expect(result).toBeGreaterThan(0);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should always round up to nearest integer', () => {
    // Test various lengths to ensure ceiling behavior
    expect(estimateTokens('a')).toBe(1);      // 1/4 = 0.25 -> 1
    expect(estimateTokens('ab')).toBe(1);     // 2/4 = 0.5 -> 1
    expect(estimateTokens('abc')).toBe(1);    // 3/4 = 0.75 -> 1
    expect(estimateTokens('abcd')).toBe(1);   // 4/4 = 1 -> 1
    expect(estimateTokens('abcde')).toBe(2);  // 5/4 = 1.25 -> 2
  });

  it('should handle text with special characters', () => {
    const text = 'Hello, World! @#$%^&*()';
    const result = estimateTokens(text);
    
    // 24 characters / 4 = 6
    expect(result).toBe(6);
  });

  it('should handle text with newlines', () => {
    const text = 'Line 1\nLine 2\nLine 3';
    const result = estimateTokens(text);
    
    // 20 characters / 4 = 5
    expect(result).toBe(5);
  });

  it('should handle text with unicode characters', () => {
    const text = 'Hello 世界 🌍';
    const result = estimateTokens(text);
    
    // Should return a positive integer based on string length
    expect(result).toBeGreaterThan(0);
    expect(Number.isInteger(result)).toBe(true);
  });
});
