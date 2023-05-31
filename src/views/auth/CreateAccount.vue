<template>
  <div class="row h-100 overflow-auto">
    <div class="col-sm-8 col-xs-12 order-sm-2 min-vh-100">
      <Title />
      <!--Signup form-->
      <form @submit.prevent="handleSubmit">
        <h3>Create An Account</h3>
        <input type="text" placeholder="Name" v-model="displayName" />
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <input
          type="password"
          placeholder="Repeat Password"
          v-model="repeat_password"
        />
        <div class="error" v-if="error">{{ error }}</div>
        <button v-if="!isPending">Create</button>
        <button v-if="isPending" disabled>Loading</button>
      </form>
      <button class="page" @click="$router.push({ name: 'Home' })">
        Return
      </button>
    </div>

    <div class="order-sm-1 col-sm-4 .d-xs-none">
      <Img />
    </div>
  </div>
</template>

<script>
//components
import Img from "@/components/Img.vue";
import Title from "@/components/Title.vue";
//composables
//////////////////////////////////////////////////////////////////////////////////////////
import useCreateAccount from "@/composables/use/useCreateAccount";
//////////////////////////////////////////////////////////////////////////////////////////
import createProfileAndRanking from "@/composables/createProfileAndRanking";
import getUserprofiles from "@/composables/get/getUserprofiles";
//other
import { useRouter } from "vue-router";
import { ref } from "@vue/reactivity";

export default {
  components: { Img, Title },
  setup() {
    //////////////////////////////////////////////////////////////////////////////////////////
    const { error, create, isPending } = useCreateAccount();
    //////////////////////////////////////////////////////////////////////////////////////////
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const repeat_password = ref("");
    const displayName = ref("");

    const eraseError = () => {
      error.value = "";
    };

    const handleSubmit = async () => {
      if (repeat_password.value === password.value) {
        const { profiles, load } = getUserprofiles(displayName.value);
        await load();
        if (profiles.value.length > 0) {
          error.value = "Name already exists!";
        } else {
          //////////////////////////////////////////////////////////////////////////////////////////
          await create(email.value, password.value, displayName.value);
          if (!error.value) {
            await createProfileAndRanking();
            router.push({ name: "Home" });
          }
          //////////////////////////////////////////////////////////////////////////////////////////
        }
      } else {
        error.value = "The password doesn't match!";
        password.value = "";
        repeat_password.value = "";
      }
    };

    return {
      email,
      password,
      displayName,
      repeat_password,
      error,
      isPending,
      handleSubmit,
      eraseError,
    };
  },
};
</script>

<style></style>
