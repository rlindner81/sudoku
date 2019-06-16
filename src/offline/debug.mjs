/* eslint-disable no-console */

// initial hintgrid 8..7..6.........82..1.....7......2........95...7........9.....8..4.....3..8....4.
// initial fullgrid 892734615476195382351682497985413276123867954647259831739546128214978563568321749
//   final hintgrid 471..9.2.2.3..5..7..5..2.9...4....8.58....27...7....6.638.....91.........4.....5.
//   final fullgrid 471639528293485617865712394324576981586194273917823465638257149152948736749361852

import { writeFileSync } from "fs";

import Counter from "./../util/Counter.mjs";
import { default as Sudoku, isValidSize, numFromChar } from "./../util/Sudoku.mjs";
import PRNG from "./../util/PRNG.mjs";

const successCounter = new Counter("success");

function start() {
  let prng = new PRNG("42");
  let numBoards = 20;
  let attempts = 500;
  let boardPacks = {};
  let size = 9;
  let solver = new Sudoku(size, prng);
  
  let hintGrid = "471..9.2.2.3..5..7..5..2.9...4....8.58....27...7....6.638.....91.........4.....5.";
  let hintBoard = solver.boardFromGrid(hintGrid);
  let fullBoard = solver.searchAnySolution(hintBoard);
  let a = solver.gridFromBoard(hintBoard);
  let b = solver.gridFromBoard(fullBoard);

  let i = 0;
}

start();

// let solutions = [];
// for (let i = 0; i < numBoards;) {
//   // fullgridCounter.log();
//   let grid = solver.generateHintGrid(attempts);
//   if (grid !== null) {
//     successCounter.log();
//     i++;
//     solutions.push(grid);
//     boardPacks[size] = solutions;
//   }
// }
