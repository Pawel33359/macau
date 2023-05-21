<template>
  <div class="img h-100">
    <div class="cover h-100">
      <!--if you're looking at ranking-->
      <div v-if="$store.state.currentMode == true" class="h-100">
        <a
          href="#/"
          @click="$store.commit('changecurrentMode')"
          class="btn btn-primary btn--resize"
          >Chat</a
        >
        <button class="btn btn-primary btn--resize" disabled>Ranking</button>
        <Ranking :user="user"/>
      </div>
      <!--if you're looking at chat-->
      <div v-else class="h-100">
        <button class="btn btn-primary btn--resize" disabled>Chat</button>
        <a
          href="#/"
          @click="$store.commit('changecurrentMode')"
          class="btn btn-primary btn--resize"
          >Ranking</a
        >
        <GlobalChatWindow :user="user"/>
      </div>
    </div>
  </div>
</template>

<script>
//components
import GlobalChatWindow from "./Global/GlobalChatWindow.vue";
import Ranking from "./Ranking/Ranking.vue";
//composables
import getUser from "@/composables/get/getUser"

export default {
  components: { GlobalChatWindow, Ranking },
  setup(){
    const { user } = getUser()

    return{user}
  }
};
</script>

<style scoped>
.img {
  background-image: url("../assets/stos.png");
  background-size: cover;
}
.cover {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 40px 20px;
}
</style>