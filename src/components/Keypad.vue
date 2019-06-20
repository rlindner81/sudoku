<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click="close">
      <div class="modal" role="dialog" @click.stop>
        <section class="modal-body">
          <table class="keypad">
            <tr v-for="(row, i) in boxSize" :key="i">
              <td v-for="(col, j) in boxSize" :key="j" @click="updateValue($event, j + boardSize * i)">
                {{ displaySquare(j + boardSize * i) }}
              </td>
            </tr>
          </table>
        </section>
      </div>
    </div>
  </transition>
</template>

<script>
import { isNull } from "@/util/helper.mjs";

export default {
  name: "Keypad",
  props: {
    value: {
      type: Number,
      required: true
    },
    symbols: {
      type: Array,
      required: true
    },
    boxSize: {
      type: Number,
      required: true
    }
  },
  methods: {
    displaySquare(value) {
      return isNull(value) ? "" : this.symbols[value];
    },
    updateValue() {
      this.$emit("change", 3);
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss">
.board {
  border-collapse: collapse;
  table-layout: fixed;
  vertical-align: middle;
  text-align: center;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  border: none;
  font-size: 20px;
  padding: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
  border-radius: 2px;
}
</style>
