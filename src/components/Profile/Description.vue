<template>
  <div class="description">
    <h5>Description:</h5>
    <div v-if="mode == false">
      <div class="words overflow-auto">{{ profile.description }}</div>
      <button v-if="ownership" @click="handleClick">Change description</button>
    </div>
    <div v-else>
      <textarea v-model="desc" rows="10"></textarea>
      <button @click="handleClick">Add changes</button>
    </div>
  </div>
</template>

<script>
import useDocument from "@/composables/useDocument";

import { ref } from "@vue/reactivity";

export default {
  props: ["profile", "ownership"],
  setup(props) {
    const { updateDoc } = useDocument("user_profile", props.profile.id);

    const mode = ref(false);
    const desc = ref(props.profile.description);

    const handleClick = async () => {
      if (mode.value == true) {
        await updateDoc({
          description: desc.value,
        });
      }
      mode.value = !mode.value;
    };

    return { mode, desc, handleClick };
  },
};
</script>

<style scoped>
.description {
  border: 1px solid rgb(184, 184, 184);
}
.words {
  margin-bottom: 40px;
}
button {
  margin-bottom: 5px;
}
</style>