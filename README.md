# JavaScript Implementation of Knuth's Algorithm X

## Usage
``` js
const testMatrix = [
  [0, 0, 1, 0, 1, 0 ,0],
  [1, 0, 0, 1, 0, 0, 1], 
  [0, 1, 1, 0, 0, 1, 0], 
  [1, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 1, 0, 1]
];

// convert matrix into a datastructure useable by the DLX program
const convertedMatrix = Convert.fromMatrix(testMatrix);

// get all valid solutions 
const solutions = DLX.find(convertedMatrix);
// outputs an array of sets, each set being a valid solution.
// Array is empty if there are no valid solutions.

console.log(solutions); // [{0, 3, 4}]
```