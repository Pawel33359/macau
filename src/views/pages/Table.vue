<template>
<div class="error" v-if="error">{{error}}</div>
<div class="row h-100 overflow-auto">
    <div class="col-md-8 col-sm-12 h-100 pe-0" v-if="table">
        <TableGame :table="table" :user="user"/>
    </div>    
    <div class="h-100 col-md-4 overflow-auto p-0" v-if="table">
        <TableInfo :table="table" :user="user"/>
    </div>
</div>
</template>

<script>
//components
import TableInfo from "@/components/Table/TableInfo.vue";
import TableGame from "@/components/Table/TableGame.vue";
//composables
import getDocument from "@/composables/get/getDocument";
import getUser from '@/composables/get/getUser'

export default {
    components: {TableInfo,TableGame},
    props: ['id'],
    setup(props){
        const { error,document: table } = getDocument("tables", props.id);
        const { user } = getUser()

        return{error,table,user}
    }

}
</script>

<style scoped>

</style>