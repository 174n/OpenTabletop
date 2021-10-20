import emitter from "../helpers/event-bus.js";

export default {
  peerNames: state => {
    return state.peers.map((p) => (p.established ? p.nickname : false));
  },
  peer: state => nickname => {
    return state.peers.find((p) => p.nickname === nickname);
  },
  rtcConfig: state => {
    let servers = [];

    try {
      servers = JSON.parse(state.customIceServers);
    } catch (err) {
      console.error(err, state.customIceServers);
      emitter.emit("snackbarOpen", "Error parsing ICE Server list");
    }

    if (!servers || !(servers instanceof Array))
      servers = [];

    localStorage.setItem("OT:customIceServers", state.customIceServers);

    return {
      optional: [
        {
          DtlsSrtpKeyAgreement: false
        },
        {
          RtpDataChannels: false
        }
      ],
      iceServers: [
        {
          url: "stun:stun.l.google.com:19302"
        },
        ...servers
      ]
    }
  }
};
