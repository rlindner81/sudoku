/**
 * Counter to track time and number of calls.
 */
function Counter(name) {
  let now = new Date();
  this.calls = 1;
  this.name = name === undefined || name === null ? "measure" : name;
  this.startTime = now;
  this.lastCallTime = now;
}

Counter.prototype.log = function(additionalLogs) {
  let now = new Date();
  let logs = [
    this.name,
    `total ${now - this.startTime}ms`,
    `delta ${now - this.lastCallTime}ms`,
    `call ${this.calls++}`
  ];
  if (additionalLogs) {
    Object.keys(additionalLogs).forEach(logKey => {
      logs.push(`${logKey} ${additionalLogs[logKey]}`);
    });
  }
  this.lastCallTime = now;
  // eslint-disable-next-line no-console
  console.log(logs.join(" | "));
};

export default Counter;
