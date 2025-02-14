// index.js (Main entry point for your package)

/**
 * A utility function for efficiently comparing objects, including nested objects and arrays.
 * Provides detailed information about differences.
 *
 * @param {any} obj1 The first object to compare.
 * @param {any} obj2 The second object to compare.
 * @param {object} [options] Optional settings.
 * @param {boolean} [options.strict=true]  Strict comparison (===) vs. loose comparison (==).
 * @param {boolean} [options.verbose=false]  Include detailed difference information.
 * @returns {object} An object containing the comparison result and differences (if verbose).
 */

function deepCompare(obj1, obj2, options = {}) {
  const { strict = true, verbose = false } = options;
  const result = {
    equal: true,
    differences: [], // Only populated if verbose is true
  };

  function compareValues(val1, val2, path = []) {
    if (typeof val1 !== typeof val2) {
      result.equal = false;
      if (verbose) {
        result.differences.push({
          path: path.join('.'),
          value1: val1,
          value2: val2,
          message: `Types differ: ${typeof val1} vs ${typeof val2}`,
        });
      }
      return; // Stop comparing further down this branch
    }

    if (val1 === val2) return; // Strict equality check first

    if (!strict && val1 == val2) return; // Loose equality check if not strict

    if (typeof val1 === 'object' && val1 !== null && val2 !== null) {
      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) {
          result.equal = false;
          if (verbose) {
            result.differences.push({
              path: path.join('.'),
              value1: val1,
              value2: val2,
              message: `Arrays have different lengths`,
            });
          }
        }
        for (let i = 0; i < Math.min(val1.length, val2.length); i++) {
          compareValues(val1[i], val2[i], [...path, i]);
        }
      } else {
        const keys1 = Object.keys(val1);
        const keys2 = Object.keys(val2);

        if (keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key))) {
          result.equal = false;
          if (verbose) {
             result.differences.push({
              path: path.join('.'),
              value1: val1,
              value2: val2,
              message: `Objects have different keys`,
            });
          }
        }
        for (const key of keys1) {
          compareValues(val1[key], val2[key], [...path, key]);
        }
      }
    } else {
      result.equal = false;
      if (verbose) {
        result.differences.push({
          path: path.join('.'),
          value1: val1,
          value2: val2,
          message: `Values differ: ${val1} vs ${val2}`,
        });
      }
    }
  }

  compareValues(obj1, obj2);
  return result;
}



module.exports = deepCompare;