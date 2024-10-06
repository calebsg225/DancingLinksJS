import { SudokuInputFormat } from "../types/FormatTypes";

/* 
type SudokuInputFormat = (
  'char-seperated digits string' | // '3-7-3-0-0' ...
  'digits string' | // '8734000' ...
  'digits array' | // [8, 3, 4, 3] ...
  'digits matrix' | // [[2, 5, 4], [0, 6, 0]] ...
  'char-seperated hexa-converted string' | // '1-3-0-A-C-8' ...
  'hexa-converted string' | // '65FGS4' ...
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
        break;
      case 'digits string':
        break;
      case 'digits array': 
        break;
      case 'digits matrix': 
        break;
      case 'char-seperated hexa-converted string':
        break;
      case 'hexa-converted string':
        break;
      case 'letters-only string':
        break;
      default: 
        break;
    }
    // determine format type
    // convert to string of dash-seperated digits

    return '';
  }
}

export default Format;