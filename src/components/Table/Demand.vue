<template>
 <div class="titl">Choose card value to demand</div>
 <div class="cards">
    <div v-for="val in demand" :key="val.value" >
        <div v-if="val.value==0">
            <div class="value"
            @click="chosen = val"
            :class="{ inuse: val == chosen }">
            No</div>
        </div>
        <div v-else>
            <div v-if="val.value == 12">
                <div class="value"
                @click="chosen = val"
                :class="{ inuse: val == chosen }">
                Q</div>
            </div>
            <div v-else>
                <div class="value"
                @click="chosen = val"
                :class="{ inuse: val == chosen }">
                {{val.value}}</div>
            </div>
        </div>
    </div>
</div>
<div class="accept" v-if="chosen != ''">
    <button @click="handleAccept">Accept</button>
</div>
</template>

<script>
//composables
import useDatabase from "@/composables/useDatabase";
import game from "@/composables/game";
//other
import { ref } from '@vue/reactivity';

export default {
    props:["table","documents","user","player"],
    setup(props){
        const demand = ref([])

        const chosen = ref('')
        demand.value.push({value: 0})

        for(var i=5;i<13;i++){
            if(i!=11){
                var objecthand = {value: i}
                demand.value.push(objecthand)
            }
        }

        const handleAccept = ()=>{
            //function card and next turn
            const {turndatabase,ifmakao} = game(props.table,props.player,props.documents,[],[])

            //clean function
            const { addDat } = useDatabase("tables/" + props.table.id + "/function/");

            if(chosen.value.value == 0){
                addDat({amount: 0, type: ""})
                ifmakao(props.user.uid)
                turndatabase(1)
            }else{
                addDat({amount: props.documents.playercount.number-1, type: "demandyes", value: chosen.value.value})
                ifmakao(props.user.uid)
                turndatabase(1)
            }
        }

        return {demand,chosen,handleAccept}
    }
}
</script>

<style scoped>
.cards{
    height: 70%;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    overflow: auto;
    text-align: center;
    position:relative;
}
.value{
    background-color: white;
    font-size: xx-large;
    width: 50px;
    left: 0;
    right: 0%;
    margin: auto;
    border: 3px solid black;
    cursor: pointer;
}
.titl{
    color: cornsilk;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: xx-large;
}
.accept{
    margin-top: 30px;
    text-align: center;
}
.inuse{
  border: 5px solid rgb(0, 119, 255);
}


@media only screen and (max-width: 545px) {
  .cards{
    column-gap: 5%;
    }
}
@media only screen and (max-width: 447px) {
  .cards{
    column-gap: 1%;
    }
}
@media only screen and (max-height: 480px) {
  .cards{
    height: 60%
    }
}
@media only screen and (max-height: 350px) {
  .cards{
    height: 50%
    }
}
</style>