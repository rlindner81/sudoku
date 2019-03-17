<template>
  <div class="field">
    {{displayValue}}
  </div>
</template>

<script>
export default {
  name: "SudokuField",
  props: {
    value: Number
  },
  computed: {
    displayValue() {
      return this.value === null ? "" : this.value;
    }
  },
  methods: {
  }
};
</script>

<style lang="scss">
$size: 3rem;

.field {
  width: $size;
  height: $size;

  font-size: 22pt;
  font-weight: 500;
  text-align: center;
  vertical-align: middle;
  line-height: $size;

  background: #eee;
  color: #222;
}
</style>
