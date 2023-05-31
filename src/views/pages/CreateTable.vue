<template>
  <div class="row h-100 overflow-auto">
    <div class="col-md-8 col-xs-12 order-sm-2 col-sm-6 h-100 overflow-auto">
      <Title />
      <!--user info-->
      <UserInfo :id="user.uid" />
      <!--create table form-->
      <form @submit.prevent="handleSubmit">
        <h3>Create Table</h3>
        <!--Input table name-->
        <input type="text" placeholder="Table Name" v-model="name" />
        <!--Ranking and password buttons-->
        <div class="row">
          <!--Ranking-->
          <div class="col-12 mt-2">Will it be a ranking table?</div>
          <!--Ranking buttons if it's not a ranking game-->
          <div class="row" v-if="ifranking === false">
            <div class="col-md-2 col-sm-4">
              <button class="btn btn-primary" @click="ifranking = true">
                Yes
              </button>
            </div>
            <div class="col-md-2 col-sm-4">
              <button class="btn btn-success" disabled>No</button>
            </div>
          </div>
          <!--Ranking buttons if it is a ranking game-->
          <div class="row" v-else>
            <div class="col-md-2 col-sm-4">
              <button class="btn btn-success" disabled>Yes</button>
            </div>
            <div class="col-md-2 col-sm-4">
              <button class="btn btn-primary" @click="ifranking = false">
                No
              </button>
            </div>
          </div>
          <!--Password-->
          <div class="col-12 mt-4">Will there be a password?</div>
          <!--Password buttons for no password option-->
          <div class="row" v-if="ifpassword === false">
            <div class="col-md-2 col-sm-4">
              <button class="btn btn-primary" @click="ifpassword = true">
                Yes
              </button>
            </div>
            <div class="col-md-2 col-sm-4">
              <button class="btn btn-success" disabled>No</button>
            </div>
            <div class="col-12 mt-2">
              <input
                type="password"
                placeholder="Password"
                v-model="password"
                disabled
              />
            </div>
          </div>
          <!--Password buttons for password option-->
          <div class="row" v-else>
            <div class="col-md-2 col-sm-4">
              <button class="btn btn-success" disabled>Yes</button>
            </div>
            <div class="col-md-2 col-sm-4">
              <button class="btn btn-primary" @click="handleClick">No</button>
            </div>
            <div class="col-12 mt-2">
              <input
                type="password"
                placeholder="Password"
                v-model="password"
              />
            </div>
          </div>
        </div>
        <!--Display Error if exists and Create button-->
        <div class="error" v-if="error">{{ error }}</div>
        <button v-if="!isPending">Create</button>
        <button v-if="isPending" disabled>Loading</button>
      </form>
      <button class="page" @click="$router.push({ name: 'Search' })">
        Return
      </button>
    </div>
    <div class="col-sm-6 h-100 order-sm-1 col-md-4">
      <LeftSide />
    </div>
  </div>
</template>

<script>
//components
import LeftSide from "@/components/LeftSide.vue";
import Title from "@/components/Title.vue";
import UserInfo from "@/components/UserInfo.vue";
//composables
import getUser from "@/composables/get/getUser";
import useCollection from "@/composables/use/useCollection";
import getTables from "@/composables/get/getTables";
import getWatchedtables from "@/composables/get/getWatchedtables";
//other
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";

export default {
  components: { LeftSide, Title, UserInfo },
  setup() {
    //calling composables
    const { user } = getUser();
    const { addDoc, error, isPending, id } = useCollection("tables");
    const { tables } = getWatchedtables();

    const router = useRouter();

    //models
    const password = ref("");
    const name = ref("");
    const ifranking = ref(false);
    const ifpassword = ref(false);

    //erase existing pasword if you change from yes option to no
    const handleClick = () => {
      ifpassword.value = false;
      password.value = "";
    };

    //handle Creating new table
    const handleSubmit = async () => {
      //check if name is at least 6 characters long
      if (name.value.length < 6 || name.value.length > 20) {
        error.value = "Name needs to be from 6 to 20 characters long!";
      } else {
        //get tables with the same name as current name
        const { tables, load } = getTables("name", "==", name.value);

        await load();

        //check if name already exists
        if (tables.value.length > 0) {
          error.value = "Name already exists!";
        } else {
          //check if password is at least 4 characters long
          if (password.value.length < 4 && ifpassword.value === true) {
            error.value = "Password needs to be at least 4 characters long!";
          } else {
            //check table
            const table = {
              name: name.value,
              password: password.value,
              ranking: ifranking.value,
              messages: [],
              inprogress: false,
              computer: false,
              users: [
                {
                  userid: user.value.uid,
                  name: user.value.displayName,
                  ready: false,
                },
              ],
            };
            //add table to database
            await addDoc(table);
            //if succesful go to table
            if (!error.value) {
              router.push({ name: "Table", params: { id: id.value } });
            }
          }
        }
      }
    };
    return {
      error,
      password,
      name,
      tables,
      ifranking,
      ifpassword,
      isPending,
      handleClick,
      handleSubmit,
      user,
    };
  },
};
</script>

<style></style>
