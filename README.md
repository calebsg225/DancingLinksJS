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

### NQueens

``` js

const {
  nQueenSolutions,
  rawExactCoverMatrix
}

const { nQueenSolutions, rawExactCoverMatrix } = DLXSolver.solveNQueens(8, '.Q', 3);
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