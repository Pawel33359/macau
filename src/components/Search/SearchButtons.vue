<template>
    <div class="searchbuttons" v-if="$store.state.ifpassword == null">
        <button class="btn btn-primary btn--resize" @click="$store.commit('changeifpassword',true)">Password</button>
        <button class="btn btn-primary btn--resize" @click="$store.commit('changeifpassword',false)">NoPassword</button>
    </div>
    <div class="searchbuttons" v-if="$store.state.ifpassword == true">
        <button class="btn btn-secondary btn--resize" @click="$store.commit('changeifpassword',null)">Password</button>
        <button class="btn btn-primary btn--resize" @click="$store.commit('changeifpassword',false)">NoPassword</button>
    </div>
    <div class="searchbuttons" v-if="$store.state.ifpassword == false">
        <button class="btn btn-primary btn--resize" @click="$store.commit('changeifpassword',true)">Password</button>
        <button class="btn btn-secondary btn--resize" @click="$store.commit('changeifpassword',null)">NoPassword</button>
    </div>
    <div class="searchbuttons" v-if="$store.state.ifranking == null">
        <button class="btn btn-primary btn--resize" @click="$store.commit('changeifranking',true)">Ranking</button>
        <button class="btn btn-primary btn--resize" @click="$store.commit('changeifranking',false)">Normal</button>
    </div>
    <div class="searchbuttons" v-if="$store.state.ifranking == true">
        <button class="btn btn-secondary btn--resize" @click="$store.commit('changeifranking',null)">Ranking</button>
        <button class="btn btn-primary btn--resize" @click="$store.commit('changeifranking',false)">Normal</button>
    </div>
    <div class="searchbuttons" v-if="$store.state.ifranking == false">
        <button class="btn btn-primary btn--resize" @click="$store.commit('changeifranking',true)">Ranking</button>
        <button class="btn btn-secondary btn--resize" @click="$store.commit('changeifranking',null)">Normal</button>
    </div>
</template>

<script>
export default {
   
}
</script>

<style>
.searchbuttons{
        margin-top: 10px;
        width: 70%;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
</style>