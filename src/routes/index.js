// import Component from './components/Component.vue';

import Tabletop from '../components/Tabletop.vue';
import MainPage from '../components/MainPage.vue';

export default [
  // { path: '/', component: Component },
  { path: '/', component: MainPage },
  { path: '/tabletop/:id', component: Tabletop }
]