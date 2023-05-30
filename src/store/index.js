import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      currentMode: false,
      ifranking: null,
      ifpassword: null,
      friendsMode: false,
      intervalFn: null,
    };
  },
  mutations: {
    //remember chat and ranking button state
    changecurrentMode(state) {
      state.currentMode = !state.currentMode;
    },
    //change buttons in search
    changeifranking(state, mode) {
      state.ifranking = mode;
    },
    changeifpassword(state, mode) {
      state.ifpassword = mode;
    },
    changefriendsMode(state) {
      state.friendsMode = !state.friendsMode;
    },
    changeIntervalFn(state, fn) {
      state.intervalFn = fn;
    },
    clearIntervalFn(state) {
      clearInterval(state.intervalFn);
    },
  },
});
export default store;
