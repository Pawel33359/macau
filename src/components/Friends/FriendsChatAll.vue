<template>
  <div v-if="friend" class="messages" ref="messages">
      <div v-for="doc in formattedDocuments" :key="doc.id" class="single">
        <ArrayChatSingle :doc="doc" :user="user" :docid="friend.id" :colname="colname"/>
      </div>
  </div>
</template>

<script>
//components
import ArrayChatSingle from "@/components/ArrayChatSingle.vue";
//other
import { formatDistance } from "date-fns";
import { computed } from "@vue/runtime-core";
import { onUpdated } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    components:{ArrayChatSingle},
    props:["friend","user"],
    setup(props){
        const formattedDocuments = computed(() => {
      if (props.friend) {
        return props.friend.messages.map((doc) => {
          let time = formatDistance(Date.now(),doc.createdAt);
          return { ...doc, creationtime: time };
        });
      }
    });
    //auto-scroll to bottom
    const messages = ref(null);
    onUpdated(() => {
      messages.value.scrollTop = messages.value.scrollHeight;
      //console.log(messages.value.scrollHeight)
    });

    //get name of collection to delete message later
    let colname = "friendlist"
    


    //if user doesn't belong to chat throw him to Home
    var i = 0;
    const router = useRouter();
    for(var usr of props.friend.users){
      if(usr.userid != props.user.uid){
        i++
      }
    }
    if(i==props.friend.users.length || props.friend.invite == false){
      router.push({ name: "Home" });
    }



    return {messages,formattedDocuments,colname}
    }
}
</script>

<style scoped>
.messages{
  height: 70%;
  width: 90%;
  margin:auto;
  left:0;
  right:0;
}
</style>