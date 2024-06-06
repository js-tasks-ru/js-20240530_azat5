/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) return string;
  let newStringSymbols = [];
  let counter = 0;
  let prevSymbol = "";

  for (const symbol of string.split("")) {
    if (prevSymbol === symbol) {
      counter++;
    } else {
      counter = 1;
    }

    if (size >= counter) {
      newStringSymbols.push(symbol);
    }

    prevSymbol = symbol;
  }

  return newStringSymbols.join("");
}
