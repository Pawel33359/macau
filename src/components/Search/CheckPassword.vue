<template>
<div v-if="table">
    <div class="line" >
    <div v-if="table.ranking == true"><h4>R</h4></div>
    <div v-else><h4>N</h4></div>
    <div class="name">Name: {{ table.name }}</div>
    <div class="password" v-if="table.password != ''">
      <font-awesome-icon icon="lock" />
    </div>
  </div>
  <div class="line">
    Users:
    <div class="users" v-for="usr in table.users" :key="usr.userid">
      {{ usr.name }}
    </div>
  </div>
  <!--Check password-->
    <div>
        <label>Password:</label>
        <input type="text" v-model="password">
        <div class="error" v-if="error">{{error}}</div>
        <button class="btn btn-primary btn--resize" @click="handleEnter">Enter</button>
        <button class="btn btn-secondary btn--resize" @click="$emit('handlePassword',singletable)">Cancel</button>
    </div>
  </div>
</template>

<script>
//composables
import getDocument from "@/composables/getDocument";
import useDocument from "@/composables/useDocument";
//other
import { useRouter } from "vue-router";
import { ref } from '@vue/reactivity'

export default {
    props:["tableid","user"],
    setup(props){
      const { error, document: table } = getDocument("tables",props.tableid);
      const router = useRouter()

      const password = ref('')
      const singletable = ref([])



    //curent user information for table
    const currentuser = {
      name: props.user.displayName,
      userid: props.user.uid,
      ready: false
    }
    
    
    const handleEnter = async()=>{
      //getting updateDoc function adding user to table and pushing user to table
      const { updateDoc} = useDocument("tables", table.value.id)
      if(table.value.users.length <4){
        if(password.value == table.value.password){
          await updateDoc({
            users:[...table.value.users, currentuser]
          })
          if(!error.value){
            router.push({ name: "Table",params: { id: table.value.id } });
          }
          else{
            error.value = "Failed to update table"
          }
        }else{
          error.value = "Wrong password"
        }
      }else{
        error.value = "There can't be more than 4 players at a table"
      }
    }


      return {password,singletable,table,error,handleEnter}
    }
}
</script>

<style>
.line {
  overflow: auto;
  display: flex;
}
.name {
  overflow: auto;
}
.password {
  margin-left: auto;
  overflow: visible;
}
.users {
  border: 1px solid rgb(4, 1, 34);
  border-radius: 8px;
}
</style>