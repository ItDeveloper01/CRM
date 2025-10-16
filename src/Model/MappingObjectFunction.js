// @ts-check

/**
 * Maps values from source into target with defaults.
 * - Trims strings
 * - Falls back to default value if missing
 *
 * @template T
 * @param {Partial<T>} source
 * @param {T} template - An object with default values
 * @returns {T}
 */
export function mapObject(source = {}, template) {
  const target = { ...template };
    console.log("Mapping Object source = .."+source);
    console.log("Mapping Object templae = .."+target);

  for (const key in template) {
   
    const value = source[key];
 
    console.log("Mapping Object key = .."+key);
    console.log("Mapping Object value = .."+value);

    if (typeof value === "string") {
      target[key] = value.trim();
    } else if (value !== undefined && value !== null) {
      target[key] = value;
    }
    // else keep default from template
  }
  return target;
}

