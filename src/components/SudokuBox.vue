<template>
  <div class="box" v-bind:data-placeholder="placeholder">
    <div class="box-row" v-for="i in size" v-bind:key="i">
      <div class="box-col" v-for="j in size" v-bind:key="j">{{i}}, {{j}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SudokuBox",
  props: {
    size: Number,
    placeholder: Boolean
  }
};
</script>

<style lang="scss">
$box-size: 3;

.box {
  //  background: #eee;
  //  color: #222;
  display: flex;
  flex-direction: column;

  border: 0.5px solid #444;

  .box-row {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100% / $box-size;

    .box-col {
      display: flex;
      width: 100% / $box-size;
      height: 100%;

      border: 0.5px solid #aaa;

      align-items: center;
      justify-content: center;
    }
  }
  &[data-placeholder="true"] {
    border: none;

    .box-row {
      display: none;
    }
  }
}
</style>
