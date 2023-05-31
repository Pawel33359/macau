<template>
<!--false - friendlist
true- invites
-->
<div v-if="documents" class="allfriends">
    <div v-if="$store.state.friendsMode === false">
        <div v-for="doc in documents" :key="doc.createdAt">
            <div v-if="doc.invite==true">
                <div v-for="usr in doc.users" :key="usr.userid">
                    <div v-if="usr.userid !== user.uid">
                        <FriendsListSingle  :doc="doc" :userid="usr.userid"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else >
        <div v-for="doc in documents" :key="doc.createdAt">
            <div v-if="doc.invite==false && doc.inviter !== user.uid">
                <div v-for="usr in doc.users" :key="usr.userid">
                    <div v-if="usr.userid !== user.uid" >
                        <FriendsInvite  :doc="doc" :userid="usr.userid"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
//components
import FriendsListSingle from "@/components/Friends/FriendsListSingle.vue"
import FriendsInvite from "@/components/Friends/FriendsInvite.vue"
//composables
import getCollection from "@/composables/get/getCollection";

export default {
    components:{FriendsListSingle,FriendsInvite},
    props:["user"],
    setup(props){
         const { documents } = getCollection("friendlist"
        , ['users','array-contains',{userid: props.user.uid}]
        );

        return{documents}
    }
}
</script>

<style scoped>
.allfriends{
        overflow: auto;
        height: 50%;
        width: 70%;
        margin: auto;
    }
</style>