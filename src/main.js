import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'

//fontawesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLock, faLockOpen, faSearch, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faLock,faLockOpen,faSearch,faCheck, faTimes)


//global styles
import './assets/main.css'

//import firebase auth service
import {projectAuth} from './firebase/config'




let app

projectAuth.onAuthStateChanged(() => {
    if(!app){
        app = createApp(App)
        .use(router)
        .use(store)
        .component('font-awesome-icon',FontAwesomeIcon)
        .mount('#app')
    }
})