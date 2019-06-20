/* eslint-disable no-console */
import { writeFileSync } from "fs";

import Counter from "./../util/Counter.mjs";
import { default as Sudoku, isValidSize } from "./../util/Sudoku.mjs";
import PRNG from "./../util/PRNG.mjs";
import { argValue } from "./../util/helper.mjs";

const successCounter = new Counter("success");

const size = parseInt(argValue("--size")) || 9;
const count = parseInt(argValue("--count")) || 20;
const attempts = parseInt(argValue("--attempts")) || 500;
const filename = argValue("--filename") || `newGrids${size}.json`;

const prng = new PRNG("42");
const sudoku = new Sudoku(size, prng);

function generateGrids() {
  let boardPacks = {};
  if (!isValidSize(size)) {
    return;
  }
  console.log("solver", sudoku.toString());

  let solutions = [];
  for (let i = 0; i < count; ) {
    let grid = sudoku.generateHintGrid(attempts);
    if (grid !== null) {
      successCounter.log();
      i++;
      solutions.push(grid);
      boardPacks[size] = solutions;
      writeFileSync(
        filename,
        JSON.stringify(boardPacks, null, 2)
      );
    }
  }
}

generateGrids();
