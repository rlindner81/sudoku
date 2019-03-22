<template>
  <input :class="getFieldClass()" contenteditable="true" :value="value" @input="onInput" @focus="onFocus" @click="onFocus">
</template>

<script>
export default {
  name: "Field",
  props: {
    value: Number
  },
  methods: {
    getFieldClass() {
      let result = {
        field: true
      };
      if (this.highlight) {
        result["highlight"] = true;
      }
      return result;
    },
    onFocus(event) {
      let input = event.target;
      input.setSelectionRange(0, input.value.length);
    },
    onInput(event) {
      let result = parseInt(event.target.value);
      this.$emit("input", result - 1);
    }
  }
};
</script>

<style lang="scss">
.field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  // align-items: center;
  // justify-content: center;
  border: none;
  text-align: center;
  font-size: 2rem;
  &:focus {
    background: lightgoldenrodyellow;
    // outline: darkorange auto 3px;
    outline: none;
    border: 2px solid orange;
  }
  &::selection {
    background: none;
  }
  
}
</style>
