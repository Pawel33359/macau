<template>
  <div v-if="profile" class="singlefriend">
    <div class="icon"><img :src="profile.icon" width="55" /></div>
    <div class="name">{{ profile.name }}</div>
    <div class="options">
      <div @click="accept" class="opt check">
        <font-awesome-icon icon="check" class="sign" />
      </div>
      <div @click="decline" class="opt times">
        <font-awesome-icon icon="times" class="sign" />
      </div>
    </div>
  </div>
</template>

<script>
//components
import getDocument from "@/composables/get/getDocument";
import useDocument from "@/composables/use/useDocument";

export default {
  props: ["doc", "userid"],
  setup(props) {
    const { document: profile } = getDocument("user_profile", props.userid);

    const { error, updateDoc, deleteDoc } = useDocument(
      "friendlist",
      props.doc.id
    );

    const accept = async () => {
      await updateDoc({ invite: true });
    };
    const decline = async () => {
      await deleteDoc();
    };

    return { profile, accept, decline };
  },
};
</script>

<style scoped>
.singlefriend {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgb(4, 1, 34);
  width: 100%;
  border-radius: 8px;
  margin: auto;
  display: flex;
  align-content: center;
  position: relative;
}
.icon {
  padding-left: 5px;
  padding-top: 5px;
}
.name {
  font-size: large;
  padding-top: 15px;
  padding-bottom: 15px;
}
.options {
  display: flex;
  right: 0%;
  position: absolute;
  width: 20%;
  height: 100%;
}
.opt {
  width: 50%;
}
.check {
  background-color: rgba(15, 219, 15, 0.8);
  cursor: pointer;
  position: relative;
}
.times {
  background-color: rgba(197, 24, 24, 0.8);
  border-radius: 0px 7px 7px 0px;
  cursor: pointer;
  position: relative;
}
.sign {
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
