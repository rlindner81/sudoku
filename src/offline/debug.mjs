/* eslint-disable no-console */

// initial hintgrid 8..7..6.........82..1.....7......2........95...7........9.....8..4.....3..8....4.
// initial fullgrid 892734615476195382351682497985413276123867954647259831739546128214978563568321749
//   final hintgrid 471..9.2.2.3..5..7..5..2.9...4....8.58....27...7....6.638.....91.........4.....5.
//   final fullgrid 471639528293485617865712394324576981586194273917823465638257149152948736749361852

import { default as Sudoku } from "./../util/Sudoku.mjs";
import PRNG from "./../util/PRNG.mjs";

function start() {
  let size = 9;
  let prng = new PRNG("42");
  let solver = new Sudoku(size, prng);
  
  let isUniqueInitial = solver.gridHasUniqueSolution("8..7..6.........82..1.....7......2........95...7........9.....8..4.....3..8....4.");
  let isUniqueFinal = solver.gridHasUniqueSolution("471..9.2.2.3..5..7..5..2.9...4....8.58....27...7....6.638.....91.........4.....5.");

  let i = 0;
}

start();
