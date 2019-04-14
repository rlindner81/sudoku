/**
 * Note:
 * The `boardSize = boxWidth * boxHeight` are the main variables. Prime board sizes lead to boring/easy boards, so we
 * will ignore these.
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
 */
import { flatten, numbers } from "./helper.mjs";
// import Counter from "./Counter.mjs";

const EMPTY_CHAR = ".";
const HINT_QUOTIENT = 1 / 5;
const SEARCH_RECURSION_LIMIT = 7;

// const searchCounter = new Counter("search");
// const uniqueCounter = new Counter("unique");

/**
 * Given a number 0,1,..,[size] return the appropriate char '.','1',...,'9','A',... for the grid notation.
 */
export function charFromNum(i) {
  return i === 0
    ? EMPTY_CHAR
    : i < 10
    ? String.fromCharCode(i + 48)
    : String.fromCharCode(i + 55);
}

/**
 * Given a char '.','1',...,'9','A',... from the grid notation, return the corresponding number.
 */
export function numFromChar(c) {
  let i = c.charCodeAt(0);
  return c === EMPTY_CHAR
    ? 0
    : 48 < i && i < 58
    ? i - 48
    : 65 <= i
    ? i - 55
    : null;
}

/**
 * Easy check if a size is valid, i.e., not prime.
 */
export function isValidSize(size) {
  for (let i = 2, s = Math.sqrt(size); i <= s; i++) {
    if (size % i === 0) return true;
  }
  return false;
}

/**
 * Generate all static information about a Sudoku board given its size.
 */
function Sudoku(size, prng) {
  this.size = size;
  this.prng = prng;
  this.width = this._widthForSize();
  this.height = this.size / this.width;
  this.cells = this.size * this.size;
  this.hints = this._hintsForSize();
  this.empties = this.cells - this.hints;

  this.chars = numbers(1, this.size)
    .map(charFromNum)
    .join("");

  this.peersForPosition = [];
  this.unitsForPosition = [];
  for (let y = 0; y < this.size; y++) {
    for (let x = 0; x < this.size; x++) {
      let index = x + y * this.size;
      let row = numbers(y * this.size, this.size).filter(i => i !== index);
      let column = numbers(x, this.size, this.size).filter(i => i !== index);
      let box = this._boxPositions(
        Math.floor(x / this.width),
        Math.floor(y / this.height)
      ).filter(i => i !== index);
      let uniqueIndices = new Set(flatten([row, column, box]));
      let sortedIndices = [...uniqueIndices].sort((a, b) => a - b);
      this.unitsForPosition.push([row, column, box]);
      this.peersForPosition.push(sortedIndices);
    }
  }
}

Sudoku.prototype.toString = function() {
  return `size ${this.size} = ${this.width}x${this.height} | hints ${
    this.hints
  }`;
};

/**
 * The appropriate box width for a given board size. Should be the smallest number bigger than the square root of the
 * size that is also divisor.
 */
Sudoku.prototype._widthForSize = function() {
  for (let i = Math.ceil(Math.sqrt(this.size)); i < this.size; i++) {
    if (this.size % i === 0) {
      return i;
    }
  }
  return this.size;
};

/**
 * The appropriate minimal number of hints for a given board size. This is just guess work. Known minimals are:
 * Size: 4 => Hints: 4
 * Size: 9 => Hints: 17
 */
Sudoku.prototype._hintsForSize = function() {
  return Math.ceil(this.size * this.size * HINT_QUOTIENT);
};

Sudoku.prototype._boxPositions = function(offsetX, offsetY) {
  let indices = [];
  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      indices.push(
        x + offsetX * this.width + (y + offsetY * this.height) * this.size
      );
    }
  }
  return indices;
};

/********************************************************************************/

/**
 * Return the board associated with a given grid by assigning all non-empty fields.
 */
Sudoku.prototype.boardFromGrid = function(grid) {
  let board = {};
  for (let i = 0; i < this.cells; i++) {
    board[i] = this.chars;
  }
  for (let i = 0; i < this.cells; i++) {
    if (grid[i] !== EMPTY_CHAR) {
      board = this.assign(board, i, grid[i]);
      if (board === null) {
        return null;
      }
    }
  }
  return board;
};

/**
 * Return the grid associated with a board. Only cells with a unique value will be non-empty in the grid.
 */
Sudoku.prototype.gridFromBoard = function(board) {
  let grid = new Array(this.cells);
  for (let i = 0; i < this.cells; i++) {
    grid[i] = board[i].length === 1 ? board[i] : EMPTY_CHAR;
  }
  return grid.join("");
};

/**
 * Assign char c to board[position] by eliminating all remaining values.
 */
