import { writeFileSync } from "fs"

import Counter from "./counter"
import Solver from "./solver"
import PRNG from "./prng"

let successCounter = new Counter("success");

function generateGridsPack(minSize) {
  let prng = new PRNG("42");
  let numBoards = 20;
  let attempts = 500;
  let boardPacks = {};
  for (let size = minSize; size <= 25; size++) {
    let solver = new Solver(size, prng.shuffle.bind(prng));
    if (solver === null) {
      continue;
    }
    console.log("solver", solver.toString());

    let solutions = [];
    for (let i = 0; i < numBoards;) {
      let grid = solver.generateHintGrid(attempts);
      if (grid !== null) {
        successCounter.log();
        i++;
        solutions.push(grid);
        boardPacks[size] = solutions
        writeFileSync("./gridsPack.json", JSON.stringify(boardPacks, null, 2));
      }
    }
  }
}

generateGridsPack(10);
