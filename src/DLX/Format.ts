import { SudokuFormat } from "../types/FormatTypes";

class Format {
  lettersConversion: Set<string>;
  digits: Set<string>;
  constructor() {
    this.lettersConversion = new Set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    this.digits = new Set('0123456789'.split(''));
  }

  // converts different sudoku board input formats into a dashed-seperated string of digits
  sudokuInput = (sudoku: any, format: SudokuFormat): string => {
    switch (format) {
      case '1-11': // '7-0-4-9-2 ...'
        if (typeof(sudoku) !== typeof('')) throw Error('The input format is incorrect.');
        const newSudoku: string[] = sudoku.split('');
        for (let i = 0; i < newSudoku.length; i++) {
          if (!this.digits.has(newSudoku[i])) newSudoku[i] = '-';
        }
        return newSudoku.join('');

      case '111': // '783495038470003 ...'
        if (typeof(sudoku) !== typeof('')) throw Error('The input does not match format.');
        return sudoku.split('').join('-');

      case '[1,11]': // [9, 3, 0, 0, 2, 8, ...]
        if (typeof(sudoku) !== typeof([])) throw Error('The input does not match format.');
        return sudoku.join('-');

      case '[[1],[11]]': // [[8, 0, ...], [1, 0, ...], ...]
        if (typeof(sudoku) !== typeof([])) throw Error('The input does not match format.'); 
        const formatedSudokuMatrix: string[] = [];
        for (const row of sudoku) {
          formatedSudokuMatrix.push(row.join('-'));
        }
        return formatedSudokuMatrix.join('');

      case '1B': // '9L8CD000 ...'
        if (typeof(sudoku) !== typeof('')) throw Error('The input does not match format.');
        const formatedDoubleSudoku: string[] = [];
        for (const double of sudoku) {
          if (+double) {
            formatedDoubleSudoku.push(double);
            continue;
          };
          if (this.lettersConversion.has(double)) {
            formatedDoubleSudoku.push(`${double.toLowerCase().charCodeAt(0) - 87}`);
            continue;
          }
          formatedDoubleSudoku.push('0');
        }
        return formatedDoubleSudoku.join('-');

      case 'AK': // 'ADFCB..L ...'
        if (typeof(sudoku) !== typeof('')) throw Error('The input does not match the format.');
        const formatedLettersSudoku: string[] = [];
        for (const letter of sudoku) {
          if (this.lettersConversion.has(letter)) {
            formatedLettersSudoku.push(`${letter.toLowerCase().charCodeAt(0) - 96}`);
            continue;
          }
          formatedLettersSudoku.push('0');
        }
        return formatedLettersSudoku.join('-');

      default: 
        throw Error('The format type does not exist.');
    }
  }

  // converts a dash-seperated sudoku solution into desired output format
  sudokuOutput = (sudokuSolutions: Set<number>[], format: SudokuFormat) => {
    const formatedSudokuSolutions: (string | string[] | string[][])[] = [];
    const n = Math.sqrt(sudokuSolutions[0].size);
    for (const solution of sudokuSolutions) {
      const sudokuSolution: string[] = new Array(n**2);
      for (const option of solution) {
        const i = Math.floor(option/n);
        sudokuSolution[i] = option%n + 1 + '';
      }
      switch (format) {
        case '1-11': // '7-0-4-9-2 ...'
          formatedSudokuSolutions.push(sudokuSolution.join('-'));
          break;

        case '111': // '783495038470003 ...'
          formatedSudokuSolutions.push(sudokuSolution.join(''));
          break;

        case '[1,11]': // [9, 3, 0, 0, 2, 8, ...]
          formatedSudokuSolutions.push(sudokuSolution);
          break;

        case '[[1],[11]]': // [[8, 0, ...], [1, 0, ...], ...]
          const matrixRes: string[][] = [];
          for (let i = 0; i < n; i++) {
            const temp: string[] = [];
            for (let j = 0; j < n; j++) {
              temp.push(sudokuSolution[i*n + j]);
            }
            matrixRes.push(temp);
          }
          formatedSudokuSolutions.push(matrixRes);
          break;

        case '1B': // '9L8CD000 ...'
          const doubleDigitLetterRes: string[] = [];
          for (const digit of sudokuSolution) {
            doubleDigitLetterRes.push(this.digits.has(digit) ? digit : String.fromCharCode(+digit + 55));
          }
          formatedSudokuSolutions.push(doubleDigitLetterRes.join(''));
          break;

        case 'AK': // 'ADFCB..L ...'
          const lettersOnlyRes: string[] = [];
          for (const digit of sudokuSolution) {
            lettersOnlyRes.push(+digit ? String.fromCharCode(+digit + 64) : digit);
          }
          formatedSudokuSolutions.push(lettersOnlyRes.join(''));
          break;

        default: 
          throw Error('The format type does not exist.');
      }
    }
    return formatedSudokuSolutions;
  }
}

export default Format;