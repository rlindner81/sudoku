/* eslint-disable */
/**
 * Note:
 * The `boardSize = boxWidth * boxHeight` are the main variables. Prime boardsizes lead to boring/easy boards, so we
 * will ignore this case for now.
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
 * A `grid` is the internal representation where all fields are numbered from top left to bottom right.
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

function charFromDigit(i) {
  return i === 0 ? "." : i < 10 ? String.fromCharCode(i + 48) : String.fromCharCode(i + 55)
}

function digitFromChar(c) {
  let i = c.charCodeAt(0);
  return c === "." ? 0 : 48 < i && i < 58 ? i - 48 : 65 <= i  ? i - 55 : null;
}

/**
 * Generates a list of hints to be spread randomly across the board.
 * The leading hints will always be 1..(boardSize - 1).
 */
function generateGrid(info, hintSize) {
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


/**
 * Assign char c to values[pos] and eliminate it for all peers.
 */
function assign(info, values, pos, c) {
  values[pos] = c;
  let peers = info.peers[pos];
  for (let j = 0; j < peers.length; j++) {
    let peer = peers[j];
    values = eliminate(info, values, peer, c);
    if (values === null) {
      return null;
    }
  }
  return values;
}

/**
 * Elmininate char c from values[pos] and trigger an assign, if only one value remains.
 */
function eliminate(info, values, pos, c) {
  let rest = values[pos].replace(new RegExp(c, "g"), "");
  values[pos] = rest;
  if (rest.length === 0) {
    return null;
  }
  if (rest.length === 1) {
    return assign(info, values, pos, rest);
  }
  return values;
}

function valuesFromGrid(info, grid) {
  let values = {};
  grid = gridToString(grid);
  for (let i = 0; i < info.cellNum; i++) {
    values[i] = info.chars;
  }
  for (let i = 0; i < info.cellNum; i++) {
    if (grid[i] !== ".") {
      values = assign(info, values, i, grid[i]);
      if (values === null) {
        return null;
      }
    }
  }
  return values;
}

function boxIndices(boxWidth, boxHeight, offsetX, offsetY) {
  let indices = [];
  let boardSize = boxWidth * boxHeight;
  for (let y = 0; y < boxHeight; y++) {
    for (let x = 0; x < boxWidth; x++) {
      indices.push((x + offsetX * boxWidth) + (y + offsetY * boxHeight) * boardSize);
    }
  }
  return indices;
}

function generateInfo(boxWidth, boxHeight) {
  boxWidth = 3;
  boxHeight = 2;

  let boardSize = boxWidth * boxHeight;
  let chars = numbers(1, boardSize).map(charFromDigit).join("");
  let cellNum = boardSize * boardSize;

  let peers = [];
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      let index = x + y * boardSize;
      let row  = numbers(y * boardSize, boardSize).filter(i => i !== index);
      let column = numbers(x, boardSize, boardSize).filter(i => i !== index);
      let box = boxIndices(boxWidth, boxHeight, Math.floor(x/boxWidth), Math.floor(y/boxHeight)).filter(i => i !== index);
      let uniqueIndices = new Set(flatten([row, column, box]));
      let sortedIndices = [...uniqueIndices].sort((a,b) => a - b);
      peers.push(sortedIndices);
    }
  }

  return {
    boardSize,
    cellNum,
    chars,
    peers
  }
}

export function generate(boxWidth, boxHeight, hintSize) {
  let info = generateInfo(boxWidth, boxHeight);
  while (true) {
    let grid = generateGrid(info, hintSize);
    let values = valuesFromGrid(info, grid);
    console.log("grid", gridToString(grid));
    console.log("values", values);
    if (values !== null) {
      break;
    }
  }
}
