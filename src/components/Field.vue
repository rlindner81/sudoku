<template>
  <input class="field" :value="value" @input.prevent="onInput" @focus="onFocus" @click="onFocus">
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
      let value = event.target.value;
      let result = parseInt(value.replace(/[^\d]+/g, ""));
      this.$emit("input", isNaN(result) ? null : result);
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
