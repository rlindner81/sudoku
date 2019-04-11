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
import { flatten, numbers, shuffle, repeat, seedRand } from "@/helper";

/**
 * List of valid Sudoku board sizes.
 */
let VALID_SIZES = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25];
let MAX_VALUES = 50000;

export function isValidSize(size) {
  return VALID_SIZES.indexOf(size) !== -1;
}

/**
 * The appropriate box width for a given board size. Should be the smallest number bigger than the square root of the
 * size that is also divisor.
 */
function widthForSize(size) {
  for (let i = Math.ceil(Math.sqrt(size)); i < size; i++) {
    if (size % i === 0) {
      return i;
    }
  }
  return size;
}

/**
 * The appropriate minimal number of hints for a given board size. This is just guess work. Known minimals are:
 * Size: 4 => Hints: 4
 * Size: 9 => Hints: 17
 */
function hintsForSize(size) {
  return Math.ceil(size * size / 4.5);
}

function charFromDigit(i) {
  return i === 0 ? "." : i < 10 ? String.fromCharCode(i + 48) : String.fromCharCode(i + 55)
}

function digitFromChar(c) {
  let i = c.charCodeAt(0);
  return c === "." ? 0 : 48 < i && i < 58 ? i - 48 : 65 <= i ? i - 55 : null;
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
  grid = shuffle(grid);

  return grid
    .map(charFromDigit)
    .join("");
}

/**
 * Search.
 */
function search(info, listOfValues) {
  // console.log("search", listOfValues.length);

  // Check fail conditions and filter out all null values
  if (listOfValues === null) {
    return null;
  }
  listOfValues = listOfValues.filter(values => values !== null);
  if (listOfValues.length === 0) {
    return null;
  }
  if (MAX_VALUES && listOfValues.length > MAX_VALUES) {
    log.warn("Hit maximal values, quitting search");
    return null;
  }

  // Check if each values is solved and if find the appropriate searchpos if not
  let listOfLengths = new Array(listOfValues.length);
  let solvedCount = 0;
  for (let i = 0; i < listOfValues.length; i++) {
    let values = listOfValues[i];
    let minValuesLength = info.boardSize;
    let maxValuesLength = 0;
    let searchValuesLength = info.boardSize;
    let searchPos = null;
    let solved;
    for (let j = 0; j < info.cellNum; j++) {
      let valueLength = values[j].length;
      if (valueLength < minValuesLength) {
        minValuesLength = valueLength;
      }
      if (maxValuesLength < valueLength) {
        maxValuesLength = valueLength;
      }
      if (1 < valueLength && valueLength < searchValuesLength) {
        searchValuesLength = valueLength;
        searchPos = j;
      }
    }
    solved = minValuesLength === 1 && maxValuesLength === 1;
    solved && solvedCount++;
    listOfLengths[i] = {
      solved,
      searchValuesLength,
      searchPos
    };
  }

  // Too many solutions already
  if (solvedCount > 1) {
    return null;
  }

  // Quit recursion if all values are solved
  if (solvedCount === listOfValues.length) {
    return listOfValues;
  }

  // Create a newListOfValues where each potential value for the searchPos is considered
  let newListOfValues = [];
  for (let i = 0; i < listOfLengths.length; i++) {
    if (listOfLengths[i].solved) {
      newListOfValues.push(listOfValues[i]);
      continue;
    }

    let values = listOfValues[i];
    let searchPos = listOfLengths[i].searchPos;
    let searchValues = values[searchPos];
    for (let i = 0; i < searchValues.length; i++) {
      let newValues = Object.assign({}, values);
      // console.log("before", gridFromValues(info, newValues));
      newValues = assign(info, newValues, searchPos, searchValues[i]);
      // console.log("after", gridFromValues(info, newValues));
      if (newValues === null) {
        continue;
      }
      newListOfValues.push(newValues);
    }
  }

  return search(info, newListOfValues);
}

/**
 * Assign char c to values[pos] by eliminating all remaining alternatives.
 */
