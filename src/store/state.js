// root state object.
// each Vuex instance is just a single state tree.
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
  rtcConfig: {
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "turn:turn.anyfirewall.com:443?transport=tcp",
        ],
        credential: "webrtc",
        username: "webrtc",
      },
    ],
  },
  gameStarted: false,
  signalhubUrl: "http://localhost:9000"
};
