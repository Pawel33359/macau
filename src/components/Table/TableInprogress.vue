<template>
  <!--choosing functions-->
  <div
    v-if="
      (documents.function.type == 'ace' ||
        documents.function.type == 'joker' ||
        documents.function.type == 'demandnot' ||
        documents.function.type == 'demandjoker' ||
        documents.function.type == 'demandjokerjack') &&
        documents.currentturn.turn == placement[0]
    "
    class="w-100 h-100"
  >
    <div v-if="documents.function.type == 'ace'">
      <Ace
        :table="table"
        :documents="documents"
        :user="user"
        :player="player"
      />
    </div>
    <div
      v-if="
        documents.function.type == 'joker' ||
          documents.function.type == 'demandjoker' ||
          documents.function.type == 'demandjokerjack'
      "
      class="h-100 w-100"
    >
      <Joker
        :table="table"
        :documents="documents"
        :nextuserid="nextuserid"
        :previoususerid="previoususerid"
        :user="user"
        :player="player"
      />
    </div>
    <div v-if="documents.function.type == 'demandnot'" class="h-100 w-100">
      <Demand
        :table="table"
        :documents="documents"
        :user="user"
        :player="player"
      />
    </div>
  </div>
  <!--players and drawpile and throwpile-->
  <div v-else class="w-100 h-100">
    <div class="demandscreen">
      <div
        class="demand"
        v-if="
          documents.function.type == 'demandyes' ||
            documents.function.type == 'demandjoker' ||
            documents.function.type == 'demandjokerjack'
        "
      >
        <div class="playerinfo">Demanded</div>
        <div class="playerinfo" v-if="documents.function.value == 12">
          card: Q
        </div>
        <div class="playerinfo" v-else>
          card: {{ documents.function.value }}
        </div>
        <div class="playerinfo">
          Turns left: {{ documents.function.amount }}
        </div>
      </div>
    </div>
    <div class="draw w-25 h-25 row">
      <div class="col-xs-12 col-sm-6 mb-2 p-0">
        <img
          @click="draw(user.uid)"
          src="@/assets/cards/b1.png"
          width="80"
          class="drawpile"
        />
      </div>
      <div class="col-xs-12 col-sm-6 p-0 throwp" v-if="documents">
        <img :src="documents.middlecard.path" width="80" class="throwpile" />
      </div>
    </div>
    <!--div v-if=documents if error remember-->
    <div v-if="documents.playercount.number == 2">
      <div v-for="player in documents.users" :key="player.information.turn">
        <div
          v-if="player.information.turn == placement[0]"
          class="playercards w-50"
        >
          <!--playerinformation-->
          <div
            class="mainplayer"
            v-if="player.cards"
            :class="{
              currentturn:
                player.information.turn == documents.currentturn.turn,
              playerinfo: player.information.turn != documents.currentturn.turn,
            }"
          >
            {{ player.information.name }}
            Cards:{{ player.cards.length }}
          </div>
          <!--player hand-->
          <div v-for="card in player.cards" :key="card.id" class="card">
            <img
              @click="throwcard(user.uid, card, nextuserid, previoususerid)"
              :src="card.path"
              width="80"
              class="owned"
            />
          </div>
          <!--makao button-->
          <div v-if="documents.makao.user == player.information.id">
            <button
              @click="makao(player.information.id)"
              class="btn btn-warning makao"
            >
              MAKAO
            </button>
          </div>
        </div>

        <div
          v-if="player.information.turn == placement[1]"
          class="playerfrontcards w-50"
        >
          <!--playerinformation-->
          <div
            class="frontplayer"
            v-if="player.cards"
            :class="{
              currentturn:
                player.information.turn == documents.currentturn.turn,
              playerinfo: player.information.turn != documents.currentturn.turn,
            }"
          >
            {{ player.information.name }}
            Cards:{{ player.cards.length }}
          </div>
          <!--player hand-->
          <div v-for="card in player.cards" :key="card.id" class="card">
            <img src="@/assets/cards/b1.png" width="80" />
          </div>
          <!--makao button-->
          <div v-if="documents.makao.user == player.information.id">
            <button
              @click="stopmakao(player.information.id)"
              class="btn btn-danger stop-makao-front"
            >
              STOP MAKAO
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-for="player in documents.users" :key="player.information.turn">
        <div
          v-if="player.information.turn == placement[0]"
          class="playercards w-50"
        >
          <!--playerinformation-->
          <div
            class="mainplayer"
            v-if="player.cards"
            :class="{
              currentturn:
                player.information.turn == documents.currentturn.turn,
              playerinfo: player.information.turn != documents.currentturn.turn,
            }"
          >
            {{ player.information.name }}
            Cards:{{ player.cards.length }}
          </div>
          <!--player hand-->
          <div v-for="card in player.cards" :key="card.id" class="card">
            <img
              @click="throwcard(user.uid, card, nextuserid, previoususerid)"
              :src="card.path"
              width="80"
              class="owned"
            />
          </div>

          <!--makao button-->
          <div v-if="documents.makao.user == player.information.id">
            <button
              @click="makao(player.information.id)"
              class="btn btn-warning makao"
            >
              MAKAO
            </button>
          </div>
        </div>

        <div
          v-if="player.information.turn == placement[1]"
          class="playerleftcards h-50"
        >
          <!--playerinformation-->
          <div
            class="leftplayer"
            v-if="player.cards"
            :class="{
              currentturn:
                player.information.turn == documents.currentturn.turn,
              playerinfo: player.information.turn != documents.currentturn.turn,
            }"
          >
            {{ player.information.name }}
            Cards:{{ player.cards.length }}
          </div>
          <!--player hand-->
          <div v-for="card in player.cards" :key="card.id" class="card">
            <img src="@/assets/cards/b1.png" width="80" />
          </div>
          <!--makao button-->
          <div v-if="documents.makao.user == player.information.id">
            <button
              @click="stopmakao(player.information.id)"
              class="btn btn-danger stop-makao-left"
            >
              STOP MAKAO
            </button>
          </div>
        </div>

        <div
          v-if="player.information.turn == placement[2]"
          class="playerfrontcards w-50"
        >
          <!--playerinformation-->
          <div
            class="frontplayer"
            v-if="player.cards"
            :class="{
              currentturn:
                player.information.turn == documents.currentturn.turn,
              playerinfo: player.information.turn != documents.currentturn.turn,
            }"
          >
            {{ player.information.name }}
            Cards:{{ player.cards.length }}
          </div>
          <!--player hand-->
          <div v-for="card in player.cards" :key="card.id" class="card">
            <img src="@/assets/cards/b1.png" width="80" />
          </div>
          <!--makao button-->
          <div v-if="documents.makao.user == player.information.id">
            <button
              @click="stopmakao(player.information.id)"
              class="btn btn-danger stop-makao-front"
            >
              STOP MAKAO
            </button>
          </div>
        </div>

        <div
          v-if="player.information.turn == placement[3]"
          class="playerrightcards h-50"
        >
          <!--playerinformation-->
          <div
            class="rightplayer"
            v-if="player.cards"
            :class="{
              currentturn:
                player.information.turn == documents.currentturn.turn,
              playerinfo: player.information.turn != documents.currentturn.turn,
            }"
          >
            {{ player.information.name }}
            Cards:{{ player.cards.length }}
          </div>
          <!--player hand-->
          <div v-for="card in player.cards" :key="card.id" class="card">
            <img src="@/assets/cards/b1.png" width="80" />
          </div>
          <!--makao button-->
          <div v-if="documents.makao.user == player.information.id">
            <button
              @click="stopmakao(player.information.id)"
              class="btn btn-danger stop-makao-right"
            >
              STOP MAKAO
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//class card makes cards go on top of each other
//components
import Ace from "@/components/Table/Ace.vue";
import Joker from "@/components/Table/Joker.vue";
import Demand from "@/components/Table/Demand.vue";
//composables
import getDatabase from "@/composables/get/getDatabase";
import game from "@/composables/game";
//other
import { ref } from "@vue/reactivity";

