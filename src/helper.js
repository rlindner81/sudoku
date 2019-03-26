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
 * Returns fallback value if first argument is null or undefined.
 *
 * Usage: let a = fallback(a, "a");
 */
export function fallback(value, fallback) {
  return isNull(value) ? fallback : value;
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
 * Exchange the values of a and b.
 */
export function exchangeInString(string, i, j) {
  let chars = Array.from(string);
  // console.log("before===", i, j, chars.join(''));
  let c = chars[i];
  chars[i] = chars[j];
  chars[j] = c;
  // console.log("after===", i, j, chars.join(''));
  return chars.join('');
}

/**
 * Replace all occurrences of string a in b.
 */
// TODO
//export function replaceAll(a, b) {
//}

/**
 * Shuffle an array in place.
 */
export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


/**
 * Simple hash function for randomizing seeds.
 * https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
 */
function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
  h = h << 13 | h >>> 19;
  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
}

/**
 * Pseudo-random number generator
 * https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
 */
function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

/**
 * Seed pseudo-random number generator.
 */
let _rand;
export function seedRand(seed) {
  let hash = xmur3(seed);
  _rand = sfc32(hash(), hash(), hash(), hash());
}
seedRand(String(Math.PI))

/**
 * Get pseudo-random numbers between 0 and 1.
 */
export function rand() {
  return _rand();
}
