// getters are functions
export default {
  // user: state => {
  //   return state.firebase.auth().currentUser
  // },
  peerNames: (state) => {
    return state.peers.map((p) => (p.established ? p.nickname : false));
  },
  peer: (state) => (nickname) => {
    return state.peers.find((p) => p.nickname === nickname);
  },
};
