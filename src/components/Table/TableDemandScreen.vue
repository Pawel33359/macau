<template>
  <div class="demandscreen">
    <div
      class="demand"
      v-if="
        documents.function.type === 'demandyes' ||
          documents.function.type === 'demandjoker' ||
          documents.function.type === 'demandjokerjack'
      "
    >
      <div class="playerinfo">Demanded</div>
      <div class="playerinfo" v-if="documents.function.value === 12">
        card: Q
      </div>
      <div class="playerinfo" v-else>card: {{ documents.function.value }}</div>
      <div class="playerinfo">Turns left: {{ documents.function.amount }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["documents"],
};
</script>

<style>
/*demand screen and text */
.demandscreen {
  position: absolute;
  top: 0;
  width: 110px;
  height: 85px;
  background-color: black;
  border-bottom: 6px solid rgb(161, 56, 56);
  border-right: 6px solid rgb(161, 56, 56);
  border-left: 0px;
  border-top: 0px;

  border-style: ridge;
}
.demand {
  font-size: large;
  margin-left: 5px;
  position: absolute;
  bottom: 0;
  width: 100px;
}
.playerinfo {
  color: aliceblue;
}
</style>
