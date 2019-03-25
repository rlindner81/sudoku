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

let rows = "ABCDEFGHI"
let cols = "123456789"
let squares = cross(rows, cols)
let unitlist = arrayApply(c => cross(rows, c), cols)
  .concat(arrayApply(r => cross(r, cols), rows))
  .concat(arrayApply(rs => cs => cross(rs, cs), ["ABC", "DEF", "GHI"], ["123", "456", "789"]))
let units = new Map(arrayApply(s => [s, arrayApply(u => u, unitlist.filter(u => u.includes(s)))], squares))
let peers = new Map(arrayApply(s => [s, new Set(flatten(units.get(s)).filter(u => u !== s))], squares))

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
