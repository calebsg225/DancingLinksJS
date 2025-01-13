import { SudokuFormat } from "./FormatTypes";

type Options = {
	solutionCount?: number,
}

type MatrixOptions extends Options = {
	secondaryItems?: Set<number>,
}

type NQueensOptions extends Options = {
	solutionFormat?: string,
}

type SudokuOptions extends Options = {
	inputFormat?: SudokuFormat,
	outputFormat?: SudokuFormat,
}

export { MatrixOptions, NQueensOptions, SudokuOptions }
