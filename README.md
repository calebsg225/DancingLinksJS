# JavaScript Implementation of Knuth's Algorithm X
Knuth's Dancing Links paper can be found [here](https://www.inf.ufrgs.br/~mrpritt/lib/exe/fetch.php?media=inf5504:7.2.2.1-dancing_links.pdf). You can also find an earlier paper of his displaying a previous version of the same algorithm [here](https://www.ocf.berkeley.edu/~jchu/publicportal/sudoku/0011047.pdf).

## Usage

- [Matrices](#matrices)
- [NQueens](#nqueens)

### Matrices

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

const solutions = DLXSolver.solveMatrix(
  matrix, // [matrix]: matrix of 1's and 0's
  2 // [solutionCount]: limit the number of solutions to find. Default: [Infinity]
  // [secondaryItems]: a Set containing column indices to exclude as primary items when running DLX. Default: [new Set()]
  );

/* 
DLXSolver.solveMatrix() outputs an array of Sets.
Each Set is a solution, where each digit in the Set is a row index making up that solution.
The array returns empty if there are no valid solutions.
*/

console.log(solutions); // [ {0, 4, 3}, {0, 5} ]
// The solution {2, 1, 6} is not found because we set solutionCount to 2.
```

### NQueens

``` js

const { nQueenSolutions, rawExactCoverMatrix } = DLXSolver.solveNQueens(
  8, // [queenCount]: number of queens, rows, and columns of the board
  '.Q', // [solutionFormat]: formats the output string matrix. The first char is an empty board tile, the second char is where a queen has been placed
  3 // [solutionCount]: limit the number of solutions to find. Default: [Infinity]
  );

/*

*/

for (let i = 0; i < nQueenSolutions.length; i++) {
  console.log(`Solution: ${i}`);
  for (const row of nQueenSolutions[i]) {
    console.log(row.join(''));
  }
}

console.log('Raw Extact Cover Matrix');
for (const row of rawExactCoverMatrix) {
  console.log(row.join(''));
}
```