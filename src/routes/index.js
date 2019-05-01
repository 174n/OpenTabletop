import MainPage from '../components/MainPage.vue';
import Lobby from '../components/Lobby.vue';
import Vuex from 'vuex'
import Store from '../store/index.js';

export default [
  // { path: '/', component: Component },
  {
    path: '/',
    component: MainPage
  },
  {
    path: '/lobby/:id',
    component: Lobby
  }
]