import { SudokuInputFormat } from "../types/FormatTypes";

class Format {

  // converts different sudoku board input formats into a dashed-seperated string of digits
  sudoku = (sudoku: any, format: SudokuInputFormat): string => {
    switch (format) {
      case '1-11': // '7-0-4-9-2 ...'
        if (typeof(sudoku) !== typeof('')) throw Error('The input format is incorrect.');
        const newSudoku: string[] = sudoku.split('');
        const digits = new Set('0123456789'.split(''));
        for (let i = 0; i < newSudoku.length; i++) {
          if (!digits.has(newSudoku[i])) newSudoku[i] = '-';
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
        const sudokuMatrix: (number | string)[][] = sudoku;
        const formatedSudokuMatrix: string[] = [];
        for (const row of sudokuMatrix) {
          formatedSudokuMatrix.push(row.join('-'));
        }
        return formatedSudokuMatrix.join('');
      case '1B': // '9L8CD000 ...'
        if (typeof(sudoku) !== typeof('')) throw Error('The input does not match format.');
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
      case 'AK': // 'ADFCB..L ...'
        if (typeof(sudoku) !== typeof('')) throw Error('The input does not match the format.');
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
        throw Error('The format type does not exist.');
    }
  }
}

export default Format;