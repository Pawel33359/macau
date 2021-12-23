<template>
<div class="wholefriend">
    <div v-if="profile" class="singlefriend" @click="$router.push({ name: 'Friends', params: { id: doc.id } })">
        <div class="icon"><img :src="profile.icon" width="55"/></div>
        <div class="name">{{profile.name }}</div>
    </div>
    <div class="delete" @click="decline">
        <font-awesome-icon icon="times" class="times"/>
    </div>
</div>
</template>

<script>
//components
import getDocument from "@/composables/getDocument";
import useDocument from "@/composables/useDocument";

export default {
     props:["doc","userid"],
    setup(props){
        const { document: profile } = getDocument(
            "user_profile",
            props.userid
        );

        //deleting friend from list
        const {  deleteDoc } = useDocument("friendlist", props.doc.id);
        const decline = async()=>{
            await deleteDoc()
        }

        return {profile,decline}
    }
}
</script>

<style scoped>
.wholefriend{
    display: flex;
}
.singlefriend{
        background-color: rgba(255, 255, 255, 0.8);
        border: 1px solid rgb(4, 1, 34);
        width: 90%;
        border-radius: 8px;
        margin: auto;
        display: flex;
        align-content: center;
        position: relative;
        cursor: pointer;
    }
    .icon{
        padding-left: 5px;
        padding-top: 5px;
    }
    .name{
        font-size: x-large;
        padding-top:15px;
        padding-bottom:15px;
    }
    .delete{
        width: 10%;
        background-color: rgba(197, 24, 24, 0.8);
        border-radius: 10px; 
        cursor: pointer;
        position: relative;
    }
    .times{
        margin: auto;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    img {
  border: 3px solid rgb(11, 110, 2); 
        }
</style>