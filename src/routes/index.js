import MainPage from "../components/MainPage.vue";
import Lobby from "../components/Lobby.vue";

export default [
  // { path: '/', component: Component },
  {
    path: "/",
    component: MainPage,
  },
  {
    path: "/lobby/:id",
    component: Lobby,
  },
];
