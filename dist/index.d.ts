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
export declare function deepCompare(obj1: any, obj2: any, options?: CompareOptions): CompareResult;
export type { CompareOptions, CompareResult };
