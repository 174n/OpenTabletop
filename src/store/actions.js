import signalhub from "signalhub-light-client";
import emitter from "../helpers/event-bus.js";
// import Peer from "simple-peer-light";
import FastRTCPeer from "@mattkrick/fast-rtc-peer";

export default {
  newLobby({ state, commit }, id) {
    commit("setLobby", {
      id,
      game: {
        objects: [
          {
            type: "card",
            back:
              "https://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg",
            url:
              "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417720&type=card",
            x: 0,
            y: 0,
            rotation: 0,
          },
          {
            type: "card",
            back:
              "https://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg",
            url:
              "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423802&type=card",
            x: 150,
            y: 0,
            rotation: 90,
          },
          {
            type: "card",
            back:
              "https://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg",
            url:
              "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417690&type=card",
            x: 0,
            y: 150,
            rotation: 0,
          },
          {
            type: "deck",
            x: 200,
            y: 200,
            color: "#ccc",
            text: "Deck 1",
            cards: [
              {
                type: "card",
                back:
                  "https://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg",
                url:
                  "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417720&type=card",
                x: 0,
                y: 0,
                rotation: 0,
              },
            ],
          },
          {
            type: "counter",
            x: 400,
            y: 300,
            count: 0,
            color: "blue",
          },
        ],
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
    });
  },

  async lobbySetGame({ commit }, game) {
    commit("lobbyReplaceGame", game);
  },

  logout({ commit }) {
    commit("logout");
  },

  initHub({ state, dispatch, commit, getters }) {
    commit(
      "setHub",
      signalhub(
        "open-tabletop",
        `${location.protocol}//${location.hostname}:9000`
      )
    );

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

    const peer = new FastRTCPeer({ isOfferer: isInitiator });
    peer.on("signal", (data) => {
      state.hub.broadcast(state.lobby.id, {
        nickname: state.user.nickname,
        data,
      });
    });
    peer.on("open", () => {
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

  sendPatch({ state, dispatch }, patch) {
    if (state.peers) {
      dispatch(
        "broadcastToPeers",
        JSON.stringify({ patch, nickname: state.user.nickname })
      );
    }
  },
};
