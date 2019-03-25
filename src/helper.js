/**
 * Returns true if and only if one of the calling arguments is null or undefined.
 * For the case of no arguments, it returns false.
 */
export function isNull() {
  return Array.prototype.reduce.call(arguments, function (result, argument) {
    return result || argument === undefined || argument === null;
  }, false);
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
 * Returns the element of a nested array if possible, otherwise null.
 *
 * Usage: getListElement(array, 1, 2, 3) === array[1][2][3] || null (without acccess exceptions)
 */
export function getListElement() {
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
 * Shuffle an array in place.
 */
export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
