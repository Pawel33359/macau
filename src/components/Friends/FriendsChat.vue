<template>
<div class="error" v-if="error">{{error}}</div>
    <div class="img h-100">
        <div class="cover h-100" v-if="friend">
            <div v-for="usr in friend.users" :key="usr.userid">
                <div v-if="usr.userid != user.uid"><UserInfo :id="usr.userid"/></div>
            </div>

            <button class="btn btn-danger surrender exit btn--resize" @click="$router.push({ name: 'Friends', params: { id: 'all' } })">Exit Friend Chat</button>
            
            <FriendsChatAll :friend="friend" :user="user"/>
            <FriendsChatForm :friend="friend" :user="user"/>
        </div>
    </div>
</template>

<script>
//components
import UserInfo from "@/components/UserInfo.vue";
import FriendsChatForm from "@/components/Friends/FriendsChatForm.vue"
import FriendsChatAll from "@/components/Friends/FriendsChatAll.vue"
//composables
import getUser from "@/composables/getUser"
import getDocument from "@/composables/getDocument";
//other


export default {
  props:[ "id" ],
  components:{UserInfo, FriendsChatForm,FriendsChatAll},
  setup(props){
      const { user } = getUser()
      const { error,document: friend } = getDocument("friendlist", props.id);

    return{user,error,friend}
  }
}
</script>

<style scoped>
.img {
  background-image: url("../../assets/stos.png");
  background-size: cover;
}
.cover {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 40px 20px;
}
.exit{
    margin-bottom: 20px;
    margin-top: 20px;
}
</style>