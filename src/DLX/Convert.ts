import { FirstNode, ItemNode, SpacerNode, HeaderNode, NodeTypes } from "../type/NodeTypes";

class Convert {

  // converts matrix of 1's and 0's to dlx data structure
  fromMatrix = (matrix: (0|1)[][], secondaryItems: Set<number> = new Set()): NodeTypes[] => {
    if (!this.verifyMatrix(matrix)) return [];
    const itemCount = matrix[0].length; // number of columns in the initial matrix
    const optionCount = matrix.length; // number of rows in the initial matrix
    const nodes: NodeTypes[] = [];
    // create [first] [spacer] node pointing to itself
    nodes.push(new FirstNode(0, 0));

    let prevHeader = 0;

    // create all [header] nodes
    // primary nodes point to the previous node on the left, 0 on the right until changed
    // secondary nodes point to themselves
    for (let i = 1; i <= itemCount; i++) {
      if (secondaryItems.has(i-1)) {
        nodes.push(new HeaderNode(i, i, i, i));
        continue;
      }
      nodes[prevHeader].rightNode = i;
      nodes.push(new  HeaderNode(prevHeader, 0, i, i));
      prevHeader = i;
    }
    // make sure the [first] node points to the last primary [header] node
    nodes[0].leftNode = prevHeader;
    
    let prevSpacer = 0;
    
    // create the rest of the relevant nodes, ([spacer] and [item] nodes)
    for (let i = 0; i < optionCount; i++) {
      // create new [spacer] node, up pointer pointing to first [item] in the previous row, if it exists
      nodes.push(new SpacerNode(prevSpacer ? prevSpacer + 1 : nodes.length, nodes.length));
      prevSpacer = nodes.length - 1;
      // create ItemNodes belonging to option row
      for (let j = 0; j < itemCount; j++) {
        if (matrix[i][j] !== 1) continue; // skip if value is not a 1
        nodes[nodes[j+1].upNode].downNode = nodes.length; // update [header] down pointer
        nodes.push(new ItemNode(j+1, i, nodes[j+1].upNode, j+1)); // add new [item] node to nodes array
        nodes[j+1].columnCount++; // increase [header] column count
        nodes[j+1].upNode = nodes.length - 1; // update [header] up pointer
      }
      nodes[prevSpacer].downNode = nodes.length - 1; // update [spacer] down pointer to last [item] node in previous option
    }
    nodes.push(new SpacerNode(prevSpacer+1, nodes.length)); // create final [spacer] node to complete final loop of the last row
    
    return nodes;
  }

  // converts langford pair (n) to dlx data structure
  fromLangfordPairs = (n: number): { matrix: (1|0)[][], converted: NodeTypes[] } => {
    if (n <= 1) return { matrix: [], converted: [] };
    const langfordMatrix: (0|1)[][] = [];

    for (let i = 1; i <= n; i++) {
      for (let j = 0; j < 2*n - i - 1; j++) {
        const temp = new Array(3*n).fill(0);
        temp[j] = 1;
        temp[j + i + 1] = 1;
        temp[2*n + i - 1] = 1;
        langfordMatrix.push(temp);
      }
    }

    return { matrix: langfordMatrix, converted: this.fromMatrix(langfordMatrix) };
  }

  toLangfordPairs = (matrix: (0|1)[][], solutions: Set<number>[]) => {
    const langfordPairLength = matrix[0].length * (2/3);

    const langfordPairs: number[][] = [];

    for (const solution of solutions) {
      const langfordPair = new Array(langfordPairLength);

      solution.forEach(v => {
        let leftIndex = 0;
        let rightIndex = 0;
        while (leftIndex < langfordPairLength) {
          if (matrix[v][leftIndex]) {
            rightIndex++;
            while (!matrix[v][rightIndex]) {
              rightIndex++;
            }
            break;
          }
          leftIndex++;
          rightIndex++;
        }
        const dist = rightIndex - leftIndex - 1;
        langfordPair[leftIndex] = dist;
        langfordPair[rightIndex] = dist;
      });

      langfordPairs.push(langfordPair);

    }
    return langfordPairs;
  }

