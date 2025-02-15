export interface Difference {
    path: string;
    value1: unknown;
    value2: unknown;
    message: string;
}
export interface ComparisonResult {
    equal: boolean;
    differences: Difference[];
}
export interface CompareOptions {
    strict?: boolean;
    verbose?: boolean;
    pathFormat?: "dot" | "structured";
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
declare function deepCompare(obj1: unknown, obj2: unknown, options?: CompareOptions): ComparisonResult;
export { deepCompare };
