import signalhub from "signalhub-light-client";
import emitter from "../helpers/event-bus.js";
// import Peer from "simple-peer-light";
import FastRTCPeer from "@mattkrick/fast-rtc-peer";

export default {
  async newLobby({ state, commit }, id) {
    const lobby = {
      id,
      game: {
        objects: [],
        chat: [],
        members: [],
        background: {
          tabletop_url: "",
          tabletop_color: "#eee",
          background_url: "",
          background_color: "#fafafa",
        },
      },
      created: Date.now(),
      creator: state.user,
      admin: state.user.nickname,
    };
    commit("setLobby", lobby);
  },

  async lobbySetGame({ commit }, game) {
    commit("lobbyReplaceGame", game);
  },

  logout({ commit }) {
    commit("logout");
  },

  initHub({ state, dispatch, commit, getters }) {
    commit("setHub", signalhub("open-tabletop", state.signalhubUrl));

    const id = state.lobby.id;

    state.hub.subscribe(id, (msg) => {
      if (msg.nickname !== state.user.nickname) {
        if (msg.hi && !getters.peer(msg.nickname)) {
          dispatch("createPeer", { nickname: msg.nickname, isInitiator: true });
        } else if (msg.data) {
          if (!getters.peer(msg.nickname)) {
            dispatch("createPeer", {
              nickname: msg.nickname,
              isInitiator: false,
            });
          }
          getters.peer(msg.nickname).peer.dispatch(msg.data);
        }
        console.log(msg);
      }
    });
    setTimeout(() => {
      state.hub.broadcast(id, {
        nickname: state.user.nickname,
        hi: true,
      });
    }, 1);
  },

  destroyHub({ state }) {
    state.hub.close();
  },

  createPeer({ state, commit, getters }, { nickname, isInitiator }) {
    if (getters.peer(nickname)) return;
    // const peer = new Peer({
    //   initiator: isInitiator,
    //   config: state.rtcConfig
    // });
    // peer.on("error", (err) => console.log("error", err));

    // peer.on("signal", (data) => {
    //   // console.log("SIGNAl:", data);
    //   state.hub.broadcast(state.lobby.id, {
    //     nickname: state.user.nickname,
    //     data,
    //   });
    // });

    // peer.on("connect", () => {
    //   console.log("CONNECT");
    //   peer.send("whatever" + Math.random());
    // });

    // peer.on("data", (data) => {
    //   console.log("data: " + data);
    // });

    const peer = new FastRTCPeer({
      isOfferer: isInitiator,
      rtcConfig: state.rtcConfig,
    });
    peer.on("signal", (data) => {
      state.hub.broadcast(state.lobby.id, {
        nickname: state.user.nickname,
        data,
      });
    });
    peer.on("open", (peer) => {
      if (isInitiator) {
        peer.send(
          JSON.stringify({
            data: state.lobby.game,
            event: "fetch",
            nickname: state.user.nickname,
          })
        );
      }
      commit("peerSetEstablished", nickname);
      emitter.emit("snackbarOpen", `${nickname} connected`);
    });
    peer.on("close", () => {
      commit("removePeer", nickname);
      emitter.emit("snackbarOpen", `${nickname} disconnected`);
    });
    peer.on("data", (data, peer) => {
      emitter.emit("peer-broadcast", data, peer);
    });

    commit("addPeer", { nickname, peer });
  },

  broadcastToPeers({ state }, msg) {
    state.peers.forEach((p) => {
      p.peer.send(msg);
    });
  },

  // async connectToALobby({ state, commit }) {
  //   state.lobby.socket = new WebSocket("ws://localhost:3000");

  //   state.lobby.socket.addEventListener("open", () => {
  //     state.lobby.socket.addEventListener("message", (event) => {
  //       const { patch, nickname } = JSON.parse(event.data);
  //       if (nickname !== state.user.nickname) {
  //         commit("patchLobby", patch);
  //       }
  //     });
  //   });
  // },

  sendPatch({ state, dispatch }, data) {
    if (state.peers) {
      dispatch(
        "broadcastToPeers",
        JSON.stringify({ data, event: "patch", nickname: state.user.nickname })
      );
    }
  },
};
