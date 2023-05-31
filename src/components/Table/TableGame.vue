<template>
  <div
    class="tablebackground h-100 w-100"
    :class="{ notinprogress: table.inprogress === false }"
    v-if="table"
  >
    <div v-if="table.inprogress === false">
      <button
        class="btn btn-primary"
        @click="handleReady"
        v-if="ready === false"
      >
        Ready for game?
      </button>
      <div v-else>
        <button class="btn btn-primary" disabled>Ready for game?</button>
        <button class="btn btn-primary" @click="handleCancel">Cancel</button>
      </div>
    </div>
    <div v-else class="w-100 h-100 gametable">
      <TableInprogress
        v-if="documents"
        :table="table"
        :user="user"
        :profiles="profiles"
        :rankings="rankings"
      />
    </div>
  </div>
</template>

<script>
//components
import TableInprogress from "@/components/Table/TableInprogress.vue";
//composables
import useDocument from "@/composables/use/useDocument";
import useDatabase from "@/composables/use/useDatabase";
import getDocument from "@/composables/get/getDocument";
import getDatabase from "@/composables/get/getDatabase";
import game from "@/composables/game/game.js";
//other
import { ref } from "@vue/reactivity";

export default {
  props: ["table", "user"],
  components: { TableInprogress },
  setup(props) {
    //preparing functions for changing table and getting table from database
    const {
      error,
      removeArrayObject,
      updateArrayObject,
      updateDoc,
    } = useDocument("tables", props.table.id);
    const { documents } = getDatabase("tables/" + props.table.id);

    //prepare players rankings and profiles because it wont work later
    const profiles = ref([]);
    const rankings = ref([]);
    //if game in progress
    const assign = async () => {
      for (const usr of props.table.users) {
        {
          const { document: profile } = await getDocument(
            "user_profile",
            usr.userid
          );
          profiles.value.push(profile);
        }
        {
          const { document: ranking } = await getDocument(
            "user_ranking",
            usr.userid
          );
          rankings.value.push(ranking);
        }
      }
    };
    if (props.table.inprogress === true) {
      assign();
    }

    //ready for check if show cancel button
    const ready = ref(false);
    for (const usr of props.table.users) {
      if (usr.userid === props.user.uid) {
        ready.value = usr.ready;
      }
    }

    const currentuser = {
      name: props.user.displayName,
      userid: props.user.uid,
      ready: true,
    };
    const pastuser = {
      name: props.user.displayName,
      userid: props.user.uid,
      ready: false,
    };
    const handleReady = async () => {
      updateArrayObject("users", currentuser);
      ready.value = true;
      if (!error.value) {
        await removeArrayObject("users", pastuser);
        let ready;
        if (props.table.computer === false) ready = checkReady();
        else ready = { inprogr: true, playercount: 4 };

        if (ready.inprogr === true && ready.playercount > 1) {
          const { deal } = game(props.table, { cards: [] }, [], [], []);
          deal();
          for (const usr of props.table.users) {
            const { document: profile } = await getDocument(
              "user_profile",
              usr.userid
            );
            profiles.value.push(profile);
            const { document: ranking } = await getDocument(
              "user_ranking",
              usr.userid
            );
            rankings.value.push(ranking);
          }
          {
            const { addDat } = useDatabase(
              "tables/" + props.table.id + "/currentturn/"
            );
            addDat({ turn: 1 });
          }
          {
            const { addDat } = useDatabase(
              "tables/" + props.table.id + "/playercount/"
            );
            addDat({ number: ready.playercount });
          }
          {
            const { addDat } = useDatabase(
              "tables/" + props.table.id + "/function/"
            );
            addDat({ type: "", amount: 0 });
          }
          {
            const { addDat } = useDatabase(
              "tables/" + props.table.id + "/makao/"
            );
            addDat({ user: "" });
          }
          const turns = [];
          for (let i = 1; i <= ready.playercount; i++) {
            turns.push(i);
          }
          const result = [];
          for (let i = ready.playercount; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            result.push(turns[j]);
            turns.splice(j, 1);
          }
          if (props.table.computer === false) setPlayers(result);
          else setComputers();

          await updateDoc({ inprogress: true });
        }
      } else {
        error.value = "Failed to update table";
      }
    };

    const checkReady = () => {
      let inprogr = true;
      let playercount = 0;
      for (const usr of props.table.users) {
        playercount++;
        if (usr.ready === false) {
          inprogr = false;
        }
      }
      return { inprogr, playercount };
    };

    const setPlayers = async (result) => {
      let order = 0;
      const proms = [];
      for (const usr of props.table.users) {
        const { addDat } = useDatabase(
          "tables/" + props.table.id + "/users/" + usr.userid + "/information/"
        );
        // await addDat({
        proms.push(
          addDat({
            name: usr.name,
            id: usr.userid,
            turn: result[order],
          })
        );
        order++;
      }
      await Promise.all(proms);
    };
    const setComputers = async () => {
      const proms = [];
      {
        const { addDat } = useDatabase(
          "tables/" +
            props.table.id +
            "/users/" +
            props.user.uid +
            "/information/"
        );
        proms.push(
          addDat({
            name: props.user.displayName,
            id: props.user.uid,
            turn: 1,
          })
        );
      }
      for (let i = 1; i < 4; i++) {
        const { addDat } = useDatabase(
          "tables/" + props.table.id + "/users/" + i + "/information/"
        );
        proms.push(
          addDat({
            name: `${i}`,
            id: `${i}`,
            turn: i + 1,
          })
        );
      }
      await Promise.all(proms);
    };

    //cancel ready
    const handleCancel = async () => {
      //create new user with ready: false and remove user with ready: true
      updateArrayObject("users", pastuser);
      ready.value = false;
      if (!error.value) {
        removeArrayObject("users", currentuser);
      } else {
        error.value = "Failed to update table";
      }
    };

    return { handleReady, ready, handleCancel, documents, profiles, rankings };
  },
};
</script>

<style>
.tablebackground {
  background-color: rgb(14, 87, 14);
  border: 6px solid rgb(161, 56, 56);
  border-style: ridge;
}
.notinprogress {
  display: flex;
  align-items: center; /* | */
  justify-content: center; /* - */
}
.gametable {
  position: relative;
}
</style>
