<template>
  <textarea
    placeholder="Type a message and hit enter to send..."
    v-model="message"
    @keydown.enter.prevent="handleSubmit"
    rows="3"
  ></textarea>
  <div class="error" v-if="error">{{ error }}</div>
</template>

<script>
//composables
import getUser from "@/composables/getUser";
import useCollection from "@/composables/useCollection";
//other
import { ref } from "vue";
import { timestamp } from "@/firebase/config";

export default {
  setup() {
    const { user } = getUser();
    const { addDoc, error } = useCollection("global_messages");

    const message = ref("");

    const handleSubmit = async () => {
      const chat = {
        name: user.value.displayName,
        userid: user.value.uid,
        message: message.value,
        createdAt: timestamp(),
      };

      await addDoc(chat);
      if (!error.value) {
        message.value = "";
      }
    };
    return { message, handleSubmit, error };
  },
};
</script>

<style scoped>
textarea {
  width: 100%;
  max-width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 0;
  border-radius: 18px;
  font-family: inherit;
  outline: none;
}
</style>