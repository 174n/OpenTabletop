import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import state from "./state.js";
import mutations from "./mutations.js"
import actions from "./actions.js"
import getters from "./getters.js"
import plugins from "./plugins.js"

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins
})