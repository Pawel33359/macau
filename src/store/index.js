import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
    state () {
      return {
        currentMode: false,
        ifranking: null,
        ifpassword: null,
        friendsMode: false
      }
    },
    mutations: {
      //remember chat and ranking button state
      changecurrentMode (state) {
        state.currentMode = !state.currentMode;
      },
      //change buttons in search
      changeifranking(state, mode){
        state.ifranking = mode;
      },
      changeifpassword(state, mode){
        state.ifpassword = mode;
      },
      changefriendsMode (state) {
        state.friendsMode = !state.friendsMode;
      }
    }
  })
export default store;