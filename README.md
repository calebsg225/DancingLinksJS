# JavaScript Implementation of Knuth's Algorithm X
Knuth's Dancing Links paper can be found [here](https://www.inf.ufrgs.br/~mrpritt/lib/exe/fetch.php?media=inf5504:7.2.2.1-dancing_links.pdf). You can also find an earlier paper of his displaying a previous version of the same algorithm [here](https://www.ocf.berkeley.edu/~jchu/publicportal/sudoku/0011047.pdf).

## Usage

- [Matrices](#matrices)
  - [Secondary Items](#matrices-secondary-items)
- [NQueens](#nqueens)
- [Sudoku](#sudoku)
  - [Formatting Options](#sudoku-formatting-options)

### Matrices
- Input Variables
  ``` ts
  const matrix: (0 | 1)[][] = [ // matrix of 1's and 0's to solve
    [0, 0, 1, 0, 1, 0 ,0],  // 0
    [1, 0, 0, 1, 0, 0, 1],  // 1
    [0, 1, 1, 0, 0, 1, 0],  // 2
    [1, 0, 0, 1, 0, 1, 0],  // 3 row indices
    [0, 1, 0, 0, 0, 0, 1],  // 4
    [1, 1, 0, 1, 0, 1, 1],  // 5
    [0, 0, 0, 0, 1, 0, 0]   // 6
  ];
  const solutionCount = 2; // [OPTIONAL] limit the number of solutions to fins. Default: [Infinity]
  const secondaryItems = new Set(); // [OPTIONAL] a Set containing column indices to exclude as primary items when running DLX. Default: [new Set()].
  ```
- Main Function
  ``` ts
  const solutions = DLXSolver.solveMatrix(matrix, solutionCount, secondaryItems);
  ```
- Output Variables
  ``` ts
  solutions // an array of Sets. Each Set is a solution, where each digit in the Set is a row index making up that solution.
  ```
- Function Output:
  ``` ts
  console.log(solutions); // [ {0, 4, 3}, {0, 5} ]
  ```

  #### Matrices Secondary Items
  While **Primary** columns must be covered *exactly* once, **Secondary** columns must be covered *at most* once. By default, all columns are primary.
  - Input Variables
    ``` ts
    const matrix: (0 | 1)[][] = [
    // 0  1  2  3      column indices
      [0, 0, 0, 1],
      [1, 1, 0, 0],
      [1, 0, 1, 0],
      [0, 0, 1, 1]
    ];

    const secondaryItems = new Set([1]);
    ```
  - Main Function
    ``` ts
    const solutions = DLXSolver.solveMatrix(matrix, Infinity, secondaryItems);
    ```
  - Function Output
    ``` ts
    solutions.forEach((solution, i) => {
      console.log(`~~~ Solution ${i}:`, solution);
      solution.forEach((v) => {
        console.log(matrix[v]);
      });
    });

    /*
      ~~~ Solution 0: Set(2) { 1, 3 }
      [ 1, 1, 0, 0 ]
      [ 0, 0, 1, 1 ]
      ~~~ Solution 1: Set(2) { 2, 0 }
      [ 1, 0, 1, 0 ]
      [ 0, 0, 0, 1 ]
    */

    // Setting column 1 as a Secondary column allows { 2, 0 } to be a solution.
    ```

### NQueens

- Input Variables:
  ``` ts
  const queenCount = 8; // number of queens, rows, and columns of the board
  const solutionFormat = '_Q'; // formats the output string matrices. The first char represents an empty board tile, the second char represents queen placements
  const solutionCount = 3; // [OPTIONAL] limit the number of solutions to find. Default: [Infinity]
  ```
- Main Function:
  ``` ts
  const {nQueenSolutions, rawExactCoverMatrix} = DLXSolver.solveNQueens(queenCount, solutionFormat, solutionCount);
  ```
- Output Variables:
  ``` ts
  nQueensSolutions // array of string matrices where each matrix is a different solution. Formated with [solutionFormat]
  rawExactCoverMatrix // the raw matrix of 1's and 0's representing the exact cover problem inputed into DLX
  ```
- Function Output:
  ``` ts
  nQueenSolutions.forEach((solution, i) => {
    console.log(`Solution ${i}:`);
    for (const row of solution) {
      console.log(row.join(' '));
    }
  });
  /*
    Solution 0:
    _ _ _ _ _ _ _ Q
    _ _ Q _ _ _ _ _
    Q _ _ _ _ _ _ _
    _ _ _ _ _ Q _ _
    _ Q _ _ _ _ _ _
    _ _ _ _ Q _ _ _
    _ _ _ _ _ _ Q _
    _ _ _ Q _ _ _ _
    Solution 1:
    _ _ _ _ _ _ _ Q
    _ _ _ Q _ _ _ _
    Q _ _ _ _ _ _ _
    _ _ Q _ _ _ _ _
    _ _ _ _ _ Q _ _
    _ Q _ _ _ _ _ _
    _ _ _ _ _ _ Q _
    _ _ _ _ Q _ _ _
    Solution 2:
    _ _ _ _ _ _ _ Q
    _ Q _ _ _ _ _ _
    _ _ _ Q _ _ _ _
    Q _ _ _ _ _ _ _
    _ _ _ _ _ _ Q _
    _ _ _ _ Q _ _ _
    _ _ Q _ _ _ _ _
    _ _ _ _ _ Q _ _
  */

  console.log('Raw Extact Cover Matrix:');
  for (const row of rawExactCoverMatrix) {
    console.log(row.join(''));
  }
  /*
    Raw Extact Cover Matrix:
    000010000000100000000010000000000000000000
    000100000000100000000001000001000000000000
    000001000000100000000000100000100000000000
    001000000000100000000000010000010000000000
    000000100000100000000000001000001000000000
    010000000000100000000000000100000100000000
    000000010000100000000000000010000010000000
    100000000000100000000000000000000001000000
    000010000001000000000100000001000000000000
    000100000001000000000010000000100000000000
    000001000001000000000001000000010000000000
    001000000001000000000000100000001000000000
    000000100001000000000000010000000100000000
    010000000001000000000000001000000010000000
    000000010001000000000000000100000001000000
    100000000001000000000000000010000000100000
    000010000000010000001000000000100000000000
    000100000000010000000100000000010000000000
    000001000000010000000010000000001000000000
    001000000000010000000001000000000100000000
    000000100000010000000000100000000010000000
    010000000000010000000000010000000001000000
    000000010000010000000000001000000000100000
    100000000000010000000000000100000000010000
    000010000010000000010000000000010000000000
    000100000010000000001000000000001000000000
    000001000010000000000100000000000100000000
    001000000010000000000010000000000010000000
    000000100010000000000001000000000001000000
    010000000010000000000000100000000000100000
    000000010010000000000000010000000000010000
    100000000010000000000000001000000000001000
    000010000000001000100000000000001000000000
    000100000000001000010000000000000100000000
    000001000000001000001000000000000010000000
    100000000010000000000000001000000000001000
    000010000000001000100000000000001000000000
    000100000000001000010000000000000100000000
    000001000000001000001000000000000010000000
    000010000000001000100000000000001000000000
    000100000000001000010000000000000100000000
    000001000000001000001000000000000010000000
    000100000000001000010000000000000100000000
    000001000000001000001000000000000010000000
    000001000000001000001000000000000010000000
    001000000000001000000100000000000001000000
    000000100000001000000010000000000000100000
    010000000000001000000001000000000000010000
    000000010000001000000000100000000000001000
    100000000000001000000000010000000000000100
    000010000100000001000000000000000100000000
    000100000100000000100000000000000010000000
    000001000100000000010000000000000001000000
    001000000100000000001000000000000000100000
    000000100100000000000100000000000000010000
    010000000100000000000010000000000000001000
    000000010100000000000001000000000000000100
    100000000100000000000000100000000000000010
    000010000000000110000000000000000010000000
    000100000000000101000000000000000001000000
    000001000000000100100000000000000000100000
    001000000000000100010000000000000000010000
    000000100000000100001000000000000000001000
    010000000000000100000100000000000000000100
    000000010000000100000010000000000000000010
    100000000000000100000001000000000000000001
    000010001000000000000000000000000001000000
    100000000000001000000000010000000000000100
    000010000100000001000000000000000100000000
    000100000100000000100000000000000010000000
    000001000100000000010000000000000001000000
    001000000100000000001000000000000000100000
    000000100100000000000100000000000000010000
    010000000100000000000010000000000000001000
    000000010100000000000001000000000000000100
    100000000100000000000000100000000000000010
    000010000000000110000000000000000010000000
    000100000000000101000000000000000001000000
    000001000000000100100000000000000000100000
    001000000000000100010000000000000000010000
    000000100000000100001000000000000000001000
    010000000000000100000100000000000000000100
    000000010000000100000010000000000000000010
    100000000000000100000001000000000000000001
    000010001000000000000000000000000001000000
    000100000000000101000000000000000001000000
    000001000000000100100000000000000000100000
    001000000000000100010000000000000000010000
    000000100000000100001000000000000000001000
    010000000000000100000100000000000000000100
    000000010000000100000010000000000000000010
    100000000000000100000001000000000000000001
    000010001000000000000000000000000001000000
    000000010000000100000010000000000000000010
    100000000000000100000001000000000000000001
    000010001000000000000000000000000001000000
    100000000000000100000001000000000000000001
    000010001000000000000000000000000001000000
    000100001000000010000000000000000000100000
    000001001000000001000000000000000000010000
    001000001000000000100000000000000000001000
    000100001000000010000000000000000000100000
    000001001000000001000000000000000000010000
    001000001000000000100000000000000000001000
    000001001000000001000000000000000000010000
    001000001000000000100000000000000000001000
    000000101000000000010000000000000000000100
    010000001000000000001000000000000000000010
    000000011000000000000100000000000000000001
    100000001000000000000010000000000000000000
  */
  ```
### Sudoku
  
- Input Variables
  ``` ts
  const sudokuBoard = '008509600760000094000000000000040000090802030800000002070396020009020400030000050' // sudoku puzzle in one of the allowed input formats
  const inputFormat = '111' // format of the inputed sudoku puzzle
  const outputFormat = '111' // format of the outputed solution(s)
  const solutionCount = Infinity // [OPTIONAL] max number of solutions DLX will try to find
  ```
  #### Sudoku Formatting Options

  | Format         | Description                                                                      | Example |
  | -------------- | -------------------------------------------------------------------------------- | ------: |
  | `'111'`        | string of unseperated digits                                                     | `'008509 ...'` |
  | `'1-11'`       | string of character-seperated digits                                             | `'0-0-8-5-0-9- ...'` |
  | `'[1,11]'`     | array of digits in string form                                                   | `[ '0', '0', '8', '5', '0', '9', ... ]` |
  | `'[[1],[11]]'` | 2d array of digits in string form                                                | `[ [ '0', '0', '8', '5', '0', '9', ... ], [ ... ], ... ]`  |
  | `'1B'`         | string where digits greater than 9 are replaced with letters (for 16x16 and up)  | `'00AB709 ...'` |
  | `'AK'`         | string whereall positive integers are replaced with letters (for 16x16 and up)   | `'BA0JL00 ...'` |

- Main Function
  ``` ts
  const { sudokuSolutions, rawExactCoverMatrix } = DLXSolver.solveSudoku(sudokuBoard, inputFormat, outputFormat, solutionCount);
  ```
- Output Variables
  ``` ts
  sudokuSolutinos // array of sudoku solutions where each solution is in the format specified by [outputFormat]
  rawExactCoverMatrix // the raw matrix of 1's and 0's representing the exact cover problem inputed into DLX
  ```
- Function Output
  ``` ts
  console.log('Solutions Found (up to solution limit):', sudokuSolutions.length);
  for (const solution of sudokuSolutions) {
    console.log(solution);
  }

  /*
  Solutions Found (up to solution limit): 1
  248539617765218394913467285326941578497852136851673942574396821189725463632184759
  */
  ```