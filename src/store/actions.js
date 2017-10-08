import firebase from "firebase";
import config from "../config/firebase.json";
import shortid from 'shortid';

// actions are functions that cause side effects and can involve
// asynchronous operations.

//this.$store.dispatch('');

export default {


  signInWithGoogle({state}){
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then((result) => {
      state.user = result.user;
    }).catch(err => EventBus.$emit('snackbarOpen', error))
  },


  logout({state}){
    firebase.auth().signOut().then(() => {
      state.user = null;
    }).catch(err => EventBus.$emit('snackbarOpen', error))
  },


  firebaseInit({state}){
    state.firebaseLoading = true;
    firebase.initializeApp(config);

    firebase.auth().getRedirectResult().then(result => {
      if(result.user !== null){
        state.user = result.user;
      }
    }).catch(error => {
      EventBus.$emit('snackbarOpen', error);
    });
    firebase.auth().onAuthStateChanged(function(user) {
      state.firebaseLoading = false;
      state.user = user;
    });
  },



  newLobby(){
    let id = shortid.generate();
    return new Promise((resolve, reject) => {
      firebase.database().ref('lobbies/'+id).set({
        game: {
          objects:[
            {
              type: "card",
              url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417720&type=card",
              x: 0,y: 0, rotation: 0
            },
            {
              type: "card",
              url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423802&type=card",
              x: 150,y: 0, rotation: 90
            },
            {
              type: "card",
              url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417690&type=card",
              x: 0,y: 150, rotation: 0
            },
            {
              type: "deck",
              x: 200,y: 200,
              color: "#ccc",
              text: "Deck 1",
              cards:[
                {
                  type: "card",
                  url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417720&type=card",
                  x: 0,y: 0, rotation: 0
                }
              ]
            },
            {
              type: "counter",
              x: 400,y: 300,
              count: 0,
              color: "blue"
            }
          ],
          chat:[]
        }
      }).then(resolve(id));
    }); 
  },

  lobbyGetData(context, id){
    firebase.database().ref('lobbies/' + id).on('value', function(snapshot){
      let val = snapshot.val().game;
      if(val.chat === undefined || val.chat === null) val = Object.assign(val,{"chat":[]});
      // console.log(val);
      context.commit('updateGame',val);
    });
  }


}