<template>
  <div class="sudoku">
    <div class="row" v-for="(row,i) in rows" v-bind:key="i">
      <div class="col" v-for="(col,j) in row.cols" v-bind:key="j">
        <SudokuField v-bind:value="col.value"/>
      </div>
    </div>
  </div>
</template>

<script>
import SudokuField from "./SudokuField.vue";
import Generator from './Generator.js'

export default {
  name: "Sudoku",
  components: {
    SudokuField
  },
  data() {
    return {
      n: 9,
      rows: null
    };
  },
  created() {
    let seed = 42;
    let gen = new Generator(this.n, seed);
    this.rows = gen.getRows()
  }
};
</script>

<style lang="scss">
$grid-width-half: 1px;

.sudoku {
  background: #000;
  padding: $grid-width-half;

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }
  .col {
    box-sizing: content-box;
    margin: $grid-width-half;
    text-align: center;

    display: flex;
    flex-direction: column;
    flex: 0;
  }
}
</style>
