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

const EMPTY_CHAR = ".";
const MAX_SEARCH_SPREAD = 2;
const MAX_SEARCH_BOARDS = 5;
const HINT_QUOTIENT = 1/5;
// const HINT_QUOTIENT = 1/4.5;

/**
 * Generate all static information about a Sudoku board given its size.
 */
function generateBoardInfo(size) {
  let width = _widthForSize(size);
  let height = size / width;
  let cells = size * size;
  let hints = _hintsForSize(size);
  let empties = cells - hints;

  // Board of prime size is not sensible
  if (width === size) {
    return null;
  }
  console.log("info", "size", size, "=", width, "x", height, "hints", hints);

  let chars = numbers(1, size).map(charFromNum).join("");

  let peersForPosition = [];
  let unitsForPosition = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let index = x + y * size;
      let row = numbers(y * size, size).filter(i => i !== index);
      let column = numbers(x, size, size).filter(i => i !== index);
      let box = _boxPositions(width, height, Math.floor(x / width), Math.floor(y / height)).filter(i => i !== index);
      let uniqueIndices = new Set(flatten([row, column, box]));
      let sortedIndices = [...uniqueIndices].sort((a, b) => a - b);
      unitsForPosition.push([row, column, box]);
      peersForPosition.push(sortedIndices);
    }
  }

  return {
    width,
    height,
    size,
    cells,
    hints,
    empties,
    chars,
    unitsForPosition,
    peersForPosition
  }
}

/**
 * The appropriate box width for a given board size. Should be the smallest number bigger than the square root of the
 * size that is also divisor.
 */
function _widthForSize(size) {
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
function _hintsForSize(size) {
  return Math.ceil(size * size * HINT_QUOTIENT);
}

function _boxPositions(width, height, offsetX, offsetY) {
  let indices = [];
  let size = width * height;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      indices.push((x + offsetX * width) + (y + offsetY * height) * size);
    }
  }
  return indices;
}

/**
 * Given a number 0,1,..,[size] return the appropriate char '.','1',...,'9','A',... for the grid notation.
 */
function charFromNum(i) {
  return i === 0 ? EMPTY_CHAR : i < 10 ? String.fromCharCode(i + 48) : String.fromCharCode(i + 55)
}

/**
 * Given a char '.','1',...,'9','A',... from the grid notation, return the corresponding number.
 */
function numFromChar(c) {
  let i = c.charCodeAt(0);
  return c === EMPTY_CHAR ? 0 : 48 < i && i < 58 ? i - 48 : 65 <= i ? i - 55 : null;
}

/**
 * Return the board associated with a given grid by assigning all non-empty fields.
 */
function boardFromGrid(info, grid) {
  let board = {};
  for (let i = 0; i < info.cells; i++) {
    board[i] = info.chars;
  }
  for (let i = 0; i < info.cells; i++) {
    if (grid[i] !== EMPTY_CHAR) {
      board = assign(info, board, i, grid[i]);
      if (board === null) {
        return null;
      }
    }
  }
  return board;
}

/**
 * Return the grid associated with a board. Only cells with a unique value will be non-empty in the grid.
 */
function gridFromBoard(info, board) {
  let grid = new Array(info.cells);
  for (let i = 0; i < info.cells; i++) {
    grid[i] = board[i].length === 1 ? board[i] : EMPTY_CHAR;
  }
  return grid.join("");
}

/**
 * Assign char c to board[position] by eliminating all remaining values.
 */
function assign(info, board, position, c) {
  // console.log("assign", pos, c);
  let remainingValues = board[position].replace(c, "");
  for (let i = 0; i < remainingValues.length; i++) {
    board = eliminate(info, board, position, remainingValues[i]);
    if (board === null) {
      return null;
    }
  }
  return board;
}

/**
 * Eliminate char c from board[position] and propagate appropriately.
 */
function eliminate(info, board, position, c) {
  // console.log("eliminate", pos, c);
  if (board[position].indexOf(c) === -1) {
    return board;
  }
  board[position] = board[position].replace(c, "");

  // Nothing remaining means the board was not solvable
  if (board[position].length === 0) {
    return null;
  }

  // Only one value remaining means we can remove this for all peers
  if (board[position].length === 1) {
    let c2 = board[position];
    let peers = info.peersForPosition[position];
    for (let i = 0; i < peers.length; i++) {
      board = eliminate(info, board, peers[i], c2);
      if (board === null) {
        return null;
      }
    }
  }

  // Check if c is the only remaining option in any of the units (row, column, or box)
  let units = info.unitsForPosition[position];
  for (let i = 0; i < units.length; i++) {
    let unit = units[i];
    let cPositions = unit.filter(position => board[position].indexOf(c) !== -1);
    if (cPositions.length === 0) {
      return null;
    }
    if (cPositions.length === 1) {
      return assign(info, board, cPositions[0], c);
    }
  }
  return board;
}

/**
 * Given a board find out if it is solved and find the "search" position with the least number of values > 1.
 */
