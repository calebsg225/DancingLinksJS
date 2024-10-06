type SudokuInputFormat = (
  'char-seperated digits string' | // '3-7-3-0-0' ...
  'digits string' | // '8734000' ...
  'digits array' | // [8, 3, 4, 3] ...
  'digits matrix' | // [[2, 5, 4], [0, 6, 0]] ...
  'char-seperated hexa-converted string' | // '1-3-0-A-C-8' ...
  'hexa-converted string' | // '65FGS4' ...
  'letters-only string' // 'SDMBNL---HG-' ...
);

export { SudokuInputFormat };