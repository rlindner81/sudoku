/**
 * Returns true if and only if one of the calling arguments is null or undefined.
 * For the case of no arguments, it returns false.
 */
export function isNull() {
  return Array.prototype.reduce.call(
    arguments,
    function(result, argument) {
      return result || argument === undefined || argument === null;
    },
    false
  );
}

/**
 * Returns true if and only if the first array-like argument has an element that is null or undefined.
 * For the case of no arguments, it returns false.
 *
 * Usage: if(hasNull(arguments)) {...}
 */
export function hasNull(list) {
  return isNull.apply(null, list);
}

/**
 * Returns fallback value if first argument is null or undefined.
 *
 * Usage: let a = fallback(a, "a");
 */
export function fallback(value, fallback) {
  return isNull(value) ? fallback : value;
}

/**
 * Flatten subarrays.
 */
export function flatten(A) {
  return A.reduce((a, b) => a.concat(b));
}

/**
 * Repeat value n times in an array.
 */
export function repeat(v, n) {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(v);
  }
  return result;
}

/**
 * Returns array of numbers from start with a given length. Increments are by 1 or a given step.
 *
 * Usage: numbers(0, 3) === [0, 1, 2]
 *        numbers(1, 3) === [1, 2, 3]
 *        numbers(1, 3, 2) === [1, 3, 5]
 */
export function numbers(start, length, step) {
  if (step === undefined) {
    step = 1;
  }
  let result = [];
  let entry = start;
  for (let i = 0; i < length; i++) {
    result.push(entry);
    entry += step;
  }
  return result;
}

/**
 * Returns the element of a nested array or object if possible, otherwise null.
 *
 * Usage: get(array, 1, 2, 3) === array[1][2][3] || null      (without acccess exceptions)
 *        get(object, "a", "b") === object["a"]["b"] || null  (without acccess exceptions)
 */
// TODO implement with exception handling and object case
export function get() {
  if (hasNull(arguments) || arguments.length < 2) {
    return null;
  }
  let array = arguments[0];
  let indices = Array.prototype.slice.call(arguments, 1);
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i];
    if (!Array.isArray(array) || array.length <= index) {
      return null;
    }
    array = array[index];
  }
  return array;
}

/**
 * Returns the capitalized version of a given string.
 *
 * Usage: capitalize("hello") === "Hello"
 *        capitalize("hello world") === "Hello world"
 */
export function capitalize(s) {
  return typeof s === "string" && s.length > 0
    ? s.charAt(0).toUpperCase() + s.slice(1)
    : null;
}
