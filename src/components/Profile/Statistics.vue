<template>
  <div>played: {{ won + lost }}</div>
    <!--if no ranking games were played-->
    <div class="w" v-if="percent == 'no'">won: {{ won }}</div>
    <div class="w" v-else>
         won: {{ won }} 
            ({{percent}}%)
              </div>
            <div class="l">lost: {{ lost }}</div>
</template>

<script>
import { ref, watch } from '@vue/runtime-core'

export default {
    props: ["lost","won"],
    setup(props){
        const percent = ref('')

        //set correct percantage for no games played, for no wins and for wins
        if(props.lost == 0 && props.won == 0){
            percent.value = 'no'
        } else if(props.won==0){
            percent.value = 0
        } else{
            percent.value = (props.won/(props.won + props.lost))*100
            const factor = Math.pow(10,2)
            percent.value = Math.round(percent.value * factor)/factor
        }

        //watch props for changes and update percantage if there was change
        //watch props.won
        watch(() => props.won, (first, second) => {
            if(props.lost == 0 && first == 0){
                percent.value = 'no'
            } else if(first==0){
                percent.value = 0
            } else{
                percent.value = (first/(first + props.lost))*100
                const factor = Math.pow(10,2)
                percent.value = Math.round(percent.value * factor)/factor
            }
        });
        //watch props.lost
        watch(() => props.lost, (first, second) => {
           if(first == 0 && props.won == 0){
            percent.value = 'no'
        } else if(props.won==0){
            percent.value = 0
        } else{
            percent.value = (props.won/(props.won + first))*100
            const factor = Math.pow(10,2)
            percent.value = Math.round(percent.value * factor)/factor
        }
        });

          return{percent}
    }
}
</script>

<style>

</style>