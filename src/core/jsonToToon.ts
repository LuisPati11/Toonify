type Row = Record<string, unknown>;
type SingleKeyArray<T> = { [root: string]: T[] };

/**
 * Serializes a value to string format for TOON output
 * @param v - Value to serialize
 * @returns String representation of the value
 */
function serializeValue(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

/**
 * Converts a JSON object to TOON format
 * @param jsonData - Object with single key containing array of objects
 * @param compact - Optional boolean for compact output (default: false)
 * @returns TOON formatted string
 * @throws Error if input is not single-key object with array value or if array is empty
 * 
 * @example
 * const json = { users: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }] };
 * const toon = jsonToToon(json);
 * // Returns: "users[2]{id,name}:\n1,Alice\n2,Bob"
 */
export function jsonToToon<T extends Row>(jsonData: SingleKeyArray<T>, compact = false): string {
  // Validate input is an object
  if (typeof jsonData !== 'object' || jsonData === null || Array.isArray(jsonData)) {
    throw new Error('Input must be an object with a single key containing an array');
  }

  // Extract root key and validate single key structure
  const keys = Object.keys(jsonData);
  if (keys.length !== 1) {
    throw new Error('Input must have exactly one root key');
  }

  const rootKey = keys[0];
  const arrayValue = jsonData[rootKey];

  // Validate that value is an array
  if (!Array.isArray(arrayValue)) {
    throw new Error('Value must be an array');
  }

  // Validate array is not empty
  if (arrayValue.length === 0) {
    throw new Error('Array cannot be empty');
  }

  // Extract field names from first array element
  const fieldNames = Object.keys(arrayValue[0]);

  // Validate that all rows have the same fields
  for (const [i, row] of arrayValue.entries()) {
    for (const field of fieldNames) {
      if (!(field in row)) {
        throw new Error(`Row ${i} is missing field "${field}"`);
      }
    }
  }

  // Build TOON header: key[count]{fields}:
  const header = `${rootKey}[${arrayValue.length}]{${fieldNames.join(',')}}:`;

  // Map array objects to comma-separated value rows
  const rows = arrayValue.map(row =>
    fieldNames.map(field => serializeValue(row[field])).join(',')
  );

  // Join rows with newlines (or empty string if compact)
  const sep = compact ? '' : '\n';
  return header + sep + rows.join(sep);
}
