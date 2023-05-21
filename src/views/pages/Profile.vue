<template>
  <div class="row h-100 overflow-auto">
    <div class="col-md-8 col-xs-12 order-sm-2 col-sm-6 h-100 overflow-auto">
      <Title />
      <div v-if="error" class="error">{{ error }}</div>

      <div class="profile h-75" v-if="profile">
        <!--icons -->
        <div class="row h-100 overflow-auto">
          <div class="col-12">
            <ChangeIcon :profile="profile" :ownership="ownership" />
          </div>
          <!--user info-->
          <div class="col-12">
            <h3>User</h3>
            <div>name: {{ profile.name }}</div>
            <div>joined: {{ profile.createdAt }}</div>
          </div>

          <!--games info-->
          <div class="col-sm-6" v-if="ranking">
            <h3>Ranking Games</h3>
            <Statistics :lost="ranking.ranking_lost" :won="ranking.ranking_won"/>
            <div>points: {{ ranking.points }}</div>
          </div>
          <div class="col-sm-6">
            <h3>Casual Games</h3>
            <Statistics :lost="profile.lost" :won="profile.won"/>  
          </div>
          <div class="col-12 h-25">
            <!--description-->
            <Description :profile="profile" :ownership="ownership" />
          </div>
        </div>
        <!--Buttons-->
        <Invite v-if="!ownership" :userid="user.uid" :profile="profile"/>
        <button class="page" @click="$router.push({ name: 'Home' })">
          Return
        </button>
      </div>
    </div>

    <div class="col-sm-6 h-100 order-sm-1 col-md-4">
      <LeftSide/>
    </div>
  </div>
</template>

<script>
//components
import LeftSide from "@/components/LeftSide.vue";
import Title from "@/components/Title.vue";
import Description from "@/components/Profile/Description.vue";
import ChangeIcon from "@/components/Profile/ChangeIcon.vue";
import Statistics from "@/components/Profile/Statistics.vue";
import Invite from "@/components/Profile/Invite.vue";
//composables
import getUser from "@/composables/get/getUser";
import getDocument from "@/composables/get/getDocument";
//other
import { computed } from "@vue/runtime-core";

export default {
  props: ["id"],
  components: { LeftSide, Title, Description, ChangeIcon, Statistics, Invite},
  setup(props) {
    const { user } = getUser();
    const { error, document: profile } = getDocument("user_profile", props.id);
    const { document: ranking } = getDocument("user_ranking", props.id);
    
 
    const ownership = computed(() => {
      return profile.value && user.value && user.value.uid == profile.value.id;
    });

   

    return { user, error, profile, ownership, ranking};
  },
};
</script>

<style scoped>
.profile {
  margin-top: 50px;
  margin-bottom: 50px;
  text-align: center;
  margin-left: 5%;
  margin-right: 5%;
}
.page {
  margin-top: 10px;
  margin-bottom: 0px;
}
</style>