/**
 * Simple hash function for randomizing seeds.
 * https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
 */
function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
  h = (h << 13) | (h >>> 19);
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

/**
 * Pseudo-random number generator
 * https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
 */
function sfc32(a, b, c, d) {
  return function() {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

/**
 * Pseudorandom number generator with seeded randomness.
 */
function PRNG(seed) {
  let _seed =
    seed === undefined || seed === null ? Math.random().toString() : seed;
  let hash = xmur3(_seed);
  this.rand = sfc32(hash(), hash(), hash(), hash());
}

/**
 * Shuffle an array in place.
 */
PRNG.prototype.shuffle = function(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(this.rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default PRNG;