export default {
  //
  components: { Ace, Joker, Demand },
  props: ["table", "user", "profiles", "rankings"],
  setup(props) {
    //get user playing
    const { documents: player } = getDatabase(
      "tables/" + props.table.id + "/users/" + props.user.uid
    );

    //get all users
    const { documents } = getDatabase("tables/" + props.table.id);

    const { draw, throwcard, makao, stopmakao } = game(
      props.table,
      player.value,
      documents.value,
      props.profiles,
      props.rankings
    );

    var userturn = player.value.information.turn;

    //set placement around the table
    //placement[user,left,front,right]
    const placement = ref([]);
    var j = userturn;
    for (var i = 0; i < documents.value.playercount.number; i++) {
      placement.value.push(j);
      if (j == documents.value.playercount.number) {
        j = 1;
      } else {
        j++;
      }
    }

    //get next player and previous player

    var nextuserid;
    var nextuserturn;
    var previoususerid;
    var previoususerturn;

    if (userturn == documents.value.playercount.number) {
      nextuserturn = 1;
    } else {
      nextuserturn = userturn + 1;
    }

    if (userturn == 1) {
      previoususerturn = documents.value.playercount.number;
    } else {
      previoususerturn = userturn - 1;
    }

    //get next and previous user id
    var users = Object.keys(documents.value.users);
    for (var checkuser of users) {
      const { documents: nuser } = getDatabase(
        "tables/" + props.table.id + "/users/" + checkuser
      );
      if (nuser.value.information.turn == nextuserturn) {
        nextuserid = nuser.value.information.id;
      }
      if (nuser.value.information.turn == previoususerturn) {
        previoususerid = nuser.value.information.id;
      }
    }

    return {
      placement,
      draw,
      throwcard,
      documents,
      nextuserid,
      previoususerid,
      makao,
      stopmakao,
      player,
    };
  },
};
</script>

