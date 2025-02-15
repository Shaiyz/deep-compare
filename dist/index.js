/**
 * A utility function for efficiently comparing objects, including nested objects and arrays.
 * Provides detailed information about differences.
 *
 * @param obj1 The first object to compare.
 * @param obj2 The second object to compare.
 * @param options Optional settings.
 * @returns An object containing the comparison result and differences (if verbose).
 */
function deepCompare(obj1, obj2, options = {}) {
    const { strict = true, verbose = true, pathFormat = "structured" } = options;
    const result = { equal: true, differences: [] };
    function formatPath(path) {
        return pathFormat === "dot"
            ? path.join(".")
            : path
                .map(key => (typeof key === "number" ? `[${key}]` : `["${key}"]`))
                .join("");
    }
    function addDifference(path, value1, value2, message) {
        result.equal = false;
        if (verbose) {
            result.differences.push({
                path: formatPath(path),
                value1,
                value2,
                message,
            });
        }
    }
    function compareValues(val1, val2, path = []) {
        if (val1 === val2 || (!strict && val1 == val2))
            return;
        if (typeof val1 !== typeof val2) {
            addDifference(path, val1, val2, `Types differ: ${typeof val1} vs ${typeof val2}`);
            return;
        }
        if (val1 && typeof val1 === "object" && val2 && typeof val2 === "object") {
            const isArray1 = Array.isArray(val1);
            const isArray2 = Array.isArray(val2);
            if (isArray1 !== isArray2) {
                addDifference(path, val1, val2, "One is an array, the other is an object");
                return;
            }
            const keys1 = isArray1 ? val1.map((_, i) => i) : Object.keys(val1);
            const keys2 = isArray2 ? val2.map((_, i) => i) : Object.keys(val2);
            const allKeys = new Set([...keys1, ...keys2]);
            for (const key of allKeys) {
                const hasKey1 = key in val1;
                const hasKey2 = key in val2;
                if (!hasKey1 || !hasKey2) {
                    addDifference([...path, key], hasKey1 ? val1[key] : "(missing)", hasKey2 ? val2[key] : "(missing)", `Key "${key}" is missing in one of the objects`);
                }
                else {
                    compareValues(val1[key], val2[key], [...path, key]);
                }
            }
            return;
        }
        addDifference(path, val1, val2, `Values differ: ${JSON.stringify(val1)} vs ${JSON.stringify(val2)}`);
    }
    compareValues(obj1, obj2);
    return result;
}
export { deepCompare };
