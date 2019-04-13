/**
 * Counter to track time and number of calls.
 */
function Counter(name) {
  let now = new Date();
  this.calls = 1;
  this.name = (name === undefined || name === null) ? "measure" : name;
  this.startTime = now;
  this.lastCallTime = now;
}

Counter.prototype.log = function () {
  let now = new Date();
  let log = `${this.name} | total ${now - this.startTime}ms | delta ${now - this.lastCallTime}ms | call ${this.calls++}`;
  if (arguments.length > 0) {
    log = Array.prototype.reduce.call(arguments, (result, argument) => {
      return `${result} | ${argument}`;
    }, log);
  }
  this.lastCallTime = now;
  console.log(log);
}

export default Counter;
