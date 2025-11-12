import { describe, it, expect } from 'vitest';
import { jsonToToon } from '../src/core/jsonToToon';

describe('jsonToToon', () => {
  it('should convert valid JSON to TOON format', () => {
    const input = {
      users: [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' }
      ]
    };

    const result = jsonToToon(input);
    const expected = 'users[2]{id,name,role}:\n1,Alice,admin\n2,Bob,user';
    
    expect(result).toBe(expected);
  });

  it('should convert JSON to compact TOON format when compact flag is true', () => {
    const input = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]
    };

    const result = jsonToToon(input, true);
    const expected = 'users[2]{id,name}:1,Alice2,Bob';
    
    expect(result).toBe(expected);
  });

  it('should handle special characters in values', () => {
    const input = {
      data: [
        { text: 'Hello, World!', symbol: '@#$' },
        { text: 'Test "quotes"', symbol: '&*%' }
      ]
    };

    const result = jsonToToon(input);
    const expected = 'data[2]{text,symbol}:\nHello, World!,@#$\nTest "quotes",&*%';
    
    expect(result).toBe(expected);
  });

  it('should handle null and undefined values', () => {
    const input = {
      items: [
        { id: 1, value: null },
        { id: 2, value: undefined }
      ]
    };

    const result = jsonToToon(input);
    const expected = 'items[2]{id,value}:\n1,\n2,';
    
    expect(result).toBe(expected);
  });

  it('should handle nested objects by stringifying them', () => {
    const input = {
      records: [
        { id: 1, meta: { type: 'A', count: 5 } }
      ]
    };

    const result = jsonToToon(input);
    const expected = 'records[1]{id,meta}:\n1,{"type":"A","count":5}';
    
    expect(result).toBe(expected);
  });

  it('should throw error for empty array', () => {
    const input = { users: [] };

    expect(() => jsonToToon(input)).toThrow('Array cannot be empty');
  });

  it('should throw error for non-object input', () => {
    expect(() => jsonToToon('not an object' as any)).toThrow('Input must be an object');
  });

  it('should throw error for array input', () => {
    expect(() => jsonToToon([1, 2, 3] as any)).toThrow('Input must be an object');
  });

  it('should throw error for multiple root keys', () => {
    const input = {
      users: [{ id: 1 }],
      posts: [{ id: 2 }]
    };

    expect(() => jsonToToon(input)).toThrow('Input must have exactly one root key');
  });

  it('should throw error when value is not an array', () => {
    const input = { users: 'not an array' };

    expect(() => jsonToToon(input as any)).toThrow('Value must be an array');
  });

  it('should throw error when rows have inconsistent fields', () => {
    const input = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2 } // missing 'name' field
      ]
    };

    expect(() => jsonToToon(input as any)).toThrow('Row 1 is missing field "name"');
  });
});
