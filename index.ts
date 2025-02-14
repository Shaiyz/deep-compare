// index.ts

export interface ComparisonResult {
  equal: boolean;
  differences: {
    path: string;
    value1: unknown;
    value2: unknown;
    message: string;
  }[];
}

export interface CompareOptions {
  strict?: boolean;
  verbose?: boolean;
}

/**
 * A utility function for efficiently comparing objects, including nested objects and arrays.
 * Provides detailed information about differences.
 *
 * @param obj1 The first object to compare.
 * @param obj2 The second object to compare.
 * @param options Optional settings.
 * @returns An object containing the comparison result and differences (if verbose).
 */
function deepCompare(obj1: unknown, obj2: unknown, options: CompareOptions = {}): ComparisonResult {
  const { strict = true, verbose = false } = options;
  const result: ComparisonResult = {
    equal: true,
    differences: [],
  };

  function formatPath(path: (string | number)[]): string {
    return path
      .map(key => (typeof key === "number" ? `[${key}]` : `["${key}"]`))
      .join("");
  }

  function compareValues(val1: any, val2: any, path: (string | number)[] = []): void {
    if (val1 === val2) return;
    if (!strict && val1 == val2) return;

    if (typeof val1 !== typeof val2) {
      result.equal = false;
      if (verbose) {
        result.differences.push({
          path: formatPath(path),
          value1: val1,
          value2: val2,
          message: `Types differ: ${typeof val1} vs ${typeof val2}`,
        });
      }
      return;
    }

    if (val1 && typeof val1 === "object" && val2 && typeof val2 === "object") {
      const keys1 = Object.keys(val1 as Record<string, unknown>);
      const keys2 = Object.keys(val2 as Record<string, unknown>);
      const allKeys = new Set([...keys1, ...keys2]);

      if (keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key))) {
        result.equal = false;
        if (verbose) {
          result.differences.push({
            path: formatPath(path),
            value1: val1,
            value2: val2,
            message: `Objects have different keys`,
          });
        }
      }

      for (const key of allKeys) {
        const value1 = (val1 as Record<string, unknown>)[key];
        const value2 = (val2 as Record<string, unknown>)[key];

        if (!(key in val1) || !(key in val2)) {
          result.equal = false;
          if (verbose) {
            result.differences.push({
              path: formatPath([...path, key]),
              value1: value1 ?? "(missing)",
              value2: value2 ?? "(missing)",
              message: `Key "${key}" is missing in one of the objects`,
            });
          }
        } else {
          compareValues(value1, value2, [...path, key]);
        }
      }
      return;
    }

    result.equal = false;
    if (verbose) {
      result.differences.push({
        path: formatPath(path),
        value1: val1,
        value2: val2,
        message: `Values differ: ${val1} vs ${val2}`,
      });
    }
  }

  compareValues(obj1, obj2);
  return result;
}


export default deepCompare;