  // 'organ-pipe' order
  // converts directly to NodeTypes[]
  fromNQueens3 = (queenCount: number) => {
    if (queenCount < 1) return { matrix: [], converted: [] }
    const itemCount = (queenCount === 1 ? 2 : queenCount*6 - 6); // number of items in the initial matrix
    const nQueenMatrix: (0|1)[][] = [];
    const nodes: NodeTypes[] = [];
    
    // create [first] [spacer] node pointing to itself
    nodes.push(new FirstNode(0, 0));

    // create all [header] nodes
    // primary nodes point to the previous node on the left, 0 on the right until changed
    // secondary nodes point to themselves
    let prevHeader = 0;
    for (let i = 1; i <= itemCount; i++) {
      if (i > queenCount*2) {
        nodes.push(new HeaderNode(i, i, i, i));
        continue;
      }
      nodes[prevHeader].rightNode = i;
      nodes.push(new  HeaderNode(prevHeader, 0, i, i));
      prevHeader = i;
    }
    // make the [first] node points to the last primary [header] node
    nodes[0].leftNode = prevHeader;

    let prevSpacer = 0;

    // creating variables for convenience
    const half = Math.floor(queenCount/2);
    const diagCount = 2*queenCount - 3;

    for (let row = 0; row < queenCount; row++) {
      for (let col = 0; col < queenCount; col++) {
        const temp = new Array(2*queenCount + 2*diagCount).fill(0);
        // create new [spacer] node, up pointer pointing to first [item] in the previous row, if it exists
        nodes.push(new SpacerNode(prevSpacer ? prevSpacer + 1 : nodes.length, nodes.length));
        prevSpacer = nodes.length - 1;

        const index = row*queenCount + col;
        
        const row2 = half + Math.floor((row+1)/2) * (row%2 ? -1 : 1);
        const col2 = half + Math.floor((col+1)/2) * (col%2 ? -1 : 1);
        const lDiag = col - row + queenCount - 2; // \
        const rDiag = col + row - 1; // /
        
        // add primary [item] nodes
        for (const j of [col2+1, queenCount + row2+1]) {
          temp[j-1] = 1;
          nodes[nodes[j].upNode].downNode = nodes.length;
          nodes.push(new ItemNode(j, index, nodes[j].upNode, j));
          nodes[j].columnCount++;
          nodes[j].upNode = nodes.length - 1;
        }
        // add secondary [item] nodes
        for (const j of [{diag: lDiag, ind: 2*queenCount + lDiag + 1}, {diag: rDiag, ind: 2*queenCount + diagCount + rDiag + 1}]) {
          if (j.diag >= 0 && j.diag < diagCount) {
            temp[j.ind - 1] = 1;
            nodes[nodes[j.ind].upNode].downNode = nodes.length;         
            nodes.push(new ItemNode(j.ind, index, nodes[j.ind].upNode, j.ind))
            nodes[j.ind].columnCount++;
            nodes[j.ind].upNode = nodes.length - 1;
          };
        }
        nodes[prevSpacer].downNode = nodes.length - 1; // update [spacer] down pointer to last [item] node in previous option
        nQueenMatrix.push(temp);
      }
    }
    nodes.push(new SpacerNode(prevSpacer+1, nodes.length)); // create final [spacer] node to complete final loop of the last row

    return { matrix: nQueenMatrix, converted: nodes };
  }

  toNQueens = (solutions: Set<number>[], format: string) => {
    const nQueensSolutions: string[][][] = [];

    if (!solutions.length) return [];

    const queenCount = solutions[0].size;

    for (const solution of solutions) {
      const temp: string[][] = Array.from(Array(queenCount), () => new Array(queenCount).fill(format[0]));
      solution.forEach(v => {
        const col = v%queenCount;
        const row = (v-col)/queenCount;
        temp[row][col] = format[1];
      });
      nQueensSolutions.push(temp);
    }

    return nQueensSolutions;
  }

