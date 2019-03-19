<template>
  <table class="box">
    <tr class="box-row" v-for="i in size" v-bind:key="i">
      <td v-for="j in size" v-bind:key="j" :class="getClasses(i, j, size)">{{getValue()}}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "Box",
  props: {
    size: Number
  },
  methods: {
    getValue() {
      return Math.floor(Math.random() * this.size * this.size) + 1;
    },
    getClasses(row, column, size) {
      return {
        noTop: row === 1,
        noRight: column === size,
        noBottom: row === size,
        noLeft: column === 1,
        'box-column': true
      }
    }
  }
};
</script>

<style lang="scss">
.box {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  vertical-align: middle;
  text-align: center;

  .box-row {
    .box-column {
      border: 1px solid darkgray;

      &.noTop {
        border-top: none;
      }
      &.noRight {
        border-right: none;
      }
      &.noBottom {
        border-bottom: none;
      }
      &.noLeft {
        border-left: none;
      }
    }
  }
}
</style>
