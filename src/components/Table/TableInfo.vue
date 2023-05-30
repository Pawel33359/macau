<template>
  <div class="background h-100">
    <div class="cover h-100">
      <h1>{{ table.name }}</h1>
      <div class="error" v-if="error">{{ error }}</div>
      <div v-for="usr in table.users" :key="usr.userid">
        <div v-if="usr.userid == user.uid">
          <div v-if="table.inprogress == true && table.computer === false">
            <Surrender
              v-if="ranking && profile"
              :table="table"
              :user="user"
              :profile="profile"
              :ranking="ranking"
            />
          </div>
          <div v-else>
            <button
              v-if="usr.ready == false || table.computer === true"
              class="page"
              @click="handleClick"
            >
              Return
            </button>
            <button v-else class="page" disabled>Return</button>
          </div>
        </div>
      </div>
      <div class="userlist" v-if="!table.computer">
        <div v-for="user in table.users" :key="user.userid" class="users">
          <h5 class="names" v-if="user.ready == false">{{ user.name }}</h5>
          <div v-else class="ready">
            <h5 class="names">{{ user.name }}</h5>
            <h5 class="readysign">Ready</h5>
          </div>
        </div>
      </div>
      <TableChat :table="table" :user="user" />
      <TableNewChatForm :table="table" :user="user" v-if="!table.computer" />
    </div>
  </div>
</template>

<script>
//components
import TableChat from "@/components/Table/TableChat.vue";
import TableNewChatForm from "@/components/Table/TableNewChatForm.vue";
import Surrender from "@/components/Table/Surrender.vue";
//composables
import useDatabase from "@/composables/use/useDatabase";
import useDocument from "@/composables/use/useDocument";
import getDocument from "@/composables/get/getDocument";
//other
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: { TableChat, TableNewChatForm, Surrender },
  props: ["table", "user"],
  setup(props) {
    const store = useStore();

    const { error, removeArrayObject, deleteDoc } = useDocument(
      "tables",
      props.table.id
    );

    const { document: profile } = getDocument("user_profile", props.user.uid);
    const { document: ranking } = getDocument("user_ranking", props.user.uid);

    const router = useRouter();

    const currentuser = {
      name: props.user.displayName,
      userid: props.user.uid,
      ready: false,
    };

    // Leave a table
    const handleClick = async () => {
      if (props.table.computer === true) {
        deleteTable();
        return;
      }
      await removeArrayObject("users", currentuser);
      if (!error.value) {
        if (props.table.users.length == 0) {
          deleteTable();
        } else {
          goBack();
        }
      } else {
        error.value = "Failed to update table";
      }
    };

    const deleteTable = async () => {
      if (props.table.inprogress === true) {
        const { deleteDat } = useDatabase("tables/" + props.table.id);
        deleteDat();
      }
      await deleteDoc();
      if (!error.value) {
        goBack();
      } else {
        error.value = "Couldn't remove user from the table";
      }
    };

    const goBack = () => {
      // clear computer game if there is one
      if (store.state.intervalFn) store.commit("clearIntervalFn");

      // Go to previous page
      if (props.table.computer === true) router.push({ name: "Home" });
      else router.push({ name: "Search" });
    };

    return { error, handleClick, profile, ranking };
  },
};
</script>

<style scoped>
h1 {
  padding: 0;
  margin: 0;
  margin-top: 0.5rem;
}
.background {
  background-image: url("../../assets/stos.png");
  background-size: cover;
}
.cover {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px 20px;
}
.userlist {
  overflow: auto;
  margin-top: 30px;
  height: 18%;
}
.names {
  margin-left: 15px;
}
.ready {
  display: flex;
}
.readysign {
  margin-left: 15px;
  color: rgb(138, 224, 138);
}
</style>
