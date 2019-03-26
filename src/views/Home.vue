<template>
  <div class="home">
  </div>
</template>

<script>
import { isNull } from "@/helper";

const defaultDifficulty = "easy";
const defaultSeed = String(Math.random()).substring(2,10);

export default {
  name: "Home",
  created() {
    let params = this.$route.params;

    if (isNull(params.difficulty, params.seed)) {
      this.$router.replace(`/${defaultDifficulty}/${defaultSeed}`)
    }
  }
};
</script>

<style lang="scss">
</style>
