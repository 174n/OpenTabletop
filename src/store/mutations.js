import Vue from "vue";
import shuffle from "shuffle-array";
import emitter from "../helpers/event-bus.js";
import { applyPatch } from "fast-json-patch";
// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.

function randomColor() {
  const colors = [
    "red",
    "pink",
    "purple",
    "deep-purple",
    "indigo",
    "blue",
    "light-blue",
    "cyan",
    "teal",
    "green",
    "light-green",
    "lime",
    "yellow",
    "amber",
    "orange",
    "deep-orange",
    "brown",
    "blue-grey",
    "grey",
  ];
  return shuffle.pick(colors);
}

export default {
  /* Objects
  =======================================*/
  takeCardFromDeck(state, [deckId, amount = 1, hand = false]) {
    /*const deckId = params[0];
    const amount = params[1] !== undefined ? params[1] : 1;*/

    const deck = state.lobby.game.objects[deckId];
    const card = deck.cards.slice(amount * -1);

    card.forEach((v) => {
      v.x = state.lobby.game.objects[deckId].x + 30;
      v.y = state.lobby.game.objects[deckId].y + 30;
      v.hand = hand ? state.user.uid : false;
      v.new = true;
      state.lobby.game.objects.push(v);
      deck.cards.splice(-1);
    });

    deck.new = true;
  },

  takeCardFromDeckById(state, { deckId, id }) {
    /*const deckId = params[0];
    const id = params[1] !== undefined ? params[1] : 0;*/

    const deck = state.lobby.game.objects[deckId];
    const card = deck.cards[id || 0];

    if (!deck || !card) return;

    card.x = deck.x + 30;
    card.y = deck.y + 30;
    card.new = true;

    state.lobby.game.objects.push(card);
    deck.cards.splice(id, 1);
    deck.new = true;
  },

  moveCardToDeck(state, [cardId, deckId]) {
    const objects = state.lobby.game.objects;
    const deck = objects[deckId];

    objects[cardId].rotation = 0;
    deck.cards.push(objects[cardId]);

    objects.splice(cardId, 1);
    objects.push({
      type: "updateAll",
    });
  },

  removeObject(state, objectId) {
    const objects = state.lobby.game.objects;
    if (objects[objectId] !== undefined) {
      objects.splice(objectId, 1);
      objects.push({
        type: "updateAll",
      });
    }
  },

  rotateCard(state, cardId) {
    const card = state.lobby.game.objects[cardId];
    if (card.type === "card")
      card.rotation =
        state.lobby.game.fullRotation || false
          ? card.rotation < 360
            ? card.rotation + 90
            : 90
          : card.rotation === 0
          ? 90
          : 0;
    card.new = true;
  },

  handMoveCard(state, cardId) {
    const card = state.lobby.game.objects[cardId];
    if (card.type === "card")
      card.hand = !card.hand ? state.user.nickname : false;
    card.new = true;
  },
  flipCard(state, cardId) {
    const card = state.lobby.game.objects[cardId];
    if (card.type === "card") card.hand = !card.hand ? "fliped" : false;
    card.new = true;
  },

  pinCard(state, cardId) {
    const card = state.lobby.game.objects[cardId];
    if (card.type === "card") card.pin = card.pin ? false : true;
    card.new = true;
  },

  cardSizeChange(state, data) {
    const card = state.lobby.game.objects[data.id];
    if (card.type === "card") {
      card.size = data.custom_size === true ? data.size : 12;
      card.real_size = data.real_size;
    }
    card.new = true;
  },

  addNewDeck(state, data) {
    const id = data.index;
    state.lobby.game.objects.push({
      type: "deck",
      x: data.x,
      y: data.y,
      color: "#ccc",
      text: state.decks[id].name,
      cards: state.decks[id].urls.map((url) => {
        return {
          type: "card",
          url,
          back: state.decks[id].back,
          real_size: state.decks[id].real_size || false,
          size: state.decks[id].size || 12,
          hand: false,
          x: 0,
          y: 0,
          rotation: 0,
        };
      }),
      new: true,
    });
  },

  addNewDeckFromData(state, data) {
    state.lobby.game.objects.push({
      type: "deck",
      x: data.x,
      y: data.y,
      color: "#ccc",
      text: data.title,
      cards: data.urls.map((url) => {
        return {
          type: "card",
          url,
          back: data.back,
          hand: false,
          real_size: data.real_size || false,
          size: data.size || 12,
          x: 0,
          y: 0,
          rotation: 0,
        };
      }),
      new: true,
    });
  },

  addNewCounter(state, pos) {
    state.lobby.game.objects.push({
      type: "counter",
      x: pos.x - 50,
      y: pos.y - 100,
      count: 0,
      color: randomColor(),
      new: true,
    });
  },

  moveObject(state, data) {
    const obj = state.lobby.game.objects[data.id];
    obj.x += data.dx;
    obj.y += data.dy;
  },

  shuffleDeck(state, deckId) {
    const deck = state.lobby.game.objects[deckId];
    deck.cards = shuffle(deck.cards);
    deck.new = true;
  },

  updateDeck(state, deckId) {
    state.lobby.game.objects[deckId].new = true;
  },

  reverseDeck(state, deckId) {
    const deck = state.lobby.game.objects[deckId];
    deck.cards.reverse();
    deck.new = true;
  },

  flipDeck(state, deckId) {
    const deck = state.lobby.game.objects[deckId];
    deck.fliped = !deck.fliped ? true : false;
    deck.new = true;
  },

  counterChangeNumber(state, [id, num = 1]) {
    const counter = state.lobby.game.objects[id];
    counter.count += num;
    counter.new = true;
  },

  counterChangeColor(state, id) {
    const counter = state.lobby.game.objects[id];
    counter.color = randomColor();
    counter.new = true;
  },

  /* User
  =======================================*/

  setNickname(state, nickname) {
    localStorage.setItem("nickname", nickname); // temporary
    state.user = {
      nickname,
    };
  },

  initUser(state) {
    //temporary
    const nickname = localStorage.getItem("nickname");
    if (nickname) {
      state.user = { nickname: nickname };
    }
  },

  logout(state) {
    localStorage.removeItem("nickname");
    state.user = null;
  },

  /* Chat
  =======================================*/

  chatAddMsg(state, data) {
    state.lobby.game.chat.push({
      nickname: data.nickname,
      msg: data.msg,
      time: Date.now(),
    });
  },

  /* Peers
  =======================================*/

  setHub(state, hub) {
    if (!hub) return;
    state.hub = hub;
  },

  addPeer(state, { nickname, peer }) {
    if (!nickname || !peer) return;
    // state.peers[nickname] = peer;
    state.peers.push({
      nickname,
      peer,
    });
  },

  removePeer(state, nickname) {
    const peer = state.peers.find((p) => p.nickname === nickname);
    state.peers.splice(state.peers.indexOf(peer), 1);
  },

  /* Lobby
  =======================================*/

  setLobby(state, lobby) {
    state.lobby = lobby;
  },

  setRedirect(state, path) {
    state.redirect = path;
  },

  updateGame(state, { id = "firstLoad", val }) {
    // Object.values(val.objects).forEach((v) => {
    //   if(v.type==="deck" && v.cards===undefined) v.cards = [];
    // });
    // state.lobby.game = val;

    if (id === "chat") {
      state.lobby.game.chat = val;
    } else if (id === "members") {
      state.lobby.game.members = val;
    } else if (id === "background") {
      state.lobby.game.background = val;
    } else if (id === "firstLoad") {
      if (val !== null || val !== undefined) {
        if (
          val !== undefined &&
          (val.objects === null || val.objects === undefined)
        )
          val.objects = [];
        Object.values(val.objects).forEach((v) => {
          if (v.type === "deck" && v.cards === undefined) v.cards = [];
        });
      }
      state.lobby.game = val;
    } else {
      if (val.type === "deck" && val.cards === undefined) val.cards = [];
      Vue.set(state.lobby.game.objects, id, val);
      emitter.emit("deckViewUpdate");
    }
  },

  lobbyAdminUpdate(state, admin) {
    state.lobby.admin = admin;
  },

  lobbySetBackground(state, background) {
    state.lobby.game.background = background;
  },

  lobbyReplaceGame(state, game) {
    Object.keys(game).forEach((key) => {
      state.lobby.game[key] = game[key];
    });
  },

  patchLobby(state, patch) {
    applyPatch(state.lobby.game, patch);
  },

  startGame(state) {
    state.gameStarted = true;
  },

  toggleGameState(state) {
    state.gameStarted = !state.gameStarted;
  },

  /* Other
  =======================================*/

  syncTypeChange(state) {
    if (state.sync === "full") state.sync = "advanced";
    else state.sync = "full";
  },

  deckOptionsChange(state, newData) {
    state.deckOptions = newData;
  },

  diceChange(state, dice) {
    state.dice = dice;
  },
};
