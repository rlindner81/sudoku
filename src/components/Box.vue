<template>
  <table class="box">
    <tr class="box-row" v-for="i in size" v-bind:key="i">
      <td class="box-column" v-for="j in size" v-bind:key="j">
        {{i}}, {{j}}
        </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "Box",
  props: {
    size: Number
  }
};
</script>

<style lang="scss">
.box {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  vertical-align: middle;
  text-align: center;
  // border: 2px solid black;

  .box-row {
    .box-column {
      border: 1px solid darkgray;
    }
  }
}
</style>
