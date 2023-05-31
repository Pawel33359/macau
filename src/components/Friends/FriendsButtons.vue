<template>
  <!--false - friendlist
true- invites
-->
  <div class="searchbuttons" v-if="$store.state.friendsMode === false">
    <button class="btn btn-secondary btn--resize" disabled>FriendList</button>
    <button
      class="btn btn-primary btn--resize"
      @click="$store.commit('changefriendsMode')"
    >
      Invites
    </button>
  </div>
  <div class="searchbuttons" v-else>
    <button
      class="btn btn-primary btn--resize"
      @click="$store.commit('changefriendsMode')"
    >
      FriendList
    </button>
    <button class="btn btn-secondary btn--resize" disabled>Invites</button>
  </div>
</template>

<script>
export default {};
</script>

<style>
.searchbuttons {
  margin-top: 10px;
  width: 70%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
