<template>
  <div class="titl">Choose Suit</div>
  <div class="aces">
    <div v-for="ace in aces" :key="ace.suit">
      <img
        :src="ace.path"
        width="200"
        @click="chosen = ace"
        :class="{ inuse: ace === chosen }"
      />
    </div>
  </div>
  <div class="accept" v-if="chosen !== ''">
    <button @click="handleAccept">Accept</button>
  </div>
</template>

<script>
//composables
import useDatabase from "@/composables/use/useDatabase";
import game from "@/composables/game/game.js";
//other
import { ref } from "@vue/reactivity";

export default {
  props: ["table", "documents", "user", "player"],
  setup(props) {
    //creating aces
    const aces = ref([]);
    const chosen = ref("");
    const suits = ["c", "d", "s", "h"];

    for (const suit in suits) {
      const path = require("@/assets/cards/" + suits[suit] + 1 + ".png");
      const objecthand = { suit: suits[suit], value: 1, path: path };
      aces.value.push(objecthand);
    }

    //accept chosen card
    const handleAccept = () => {
      //changemiddlecard
      const { addDat: addmiddlecard } = useDatabase(
        "tables/" + props.table.id + "/middlecard/"
      );
      addmiddlecard(chosen.value);
      //clean function
      const { addDat } = useDatabase("tables/" + props.table.id + "/function/");
      addDat({ amount: 0, type: "" });
      //change turn
      const { turndatabase, ifmakao, aceMessage } = game(
        props.table,
        props.player,
        props.documents,
        [],
        []
      );

      aceMessage(props.user.uid, chosen.value);

      ifmakao(props.user.uid);
      turndatabase(1);
    };

    return { aces, chosen, handleAccept };
  },
};
</script>

<style scoped>
.aces {
  display: flex;
  margin-left: 10%;
  flex-wrap: wrap;
  column-gap: 45px;
  row-gap: 20px;
  overflow: auto;
  height: 70%;
}
.titl {
  color: cornsilk;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: xx-large;
}
img {
  border: none;
}
.accept {
  padding-top: 20px;
  text-align: center;
}
.inuse {
  border: 4px solid rgb(0, 119, 255);
}

@media only screen and (max-width: 505px), only screen and (max-height: 692px) {
  img {
    width: 150px;
  }
  .aces {
    column-gap: 15px;
    row-gap: 10px;
    margin-left: 5%;
  }
}
@media only screen and (max-width: 394px), only screen and (max-height: 420px) {
  img {
    width: 100px;
  }
  .aces {
    column-gap: 15px;
    row-gap: 5px;
    margin-left: 1%;
  }
}
</style>
