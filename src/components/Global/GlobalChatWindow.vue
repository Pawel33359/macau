<template>
    <div v-if="error">{{ error }}</div>
    <div v-if="documents" class="messages" ref="messages">
      <div v-for="doc in formattedDocuments" :key="doc.id" class="single">
        <GlobalSingleChatWindow :doc="doc" :user="user"/>
      </div>
    </div>
    <div class="new_message"><GlobalNewChatForm /></div>
</template>

<script>
//components
import GlobalNewChatForm from "./GlobalNewChatForm.vue";
import GlobalSingleChatWindow from "./GlobalSingleChatWindow.vue";
//composables
import getCollection from "@/composables/get/getCollection";
//other
import { formatDistanceToNow } from "date-fns";
import { computed } from "@vue/runtime-core";
import { onUpdated } from "vue";
import { ref } from "vue";

export default {
  components: { GlobalNewChatForm, GlobalSingleChatWindow },
  props:["user"],
  setup() {
    const { error, documents } = getCollection("global_messages");

    const formattedDocuments = computed(() => {
      if (documents.value) {
        return documents.value.map((doc) => {
          let time = formatDistanceToNow(doc.createdAt.toDate());
          return { ...doc, createdAt: time };
        });
      }
    });
    //auto-scroll to bottom
    const messages = ref(null);

    onUpdated(() => {
      messages.value.scrollTop = messages.value.scrollHeight;
    });

    return { error, documents, formattedDocuments, messages };
  },
};
</script>

<style>
.new_message {
  margin: 10px;
  border-radius: 20px;
  border: 2px solid rgb(87, 87, 87);
  background-color: rgb(255, 255, 255);
}
.single {
  margin: 18px 0;
  display: flex;
}
.messages {
  height: 80%;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 11px 8px 7px 3px rgb(0 0 0 / 35%);
}

@media only screen and (max-width: 575px) {
  .messages {
    margin-left: 20px;
  }
}
</style>