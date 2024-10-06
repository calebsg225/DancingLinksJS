import { SudokuInputFormat } from "../types/FormatTypes";

/* 
type SudokuInputFormat = (
  'char-seperated digits string' | // '3-7-3-0-0' ...
  'digits string' | // '8734000' ...
  'digits array' | // [8, 3, 4, 3] ...
  'digits matrix' | // [[2, 5, 4], [0, 6, 0]] ...
  'hexa-converted string' | // '6-5FGS-04' ...
  'letters-only string' // 'SDMBNL---HG-' ...
);
*/

class Format {

  // converts different sudoku board input formats into a dashed-seperated string of digits
  sudoku = (sudoku: any, format: SudokuInputFormat): string => {
    switch (format) {
      case 'char-seperated digits string':
        if (typeof(sudoku) !== typeof('')) throw Error('The input format is incorrect.');
        const newSudoku: string[] = sudoku.split('');
        const digits = new Set('0123456789'.split(''));
        for (let i = 0; i < newSudoku.length; i++) {
          if (!digits.has(newSudoku[i])) newSudoku[i] = '-';
        }
        return newSudoku.join('');
      case 'digits string':
        if (typeof(sudoku) !== typeof('')) throw Error('The input format is incorrect.');
        return sudoku.split('').join('-');
      case 'digits array': 
        if (typeof(sudoku) !== typeof([])) throw Error('The input format is incorrect.');
        return sudoku.join('-');
      case 'digits matrix':
        if (typeof(sudoku) !== typeof([])) throw Error('The input format is incorrect.'); 
        const sudokuMatrix: (number | string)[][] = sudoku;
        const formatedSudokuMatrix: string[] = [];
        for (const row of sudokuMatrix) {
          formatedSudokuMatrix.push(row.join('-'));
        }
        return formatedSudokuMatrix.join('');
      case 'double-digit-letter-converted string':
        if (typeof(sudoku) !== typeof('')) throw Error('The input format is incorrect.');
        const lettersConversion = new Set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
        const doubleSudoku: string = sudoku;
        const formatedDoubleSudoku: string[] = [];
        for (const double of doubleSudoku) {
          if (+double) {
            formatedDoubleSudoku.push(double);
            continue;
          };
          if (lettersConversion.has(double)) {
            formatedDoubleSudoku.push(`${double.toLowerCase().charCodeAt(0) - 87}`);
            continue;
          }
          formatedDoubleSudoku.push('0');
        }
        return formatedDoubleSudoku.join('-');
      case 'letters-only string':
        if (typeof(sudoku) !== typeof('')) throw Error('The input format is incorrect.');
        const lettersSudoku: string = sudoku;
        const formatedLettersSudoku: string[] = [];
        for (const letter of lettersSudoku) {
          if (lettersConversion.has(letter)) {
            formatedLettersSudoku.push(`${letter.toLowerCase().charCodeAt(0) - 96}`);
            continue;
          }
          formatedLettersSudoku.push('0');
        }
        return formatedLettersSudoku.join('-');
      default: 
        break;
    }
    // determine format type
    // convert to string of dash-seperated digits

    return '';
  }
}

export default Format;