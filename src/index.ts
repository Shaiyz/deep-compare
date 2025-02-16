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
  pathFormat?: "bracket" | "dot";
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
  const { verbose = false, strict = true, pathFormat = "bracket" } = options;
  const differences: CompareResult["differences"] = [];
  const visited = new WeakMap();  

  const formatPath = (key: string, format: "bracket" | "dot", isFirstKey: boolean = false): string => {
    if (format === "dot") {
      return isFirstKey ? `${key}` : `.${key}`;
    }
    if (/^\d+$/.test(key)) {
      return `[${key}]`;
    }
    return `["${key}"]`;
  };

  const compare = (val1: any, val2: any, path: string, isFirstKey: boolean = false): boolean => {
     if (!strict && val1 == val2) {
      return true;
    }

     if (strict && typeof val1 !== typeof val2) {
      differences.push({ path, value1: val1, value2: val2, message: `Types differ: ${typeof val1} vs ${typeof val2}` });
      return false;
    }

     if (val1 === val2) return true;

    if (typeof val1 === "object" && val1 !== null && typeof val2 === "object" && val2 !== null) {
      if (visited.has(val1)) {
        return visited.get(val1) === val2; 
      }

       visited.set(val1, val2);

      const keys1 = Object.keys(val1);
      const keys2 = Object.keys(val2);

     for (const key of keys1) {
        if (!keys2.includes(key)) {
          differences.push({
            path: `${path}${formatPath(key, pathFormat, isFirstKey)}`,
            value1: val1[key],
            value2: "(missing)",
            message: `Key "${key}" is missing in one of the objects`,
          });
          return false;
        }
      }

      for (const key of keys2) {
        if (!keys1.includes(key)) {
          differences.push({
            path: `${path}${formatPath(key, pathFormat, isFirstKey)}`,
            value1: "(missing)",
            value2: val2[key],
            message: `Key "${key}" is missing in one of the objects`,
          });
          return false;
        }
      }

      let isEqual = true;
      for (const key of keys1) {
        const newPath = `${path}${formatPath(key, pathFormat, isFirstKey)}`;
        if (!compare(val1[key], val2[key], newPath, false)) {
          isEqual = false;
        }
      }
      return isEqual;
    }

    differences.push({ path, value1: val1, value2: val2, message: `Values differ: ${val1} vs ${val2}` });
    return false;
  };

  const equal = compare(obj1, obj2, "", true);
  return { equal, differences: verbose ? differences : [] };
}

export type { CompareOptions, CompareResult };