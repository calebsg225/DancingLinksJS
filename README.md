# JavaScript Implementation of Knuth's Algorithm X

## Matrix Usage
``` js
const matrix: (0 | 1)[][] = [
  [0, 0, 1, 0, 1, 0 ,0],  // 0
  [1, 0, 0, 1, 0, 0, 1],  // 1
  [0, 1, 1, 0, 0, 1, 0],  // 2
  [1, 0, 0, 1, 0, 1, 0],  // 3 commented row indices
  [0, 1, 0, 0, 0, 0, 1],  // 4
  [1, 1, 0, 1, 0, 1, 1],  // 5
  [0, 0, 0, 0, 1, 0, 0]   // 6
];

/* 
DLXSolver.solveMatrix(
  matrix: matrix of 1's and 0's,
  solutionCount: limit the number of solutions to find. Default: */ Infinity /*,
  secondaryItems: a Set containing column indices to exclude as primary items when running DLX. Default: */ new Set() /*
)
*/

const solutions = DLXSolver.solveMatrix(matrix, 2);

/* 
DLXSolver.solveMatrix() outputs an array of Sets.
Each Set is a solution, where each digit in the Set is a row index making up that solution.
The array returns empty if there are no valid solutions.
*/

console.log(solutions); // [ {0, 4, 3}, {0, 5} ]
// The solution {2, 1, 6} is not found because we set solutionCount to 2.
```

## NQueens Usage
``` js
```