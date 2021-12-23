<template>
  <div class="information">
        <div class="icon" v-if="profile">
            <img v-bind:src="profile.icon" width="70">
        </div>
        <h3 v-if="profile">{{ profile.name }}</h3>
        <div class="rp" v-if="ranking">
            <h6>: {{ranking.points}} rp</h6>
        </div>
    </div>
</template>

<script>
//composables
import getDocument from '@/composables/getDocument'

export default {
    props: ['id'],
    setup(props){
        const {document: ranking} = getDocument('user_ranking',props.id)
        const {document: profile} = getDocument('user_profile',props.id)

        return{profile,ranking}
    }
}
</script>

<style scoped>
.information {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
img{
  border: 2px solid rgb(15, 6, 138);
}
.rp{
    margin-left: 15px;
}
h3{
  color: rgb(0, 3, 179);
}
</style>