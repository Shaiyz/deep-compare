import deepCompare, { ComparisonResult } from "../src/index"; 

describe("deepCompare", () => {
  test("should return equal for identical objects", () => {
    const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
    const obj2 = { a: 1, b: { c: 2, d: [3, 4] } };

    const result: ComparisonResult = deepCompare(obj1, obj2);
    expect(result.equal).toBe(true);
    expect(result.differences).toHaveLength(0);
  });

  test("should detect different values", () => {
    const obj1 = { a: 1, b: { c: 2  } };
    const obj2 = { a: 1, b: { c: 3 } };

    const result = deepCompare(obj1, obj2, { verbose: true });
    expect(result.equal).toBe(false);
    expect(result.differences).toHaveLength(1);
    expect(result.differences[0]).toEqual({
      path: `["b"]["c"]`,
      value1: 2,
      value2: 3,
      message: "Values differ: 2 vs 3",
    });
  });

  test("should detect missing keys", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1 };

    const result = deepCompare(obj1, obj2, { verbose: true });
    expect(result.equal).toBe(false);
    expect(result.differences).toContainEqual({
      path: `["b"]`,
      value1: { c: 2 },
      value2: "(missing)",
      message: `Key "b" is missing in one of the objects`,
    });
  });

  test("should detect different types", () => {
    const obj1 = { a: 1, b: "hello" };
    const obj2 = { a: 1, b: 123 };

    const result = deepCompare(obj1, obj2, { verbose: true });
    expect(result.equal).toBe(false);
    expect(result.differences).toContainEqual({
      path: `["b"]`,
      value1: "hello",
      value2: 123,
      message: "Types differ: string vs number",
    });
  });

  test("should handle arrays properly", () => {
    const obj1 = { a: [1, 2, 3] };
    const obj2 = { a: [1, 2, 4] };

    const result = deepCompare(obj1, obj2, { verbose: true });
    expect(result.equal).toBe(false);
    expect(result.differences).toContainEqual({
      path: `["a"][2]`,
      value1: 3,
      value2: 4,
      message: "Values differ: 3 vs 4",
    });
  });

  test("should support dot notation for paths", () => {
    const obj1 = { a: { b: { c: 1 } } };
    const obj2 = { a: { b: { c: 2 } } };

    const result = deepCompare(obj1, obj2, { verbose: true, pathFormat: "dot" });
    expect(result.differences[0].path).toBe("a.b.c");
  });

  test("should handle deeply nested differences", () => {
    const obj1 = { a: { b: { c: { d: { e: 5 } } } } };
    const obj2 = { a: { b: { c: { d: { e: 10 } } } } };

    const result = deepCompare(obj1, obj2, { verbose: true });
    expect(result.equal).toBe(false);
    expect(result.differences).toContainEqual({
      path: `["a"]["b"]["c"]["d"]["e"]`,
      value1: 5,
      value2: 10,
      message: "Values differ: 5 vs 10",
    });
  });

  test("should respect strict equality option", () => {
    const obj1 = { a: 1, b: "2" };
    const obj2 = { a: 1, b: 2 };

    const resultStrict = deepCompare(obj1, obj2, { strict: true, verbose: true });
    expect(resultStrict.equal).toBe(false);

    const resultLoose = deepCompare(obj1, obj2, { strict: false, verbose: true });
    expect(resultLoose.equal).toBe(true);
    
  });
});
