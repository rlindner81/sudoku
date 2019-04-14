/* eslint-disable no-console */
import { writeFileSync } from "fs";

import Counter from "./../util/Counter.mjs";
import { default as Sudoku, isValidSize } from "./../util/Sudoku.mjs";
import PRNG from "./../util/PRNG.mjs";

let successCounter = new Counter("success");

function generateGridsPack(minSize) {
  let prng = new PRNG("44");
  let numBoards = 20;
  let attempts = 500;
  let boardPacks = {};
  for (let size = minSize; size <= 25; size++) {
    let solver = new Sudoku(size, prng);
    if (!isValidSize(size)) {
      continue;
    }
    console.log("solver", solver.toString());

    let solutions = [];
    for (let i = 0; i < numBoards; ) {
      // fullgridCounter.log();
      let grid = solver.generateHintGrid(attempts);
      if (grid !== null) {
        successCounter.log();
        i++;
        solutions.push(grid);
        boardPacks[size] = solutions;
        writeFileSync("./gridsPack.json", JSON.stringify(boardPacks, null, 2));
      }
    }
  }
}

generateGridsPack(12);
