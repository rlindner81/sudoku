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
let MAX_SEARCH_SPREAD = 2;
let MAX_BOARDS = 5;

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
  return Math.ceil(size * size / 2);
  // return Math.ceil(size * size / 4.5);
}

function charFromDigit(i) {
  return i === 0 ? "." : i < 10 ? String.fromCharCode(i + 48) : String.fromCharCode(i + 55)
}

function digitFromChar(c) {
  let i = c.charCodeAt(0);
  return c === "." ? 0 : 48 < i && i < 58 ? i - 48 : 65 <= i ? i - 55 : null;
}

function searchInfoFromBoard(info, board) {
  let minValuesLength = info.boardSize;
  let maxValuesLength = 0;
  let searchSpread = info.boardSize + 1;
  let searchPos = null;
  let solved;
  for (let j = 0; j < info.cellNum; j++) {
    let valueLength = board[j].length;
    if (valueLength < minValuesLength) {
      minValuesLength = valueLength;
    }
    if (maxValuesLength < valueLength) {
      maxValuesLength = valueLength;
    }
    if (1 < valueLength && valueLength < searchSpread) {
      searchSpread = valueLength;
      searchPos = j;
    }
  }
  solved = minValuesLength === 1 && maxValuesLength === 1;
  return {
    solved,
    searchPos
  };
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

  // Check if each values is solved and if find the appropriate searchpos if not
  let listOfLengths = new Array(listOfValues.length);
  let solvedCount = 0;
  for (let i = 0; i < listOfValues.length; i++) {
    let board = listOfValues[i];
    let searchInfo = searchInfoFromBoard(info, board);
    if (searchInfo.solved) {
      solvedCount++;
    }

    // avoid boards with too much spread
    if (!searchInfo.solved && board[searchInfo.searchPos].length > MAX_SEARCH_SPREAD) {
      return null;
    }

    listOfLengths[i] = searchInfo;
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
  let newListLength = 0;
  for (let i = 0; i < listOfLengths.length; i++) {
    if (listOfLengths[i].solved) {
      newListOfValues.push(listOfValues[i]);
      continue;
    }

    let values = listOfValues[i];
    let searchPos = listOfLengths[i].searchPos;
    let searchValues = values[searchPos];
    // console.log("searchValues", searchValues.length);
    for (let i = 0; i < searchValues.length; i++) {
      let newValues = Object.assign({}, values);
      newValues = assign(info, newValues, searchPos, searchValues[i]);
      if (newValues === null) {
        continue;
      }
      newListOfValues.push(newValues);
      if (newListLength++ > MAX_BOARDS) {
        return null;
      }
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


function boardFromGrid(info, grid) {
  // console.log("valuesFromGrid", grid);
  let board = {};
  for (let i = 0; i < info.cellNum; i++) {
    board[i] = info.chars;
  }
  for (let i = 0; i < info.cellNum; i++) {
    if (grid[i] !== ".") {
      board = assign(info, board, i, grid[i]);
      if (board === null) {
        return null;
      }
    }
  }
  return board;
}

function gridFromBoard(info, board) {
  let grid = new Array(info.cellNum);
  for (let i = 0; i < info.cellNum; i++) {
    grid[i] = board[i].length === 1 ? board[i] : ".";
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

  console.log("size", size, "=", widthForSize(size), "x", size / widthForSize(size), "hints", hintsForSize(size));
  let width = widthForSize(size);
  let height = size / width;
  let hints = hintsForSize(size);

  let info = generateInfo(width, height);
  let fullGrid = generateFullGrid(info);
  // console.log("fullGrid", fullGrid);
  let attempt = 0;

  for (; attempt < attempts; attempt++) {
    let grid = generateHintGrid(info, fullGrid, hints);
    // console.log("hintGrid", grid);
    // grid = ".......13...2............8....76.2....8...4...1.......2.....75.6..34.........8...";
    // if (attempt % 1000 === 0) {
    //   console.log("attempt", attempt, "grid", grid);
    // }
    let board = boardFromGrid(info, grid);
    let solutions = search(info, [board]);
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

/**
 * Given a full grid, take out values so that only hints many remain.
 */
function generateHintGrid(info, fullGrid, hints) {
  let grid = fullGrid.split("");
  let positions = shuffle(numbers(0, info.cellNum));
  for (let i = info.cellNum - hints - 1; i >= 0; i--) {
    grid[positions[i]] = ".";
  }
  return grid.join("");
}


/**
 * Starting form a given board, find any valid solution.
 */
function searchAnySolution(info, board) {
  if (board === null) {
    return null;
  }
  let searchInfo = searchInfoFromBoard(info, board);
  if (searchInfo.solved) {
    return board;
  }
  let searchValues = shuffle(board[searchInfo.searchPos].split(""));
  for (let i = 0; i < searchValues.length; i++) {
    let newBoard = Object.assign({}, board);
    newBoard = assign(info, newBoard, searchInfo.searchPos, searchValues[i]);
    if (newBoard === null) {
      continue;
    }
    // console.log("grid", gridFromBoard(info, newBoard));
    newBoard = searchAnySolution(info, newBoard);
    if (newBoard !== null) {
      return newBoard;
    }
  }
  return null;
}

function generateFullGrid(info) {
  let baseGrid = shuffle(numbers(1, info.boardSize).map(charFromDigit)).join("") + ".".repeat(info.cellNum - info.boardSize);
  let baseBoard = boardFromGrid(info, baseGrid);
  let solution = searchAnySolution(info, baseBoard)
  return gridFromBoard(info, solution);
}

export function run() {
  seedRand("43");
  let attempts = 1000;
  for (let size = 1; size <= 25; size++) {
    if (!isValidSize(size)) {
      continue;
    }

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