Sudoku.prototype.assign = function(board, position, c) {
  // console.log("assign", pos, c);
  let remainingValues = board[position].replace(c, "");
  for (let i = 0; i < remainingValues.length; i++) {
    board = this.eliminate(board, position, remainingValues[i]);
    if (board === null) {
      return null;
    }
  }
  return board;
};

/**
 * Eliminate char c from board[position] and propagate appropriately.
 */
Sudoku.prototype.eliminate = function(board, position, c) {
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
    let peers = this.peersForPosition[position];
    for (let i = 0; i < peers.length; i++) {
      board = this.eliminate(board, peers[i], c2);
      if (board === null) {
        return null;
      }
    }
  }

  // Check if c is the only remaining option in any of the units (row, column, or box)
  let units = this.unitsForPosition[position];
  for (let i = 0; i < units.length; i++) {
    let unit = units[i];
    let cPositions = unit.filter(p => {
      return board[p].indexOf(c) !== -1;
    });
    if (cPositions.length === 0) {
      return null;
    }
    if (cPositions.length === 1) {
      return this.assign(board, cPositions[0], c);
    }
  }
  return board;
};

/********************************************************************************/

/**
 * Given a board find out if it is solved and find the "search" position with the least number of values > 1.
 */
Sudoku.prototype.searchInfoFromBoard = function(board) {
  let minValuesLength = this.size;
  let maxValuesLength = 0;
  let spread = this.size + 1;
  let position = null;
  let solved;
  for (let j = 0; j < this.cells; j++) {
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
};

/**
 * Starting form a given board, find any valid solution.
 */
Sudoku.prototype.searchAnySolution = function(
  board,
  depthLimit = -1,
  depth = 0
) {
  if (board === null) {
    return null;
  }
  // searchCounter.logEvery(1000, { depth });
  if (0 <= depthLimit && depthLimit < depth) {
    // console.log("below recursion depth limit at", depth);
    return board;
  }

  let searchInfo = this.searchInfoFromBoard(board);
  if (searchInfo.solved) {
    return board;
  }
  let searchValues = this.prng.shuffle(board[searchInfo.position].split(""));
  for (let i = 0; i < searchValues.length; i++) {
    let newBoard = Object.assign({}, board);
    newBoard = this.assign(newBoard, searchInfo.position, searchValues[i]);
    if (newBoard === null) {
      continue;
    }
    // console.log("grid", this.gridFromBoard(newBoard));
    newBoard = this.searchAnySolution(newBoard, depthLimit, depth++);
    if (newBoard !== null) {
      return newBoard;
    }
  }
  return null;
};

Sudoku.prototype.generateFullGrid = function() {
  // console.log("generateFullGrid");
  let baseGrid =
    this.prng.shuffle(numbers(1, this.size).map(charFromNum)).join("") +
    EMPTY_CHAR.repeat(this.cells - this.size);
  let baseBoard = this.boardFromGrid(baseGrid);
  let solution = this.searchAnySolution(baseBoard);
  return this.gridFromBoard(solution);
};

Sudoku.prototype.hasUniqueSolution = function(searchInfo, board, fullGrid) {
  if (searchInfo.solved) {
    return true;
  }
  // uniqueCounter.log();

  let realValue = fullGrid[searchInfo.position];
  let remainingValues = board[searchInfo.position].replace(realValue, "");
  for (let i = 0; i < remainingValues.length; i++) {
    let c = remainingValues[i];
    let newBoard = Object.assign({}, board);
    newBoard = this.assign(newBoard, searchInfo.position, c);
    let solution = this.searchAnySolution(newBoard, SEARCH_RECURSION_LIMIT);
    if (solution !== null) {
      return false;
    }
  }
  return true;
};

function _emptyAtPos(grid, pos) {
  return grid.substr(0, pos) + EMPTY_CHAR + grid.substr(pos + 1);
}

Sudoku.prototype.generateHintGrid = function(attempts) {
  let fullGrid = this.generateFullGrid();
  let positions = this.prng.shuffle(numbers(0, this.cells));
  let grid = fullGrid;
  let lastLenght = positions.length;

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (positions.length <= this.hints) {
      return grid;
    }
    let newGrid = _emptyAtPos(grid, positions[0]);
    let board = this.boardFromGrid(newGrid);
    let searchInfo = this.searchInfoFromBoard(board);
    if (this.hasUniqueSolution(searchInfo, board, fullGrid)) {
      // console.log("progress", positions.length, "hints", this.hints);
      grid = newGrid;
      positions = positions.slice(1);
      continue;
    } else {
      if (positions.length < lastLenght) {
        lastLenght = positions.length;
        // console.log("reached", lastLenght, "hints");
      }
      positions = this.prng.shuffle(positions);
      attempt++;
      continue;
    }
  }
  return null;
};

export default Sudoku;
