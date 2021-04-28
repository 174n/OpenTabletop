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
  socket: null,
};
