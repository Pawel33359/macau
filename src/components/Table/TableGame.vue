<template>
  <div class="tablebackground h-100 w-100"
  :class="{ notinprogress: table.inprogress == false }"
  v-if="table"
  >
    <div v-if="table.inprogress == false">
      <button class="btn btn-primary" @click="handleReady" v-if="ready ==false">Ready for game?</button>
    <div v-else>
      <button class="btn btn-primary" disabled>Ready for game?</button>
      <button class="btn btn-primary" @click="handleCancel">Cancel</button>
    </div>
    </div>
    <div v-else class="w-100 h-100 gametable">
      <TableInprogress v-if="documents" :table="table" :user="user" :profiles="profiles" :rankings="rankings"/>
    </div>
  </div>
</template>

<script>
//components
import TableInprogress from "@/components/Table/TableInprogress.vue";
//composables
import useDocument from "@/composables/useDocument";
import getDocument from "@/composables/getDocument";
import getDatabase from "@/composables/getDatabase";
import useDatabase from "@/composables/useDatabase";
import game from "@/composables/game";
//other
import { ref } from '@vue/reactivity';

export default {
    props: ["table","user"],
    components:{TableInprogress},
    setup(props){
      //preparing fynctions for changing table and getting table from database
      const { error, removeArrayObject, updateArrayObject, updateDoc } = useDocument("tables", props.table.id);
      const { documents } = getDatabase("tables/" + props.table.id);

      //preparing game logic for child component
      const {deal} = game(props.table,{cards:[]},[],[],[])


       //prepare players rankings and profiles because it wont work later
      const profiles = ref([])
      const rankings = ref([])
      //if game in progress
      const assign =async()=>{
        for(var usr of props.table.users){
          {
          const {document: profile} = await getDocument('user_profile', usr.userid);
          profiles.value.push(profile)
          }
          {
          const {document: ranking} = await getDocument('user_ranking', usr.userid);
          rankings.value.push(ranking)
          }
        }
      }
      if(props.table.inprogress == true){
        assign()
      }
      
      

      //ready for check if show cancel button
      const ready = ref(false)
      for(var usr of props.table.users){
        if(usr.userid == props.user.uid){
          ready.value = usr.ready
        }
      }
      
      var currentuser = {name: props.user.displayName,userid: props.user.uid,ready: true}
      var pastuser = {name: props.user.displayName,userid: props.user.uid,ready: false}
      const handleReady =async () => {
        updateArrayObject('users',currentuser)
        ready.value=true
        if(!error.value){
          await removeArrayObject('users', pastuser)
          var inprogr = true
          var playercount = 0
          for( var usr of props.table.users){
            playercount++
            if(usr.ready == false){
              inprogr = false
            }
          }
          if(inprogr == true && playercount > 1){
            deal()
            for(var usr of props.table.users){
              const {document: profile} = await getDocument('user_profile', usr.userid);
              profiles.value.push(profile)
              const {document: ranking} = await getDocument('user_ranking', usr.userid);
              rankings.value.push(ranking)
            }
            {
              const { addDat } = useDatabase("tables/" + props.table.id + "/currentturn/");
              addDat({turn: 1})
            }
            {
              const { addDat } = useDatabase("tables/" + props.table.id + "/playercount/");
              addDat({number: playercount})
            }
            {
              const { addDat } = useDatabase("tables/" + props.table.id + "/function/");
              addDat({type: "",amount: 0})
            }
            {
              const { addDat } = useDatabase("tables/" + props.table.id + "/makao/");
              addDat({user: ""})
            }
            var turns = []
            for(var i = 1; i<=playercount; i++){turns.push(i)}
            var result = []
            for(var i = playercount;i>0;i--){
                var j = Math.floor(Math.random() * (i));
                result.push((turns[j]))
                turns.splice(j,1) 
            }
            var order = 0;
            for(var usr of props.table.users){
              const { addDat } = useDatabase("tables/" + props.table.id + "/users/" + usr.userid +"/information/");
              await addDat({name: usr.name,id: usr.userid,turn: result[order]})
              order++
            }
            await updateDoc({inprogress: true});
          }
        }
        else {
          error.value = "Failed to update table";
        }
      }

      //cancel ready
      const handleCancel = async () => {
        //create new user with ready: false and remove user with ready: true
        updateArrayObject('users',pastuser)
        ready.value=false
        if(!error.value){
          removeArrayObject('users', currentuser)
        }
        else {
          error.value = "Failed to update table";
        }
      }



      return{handleReady,ready,handleCancel,documents,profiles,rankings}
    }
}
</script>

<style>
.tablebackground{
 background-color: rgb(14, 87, 14);
 border: 6px solid rgb(161, 56, 56);
 border-style: ridge;
}
.notinprogress{
  display: flex;
  align-items: center;/* | */
  justify-content: center;/* - */ 
}
.gametable{
  position:relative;
}
</style>