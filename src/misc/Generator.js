class Generator {

  rows = [];

  constructor(n, seed) {
    // TODO: do proper alg
    console.log(seed);

    let rows = [];
    for (let i = 0; i < n; i++) {
      let cols = [];
      for (let j = 0; j < n; j++) {
        // let value = i === j ? null : j;
        let value = j + 1;
        cols.push({ value });
      }
      rows.push({ cols });
    }
    this.rows = rows;
  }

  getRows() {
    return this.rows;
  }

}

export default Generator;
