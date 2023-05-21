<template>
  <div class="btn-guest" @click="handleLoginAsGuest" v-if="!isPending">
    Log in as Guest
  </div>
  <div class="btn-guest btn-guest-disabled" v-else>Loading</div>
</template>

<script>
import { projectAuth } from "../firebase/config";
import { useRouter } from "vue-router";

import createProfileAndRanking from "../composables/createProfileAndRanking";
import { ref } from "vue";

export default {
  setup() {
    const router = useRouter();
    const isPending = ref(false);

    const handleLoginAsGuest = async () => {
      try {
        isPending.value = true;
        const res = await projectAuth.signInAnonymously();
        if (!res) {
          throw new Error("Could not complete signup");
        }

        await res.user.updateProfile({
          displayName: `guest(${res.user.uid.slice(0, 5)}${res.user.uid.slice(
            -5
          )})`,
        });

        await createProfileAndRanking();

        isPending.value = false;
        router.push({ name: "Home" });
      } catch (err) {}
    };

    return { handleLoginAsGuest, isPending };
  },
};
</script>

<style scoped>
.btn-guest {
  margin-top: 0.5rem;
  background-color: #ced4da;
  width: 8rem;
  text-align: center;
  padding: 0.4rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.btn-guest:hover {
  background-color: #868e96;
  color: white;
}

.btn-guest-disabled {
  background-color: #868e96;
  color: white;
  cursor: default;
}
</style>
