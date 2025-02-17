type CompareResult = {
  equal: boolean;
  differences: Array<{
    path: string;
    value1: any;
    value2: any;
    message: string;
  }>;
};

type CompareOptions = {
  verbose?: boolean;
  strict?: boolean;
  pathFormat?: "structured" | "dot";
};

/**
 * A utility function for efficiently comparing objects, including nested objects and arrays.
 * Provides detailed information about differences.
 *
 * @param obj1 The first object to compare.
 * @param obj2 The second object to compare.
 * @param options Optional settings.
 * @returns An object containing the comparison result and differences (if verbose).
 */

export function deepCompare(obj1: any, obj2: any, options: CompareOptions = {}): CompareResult {
  const { verbose = false, strict = true, pathFormat = "structured" } = options;
  const differences: CompareResult["differences"] = [];
  const visited = new WeakMap();

  const formatPath = (key: string | number, format: "structured" | "dot", currentPath: string): string => {
    if (format === "dot") {
      return currentPath ? `${currentPath}.${key}` : `${key}`;
    }
    if (typeof key === "number") {
      return `${currentPath}[${key}]`;
    }
    return `${currentPath}["${key}"]`;
  };

  const compare = (val1: any, val2: any, currentPath: string): boolean => {
    if (!strict && val1 == val2) {
      return true;
    }

    if (strict && typeof val1 !== typeof val2) {
      differences.push({ path: currentPath, value1: val1, value2: val2, message: `Types differ: ${typeof val1} vs ${typeof val2}` });
      return false;
    }

    if (val1 === val2) return true;

    if (typeof val1 === "object" && val1 !== null && typeof val2 === "object" && val2 !== null) {
      if (visited.has(val1)) {
        return visited.get(val1) === val2;
      }

      visited.set(val1, val2);

      const keys1 = Array.isArray(val1) ? val1.map((_, i) => i) : Object.keys(val1);
      const keys2 = Array.isArray(val2) ? val2.map((_, i) => i) : Object.keys(val2);

      const allKeys = new Set([...keys1, ...keys2]);

      let isEqual = true;
      for (const key of allKeys) {
        const newPath = formatPath(key, pathFormat, currentPath);
        const hasKey1 = key in val1;
        const hasKey2 = key in val2;

        if (!hasKey1 || !hasKey2) {
          differences.push({
            path: newPath,
            value1: hasKey1 ? val1[key] : "(missing)",
            value2: hasKey2 ? val2[key] : "(missing)",
            message: `Key "${key}" is missing in one of the objects`,
          });
          isEqual = false;
        } else if (!compare(val1[key], val2[key], newPath)) {
          isEqual = false;
        }
      }

      return isEqual;
    }

    differences.push({ path: currentPath, value1: val1, value2: val2, message: `Values differ: ${val1} vs ${val2}` });
    return false;
  };

  const equal = compare(obj1, obj2, "");
  return { equal, differences: verbose ? differences : [] };
}

export type { CompareOptions, CompareResult };