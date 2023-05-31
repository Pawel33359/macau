<template>
  <!--check if profile is loaded -->
  <div class="icon" v-if="profile">
    <!--check if it is current user profile or not -->
    <div v-if="ownership">
      <!--check if it is to be edited or not -->
      <div v-if="mode === false">
        <h5>Click on icon to change</h5>
        <img
          :src="profile.icon"
          @click="handleClick"
          width="150"
          class="owned"
        />
      </div>
      <div v-else>
        <div class="allicons">
          <div
            v-for="doc in icons"
            :key="doc.iconurl"
            class="single_icon"
            :class="{ inuse: doc.iconurl === inuseicon }"
          >
            <img
              :src="doc.iconurl"
              width="100"
              class="allicons"
              @click="checkIcon(doc.iconurl)"
            />
          </div>
        </div>

        <!--buttons for confirming change and canceling-->
        <button disabled v-if="inuseicon === profile.icon">
          Confirm change
        </button>
        <button @click="handleChange" v-else>Confirm change</button>
        <button @click="handleClick">Cancel</button>
      </div>
    </div>
    <!-- it's not current user-->
    <div v-else>
      <img :src="profile.icon" width="150" class="notyours" />
    </div>
  </div>
</template>

<script>
//composables
import useDocument from "@/composables/use/useDocument";
//other
import { ref } from "@vue/reactivity";

export default {
  props: ["profile", "ownership"],
  setup(props) {
    const { updateDoc } = useDocument("user_profile", props.profile.id);

    //used to store all icons url
    const icons = [];

    //used to check if it's in edit mode(true) or not(false)
    const mode = ref(false);

    //used to check whcich icon is in use (at first profile icon and then clicked on icons)
    const inuseicon = ref("");
    inuseicon.value = props.profile.icon;

    //load all icons to array icons
    for (let i = 1; i < 19; i++) {
      icons.push({ iconurl: require("@/assets/icons/" + i + ".png") });
    }

    //check new icon to be used by user
    const checkIcon = (url) => {
      inuseicon.value = url;
    };

    //cancel button and click on icon to change
    const handleClick = () => {
      if (mode.value === true) {
        inuseicon.value = props.profile.icon;
      }
      mode.value = !mode.value;
    };
    //Confirm changes
    const handleChange = async () => {
      await updateDoc({
        icon: inuseicon.value,
      });
      mode.value = !mode.value;
    };

    return {
      icons,
      mode,
      inuseicon,
      checkIcon,
      handleClick,
      handleChange,
    };
  },
};
</script>

<style scoped>
img {
  border: 4px solid rgb(4, 1, 34);
  cursor: pointer;
}
.icon {
  border: 1px solid rgb(184, 184, 184);
  padding: 3px;
}
.allicons {
  display: flex;
  flex-wrap: wrap;
}
.single_icon {
  padding: 1px;
}
.inuse img {
  border: 4px solid rgb(39, 22, 233);
}
button {
  margin-right: 5px;
  margin-bottom: 5px;
}
.notyours {
  cursor: default;
}

img.owned {
  border: 5px solid rgb(31, 15, 253);
}
img.owned:hover,
img.allicons:hover {
  transform: scale(1.1);
  z-index: 2;
  cursor: pointer;
}
</style>
