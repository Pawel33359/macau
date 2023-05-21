<template>
  <div v-if="error">{{ error }}</div>
  <div class="ranking" v-if="rankings">
    <table style="empty-cells: hide">
      <tr>
        <td>Profile:</td>
        <td>Place:</td>
        <td>User Name:</td>
        <td>Ranking Points:</td>
      </tr>
      <tr>
        <td colspan="4" class="search">
            <textarea
              placeholder="Search" 
              v-model="search"></textarea>
        </td>
      </tr>
      <tr v-for="rank in formattedRankings" :key="rank.id">
        <SingleRanking :rank="rank" :search="search" :user="user"/>
      </tr>
    </table>
  </div>
</template>

<script>
//components
import SingleRanking from './SingleRanking.vue'
//composables
import getUserrankings from "@/composables/get/getUserrankings";
//other
import { computed } from '@vue/runtime-core'
import { ref } from '@vue/reactivity'


export default {
  components:{SingleRanking},
  props:["user"],
  setup() {
    const search = ref('')

    const { rankings,error} = getUserrankings()
    //add place to ranking
    const formattedRankings = computed(()=>{
      if(rankings.value){
        let i = 0
        return rankings.value.map(doc => {
          i+=1
          return {...doc, place: i}
        })
      }
    })

    return { rankings, error,formattedRankings,search }
  },
};
</script>

<style scoped>
.ranking {
  height: 90%;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 11px 8px 7px 3px rgb(0 0 0 / 35%);
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  font-size: large;
}
table tr td:first-child{
  width: 46px;
}


@media only screen and (max-width: 575px) {
  .ranking{
    margin-left: 20px;
  }
}
/* margin: 10px;
    position: fixed;
    bottom: 0;
    width: 33%;
    border: 2px solid rgb(87, 87, 87);
    border-radius: 20px;
    background-color: rgb(255, 255, 255);*/
</style>