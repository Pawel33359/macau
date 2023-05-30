<template>
  <div class="row h-100 overflow-auto">
    <div class="col-md-8 col-xs-12 order-sm-2 col-sm-6">
      <Title />
      <div v-if="error" class="error">{{ error }}</div>

      <UserInfo :id="user.uid" />
      <div class="menu">
        <button class="page" @click="goToComputer">
          Play with Computer
        </button>
        <button class="page" @click="$router.push({ name: 'Search' })">
          Search
        </button>

        <button
          class="page"
          @click="$router.push({ name: 'Profile', params: { id: user.uid } })"
        >
          Profile
        </button>

        <button
          class="page"
          @click="$router.push({ name: 'Friends', params: { id: 'all' } })"
        >
          Friendlist
        </button>
        <button
          @click="handleClick"
          class="logout btn__bottom"
          v-if="!user.isAnonymous"
        >
          Logout
        </button>
        <button
          @click="$router.push({ name: 'CreateAccount' })"
          class="account btn__bottom"
          v-else
        >
          Create an account
        </button>
      </div>
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
import useLogout from "../composables/use/useLogout";
import useSetCollection from "../composables/use/useSetCollection";
import getUser from "../composables/get/getUser";
//other
import { useRouter } from "vue-router";

export default {
  name: "Home",
  components: { Title, UserInfo, LeftSide },
  setup() {
    const router = useRouter();
    const { error, logout, isPending } = useLogout();
    const { user } = getUser();

    const handleClick = async () => {
      await logout();
      console.log("user logged out");
      router.push({ name: "Login" });
    };

    const goToComputer = async () => {
      const { setDoc } = useSetCollection("tables", user.value.uid);
      const table = {
        name: user.value.displayName,
        password: "",
        ranking: false,
        messages: [],
        inprogress: false,
        computer: true,
        users: [
          {
            userid: user.value.uid,
            name: user.value.displayName,
            ready: false,
          },
        ],
      };
      //add table to database
      await setDoc(table);

      router.push({ name: "Table", params: { id: user.value.uid } });
    };

    return { handleClick, error, isPending, user, goToComputer };
  },
};
</script>

<style>
.h3 {
  font-size: 100px;
}
.menu {
  text-align: center;
}

.btn__bottom {
  margin-top: 100px;
  margin-bottom: 50px;
  width: 50%;
}
.logout {
  background-color: rgb(223, 83, 83);
}
.logout:hover {
  background-color: rgb(100, 16, 16);
  color: rgb(254, 254, 255);
}
.account {
  background-color: #51cf66;
}
.account:hover {
  background-color: #2b8a3e;
  color: rgb(254, 254, 255);
}

.page {
  margin-top: 50px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.btn--resize {
  width: 50%;
}
</style>
