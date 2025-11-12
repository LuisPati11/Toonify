/**
 * Converts TOON format to JSON object
 * @param toonData - TOON formatted string
 * @returns JSON object with reconstructed structure
 * @throws Error if header format is invalid
 * 
 * @example
 * const toon = "users[2]{id,name}:\n1,Alice\n2,Bob";
 * const json = toonToJson(toon);
 * // Returns: { users: [{ id: "1", name: "Alice" }, { id: "2", name: "Bob" }] }
 */
export function toonToJson(toonData: string): any {
  // Split input by newlines and filter empty lines
  const lines = toonData.split('\n').filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    throw new Error('TOON data cannot be empty');
  }

  // Parse header using regex: key[count]{fields}:
  const headerRegex = /(\w+)\[\d+\]\{([^}]+)\}:/;
  const headerLine = lines[0];
  const match = headerLine.match(headerRegex);

  if (!match) {
    throw new Error('Invalid TOON header format');
  }

  // Extract key name and field names
  const keyName = match[1];
  const fieldsStr = match[2];
  const fieldNames = fieldsStr.split(',');

  // Parse data rows (skip header line)
  const dataRows = lines.slice(1);

  // Map values to field names to reconstruct objects
  const objects = dataRows.map(row => {
    const values = row.split(',');
    const obj: any = {};
    
    fieldNames.forEach((field, index) => {
      obj[field] = values[index] !== undefined ? values[index] : '';
    });
    
    return obj;
  });

  // Return JSON object with key and array structure
  return {
    [keyName]: objects
  };
}
