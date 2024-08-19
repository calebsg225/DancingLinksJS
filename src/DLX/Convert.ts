import { FirstNode, ItemNode, SpacerNode, HeaderNode, NodeTypes } from "../type/NodeTypes";

class Convert {

  // converts matrix of 1's and 0's to dlx data structure
  // primary items MUST be put to the far left
  fromMatrix = (matrix: (0|1)[][], secondaryItems: Set<number> = new Set()): NodeTypes[] => {
    if (!this.verifyMatrix(matrix)) return [];
    const itemCount = matrix[0].length; // number of columns in the initial matrix
    const optionCount = matrix.length; // number of rows in the initial matrix
    const nodes: NodeTypes[] = [];
    // create [first] [spacer] node pointing to itself
    nodes.push(new FirstNode(0, 0));
    // create set of all secondary items

    let prevHeader = 0;

    // create all [header] nodes
    // primary nodes point to the previous node on the left, 0 on the right until changed
    // secondary nodes point to themselves
    for (let i = 1; i <= itemCount; i++) {
      if (secondaryItems.has(i)) {
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

    const secondaryItems: Set<number> = new Set();
    for (let i = 2*queenCount + 1; i <= nQueenMatrix[0].length; i++) secondaryItems.add(i);

    const converted = this.fromMatrix(nQueenMatrix, secondaryItems);

    return { matrix: nQueenMatrix, converted: converted };

  }

  // generate rows and columns using 'organ-pipe' order for primary items
  // results a noticeable speed increase for larger queen count values
  fromNQueens2 = (queenCount: number) => {
    if (queenCount < 1) return { matrix: [], converted: [] }
    const nQueenMatrix: (0|1)[][] = [];

    const half = Math.floor(queenCount/2);
    const diagCount = 2*queenCount - 3;

    for (let row = 0; row < queenCount; row++) {
      for (let col = 0; col < queenCount; col++) {
        const row2 = half + (row%2 ? -Math.floor((row+1)/2) : Math.floor((row+1)/2));
        const col2 = half + (col%2 ? -Math.floor((col+1)/2) : Math.floor((col+1)/2));
        const temp = new Array(2*queenCount + 2*diagCount).fill(0);
        const lDiag = col - row + queenCount - 2; // \
        const rDiag = col + row - 1; // /
        temp[col2] = 1;
        temp[queenCount + row2] = 1;
        if (lDiag >= 0 && lDiag < diagCount) temp[2*queenCount + lDiag] = 1;
        if (rDiag >= 0 && rDiag < diagCount) temp[2* queenCount + diagCount + rDiag] = 1;

        nQueenMatrix.push(temp);
      }
    }

    const secondaryItems: Set<number> = new Set();
    for (let i = 2*queenCount + 1; i <= nQueenMatrix[0].length; i++) secondaryItems.add(i);

    const converted = this.fromMatrix(nQueenMatrix, secondaryItems);

    return { matrix: nQueenMatrix, converted: converted };
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
      if (digits.has(+char)) {
        for  (let j = 1; j <= n; j++) {
          if (+char === j) sudokuMatrix.push(this.sudokuCreateRow(n, t, +char, i));
          else sudokuMatrix.push(new Array(n**2 * 4).fill(0));
        }
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
      sudokuSolutions.push(sudokuSolution.join(''));
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

}

export default Convert;