function searchInfoFromBoard(info, board) {
  let minValuesLength = info.size;
  let maxValuesLength = 0;
  let spread = info.size + 1;
  let position = null;
  let solved;
  for (let j = 0; j < info.cells; j++) {
    let valueLength = board[j].length;
    if (valueLength < minValuesLength) {
      minValuesLength = valueLength;
    }
    if (maxValuesLength < valueLength) {
      maxValuesLength = valueLength;
    }
    if (1 < valueLength && valueLength < spread) {
      spread = valueLength;
      position = j;
    }
  }
  solved = minValuesLength === 1 && maxValuesLength === 1;
  return {
    solved,
    position
  };
}


/**
 * Given a full grid, take out values so that only hints many remain.
 */
function generateHintGrid(info, fullGrid) {
  let grid = fullGrid.split("");
  let positions = shuffle(numbers(0, info.cells));
  for (let i = 0; i < info.empties; i++) {
    grid[positions[i]] = EMPTY_CHAR;
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
  let searchValues = shuffle(board[searchInfo.position].split(""));
  for (let i = 0; i < searchValues.length; i++) {
    let newBoard = Object.assign({}, board);
    newBoard = assign(info, newBoard, searchInfo.position, searchValues[i]);
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
  let baseGrid = shuffle(numbers(1, info.size).map(charFromNum)).join("") + EMPTY_CHAR.repeat(info.cells - info.size);
  let baseBoard = boardFromGrid(info, baseGrid);
  let solution = searchAnySolution(info, baseBoard)
  return gridFromBoard(info, solution);
}

/**
 * Search. AKA the monster.
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
  let listOfSearchInfos = new Array(listOfValues.length);
  let solvedCount = 0;
  for (let i = 0; i < listOfValues.length; i++) {
    let board = listOfValues[i];
    let searchInfo = searchInfoFromBoard(info, board);
    if (searchInfo.solved) {
      solvedCount++;
    }

    // avoid boards with too much spread
    if (!searchInfo.solved && board[searchInfo.position].length > MAX_SEARCH_SPREAD) {
      return null;
    }

    listOfSearchInfos[i] = searchInfo;
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
  for (let i = 0; i < listOfSearchInfos.length; i++) {
    if (listOfSearchInfos[i].solved) {
      newListOfValues.push(listOfValues[i]);
      continue;
    }

    let values = listOfValues[i];
    let searchPos = listOfSearchInfos[i].position;
    let searchValues = values[searchPos];
    // console.log("searchValues", searchValues.length);
    for (let i = 0; i < searchValues.length; i++) {
      let newValues = Object.assign({}, values);
      newValues = assign(info, newValues, searchPos, searchValues[i]);
      if (newValues === null) {
        continue;
      }
      newListOfValues.push(newValues);
      if (newListLength++ > MAX_SEARCH_BOARDS) {
        return null;
      }
    }
  }

  return search(info, newListOfValues);
}

/**
 * Old school generate. Not really where it's at.
 */
export function generate(info, attempts) {
  let fullGrid = generateFullGrid(info);
  // console.log("fullGrid", fullGrid);
  let attempt = 1;

  for (; attempt < attempts; attempt++) {
    let grid = generateHintGrid(info, fullGrid);
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

function hasUniqueSolution(info, searchInfo, board, fullgrid) {
  if (searchInfo.solved) {
    return true;
  }
  let remainingValues = board[searchInfo.position].replace(fullgrid[searchInfo.position], "");
  for (let i = 0; i < remainingValues.length; i++) {
    let c = remainingValues[i];
    let newBoard = Object.assign({}, board);
    newBoard[searchInfo.position] = c;
    let solution = searchAnySolution(info, newBoard);
    if (solution !== null) {
      // console.log("       real solution", fullgrid);
      // console.log("conflicting solution", gridFromBoard(info, solution), "differs in position", searchInfo.position);
      // debugger;
      return false;
    }
  }
  return true;
}

function _emptyAtPos(grid, pos) {
  return grid.substr(0, pos) + EMPTY_CHAR + grid.substr(pos + 1);
}

function nextGenerate(info, attempts) {
  let fullgrid = generateFullGrid(info);
  let positions = shuffle(numbers(0, info.cells));
  let grid = fullgrid;
  let success = false;
  let lastLenght = positions.length;

  for (let attempt = 0; attempt < attempts;) {
    if (positions.length <= info.hints) {
      success = true;
      console.log("success on attempt", attempt + 1);
      break;
    }
    let newGrid = _emptyAtPos(grid, positions[0]);
    let board = boardFromGrid(info, newGrid);
    let searchInfo = searchInfoFromBoard(info, board);
    if (hasUniqueSolution(info, searchInfo, board, fullgrid)) {
      grid = newGrid;
      positions = positions.slice(1);
      continue;
    } else {
      if (positions.length < lastLenght) {
        lastLenght = positions.length;
        console.log("reached", lastLenght, "hints at", attempt + 1, "attempt");
      }
      positions = shuffle(positions);
      attempt++;
      continue;
    }
  }

  return success ? grid : null;
}


export function run() {
  seedRand("43");
  let attempts = 1000;
  for (let size = 4; size <= 16; size++) {
    let info = generateBoardInfo(size);
    if (info === null) {
      continue;
    }

    let grid = nextGenerate(info, attempts);
    if (grid !== null) {
      console.log("happy face", grid);
    } else {
      console.log("sad face after", attempts, "attempts");
    }
  }
}
