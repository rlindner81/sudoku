<template>
  <input class="field" contenteditable="true" :value="value" @input="onInput" @focus="onFocus" @click="onFocus">
</template>

<script>
export default {
  name: "Field",
  props: {
    value: Number
  },
  methods: {
    onFocus(event) {
      let input = event.target;
      input.setSelectionRange(0, input.value.length);
    },
    onInput(event) {
      let result = parseInt(event.target.value);
      if(isNaN(result)) {
        this.$emit("input", null);
      }
      this.$emit("input", result);
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
