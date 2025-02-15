# deep-object-compare  

A robust utility for deeply comparing objects and providing detailed difference information. Handles nested objects, arrays, and circular references.

## Installation  

```bash
npm install nested-object-compare
```

## Usage  

### **Basic Comparison**  

```javascript
const { deepCompare } = require('nested-object-compare');

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };

const result = deepCompare(obj1, obj2);
console.log(result);
// Output: { equal: true }
```

### **Detecting Differences**  

```javascript
const obj3 = { a: 1, b: { c: 2, d: [3, 4] } };
const obj4 = { a: 1, b: { c: 2, d: [3, 5] } };

const result2 = deepCompare(obj3, obj4);
console.log(result2);
/* Output:
{
  equal: false,
  differences: []
}
*/
```


### **Verbose Mode(Structured Path)**  

```javascript
const resultVerbose = deepCompare(obj3, obj4, { verbose: true });
console.log(resultVerbose);
/* Output:
{
  equal: false,
  differences: [
    { path: '["b"]["d"][1]', value1: 4, value2: 5, message: 'Values differ: 4 vs 5' }
  ]
}
*/
```

### **Verbose Mode(Dot Notation Path)**  

```javascript
const resultVerbose = deepCompare(obj3, obj4, { verbose: true,pathFormat: "dot" });
console.log(resultVerbose);
/* Output:
{
  equal: false,
  differences: [
    { path: "b.d.1", value1: 4, value2: 5, message: 'Values differ: 4 vs 5' }
  ]
}
*/
```

### **Strict vs. Loose Comparison**  

```javascript
const obj5 = { a: 1, b: { c: 2 } };
const obj6 = { a: 1, b: { c: '2' } }; // '2' is a string

const result3 = deepCompare(obj5, obj6); // Strict (default)
console.log(result3);
/* Output:
{
  equal: false,
  differences: []
}
*/

const result4 = deepCompare(obj5, obj6, { strict: false }); // Loose
console.log(result4);
/* Output:
 { equal: true,
// differences: []
}
*/
```

### **Handling Circular References**  

```javascript
const circular1 = {};
circular1.itself = circular1;

const circular2 = {};
circular2.itself = circular2;

const resultCircular = deepCompare(circular1, circular2);
console.log(resultCircular);
/* Output:
 { equal: true,
// differences: []
}
*/
```

```javascript
const circular3 = {};
circular3.a = circular3;

const circular4 = {};
circular4.a = circular4;
circular4.b = 1;

const resultCircular2 = deepCompare(circular3, circular4, { verbose: true });
console.log(resultCircular2);
/* Output:
{
  equal: false,
  differences: [
    { path: '["b"]', value1: undefined, value2: 1, message: 'Value exists in one object only' }
  ]
}
*/
```

