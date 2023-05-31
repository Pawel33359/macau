<template>
  <span class="icon" v-if="profile">
    <img
      :src="profile.icon"
      width="45"
      :class="{ owned: profile.id === user.uid }"
  /></span>
  <div v-if="profile && doc.name" class="w-100 messagefield">
    <div class="message_info" :class="{ ownmessage: profile.id === user.uid }">
      <span class="created-at">{{ doc.creationtime }}</span>
      <span class="name">{{ doc.name }}:</span>
      <span class="text-break">{{ doc.text }}</span>
    </div>
    <div
      v-if="profile.id === user.uid"
      @click="deletemessage"
      class="deletemessage"
    >
      <font-awesome-icon icon="times" class="sign" />
    </div>
  </div>
  <div v-else>
    <div class="message_info system_info">
      <span class="created-at">{{ doc.creationtime }}</span>
      <span class="text-break">{{ doc.text }}</span>
    </div>
  </div>
</template>

<script>
//composables
import getDocument from "@/composables/get/getDocument";
import useDocument from "@/composables/use/useDocument";

export default {
  props: ["doc", "user", "colname", "docid"],
  setup(props) {
    const { error, document: profile } = getDocument(
      "user_profile",
      props.doc.userid
    );

    const { removeArrayObject } = useDocument(props.colname, props.docid);

    const deletemessage = async () => {
      const todelete = {
        createdAt: props.doc.createdAt,
        name: props.doc.name,
        text: props.doc.text,
        userid: props.doc.userid,
      };
      await removeArrayObject("messages", todelete);
    };

    return { profile, error, deletemessage };
  },
};
</script>

<style scoped>
.messagefield {
  display: flex;
}
.message_info {
  width: 100%;
}
.system_info {
  margin-left: 2rem;
}
.ownmessage {
  width: 80%;
}

.created-at {
  display: block;
  color: rgb(119, 119, 119);
  font-size: 12px;
  margin-bottom: 4px;
}
.name {
  font-weight: bold;
  margin-right: 6px;
}
.icon {
  display: block;
  padding-left: 5px;
}
img {
  border: 1px solid rgb(0, 0, 0);
}

img.owned {
  border: 3px solid rgb(31, 15, 253);
}

.deletemessage {
  background-color: rgba(197, 24, 24, 0.8);
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  width: 40px;
  height: 40px;

  margin: auto;
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
