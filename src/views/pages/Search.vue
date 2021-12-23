<template>
  <div class="row h-100 overflow-auto">
    <div class="col-md-8 col-xs-12 order-sm-2 col-sm-6 h-100 overflow-auto">
            <Title/>
            
            <!--user info-->
            <UserInfo :id="user.uid"/>


            <!--buttons for search-->
            <SearchButtons/>
            <!--Search for table-->
            <div class="search">
                <font-awesome-icon icon="search"/>
                <textarea
                    placeholder="Search" 
                    v-model="search"></textarea>
            </div>
            
            <!--Show all tables -->
            <SearchTables :search="search" :user="user"/>

            <!--buttons to move-->
            <button 
                class="page"
                @click="$router.push({ name: 'CreateTable'})"
            >
            Create Table
            </button>
            <button 
                class="page"
                @click="$router.push({ name: 'Home'})"
            >
            Return
            </button>    
    </div>
    <div class="col-sm-6 h-100 order-sm-1 col-md-4">
        <LeftSide/>
    </div>
  </div>
</template>

<script>
//<font-awesome-icon icon="lock-open"/>

//components
import LeftSide from '@/components/LeftSide.vue'
import Title from '@/components/Title.vue'
import UserInfo from "@/components/UserInfo.vue"
import SearchButtons from "@/components/Search/SearchButtons.vue"
import SearchTables from "@/components/Search/SearchTables.vue"
//composables
import getUser from "@/composables/getUser"
//other
import { ref } from '@vue/reactivity'

export default {
    components: {LeftSide,Title,UserInfo,SearchButtons,SearchTables},
    setup(){
        const { user } = getUser()

        //models
        const search = ref('')

        return {search,user}
    }

}
</script>

<style scoped>
    .search{
        display: flex;
        width: 70%;
        margin: auto;
        background-color: rgba(255, 255, 255);
        margin-bottom: 10px;
        margin-top: 10px;
        overflow: auto;
    }
</style>