  // converts sudoku board from a string of dash-seperated integers to NodeTypes[]
  // string.length === n^4, 2 <= n <= 5
  fromSudoku = (sudokuBoard: string): { matrix: (0|1)[][], converted: NodeTypes[] } => {

    const sudokuCreateRow = (n: number, t: number, digit: number, i: number): (0|1)[] => {
      const res = new Array(n**2 * 4).fill(0);
      const col = i%n;
      const row = (i - col) / n;
      const indexArr: number[] = [
        i, // box index
        n**2 + row*n + digit - 1, // row index
        2 * n**2 + col*n + digit - 1, // col index
        3 * n**2 + Math.floor(col/t) * n + Math.floor(row/t) * n*t + digit - 1 // block index
      ];
      for (const index of indexArr) {
        // set exact cover matrix digits
        res[index] = 1;

        // set nodeTypes[] digits
        nodes[nodes[index+1].upNode].downNode = nodes.length; // update [header] down pointer
        nodes.push(new ItemNode(index+1, sudokuMatrix.length, nodes[index+1].upNode, index+1)); // add new [item] node
        nodes[index+1].columnCount++; // increase [header] column count
        nodes[index+1].upNode = nodes.length - 1; // update [header] up pointer
      }
      return res;
    }

    const sudokuMatrix: (0|1)[][] = [];

    const sudokuBoardArr = sudokuBoard.split('-');
    const n = Math.sqrt(sudokuBoardArr.length);
    const t = Math.sqrt(n);
    // TODO: error check here

    const nodes: NodeTypes[] = [];

    // create [first] [spacer] node pointing to itself
    nodes.push(new FirstNode(0, 0));

    const digits = new Set();

    let prevHeader = 0;

    // create all [header] nodes, all primary
    for (let i = 1; i <= n**2 * 4; i++) {
      nodes[prevHeader].rightNode = i;
      nodes.push(new HeaderNode(prevHeader, 0, i, i));
      prevHeader = i;
      if (i <= n) digits.add(i); // also create set of allowed digits in the same loop
    }
    // make the [first] node points to the last primary [header] node
    nodes[0].leftNode = prevHeader;

    let prevSpacer = 0;

    for (let i = 0; i < sudokuBoardArr.length; i++) {
      const char = sudokuBoardArr[i];
      if (+char && digits.has(+char)) {
        // char is a valid digit
        for  (let j = 1; j <= n; j++) {
          // the row to add 1's to depends on the digit
          // create new [spacer] node
          nodes.push(new SpacerNode(prevSpacer ? prevSpacer + 1 : nodes.length, nodes.length));
          prevSpacer = nodes.length - 1;
          if (+char === j) {
            sudokuMatrix.push(sudokuCreateRow(n, t, +char, i));
          }
          else {
            sudokuMatrix.push(new Array(n**2 * 4).fill(0));
          };
          nodes[prevSpacer].downNode = nodes.length - 1; // update [spacer] down pointer to last [item] node in previous option
        }
      } else {
        // char is not a valid digit, therefore it is considered blank
        for (let j = 1; j <= n; j++) {
          // create new [spacer] node
          nodes.push(new SpacerNode(prevSpacer ? prevSpacer + 1 : nodes.length, nodes.length));
          prevSpacer = nodes.length - 1;
          sudokuMatrix.push(sudokuCreateRow(n, t, j, i));
          nodes[prevSpacer].downNode = nodes.length - 1; // update [spacer] down pointer to last [item] node in previous option
        }
      }
    }
    nodes.push(new SpacerNode(prevSpacer+1, nodes.length)); // create final [spacer] node

    return { matrix: sudokuMatrix, converted: nodes};
  }

  // TODO: make more format-friendly
  toSudoku = (solutions: Set<number>[]) => {
    if (!solutions.length) return [];
    const sudokuSolutions: string[] = [];
    const n = Math.sqrt(solutions[0].size);

    for (const solution of solutions) {
      const sudokuSolution = new Array(n**2);
      for (const option of solution) {
        const i = Math.floor(option/n);
        sudokuSolution[i] = option%n + 1;
      }
      sudokuSolutions.push(sudokuSolution.join('-'));
    }

    return sudokuSolutions;
  }

  private verifySudokuString = (sudokuBoardString: string) => {}

  private verifySudokuMatrix = (sudokuBoardMatrix: number[][]) => {}

  private verifyMatrix = (matrix: (0|1)[][]): boolean => {
    if (!matrix.length) return false;
    const control = matrix[0].length;
    for (const row of matrix) {
      if (row.length !== control) {return false}
    }
    return true;
  }

  verifySudokuSolution = (rawPuzzle: string): boolean => {
    const puzzle = rawPuzzle.split('-');
    const n = Math.sqrt(puzzle.length);
    const t = Math.sqrt(n);

    const rows = Array.from(Array(n), () => new Set<number>());
    const cols = Array.from(Array(n), () => new Set<number>());
    const grids = Array.from(Array(n), () => new Set<number>());

    for (let i = 0; i < puzzle.length; i++) {
      // if any digit is 0, the puzzle is not solved
      if (!puzzle[i].length) return false

      const col = i%n;
      const row = (i-col)/n;
      const grid = t*Math.floor(row/t) + Math.floor(col/t);

      // checks to see that new digit is unique in its row, column, and subgrid
      if (rows[row].size === rows[row].add(+puzzle[i]).size) return false;
      if (cols[col].size === cols[col].add(+puzzle[i]).size) return false;
      if (grids[grid].size === grids[grid].add(+puzzle[i]).size) return false;
    }

    return true;
  }

}

export default Convert;