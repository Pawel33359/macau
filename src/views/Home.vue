<template>
  <div class="row h-100 overflow-auto">
    <div class="col-md-8 col-xs-12 order-sm-2 col-sm-6">
      <Title />
      <div v-if="error" class="error">{{ error }}</div>

      <UserInfo :id="user.uid"/>
      <div class="menu">
        <button 
          class="page"
          @click="$router.push({ name: 'Search'})"
        >
        Search
        </button>

        <button
          class="page"
          @click="$router.push({ name: 'Profile', params: { id: user.uid } })"
        >
          Profile
        </button>

        <button  class="page"
          @click="$router.push({ name: 'Friends', params: { id: 'all' }})"
        >Friendlist</button>
        <button @click="handleClick" class="logout">Logout</button>
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
import useLogout from "../composables/useLogout";
import getUser from "../composables/getUser";
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

    return { handleClick, error, isPending, user };
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
.logout {
  margin-top: 100px;
  margin-bottom: 50px;
  width: 50%;
  background-color: rgb(223, 83, 83);
}
.logout:hover {
  background-color: rgb(100, 16, 16);
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
