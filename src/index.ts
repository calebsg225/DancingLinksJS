import DancingLinks from "./DLX/DLX";
import Convert from "./DLX/Convert";
import Format from "./DLX/Format";
import { SudokuFormat } from "./types/FormatTypes";

class DLXSolver {
  private DLX: DancingLinks;
  private Convert: Convert;
  private Format: Format;

  constructor() {
    this.DLX = new DancingLinks();
    this.Convert = new Convert();
    this.Format = new Format();
  }

  solveMatrix = (matrix: (0 | 1)[][], solutionCount: number = Infinity, secondaryItems: Set<number> = new Set()) => {
    const converted = this.Convert.fromMatrix(matrix, secondaryItems);
    const solutions = this.DLX.find(converted, solutionCount);
    return solutions;
  }

  solveNQueens = (queenCount: number, solutionFormat: string, solutionCount: number = Infinity) => {
    if (solutionFormat.length !== 2) throw new Error(`DLXSolver.solveNQueens(solutionFormat): solutionFormat must be 2 characters long`);
    const { matrix, converted } = this.Convert.fromNQueens3(queenCount);
    const solutions = this.DLX.find(converted, solutionCount);
    const nQueenSolutions = this.Convert.toNQueens(solutions, solutionFormat);
    return { nQueenSolutions, rawExactCoverMatrix: matrix };
  }

  solveSudoku = (sudokuBoard: any, inputFormat: SudokuFormat, outputFormat: SudokuFormat ,solutionCount: number = Infinity) => {
    const formatedSudokuBoard = this.Format.sudokuInput(sudokuBoard, inputFormat);
    const { matrix, converted } = this.Convert.fromSudoku(formatedSudokuBoard);
    const solutions = this.DLX.find(converted, solutionCount);
    const sudokuSolutions = this.Format.sudokuOutput(solutions, outputFormat)
    return { sudokuSolutions, rawExactCoverMatrix: matrix };
  }
  
}

export default new DLXSolver;