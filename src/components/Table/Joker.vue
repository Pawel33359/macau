<template>
  <div class="titl">Choose Card</div>
  <!--demand cards-->
  <div
    class="cards"
    v-if="
      documents.function.type == 'demandjoker' ||
        documents.function.type == 'demandjokerjack'
    "
  >
    Hello
    <div class="alldemand">
      <div class="demand">
        <div v-for="card in demand" :key="card.suit">
          <img
            :src="card.path"
            width="100"
            @click="chosen = card"
            :class="{ inuse: card == chosen }"
          />
        </div>
      </div>
      <div class="demand">
        <div v-for="card in demandjack" :key="card.suit">
          <img
            :src="card.path"
            width="100"
            @click="chosen = card"
            :class="{ inuse: card == chosen }"
          />
        </div>
      </div>
    </div>
  </div>
  <!--regular joker-->
  <div class="cards" v-else>
    <div class="suit">
      <div v-for="club in clubs" :key="club.value">
        <img
          :src="club.path"
          width="80"
          @click="chosen = club"
          :class="{ inuse: club == chosen }"
        />
      </div>
    </div>
    <div class="suit">
      <div v-for="diamond in diamonds" :key="diamond.value">
        <img
          :src="diamond.path"
          width="80"
          @click="chosen = diamond"
          :class="{ inuse: diamond == chosen }"
        />
      </div>
    </div>
    <div class="suit">
      <div v-for="spade in spades" :key="spade.value">
        <img
          :src="spade.path"
          width="80"
          @click="chosen = spade"
          :class="{ inuse: spade == chosen }"
        />
      </div>
    </div>
    <div class="suit">
      <div v-for="heart in hearts" :key="heart.value">
        <img
          :src="heart.path"
          width="80"
          @click="chosen = heart"
          :class="{ inuse: heart == chosen }"
        />
      </div>
    </div>
  </div>
  <div class="accept" v-if="chosen != ''">
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
  props: [
    "table",
    "documents",
    "nextuserid",
    "previoususerid",
    "user",
    "player",
  ],
  setup(props) {
    //chosen card
    const chosen = ref("");

    //demand cards and jack if nothing was thrown since demand
    const demand = ref([]);
    const demandjack = ref([]);
    var suits = ["c", "d", "s", "h"];

    if (
      props.documents.function.type == "demandjoker" ||
      props.documents.function.type == "demandjokerjack"
    ) {
      for (var i = 0; i < 4; i++) {
        var path = require("@/assets/cards/" +
          suits[i] +
          props.documents.function.value +
          ".png");
        var objecthand = {
          suit: suits[i],
          value: props.documents.function.value,
          path: path,
        };
        demand.value.push(objecthand);
      }
      //if no card was thrown since demand include jacks id
      if (props.documents.function.type == "demandjokerjack") {
        for (var i = 0; i < 4; i++) {
          var path = require("@/assets/cards/" + suits[i] + 11 + ".png");
          var objecthand = { suit: suits[i], value: 11, path: path };
          demandjack.value.push(objecthand);
        }
      }
    }

    //all cards without jokers
    const clubs = ref([]);
    const diamonds = ref([]);
    const spades = ref([]);
    const hearts = ref([]);

    for (var i = 1; i < 14; i++) {
      var path = require("@/assets/cards/" + "c" + i + ".png");
      var objecthand = { suit: "c", value: i, path: path };
      clubs.value.push(objecthand);
    }
    for (var i = 1; i < 14; i++) {
      var path = require("@/assets/cards/" + "d" + i + ".png");
      var objecthand = { suit: "d", value: i, path: path };
      diamonds.value.push(objecthand);
    }
    for (var i = 1; i < 14; i++) {
      var path = require("@/assets/cards/" + "s" + i + ".png");
      var objecthand = { suit: "s", value: i, path: path };
      spades.value.push(objecthand);
    }
    for (var i = 1; i < 14; i++) {
      var path = require("@/assets/cards/" + "h" + i + ".png");
      var objecthand = { suit: "h", value: i, path: path };
      hearts.value.push(objecthand);
    }

    const handleAccept = () => {
      //function card and next turn
      const {
        functiondemand,
        turndatabase,
        demanddecrease,
        function23,
        functionstop,
        functionking,
        functionsuit,
        ifmakao,
        jokerMessage,
      } = game(props.table, props.player, props.documents, [], []);

      jokerMessage(props.user.uid, chosen.value);

      //changemiddlecard
      const { addDat: addmiddlecard } = useDatabase(
        "tables/" + props.table.id + "/middlecard/"
      );
      addmiddlecard(chosen.value);

      if (
        props.documents.function.type == "demandjoker" ||
        props.documents.function.type == "demandjokerjack"
      ) {
        if (chosen.value.value == 11) {
          functiondemand();
        } else {
          demanddecrease(props.documents);
          ifmakao(props.user.uid);
          turndatabase(1);
        }
      }
      //clean function if no demand
      else {
        const { addDat } = useDatabase(
          "tables/" + props.table.id + "/function/"
        );
        addDat({ amount: 0, type: "" });
        //check if it was function card
        if (chosen.value.value == 2 || chosen.value.value == 3) {
          function23(chosen.value, props.nextuserid, props.user.uid);
        } else if (chosen.value.value == 4) {
          functionstop(props.user.uid);
        } else if (chosen.value.value == 13) {
          functionking(
            chosen.value,
            props.nextuserid,
            props.previoususerid,
            props.user.uid
          );
        } else if (chosen.value.value == 1) {
          functionsuit();
        } else if (chosen.value.value == 11) {
          functiondemand();
        } else {
          ifmakao(props.user.uid);
          turndatabase(1);
        }
      }
    };

    return {
      clubs,
      diamonds,
      spades,
      hearts,
      chosen,
      handleAccept,
      demand,
      demandjack,
    };
  },
};
</script>

<style scoped>
.cards {
  display: flex;
  margin-left: 10%;
  column-gap: 10%;
  overflow: auto;
  height: 75%;
}
.suit {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.alldemand {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  left: 0;
  right: 0;
}
.demand {
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 10px;
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
  padding-top: 30px;
  text-align: center;
}
.inuse {
  border: 4px solid rgb(0, 119, 255);
}

@media only screen and (max-width: 545px) {
  .cards {
    column-gap: 5%;
  }
}
@media only screen and (max-width: 447px) {
  .cards {
    column-gap: 1%;
  }
}
@media only screen and (max-height: 480px) {
  .cards {
    height: 60%;
  }
}
@media only screen and (max-height: 350px) {
  .cards {
    height: 50%;
  }
}
</style>
