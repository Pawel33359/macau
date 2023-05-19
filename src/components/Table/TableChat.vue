<template>
    <div v-if="table" class="messages" ref="messages">
      <div v-for="doc in formattedDocuments" :key="doc.id" class="single">
        <ArrayChatSingle :doc="doc" :user="user" :docid="table.id" :colname="colname"/>
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

export default {
    props: ["table","user"],
    components:{ArrayChatSingle},
    setup(props){
    const formattedDocuments = computed(() => {
      if (props.table) {
        return props.table.messages.map((doc) => {
          let time = formatDistance(Date.now(),doc.createdAt);
          return { ...doc, creationtime: time };
        });
      }
    });

    //auto-scroll to bottom
    const messages = ref(null);

    let colname = "tables"

    onUpdated(() => {
      messages.value.scrollTop = messages.value.scrollHeight;
    });

    return {messages,formattedDocuments,colname}
    }
}
</script>

<style scoped>
.messages{
  height: 45%;
}
</style>