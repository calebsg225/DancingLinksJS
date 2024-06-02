import { FirstNode, ItemNode, SpacerNode, HeaderNode, NodeTypes } from "../type/NodeTypes";

class Convert {

  // converts matrix of 1's and 0's to dlx data structure
  // primary items MUST be put to the far left
  fromMatrix = (matrix: (0|1)[][], secondaryItems: number[] = []): NodeTypes[] => {
    if (!this.verifyMatrix(matrix)) return [];
    
    const colCount = matrix[0].length; // number of columns in the initial matrix
    const rowCount = matrix.length; // number of rows in the initial matrix
    
    const nodes: NodeTypes[] = [];
    
    // create [first] [spacer] node
    nodes.push(new FirstNode(1, colCount));
    
    // create set of all secondary items
    const secItSet = new Set(secondaryItems);
    
    // create [header] nodes, each pointing to themselves in the up and down direction
    for (let i = 1; i <= colCount; i++) {
      const leftNode = secItSet.has(i) ? i : i-1;
      const rightNode = secItSet.has(i) ? i : (i === colCount ? 0 : i+1);
      nodes.push(new HeaderNode(leftNode, rightNode, i, i));
    }

    if (secondaryItems.length) {
      nodes[secondaryItems[0] - 1].rightNode = 0;
      nodes[0].leftNode = secondaryItems[0] - 1;
    }
    
    let prevSpacer = 0; // keep track of the index of the previous spacer, 0 if previous doesn't exist
    
    // create the rest of the relevant nodes, i.e. [spacer] and [item] nodes
    for (let i = 0; i < rowCount; i++) {
      // create new [spacer] node, up pointer pointing to first [item] in the previous row, if it exists
      nodes.push(new SpacerNode(prevSpacer ? prevSpacer + 1 : nodes.length, nodes.length));
      const spacerIndex = nodes.length - 1;
      
      // create ItemNodes belonging to option row
      for (let j = 0; j < colCount; j++) {
        if (!matrix[i][j]) continue; // skip if value is 0
        nodes[spacerIndex].downNode = nodes.length; // update [spacer] down pointer
        
        nodes[nodes[j+1].upNode].downNode = nodes.length; // update [header] down pointer
        
        nodes.push(new ItemNode(j+1, i, nodes[j+1].upNode, j+1)); // add new [item] node to nodes array
        
        nodes[j+1].columnCount++; // increase [header] column count
        nodes[j+1].upNode = nodes.length - 1; // update [header] up pointer
      }
      
      prevSpacer = spacerIndex;
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
  
  fromNQueens = (queenCount: number): { matrix: (1|0)[][], converted: NodeTypes[] } => {
    if (queenCount < 1) return { matrix: [], converted: [] }
    const nQueenMatrix: (0|1)[][] = [];

    const diagCount = 2*queenCount - 3;

    for (let row = 0; row < queenCount; row++) {
      for (let col = 0; col < queenCount; col++) {
        const temp = new Array(2*queenCount + 2*diagCount).fill(0);
        const lDiag = col - row + queenCount - 2; // \
        const rDiag = col + row - 1; // /
        temp[col] = 1;
        temp[queenCount + row] = 1;
        if (lDiag >= 0 && lDiag < diagCount) temp[2*queenCount + lDiag] = 1;
        if (rDiag >= 0 && rDiag < diagCount) temp[2* queenCount + diagCount + rDiag] = 1;

        nQueenMatrix.push(temp);
      }
    }

    const secondaryItems = [];
    for (let i = 2*queenCount + 1; i <= nQueenMatrix[0].length; i++) secondaryItems.push(i);

    const converted = this.fromMatrix(nQueenMatrix, secondaryItems);

    return { matrix: nQueenMatrix, converted: converted };

  }

  toNQueens = (solutions: Set<number>[]) => {
    const nQueensSolutions = [];

    if (!solutions.length) return [];

    const queenCount = solutions[0].size;

    for (const solution of solutions) {
      const temp = Array.from(Array(queenCount), () => new Array(queenCount).fill(0));
      solution.forEach(v => {
        const col = v%queenCount;
        const row = (v-col)/queenCount;
        temp[row][col] = 1;
      });
      nQueensSolutions.push(temp);
    }

    return nQueensSolutions;
  }

  // converts sudoku board in the form of a string consisting of chars 1-9 as well as any spacers
  // string.length === n^4, 2 <= n <= 5
  fromSudokuString = (sudokuBoard: string): { matrix: (0|1)[][], converted: NodeTypes[] } => {
    const sudokuMatrix: (0|1)[][] = [];

    const n = Math.sqrt(sudokuBoard.length);
    const t = Math.sqrt(n);

    const digits = new Set();
    for (let i = 1; i <= n; i++) digits.add(i);

    for (let i = 0; i < sudokuBoard.length; i++) {
      const char = sudokuBoard[i];
      if (digits.has(char)) {
        sudokuMatrix.push(this.sudokuCreateRow(n, t, +char, i));
      } else {
        for (let j = 1; j <= n; j++) {
          sudokuMatrix.push(this.sudokuCreateRow(n, t, j, i));
        }
      }
    }
    return { matrix: sudokuMatrix, converted: this.fromMatrix(sudokuMatrix)};
  }

  private sudokuCreateRow = (n: number, t: number, digit: number, i: number): (0|1)[] => {
    const res = new Array(n**2 * 4).fill(0);
    const col = i%n;
    const row = (i - col) / n;
    res[i] = 1;
    res[n**2 + row*n + digit - 1] = 1;
    res[2 * n**2 + col*n + digit - 1] = 1;
    res[3 * n**2 + Math.floor(col/t) * n + Math.floor(row/t) * n*t + digit - 1] = 1;
    return res;
  }

  // converts sudoku board in the form of a matrix of digits 0-9
  // row.count === col.count, row.count === n^2, 2 <= n <= 5
  fromSudokuMatrix = (sudokuBoard: number[][]) => {}

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

}

export default new Convert;