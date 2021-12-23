<template>
  <div class="row h-100 overflow-auto" v-if="id == 'all'">
    <div class="col-md-8 col-xs-12 order-sm-2 col-sm-6 h-100 overflow-auto">
            <Title/>
            
            <!--user info-->
            <UserInfo :id="user.uid" />

            <FriendsButtons/>

            <FriendsList :user="user"/>

            <button 
                class="page"
                @click="$router.push({ name: 'Home'})"
            >
            Return
            </button>    
    </div>
    <div class="col-sm-6 h-100 order-sm-1 col-md-4">
      <LeftSide />
    </div>
  </div>
  
  <div class="row h-100 overflow-auto" v-else>
    <div class="col-md-8 order-sm-2 col-sm-6 d-xs-none h-100 overflow-auto d-none d-sm-block">
            <Title/>
            
            <!--user info-->
            <UserInfo :id="user.uid" />

            <FriendsButtons/>

            <FriendsList :user="user"/>

            <button 
                class="page"
                @click="$router.push({ name: 'Home'})"
            >
            Return
            </button>    
    </div>
    <div class="col-xs-12 col-sm-6 h-100 order-sm-1 col-md-4">
      <FriendsChat :id="id" />
    </div>
  </div>
</template>

<script>
//components
import LeftSide from '@/components/LeftSide.vue'
import Title from '@/components/Title.vue'
import UserInfo from "@/components/UserInfo.vue"
import FriendsButtons from "@/components/Friends/FriendsButtons.vue"
import FriendsList from "@/components/Friends/FriendsList.vue"
import FriendsChat from "@/components/Friends/FriendsChat.vue"
//composables
import getUser from "@/composables/getUser"

export default {
    props:[ "id" ],
    components: {LeftSide,Title,UserInfo,FriendsButtons,FriendsList,FriendsChat},
    setup(){
        const { user } = getUser()

        return {user}
    }

}
</script>

<style>
.friendbuttons{
        margin-top: 10px;
        width: 70%;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
</style>