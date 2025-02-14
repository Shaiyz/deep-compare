# deep-object-compare

A robust utility for deeply comparing objects and providing detailed difference information.  Handles nested objects, arrays, and circular references.

 ## Installation

```bash
npm install deep-object-compare
```

const deepCompare = require('deep-object-compare'); // Or import if using modules

const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
const obj2 = { a: 1, b: { c: 2, d: [3, 5] } };

const result = deepCompare(obj1, obj2);
console.log(result);
// Output: { equal: false, differences: [ { path: 'b.d.1', value1: 4, value2: 5, message: 'Values differ: 4 vs 5' } ] }


const resultVerbose = deepCompare(obj1, obj2, { verbose: true });
console.log(resultVerbose);
/* Output (with verbose):
{
  equal: false,
  differences: [
    {
      path: 'b.d.1',
      value1: 4,
      value2: 5,
      message: 'Values differ: 4 vs 5'
    }
  ]
}
*/

const obj3 = { a: 1, b: { c: 2 } };
const obj4 = { a: 1, b: { c: 2 } };
const result2 = deepCompare(obj3, obj4);
console.log(result2); // Output: { equal: true, differences: [] }


const obj5 = { a: 1, b: { c: 2 } };
const obj6 = { a: 1, b: { c: '2' } }; // Note: '2' is a string
const result3 = deepCompare(obj5, obj6); // Strict by default
console.log(result3); // Output: { equal: false, differences: [ { path: 'b.c', value1: 2, value2: '2', message: 'Types differ: number vs string' } ] }

const result4 = deepCompare(obj5, obj6, { strict: false }); // Loose comparison
console.log(result4); // Output: { equal: true, differences: [] }


// Example with circular references (important!)
const circular1 = {};
circular1.itself = circular1;

const circular2 = {};
circular2.itself = circular2;

const resultCircular = deepCompare(circular1, circular2);
console.log(resultCircular); // Output: { equal: true, differences: [] } (Handles circularity!)

const circular3 = {};
circular3.a = circular3;

const circular4 = {};
circular4.a = circular4;
circular4.b = 1;


const resultCircular2 = deepCompare(circular3, circular4);
console.log(resultCircular2); // Output: { equal: false, differences: [ { path: 'b', value1: undefined, value2: 1, message: 'Values differ: undefined vs 1' } ] }

API
deepCompare(obj1, obj2, [options])
Compares two objects deeply.

Parameters:

obj1: The first object to compare.
obj2: The second object to compare.
options (optional): An object with comparison options.
strict (boolean, default: true): If true, performs strict equality checks (===). If false, performs loose equality checks (==).
verbose (boolean, default: false): If true, includes detailed information about differences in the result.
Returns:

An object with the following properties:

equal: A boolean indicating whether the objects are deeply equal.
differences (only if verbose is true): An array of objects, where each object describes a difference found. Each difference object has:
path: A string representing the path to the differing value (e.g., "a.b.c").
value1: The value in obj1 at the given path.
value2: The value in obj2 at the given path.
message: A descriptive message about the difference.
