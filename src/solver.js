// This is a straight up re-implementation of
// https://github.com/norvig/pytudes/blob/master/py/sudoku.py

const assert = require('assert');

// Flatten subarrays.
function flatten(A) {
  return A.reduce((a, b) => a.concat(b))
}

// Mimic python array constuctor.
function arrayApply(fn, A, B) {
  if (A === undefined) {
    return null;
  }
  if (B === undefined) {
    return Array.from(A).map(fn)
  }
  return flatten(Array.from(A).map(a => Array.from(B).map(fn(a))))
}

// Cross product of elements in A and elements in B.
function cross(A, B) {
  return arrayApply(a => b => a + b, A, B)
}

let digits = "123456789"
let rows = "ABCDEFGHI"
let cols = digits
let squares = cross(rows, cols)
let unitlist = arrayApply(c => cross(rows, c), cols)
  .concat(arrayApply(r => cross(r, cols), rows))
  .concat(arrayApply(rs => cs => cross(rs, cs), ["ABC", "DEF", "GHI"], ["123", "456", "789"]))
let units = new Map(arrayApply(s => [s, arrayApply(u => u, unitlist.filter(u => u.includes(s)))], squares))
let peers = new Map(arrayApply(s => [s, new Set(flatten(units.get(s)).filter(u => u !== s))], squares))

// ################ Unit Tests ################

function test() {
  assert(squares.length === 81);
  assert(unitlist.length === 27);
  assert(units.size === 81);
  assert(JSON.stringify(units.get("C2")) === JSON.stringify([
    ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2'],
    ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
    ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']
  ]));
  assert(peers.get("C2").size === 20);
}
test()

// ################ Parse a Grid ################

// Convert grid to a dict of possible values, {square: digits}, or
//   return False if a contradiction is detected.
function parse_grid(grid) {
  let values = new Map(arrayApply(s => [s, digits], squares))

  grid_values.entries().forEach((s, d) => {
    if (digits.includes(d) && !assign(values, s, d)) {
      assert(false);
    }
  });
  return values
}

// Convert grid into a dict of {square: char} with '0' or '.' for empties.
function grid_values(grid) {
  let chars = grid.filter(c => digits.includes(c) || c === '0' || c === '.')
  assert(chars.length === 81)
  return new Map(squares.map((s, i) => [s, chars[i]]))
}

// ################ Constraint Propagation ################

// Eliminate all the other values (except d) from values[s] and propagate.
//   Return values, except return False if a contradiction is detected.
function assign(values, s, d) {
  
}

/*
def assign(values, s, d):
    other_values = values[s].replace(d, '')
    if all(eliminate(values, s, d2) for d2 in other_values):
        return values
    else:
        return False

def eliminate(values, s, d):
    """Eliminate d from values[s]; propagate when values or places <= 2.
    Return values, except return False if a contradiction is detected."""
    if d not in values[s]:
        return values ## Already eliminated
    values[s] = values[s].replace(d,'')
    ## (1) If a square s is reduced to one value d2, then eliminate d2 from the peers.
    if len(values[s]) == 0:
        return False ## Contradiction: removed last value
    elif len(values[s]) == 1:
        d2 = values[s]
        if not all(eliminate(values, s2, d2) for s2 in peers[s]):
            return False
    ## (2) If a unit u is reduced to only one place for a value d, then put it there.
    for u in units[s]:
        dplaces = [s for s in u if d in values[s]]
        if len(dplaces) == 0:
            return False ## Contradiction: no place for this value
        elif len(dplaces) == 1:
            # d can only be in one place in unit; assign it there
            if not assign(values, dplaces[0], d):
                return False
    return values

*/
