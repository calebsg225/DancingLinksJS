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

  /**
   * 
   * @param matrix 2d array of 1's and 0's
   * @param solutionCount limit the number of solutions to find (up to Infinity)
   * @param secondaryItems a Set containing column indices to exclude as primary items when running DLX
   * @returns an array of Sets. Each Set is a solution, where each digit in the set is a row index making up that solution
   */
  solveMatrix = (matrix: (0 | 1)[][], solutionCount: number = Infinity, secondaryItems: Set<number> = new Set()) => {
    const converted = this.Convert.fromMatrix(matrix, secondaryItems);
    const solutions = this.DLX.find(converted, solutionCount);
    return solutions;
  }

  /**
   * 
   * @param queenCount number of queens, rows, and columns of the board
   * @param solutionFormat formats the output string matrices. The first char represents an empty board tile, the second char represents queen placements
   * @param solutionCount limit the number of solutions to find (up to Infinity)
   * @returns an array of string matrices where each matrix is a different solution formated with solutionFormat
   * @returns the raw matrix of 1's and 0's representing the exact cover problem inputed into DLX
   */
  solveNQueens = (queenCount: number, solutionFormat: string, solutionCount: number = Infinity) => {
    if (solutionFormat.length !== 2) throw new Error(`DLXSolver.solveNQueens(solutionFormat): solutionFormat must be 2 characters long`);
    const { matrix, converted } = this.Convert.fromNQueens3(queenCount);
    const solutions = this.DLX.find(converted, solutionCount);
    const nQueenSolutions = this.Convert.toNQueens(solutions, solutionFormat);
    return { nQueenSolutions, rawExactCoverMatrix: matrix };
  }

  /**
   * 
   * @param sudokuBoard sudoku puzzle in one of the allowed input formats
   * @param inputFormat format of the inputed sudoku puzzle
   * @param outputFormat desired format of the outputed solution(s)
   * @param solutionCount max number of solutions DLX will try to find (up to Infinity)
   * @returns array of sudoku solutionswhere each solution is in the format specified by outputFormat
   * @returns the raw matrix of 1's and 0's representing the exact cover problem inputed into DLX
   */
  solveSudoku = (sudokuBoard: any, inputFormat: SudokuFormat, outputFormat: SudokuFormat ,solutionCount: number = Infinity) => {
    const formatedSudokuBoard = this.Format.sudokuInput(sudokuBoard, inputFormat);
    const { matrix, converted } = this.Convert.fromSudoku(formatedSudokuBoard);
    const solutions = this.DLX.find(converted, solutionCount);
    const sudokuSolutions = this.Format.sudokuOutput(solutions, outputFormat)
    return { sudokuSolutions, rawExactCoverMatrix: matrix };
  }
  
}

export default new DLXSolver;