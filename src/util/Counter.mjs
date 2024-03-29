const TIME_UNITS = Object.entries({
  ms: 1000,
  sec: 60,
  min: 60,
  hour: 24,
  day: null,
});

function timeDiffToString(timeDiff) {
  let unit;
  for (let i = 0; i < TIME_UNITS.length; i++) {
    unit = TIME_UNITS[i][0];
    let limit = TIME_UNITS[i][1];

    if (limit !== null && limit <= timeDiff) {
      timeDiff = timeDiff / limit;
    } else {
      break;
    }
  }
  return `${timeDiff % 1 !== 0 ? timeDiff.toFixed(1) : timeDiff} ${unit}`;
}

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

Counter.prototype.log = function (additionalLogs = null) {
  let now = new Date();
  let logs = [
    this.name,
    `total ${timeDiffToString(now - this.startTime)}`,
    `delta ${timeDiffToString(now - this.lastCallTime)}`,
    `call ${this.calls++}`,
  ];
  if (additionalLogs) {
    Object.entries(additionalLogs).forEach(([logKey, value]) => {
      logs.push(`${logKey} ${value}`);
    });
  }
  this.lastCallTime = now;
  // eslint-disable-next-line no-console
  console.log(logs.join(" | "));
};

Counter.prototype.logEvery = function (frequency = 100, additionalLogs = null) {
  if (this.calls % frequency !== 0) {
    this.calls++;
    return;
  }
  this.log(additionalLogs);
};

export default Counter;
