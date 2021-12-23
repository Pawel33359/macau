import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/auth/Signup.vue'
import Login from '../views/auth/Login.vue'
import Profile from '../views/pages/Profile.vue'
import CreateTable from '../views/pages/CreateTable.vue'
import Search from '../views/pages/Search.vue'
import Table from '../views/pages/Table.vue'
import Friends from '../views/pages/Friends.vue'

//route guards
import {projectAuth} from '../firebase/config'

import { projectFirestore } from '../firebase/config'
import { ref} from '@vue/reactivity'

//check if user is logged in and if he is already sitting at a table
const requireAuthandTable = async (to,from,next) => {

  let user = projectAuth.currentUser

  if (!user) {//check if user is logged in
    next({ name: 'Login' })
  } else {

  const tables = ref([])
  let tableid = null

  //get all tables
  const res = await projectFirestore.collection('tables').get()

  tables.value = res.docs.map((doc=>{
    return {...doc.data(), id: doc.id}
  })
  )

  //loop through all tables and in every table loop through all users
  for(const object of tables.value){
    for(const singleuser of object.users){
      if(singleuser.userid == user.uid){
        tableid = object.id//if user is at table set id
      }
    }
  }

 
  if(tableid == null){//if user isn't at any table
    //console.log(tableid)
    next()
  }
  else{
    next({name:'Table',params: { id: tableid }})
  }
  }

}


//check only if user is logged in 
const requireAuth = (to,from,next) => {
  let user = projectAuth.currentUser
  if (!user) {
    next({ name: 'Login' })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: requireAuthandTable
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: Profile,
    beforeEnter: requireAuthandTable,
    props: true,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/createtable',
    name: 'CreateTable',
    component: CreateTable,
    beforeEnter: requireAuthandTable
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    beforeEnter: requireAuthandTable
  },
  {
    path: '/table/:id',
    name: 'Table',
    component: Table,
    beforeEnter: requireAuth,
    props: true,
  },
  {
    path: '/friends/:id',
    name: 'Friends',
    component: Friends,
    beforeEnter: requireAuthandTable,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
