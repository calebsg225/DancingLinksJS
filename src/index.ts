import DancingLinks from "./DLX/DLX";
import Convert from "./DLX/Convert";
import Format from "./DLX/Format";
import { MatrixOptions, NQueensOptions, SudokuOptions } from "./types/OptionTypes";

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
   * @param options MatrixOptions
   * @returns an array of Sets. Each Set is a solution, where each digit in the set is a row index making up that solution
   */
  solveMatrix = (
	  matrix: (0 | 1)[][], 
	  {
		maxSolutionCount = 1,
		secondaryItems = new Set(),
	  }: MatrixOptions = {}
  ) => {
    const converted = this.Convert.fromMatrix(matrix, secondaryItems);
    const solutions = this.DLX.find(converted, maxSolutionCount);
    return solutions;
  }

  /**
   * 
   * @param queenCount number of queens, rows, and columns of the board
   * @param options NQueensOptions
   * @returns an array of string matrices where each matrix is a different solution formated with solutionFormat
   * @returns the raw matrix of 1's and 0's representing the exact cover problem inputed into DLX
   */ 
   solveNQueens = (
	  queenCount: number, 
	  {
		  maxSolutionCount = 2,
		  solutionFormat = ".Q",
	  }: NQueensOptions = {}
  ) => {
	console.log(solutionFormat, "foofoo");
    if (solutionFormat.length !== 2) throw new Error(`DLXSolver.solveNQueens(solutionFormat): solutionFormat must be 2 characters long`);
    const { matrix, converted } = this.Convert.fromNQueens3(queenCount);
    const solutions = this.DLX.find(converted, maxSolutionCount);
    const nQueenSolutions = this.Convert.toNQueens(solutions, solutionFormat);
    return { nQueenSolutions, rawExactCoverMatrix: matrix };
  }

  /**
   * 
   * @param sudokuBoard sudoku puzzle in one of the allowed input formats
   * @param options SudokuOptions
   * @returns array of sudoku solutionswhere each solution is in the format specified by outputFormat
   * @returns the raw matrix of 1's and 0's representing the exact cover problem inputed into DLX
   */
  solveSudoku = (
	  sudokuBoard: any, 
	  {
		  inputFormat = "111",
		  outputFormat = "111",
		  maxSolutionCount = 1,
	  }: SudokuOptions = {}
  ) => {
    const formatedSudokuBoard = this.Format.sudokuInput(sudokuBoard, inputFormat);
    const { matrix, converted } = this.Convert.fromSudoku(formatedSudokuBoard);
    const solutions = this.DLX.find(converted, maxSolutionCount);
    const sudokuSolutions = this.Format.sudokuOutput(solutions, outputFormat)
    return { sudokuSolutions, rawExactCoverMatrix: matrix };
  }
  
}

export default new DLXSolver;
