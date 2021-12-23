<template>
  <div class="row h-100 overflow-auto">
    <div class="col-sm-8 col-xs-12 order-sm-2 min-vh-100">
      <Title />
      <!--Signup form-->
      <form @submit.prevent="handleSubmit">
        <h3>Sign up</h3>
        <input type="text" placeholder="Name" v-model="displayName" />
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <input
          type="password"
          placeholder="Repeat Password"
          v-model="repeat_password"
        />
        <div class="route" @click="eraseError">
          <router-link :to="{ name: 'Login' }"
            >Already have an account? Login</router-link
          >
        </div>
        <div class="error" v-if="error">{{ error }}</div>
        <button v-if="!isPending">Sign up</button>
        <button v-if="isPending" disabled>Loading</button>
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
import useSignup from "@/composables/useSignup";
import useSetCollection from "@/composables/useSetCollection";
import getUser from "@/composables/getUser";
import getUserprofiles from "@/composables/getUserprofiles";
//other
import { useRouter } from "vue-router";
import { ref } from "@vue/reactivity";

export default {
  components: { Img, Title },
  setup() {
    const { error, signup, isPending } = useSignup();
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const repeat_password = ref("");
    const displayName = ref("");

    const eraseError = () => {
      error.value = "";
    };

    const handleSubmit = async () => {
      //check if password was repeated correctly
      if (repeat_password.value == password.value) {
        //check if name already exists
        //get users with the same name as current name
        const { profiles, load } = getUserprofiles(displayName.value);
        //wait for the profiles with the same name
        await load();
        //if there is at least one profile of the same name
        if (profiles.value.length > 0) {
          error.value = "Name already exists!";
        } else {
          //wait for signup to happen
          const res = await signup(
            email.value,
            password.value,
            displayName.value
          );
          //if there weren't any errors
          if (!error.value) {
            //get new user
            const { user } = getUser();

            {
              //prepate new profile
              const { setDoc } = useSetCollection(
                "user_profile",
                user.value.uid
              );

              //created basic profile for new user
              const profile = {
                icon: require('@/assets/icons/1.png'),
                description: "",
                won: 0,
                lost: 0,
                createdAt: user.value.metadata.creationTime,
                name: user.value.displayName,
              };
              //add new profile
              await setDoc(profile);
            }

            {
              //prepate new ranking
              const { setDoc } = useSetCollection(
                "user_ranking",
                user.value.uid
              );
              //created basic ranking for new user
              const ranking = {
                ranking_won: 0,
                ranking_lost: 0,
                points: 100,
              };
              //add new ranking
              await setDoc(ranking);
            }

            //redirect to homepage
            router.push({ name: "Home" });
          }
        } //if password was repeated incorrectly
      } else {
        error.value = "The password doesn't match!";
        password.value = "";
        repeat_password.value = "";
      }
    };

    return {
      email,password,displayName,repeat_password,
      error,isPending,
      handleSubmit,eraseError,
    };
  },
};
</script>

<style>
</style>