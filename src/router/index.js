import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/auth/Signup.vue";
import Login from "../views/auth/Login.vue";
import Profile from "../views/pages/Profile.vue";
import CreateTable from "../views/pages/CreateTable.vue";
import Search from "../views/pages/Search.vue";
import Table from "../views/pages/Table.vue";
import Friends from "../views/pages/Friends.vue";
import CreateAccount from "../views/auth/CreateAccount.vue";

//route guards
import { projectAuth } from "../firebase/config";
import { projectFirestore } from "../firebase/config";
import { ref } from "@vue/reactivity";

//check if user is already sitting at a table

const requireTable = async (to, from, next) => {
  let user = projectAuth.currentUser;

  const tables = ref([]);
  let tableid = null;
  const res = await projectFirestore.collection("tables").get();

  tables.value = res.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  for (const object of tables.value) {
    for (const singleuser of object.users) {
      if (singleuser.userid === user.uid) {
        tableid = object.id;
      }
    }
  }

  if (tableid === null) {
    next();
  } else {
    next({ name: "Table", params: { id: tableid } });
  }
};

//check if user is logged in

const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser;
  if (!user) {
    next({ name: "Login" });
  } else {
    next();
  }
};
//check if user is not logged in
const requireNoAuth = (to, from, next) => {
  let user = projectAuth.currentUser;
  if (user) {
    next({ name: "Home" });
  } else {
    next();
  }
};

//check if user is anonymous
const requireAnonymous = (to, from, next) => {
  if (!projectAuth.currentUser.isAnonymous) {
    next({ name: "Home" });
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: [requireAuth, requireTable],
  },
  {
    path: "/profile/:id",
    name: "Profile",
    component: Profile,
    beforeEnter: [requireAuth, requireTable],
    props: true,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    beforeEnter: requireNoAuth,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: requireNoAuth,
  },
  {
    path: "/createtable",
    name: "CreateTable",
    component: CreateTable,
    beforeEnter: [requireAuth, requireTable],
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
    beforeEnter: [requireAuth, requireTable],
  },
  {
    path: "/table/:id",
    name: "Table",
    component: Table,
    beforeEnter: requireAuth,
    props: true,
  },
  {
    path: "/friends/:id",
    name: "Friends",
    component: Friends,
    beforeEnter: [requireAuth, requireTable],
    props: true,
  },
  {
    path: "/createaccount",
    name: "CreateAccount",
    component: CreateAccount,
    beforeEnter: [requireAuth, requireTable, requireAnonymous],
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
