<template>
  <div class="luka-board">
    <div class="grid">
      <div class="row" v-for="(row, index) in grid" :key="index">
          <div class="field" v-for="(field, index) in row" :key="index">
            <div v-if="field === 0" class="empty" />
            <div v-else class="full" v-text="field" />
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'luka-board',
  components: {
  },
  data() {
    return {
      grid: [
        ['a1', 'a2', 'a3', 0, 0],
        ['b1', 'b2', 'b3', 'b4', 0],
        ['c1', 'c2', 'c3', 'c4', 'c5'],
        [0, 'd2', 'd3', 'd4', 'd5'],
        [0, 0, 'e3', 'e4', 'e5']
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  box-sizing: border-box;
}

.grid {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: row;
}

.field {
  width: 1rem;
  height: 1rem;
  margin: 0.2rem;
}

.field > div {
  width: 100%;
  height: 100%;
  padding: 0.1rem;
}

.field > .full {
  background: lightgrey;
}

</style>
