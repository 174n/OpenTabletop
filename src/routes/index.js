import MainPage from "../components/MainPage.vue";
import Game from "../components/Game.vue";
import Lobby from "../components/Lobby.vue";

export default [
  // { path: '/', component: Component },
  {
    path: "/",
    component: MainPage,
  },
  {
    path: "/game/:id",
    component: Game,
  },
  {
    path: "/lobby/:id",
    component: Lobby,
  },
];
