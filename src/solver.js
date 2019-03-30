import { flatten, numbers, shuffle, repeat } from "@/helper";

// function gridToValues(grid) {
//   let values = {};
// }

// function valuesToGrid(values) {
// }

function gridToString(grid) {
  return grid
    .map(c => {
      return c === 0 ? "." : String(c);
    })
    .join("");
}

/**
 * Generates a list of hints to be spread randomly across the board.
 * The leading hints will always be 1..(boardSize - 1).
 */
function generateNewGrid(boardSize, hintSize) {
  let hints = [];
  for (let i = 0; i < boardSize - 1; i++) {
    hints.push(numbers(1, boardSize));
  }
  hints.push([boardSize]);
  hints = numbers(1, boardSize - 1).concat(shuffle(flatten(hints)));

  let grid = hints
    .slice(0, hintSize)
    .concat(repeat(0, boardSize * boardSize - hintSize));
  return shuffle(grid);
}

export function generate() {
  let boardSize = 9;
  let hintSize = 22;
  let grid = generateNewGrid(boardSize, hintSize);
  console.log("new grid", gridToString(generateNewGrid(boardSize, hintSize)));
  console.log("new grid", gridToString(generateNewGrid(boardSize, hintSize)));
  console.log("new grid", gridToString(generateNewGrid(boardSize, hintSize)));
  console.log("new grid", gridToString(generateNewGrid(boardSize, hintSize)));

  let numCells = boardSize * boardSize;

  values = {};
  console.log("", grid);
}
