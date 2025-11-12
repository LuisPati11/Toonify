import { describe, it, expect } from 'vitest';
import { validateToon } from '../src/core/validator';

describe('validateToon', () => {
  it('should validate correct TOON format', () => {
    const validToon = `users[2]{id,name,role}:
1,Alice,admin
2,Bob,user`;

    const result = validateToon(validToon);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect missing header', () => {
    const invalidToon = `1,Alice,admin
2,Bob,user`;

    const result = validateToon(invalidToon);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Cabecera TOON inválida.');
  });

  it('should detect invalid header format', () => {
    const invalidToon = `users{id,name,role}:
1,Alice,admin`;

    const result = validateToon(invalidToon);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Cabecera TOON inválida.');
  });

  it('should detect column count mismatch', () => {
    const invalidToon = `users[2]{id,name,role}:
1,Alice,admin
2,Bob`;

    const result = validateToon(invalidToon);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('Fila 2: se esperaban 3 columnas, se encontraron 2.');
  });

  it('should detect multiple column mismatches', () => {
    const invalidToon = `users[3]{id,name,role}:
1,Alice,admin,extra
2,Bob
3,Charlie,user`;

    const result = validateToon(invalidToon);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0]).toContain('Fila 1: se esperaban 3 columnas, se encontraron 4.');
    expect(result.errors[1]).toContain('Fila 2: se esperaban 3 columnas, se encontraron 2.');
  });

  it('should detect empty data (no rows after header)', () => {
    const invalidToon = `users[0]{id,name,role}:`;

    const result = validateToon(invalidToon);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Faltan filas de datos.');
  });

  it('should handle empty string', () => 
    {
    const result = validateToon('');
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Faltan filas de datos.');
  });

  it('should validate TOON with single data row', () => {
    const validToon = `users[1]{id,name}:
1,Alice`;

    const result = validateToon(validToon);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should ignore empty lines in TOON data', () => {
    const validToon = `users[2]{id,name}:
1,Alice

2,Bob`;

    const result = validateToon(validToon);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate TOON with special characters in values', () => {
    const validToon = `data[2]{text,symbol}:
Hello World!,@#$
Test "quotes",&*%`;

    const result = validateToon(validToon);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
