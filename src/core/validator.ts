/**
 * Validates TOON format data for structural correctness
 * @param toonData - TOON formatted string to validate
 * @returns Validation result with boolean and array of error messages
 */
export function validateToon(toonData: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const lines = toonData.split('\n').filter((line) => line.trim() !== '');

  // Validate minimum 2 lines (header + at least one data row)
  if (lines.length < 2) {
    errors.push('Faltan filas de datos.');
    return { valid: false, errors };
  }

  // Validate header format using regex pattern
  const headerPattern = /^(\w+)\[(\d+)\]\{([^}]+)\}:$/;
  const headerMatch = lines[0].match(headerPattern);

  if (!headerMatch) {
    errors.push('Cabecera TOON inválida.');
    return { valid: false, errors };
  }

  // Extract expected field count from header
  const fields = headerMatch[3].split(',');
  const expectedFieldCount = fields.length;

  // Check each data row for matching column count
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length !== expectedFieldCount) {
      errors.push(
        `Fila ${i}: se esperaban ${expectedFieldCount} columnas, se encontraron ${values.length}.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
