<template>
  <!--To check searched player first for every table cell i need to wait for profile to get
  then inside cell there is a div that only shows if first letters of profile.name is the same as search
  then each div has assigned class shown that has border and conditional class that hides this border
  -->
  <td v-if="profile">
    <router-link
      :to="{ name: 'Profile', params: { id: profile.id } }"
      v-if="
        profile.name.substring(0, search.length).toLowerCase() ==
          search.toLowerCase()
      "
      class="shown"
    >
      <img
        :src="profile.icon"
        width="70"
        :class="{ owned: profile.id === user.uid }"
      />
    </router-link>
  </td>
  <td v-if="profile">
    <div
      v-if="
        profile.name.substring(0, search.length).toLowerCase() ==
          search.toLowerCase()
      "
      class="shown"
    >
      {{ rank.place }}.
    </div>
  </td>
  <td v-if="profile">
    <div
      v-if="
        profile.name.substring(0, search.length).toLowerCase() ==
          search.toLowerCase()
      "
      class="shown"
    >
      {{ profile.name }}
    </div>
  </td>
  <td v-if="profile">
    <div
      v-if="
        profile.name.substring(0, search.length).toLowerCase() ==
          search.toLowerCase()
      "
      class="shown"
    >
      Points :{{ rank.points }}
    </div>
  </td>
</template>

<script>
//composables
import getDocument from "@/composables/get/getDocument";

export default {
  props: ["rank", "search", "user"],
  setup(props) {
    const { error, document: profile } = getDocument(
      "user_profile",
      props.rank.id
    );
    return { profile, error };
  },
};
</script>

<style scoped>
.name {
  font-weight: bold;
  margin-right: 6px;
}
img {
  border: 1px solid rgb(0, 0, 0);
}
img.owned {
  border: 3px solid rgb(31, 15, 253);
}

td,
th {
  text-align: left;
  text-align: center;
  font-size: large;
}
.shown {
  border: 1px solid #dddddd;
  height: 70px;
}

img:hover {
  transform: scale(1.1);
  z-index: 2;
  cursor: pointer;
}
</style>
