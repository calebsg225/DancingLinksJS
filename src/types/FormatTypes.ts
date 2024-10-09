type SudokuFormat = (
  '1-11' | // '3-7-3-0-0' ...
  '111' | // '8734000' ...
  '[1,11]' | // [8, 3, 4, 3] ...
  '[[1],[11]]' | // [[2, 5, 4], [0, 6, 0]] ...
  '1B' | // '6-5FGS-04' ...
  'AK' // 'SDMBNL---HG-' ...
);

export { SudokuFormat };