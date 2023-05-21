<template>
  <div class="messageinput">
    <textarea
      placeholder="Type a message and hit enter to send..."
      v-model="text"
      @keydown.enter.prevent="handleSubmit"
      rows="3"
    ></textarea>
    <div class="error" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
//composables
import useDocument from "@/composables/use/useDocument";
//other
import { ref } from "vue";

export default {
  props: ["table", "user"],
  setup(props) {
    const { error, updateDoc } = useDocument("tables", props.table.id);

    const text = ref("");

    const handleSubmit = async () => {
      const message = {
        name: props.user.displayName,
        userid: props.user.uid,
        text: text.value,
        createdAt: Date.now(),
      };

      await updateDoc({
        messages: [...props.table.messages, message],
      });
      if (!error.value) {
        text.value = "";
      }
    };
    return { text, handleSubmit, error };
  },
};
</script>

<style>
.messageinput {
  margin-top: 10px;
}
</style>
