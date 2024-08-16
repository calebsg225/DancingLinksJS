import Convert from "./DLX/Convert";
import DancingLinks from "./DLX/DLX";

class DLXSolver {
  DLX: DancingLinks;
  Convert: Convert
  constructor() {
    this.DLX = new DancingLinks();
    this.Convert = new Convert();
  }

  solveMatrix = (matrix: (0 | 1)[][], solutionCount: number = Infinity, secondaryItems: Set<number> = new Set()) => {
    const converted = this.Convert.fromMatrix(matrix, secondaryItems);
    const solutions = this.DLX.find(converted, solutionCount);
    return solutions;
  }

  solveNQueens = (queenCount: number, solutionFormat: ('.Q' | '01'), solutionCount: number = Infinity) => {
    const { matrix, converted } = this.Convert.fromNQueens3(queenCount);
    const solutions = this.DLX.find(converted, solutionCount);
    const nQueenSolutions = this.Convert.toNQueens(solutions, solutionFormat);
    return { nQueenSolutions, rawExactCoverMatrix: matrix };
  }
  
}

export default new DLXSolver;