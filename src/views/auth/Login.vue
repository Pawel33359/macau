n<template>
  <div class="row h-100 overflow-auto">
    <div class="col-sm-8 col-xs-12 order-sm-2 min-vh-100">
      <Title />
      <form @submit.prevent="handleSubmit">
        <h3>Login</h3>
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <div class="route">
          <router-link :to="{ name: 'Signup' }"
            >You don't have account? Sigup</router-link
          >
        </div>
        <div class="error" v-if="error">{{ error }}</div>
        <button v-if="!isPending">Log in</button>
        <button v-if="isPending" disabled>Loading</button>
        <AnonymousLogin />
      </form>
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
import useLogin from "@/composables/use/useLogin";
//other
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import AnonymousLogin from "../../components/AnonymousLogin.vue";

export default {
  components: { Img, Title, AnonymousLogin },
  setup() {
    const { error, login, isPending } = useLogin();
    const router = useRouter();

    const email = ref("");
    const password = ref("");

    const handleSubmit = async () => {
      const res = await login(email.value, password.value);
      if (!error.value) {
        router.push({ name: "Home" });
      }
    };

    return { email, password, handleSubmit, error, isPending };
  },
};
</script>

<style></style>
