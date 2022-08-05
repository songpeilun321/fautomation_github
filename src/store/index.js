import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import state from '@/store/state'
import getters from '@/store/getters'
import mutations from '@/store/mutations'


const store = new Vuex.Store({
  state,
  getters,
  mutations,

});

export default store

