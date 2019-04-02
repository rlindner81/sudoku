/* eslint-disable */
/**
 * Note:
 * The `boardSize = boxWidth * boxHeight` are the main variables. Prime boardsizes lead
 * to boring/easy boards, so we will ignore this case for now.
 * 
 * For example: `boardSize = 6 = 3 * 2 = boxWidth * boxHeight` looks as follows.
 *
 *   -----------------
 *   | 1 2 3 | 4 5 6 |
 *   | 4 5 6 | 1 2 3 |
 *   -----------------
 *   | 2 3 1 | 5 6 4 |
 *   | 5 6 4 | 2 3 1 |
 *   -----------------
 *   | 3 1 2 | 6 4 5 |
 *   | 6 4 5 | 3 1 2 |
 *   -----------------
 *
 * A `grid` is the internal representation where all fields are numbered from top left to bottom right. It's an array with 
 * 
 */
import { flatten, numbers, shuffle, repeat } from "@/helper";

// function gridToValues(grid) {
//   let values = {};
// }

// function valuesToGrid(values) {
// }

/**
 * Print a grid in sequence, where an empty cell is marked with a dot.
 */
function gridToString(grid) {
  return grid
    .map(charFromDigit)
    .join("");
}

/**
 * Generates a list of hints to be spread randomly across the board.
 * The leading hints will always be 1..(boardSize - 1).
 */
function generateNewGrid(info, hintSize) {
  let hints = [];
  for (let i = 0; i < info.boardSize - 1; i++) {
    hints.push(numbers(1, info.boardSize));
  }
  hints.push([info.boardSize]);
  hints = numbers(1, info.boardSize - 1).concat(shuffle(flatten(hints)));

  let grid = hints
    .slice(0, hintSize)
    .concat(repeat(0, info.cellNum - hintSize));
  return shuffle(grid);
}


function assign()

function valuesFromGrid(info, grid) {
  let values = {};
  for (let i = 0; i < info.cellNum; i++) {
    values[i] = info.chars;
  }
  for (let i = 0; i < info.cellNum; i++) {
    if (grid[i] !== ".") {
      assign(info, values, i, grid[i]);
    }
  }
  
  return values;
}

function charFromDigit(i) {
  return i === 0 ? '.' : i < 10 ? String.fromCharCode(i + 48) : String.fromCharCode(i + 55)
}

function generateInfo(boxWidth, boxHeight) {
  let boardSize = boxWidth * boxHeight;
  let chars = numbers(1, boardSize).map(charFromDigit).join("");
  let cellNum = boardSize * boardSize;
  return {
    boardSize,
    cellNum,
    chars
  }
}

export function generate(boxWidth, boxHeight, hintSize) {
  let info = generateInfo(boxWidth, boxHeight);
  let grid = generateNewGrid(info, hintSize);
  console.log("grid", gridToString(grid));
  // console.log("new grid", gridToString(generateNewGrid(info, hintSize)));
  // console.log("new grid", gridToString(generateNewGrid(info, hintSize)));
  // console.log("new grid", gridToString(generateNewGrid(info, hintSize)));

  console.log("values", valuesFromGrid(info, grid));
}