<style scoped>
.throwp {
  padding-left: 10px;
}
.card {
  overflow: hidden;
  width: 80px;
}
.card:last-child,
.card:hover {
  overflow: visible;
}
.draw {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background-color: rgb(14, 87, 14);
}

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

/*player information next to the cards */
.currentturn {
  color: rgb(218, 60, 60);
}
.playerinfo {
  color: aliceblue;
}
.mainplayer {
  margin-right: 10px;
}
.leftplayer {
  margin-bottom: 10px;
}
.frontplayer {
  margin-right: 10px;
}
.rightplayer {
  margin-bottom: 10px;
}

/*playercards */
.playercards {
  display: flex;
  justify-content: center;
  position: absolute;
  padding-bottom: 1%;
  margin: auto;
  bottom: 0;
  left: 0;
  right: 0;
}
/*cards of player in front*/
.playerfrontcards {
  display: flex;
  justify-content: center;
  position: absolute;
  padding-top: 1%;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
}
/*cards of player on left and right*/
.playerleftcards {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  padding-left: 1%;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
}
.playerrightcards {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  padding-right: 1%;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
}

img {
  border: none;
}
img.owned:hover {
  transform: scale(1.3);
  z-index: 2;
  cursor: pointer;
}
img.drawpile:hover {
  transform: scale(1.1);
  cursor: pointer;
}
img.drawpile {
  margin-right: 25px;
}

/*makao and stop makao buttons*/
.makao {
  position: absolute;
  margin: auto;
  bottom: 140px;
  left: 50%;
}
.stop-makao-front {
  position: absolute;
  margin: auto;
  top: 140px;
  left: 50%;
}
.stop-makao-left {
  position: absolute;
  margin: auto;
  top: 50%;
  left: 100px;
  white-space: normal;
  word-wrap: break-word;
  width: 88px;
}
.stop-makao-right {
  position: absolute;
  margin: auto;
  top: 50%;
  right: 120px;
  white-space: normal;
  word-wrap: break-word;
  width: 88px;
}

/*make cards smaller */
@media only screen and (max-width: 575px), only screen and (max-height: 400px) {
  .stop-makao-left {
    width: 30px;
  }
  .stop-makao-right {
    width: 30px;
  }
  .playerfrontcards {
    left: 25%;
  }
  img {
    width: 60px;
  }
  img.owned {
    width: 70px;
  }

  .card {
    overflow: hidden;
    width: 60px;
  }
  .playerrightcards {
    align-items: center;
  }

  .makao {
    font-size: small;
  }
  .stop-makao-front {
    top: 110px;
    font-size: small;
  }
  .stop-makao-left {
    left: 80px;
    font-size: small;
  }
  .stop-makao-right {
    right: 100px;
    font-size: small;
  }
}
</style>
