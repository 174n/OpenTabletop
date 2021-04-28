import shortid from "shortid";

export default {
  newLobby({ state, commit }) {
    commit("setLobby", {
      id: shortid.generate(),
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
      peers: [],
    });
  },

  async lobbySetGame({ commit }, game) {
    commit("lobbyReplaceGame", game);
  },

  logout({ commit }) {
    commit("logout");
  },

  async connectToALobby({ state, commit }) {
    state.lobby.socket = new WebSocket("ws://localhost:3000");

    state.lobby.socket.addEventListener("open", () => {
      state.lobby.socket.addEventListener("message", (event) => {
        const { patch, nickname } = JSON.parse(event.data);
        if (nickname !== state.user.nickname) {
          commit("patchLobby", patch);
        }
      });
    });
  },

  sendPatch({ state }, patch) {
    if (state.lobby.socket) {
      state.lobby.socket.send(
        JSON.stringify({ patch, nickname: state.user.nickname })
      );
    }
  },
};