function assign(info, values, pos, c) {
  // console.log("assign", pos, c);
  let remainingValues = values[pos].replace(c, "");
  for (let i = 0; i < remainingValues.length; i++) {
    values = eliminate(info, values, pos, remainingValues[i]);
    if (values === null) {
      return null;
    }
  }
  return values;
}

/**
 * Eliminate char c from values[pos] and trigger an assign, if only one value remains.
 */
function eliminate(info, values, pos, c) {
  // console.log("eliminate", pos, c);
  if (values[pos].indexOf(c) === -1) {
    return values;
  }
  values[pos] = values[pos].replace(c, "");

  // Nothing remaining not solvable
  if (values[pos].length === 0) {
    return null;
  }
  // Only one value remaining can remove this for all peers
  if (values[pos].length === 1) {
    let c2 = values[pos];
    let peers = info.peersForPosition[pos];
    for (let i = 0; i < peers.length; i++) {
      values = eliminate(info, values, peers[i], c2);
      if (values === null) {
        return null;
      }
    }
  }
  // Check if c is the only remaining option in any of the units (row, column, or box)
  let units = info.unitsForPosition[pos];
  for (let i = 0; i < units.length; i++) {
    let unit = units[i];
    let cPositions = unit.filter(p => values[p].indexOf(c) !== -1);
    if (cPositions.length === 0) {
      return null;
    }
    if (cPositions.length === 1) {
      return assign(info, values, cPositions[0], c);
    }
  }
  return values;
}


function valuesFromGrid(info, grid) {
  // console.log("valuesFromGrid", grid);
  let values = {};
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

function gridFromValues(info, values) {
  let grid = new Array(info.cellNum);
  for (let i = 0; i < info.cellNum; i++) {
    grid[i] = values[i].length === 1 ? values[i] : ".";
  }
  return grid.join("");
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
  let boardSize = boxWidth * boxHeight;
  let chars = numbers(1, boardSize).map(charFromDigit).join("");
  let cellNum = boardSize * boardSize;

  let peersForPosition = [];
  let unitsForPosition = [];
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      let index = x + y * boardSize;
      let row = numbers(y * boardSize, boardSize).filter(i => i !== index);
      let column = numbers(x, boardSize, boardSize).filter(i => i !== index);
      let box = boxIndices(boxWidth, boxHeight, Math.floor(x / boxWidth), Math.floor(y / boxHeight)).filter(i => i !== index);
      let uniqueIndices = new Set(flatten([row, column, box]));
      let sortedIndices = [...uniqueIndices].sort((a, b) => a - b);
      unitsForPosition.push([row, column, box]);
      peersForPosition.push(sortedIndices);
    }
  }

  return {
    boardSize,
    cellNum,
    chars,
    unitsForPosition,
    peersForPosition
  }
}

export function generate(size, attempts) {
  if (!isValidSize(size)) {
    return null;
  }

  let width = widthForSize(size);
  let height = size / width;
  let hints = hintsForSize(size);

  let info = generateInfo(width, height);
  let attempt = 0;
  for (; attempt < attempts; attempt++) {
    let grid = generateGrid(info, hints);
    let values = valuesFromGrid(info, grid);
    let solutions = search(info, [values]);
    if (solutions !== null) {
      return {
        attempt,
        grid,
        solutions
      };
    }
  }
  return {
    attempt
  };
}

export function run() {
  seedRand("42");
  let attempts = 10000;
  for (let size = 1; size < 9; size++) {
    if (!isValidSize(size)) {
      continue;
    }

    console.log("size", size, "=", widthForSize(size), "x", size / widthForSize(size), "hints", hintsForSize(size));
    let generateInfo = generate(size, attempts);
    if (generateInfo !== null) {
      if ("grid" in generateInfo) {
        console.log("success after", generateInfo.attempt, "tries: grid", generateInfo.grid);
        // size++;
      } else {
        console.log("exhausted", generateInfo.attempt, "tries and failed");
      }
    }
  }
}
