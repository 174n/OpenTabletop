import config from "../../config.json";

export default {
  user: null,
  redirect: null,
  decks: [],
  loading: false,
  lobbyId: "",
  deckOptions: {},
  dice: "1d6",
  lobby: null,
  hub: null,
  peers: [],
  gameStarted: false,
  signalhubUrl: config?.signalhub_url || "http://localhost:9000",
  customIceServers: localStorage.getItem("OT:customIceServers") || config?.custom_ice_servers || []
};
