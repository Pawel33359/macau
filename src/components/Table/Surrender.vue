<template>
  <button  class="btn btn-danger surrender btn--resize" @click="handleSurrender">Surrender and leave table</button>
</template>

<script>
//composables
import getDatabase from "@/composables/getDatabase";
import useDatabase from "@/composables/useDatabase";
import useDocument from "@/composables/useDocument";
//other
import { useRouter } from "vue-router";

export default {
    props: ["table","user","profile","ranking"],
setup(props){
    const { deleteDat } = useDatabase("tables/" + props.table.id + "users" + props.user.uid);
    const { error, removeArrayObject, updateArrayObject, updateDoc } = useDocument("tables", props.table.id);

    const router = useRouter();
    
     //leave table if game in progress
            const handleSurrender = async()=>{
                const { documents: playernumber } = await getDatabase("tables/" + props.table.id + "/playercount/");
                var playercount = playernumber.value.number -1
                updateplayercount(playercount)

                
                await deleteDat();
                //prepare user to delete from firestore
     
                profilelost()

                if(props.table.ranking ==true){
                    rankinglost()
                }
                if(playercount == 1){
                            const { deleteDat } = useDatabase("tables/" + props.table.id);
                            await deleteDat()

                            for(var usr of props.table.users){
                                //users for cleanup after game
                                var readyfalseuser = {
                                    name: usr.name,
                                    userid: usr.userid,
                                    ready: false
                                }
                                var currentuser = {
                                    name: usr.name,
                                    userid: usr.userid,
                                    ready: true
                                }
                                updateArrayObject('users', readyfalseuser)
                                removeArrayObject('users', currentuser)
                            }

                            //remove user from firestore
                            const surrenduser = {
                                name: props.user.displayName,
                                userid: props.user.uid,
                                ready: false
                            }   
                            await removeArrayObject('users',surrenduser)
                            
                            //exit game
                            await updateDoc({
                                inprogress: false
                            });
                            router.push({ name: "Search" });
                        }
                else{
                    const surrenduser = {
                    name: props.user.displayName,
                    userid: props.user.uid,
                    ready: true
                    }   
                    await removeArrayObject('users',surrenduser)
                    router.push({ name: "Search" });
                }
            }



            const updateplayercount= async(playercount)=>{
                const { addDat } = await useDatabase("tables/" + props.table.id + "/playercount/");
                addDat({number: playercount})
            }
            const profilelost = async()=>{
                const { updateDoc } = await useDocument("user_profile", props.user.uid);
                var lost = props.profile.lost                    
                lost+=1
                //update database
                updateDoc({
                    lost: lost
                })
            }
            const rankinglost = async()=>{
                const { updateDoc } = await useDocument("user_ranking", props.user.uid);
                var rankpoints = props.ranking.points
                var ranklost = props.ranking.ranking_lost
                rankpoints-= 5
                ranklost+=1
                updateDoc({
                    points: rankpoints,
                    ranking_lost: ranklost
                })
            }



            return{handleSurrender}
    }
}
</script>

<style>

</style>