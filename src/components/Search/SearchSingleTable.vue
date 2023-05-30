<template>
  <div v-if="table.inprogress == false" class="singletable">
    <div
      class="line"
      @click="handleClick"
      :class="{ notfull: table.users.length < 4 }"
    >
      <div v-if="table.ranking == true"><h4>R</h4></div>
      <div v-else><h4>N</h4></div>
      <div class="name table__name">Name: {{ table.name }}</div>
      <div class="password" v-if="table.password != ''">
        <font-awesome-icon icon="lock" />
      </div>
    </div>
    <div
      class="line"
      @click="handleClick"
      :class="{ notfull: table.users.length < 4 }"
    >
      Users:
      <div class="users" v-for="usr in table.users" :key="usr.userid">
        {{ usr.name }}
      </div>
    </div>
    <div class="error" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
//composables
import useDocument from "@/composables/use/useDocument";
//other
import { useRouter } from "vue-router";

export default {
  props: ["table", "user"],
  setup(props, context) {
    const { error, updateDoc } = useDocument("tables", props.table.id);

    const router = useRouter();

    //curent user information for table
    const currentuser = {
      name: props.user.displayName,
      userid: props.user.uid,
      ready: false,
    };

    //go to table
    const handleClick = async () => {
      if (props.table.users.length < 4 || props.table.inprogress == false) {
        //if table doesn't have password
        if (props.table.password == "") {
          await updateDoc({
            users: [...props.table.users, currentuser],
          });
          if (!error.value) {
            router.push({ name: "Table", params: { id: props.table.id } });
          } else {
            error.value = "Table user list couldn't been updated";
          }
        }
        //if table has password
        else {
          context.emit("handlePassword", props.table);
        }
      }
    };

    return { handleClick, error };
  },
};
</script>

<style>
.singletable {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgb(4, 1, 34);
  width: 100%;
  border-radius: 8px;
  margin: auto;
  padding-left: 1rem;
}
.line {
  overflow: auto;
  display: flex;
}
.name {
  overflow: auto;
}
.table__name {
  padding-left: 1rem;
}
.password {
  margin-left: auto;
  overflow: visible;
}
.users {
  border: 1px solid rgb(4, 1, 34);
  border-radius: 8px;
  margin-left: 1rem;
}
.notfull {
  cursor: pointer;
}
</style>
