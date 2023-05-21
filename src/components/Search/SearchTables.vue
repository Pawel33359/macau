<template>
  <div class="error" v-if="error">{{ error }}</div>
  <!--check wheter you are typing in password or not-->
  <div v-if="checkpassword == false">
    <!--All tables visible-->
    <div
      class="alltables"
      v-if="$store.state.ifranking == null && $store.state.ifpassword == null"
    >
      <!--Check option-->
      <div v-for="table in tables" :key="table.id">
        <!--Search-->
        <div
          v-if="
            table.name.substring(0, search.length).toLowerCase() ==
              search.toLowerCase()
          "
        >
          <SearchSingleTable
            :table="table"
            :user="user"
            @handlePassword="handlePassword"
          />
        </div>
      </div>
    </div>

    <!--Sorted based on ranking-->
    <div
      class="alltables"
      v-if="$store.state.ifranking != null && $store.state.ifpassword == null"
    >
      <!--Check option-->
      <div v-for="table in tables" :key="table.id">
        <!--Search-->
        <div
          v-if="
            table.name.substring(0, search.length).toLowerCase() ==
              search.toLowerCase() && $store.state.ifranking == table.ranking
          "
        >
          <!--Sort Tables-->
          <SearchSingleTable
            :table="table"
            :user="user"
            @handlePassword="handlePassword"
          />
        </div>
      </div>
    </div>

    <!--Sorted based on password-->
    <!--if there is no password-->
    <div
      class="alltables"
      v-if="$store.state.ifranking == null && $store.state.ifpassword == false"
    >
      <!--Check option-->
      <div v-for="table in tables" :key="table.id">
        <!--Search-->
        <div
          v-if="
            table.name.substring(0, search.length).toLowerCase() ==
              search.toLowerCase() && table.password == ''
          "
        >
          <!--Sort Tables-->
          <SearchSingleTable
            :table="table"
            :user="user"
            @handlePassword="handlePassword"
          />
        </div>
      </div>
    </div>
    <!--if there is password-->
    <div
      class="alltables"
      v-if="$store.state.ifranking == null && $store.state.ifpassword == true"
    >
      <!--Check option-->
      <div v-for="table in tables" :key="table.id">
        <!--Search-->
        <div
          v-if="
            table.name.substring(0, search.length).toLowerCase() ==
              search.toLowerCase() && table.password != ''
          "
        >
          <!--Sort Tables-->
          <SearchSingleTable
            :table="table"
            :user="user"
            @handlePassword="handlePassword"
          />
        </div>
      </div>
    </div>

    <!--Sorted based on ranking and password-->
    <!--if there is no password-->
    <div
      class="alltables"
      v-if="$store.state.ifranking != null && $store.state.ifpassword == false"
    >
      <!--Check option-->
      <div v-for="table in tables" :key="table.id">
        <!--Search-->
        <div
          v-if="
            table.name.substring(0, search.length).toLowerCase() ==
              search.toLowerCase() &&
              $store.state.ifranking == table.ranking &&
              table.password == ''
          "
        >
          <!--Sort Tables-->
          <SearchSingleTable
            :table="table"
            :user="user"
            @handlePassword="handlePassword"
          />
        </div>
      </div>
    </div>
    <!--if there is password-->
    <div
      class="alltables"
      v-if="$store.state.ifranking != null && $store.state.ifpassword == true"
    >
      <!--Check option-->
      <div v-for="table in tables" :key="table.id">
        <!--Search-->
        <div
          v-if="
            table.name.substring(0, search.length).toLowerCase() ==
              search.toLowerCase() &&
              $store.state.ifranking == table.ranking &&
              table.password != ''
          "
        >
          <!--Sort Tables-->
          <SearchSingleTable
            :table="table"
            :user="user"
            @handlePassword="handlePassword"
          />
        </div>
      </div>
    </div>
  </div>
  <!--if you are typing in password-->
  <div v-else class="singletable w-75">
    <CheckPassword
      :tableid="singletable.id"
      :user="user"
      @handlePassword="handlePassword"
    />
  </div>
</template>

<script>
//components
import SearchSingleTable from "./SearchSingleTable.vue";
import CheckPassword from "./CheckPassword.vue";
//composables
import getWatchedtables from "@/composables/get/getWatchedtables";
//other
import { ref } from "@vue/reactivity";
//import store from '@/store'

export default {
  components: { SearchSingleTable, CheckPassword },
  props: ["search", "user"],
  setup(props) {
    const { error, tables } = getWatchedtables();

    const checkpassword = ref(false);
    const singletable = ref([]);

    //change mode between looking at tables and typing password to enter a table
    //from CheckPassword.vue and SearchSingleTable.vue
    function handlePassword(t) {
      checkpassword.value = !checkpassword.value;
      singletable.value = t;
    }

    return { error, tables, handlePassword, checkpassword, singletable };
  },
};
</script>

<style>
.alltables {
  overflow: auto;
  height: 50%;
  width: 70%;
  margin: auto;
}
.line {
  overflow: auto;
  display: flex;
}
.users {
  border: 1px solid rgb(4, 1, 34);
  border-radius: 8px;
}
.name {
  overflow: auto;
}
.password {
  margin-left: auto;
  overflow: visible;
}
</style>
