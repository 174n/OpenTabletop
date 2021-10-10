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
  rtcConfig: {
    optional: [
      {
        DtlsSrtpKeyAgreement: false,
      },
      {
        RtpDataChannels: false,
      },
    ],
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
  signalhubUrl: config?.signalhub_url || "http://localhost:9000",
};
