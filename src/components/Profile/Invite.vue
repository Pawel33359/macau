<template>
  <div v-if="documents">
    <button v-if="checkFriends()==false" @click="sendInvite" class="friend">Send invite</button>
  </div>
</template>

<script>
//composables
import getCollection from "@/composables/getCollection";
import useCollection from '@/composables/useCollection'
//other
import { timestamp } from "@/firebase/config";

export default {
    props: ["userid","profile"],
    setup(props){

        //get two friends inside array
            const currentuser ={userid: props.userid}
            const user = {userid: props.profile.id}
            const users = []
            users.push(currentuser)
            users.push(user)

        const { documents } = getCollection("friendlist"
        , ['users','array-contains',{userid: props.userid}]
        //['users','==',users]
        );
        const {addDoc} = useCollection('friendlist')


        const checkFriends = ()=>{
          let check = false
          for(let doc of documents.value){
            for(let user of doc.users){
              if(user.userid == props.profile.id){
                check = true
              }
            }
          }
          return check;
        }


        const sendInvite = async()=>{
            //prepare document
            const friends = {
                users: users,
                messages: [],
                invite: false,
                createdAt: timestamp(),
                inviter: props.userid
            }
            //add to firestore
            await addDoc(friends)
        }
        return {sendInvite,documents,checkFriends}
    }
}
</script>

<style>
.friend {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  background-color: rgb(167, 255, 164);
}
.friend:hover {
  background-color: rgb(26, 104, 10);
  color: rgb(254, 254, 255);
}
</style>