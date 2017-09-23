import Vue from 'vue'
import Vuex from 'vuex'
import Firebase from 'firebase';
import { config } from '../firebase-config'

Vue.use(Vuex)


// root state object.
// each Vuex instance is just a single state tree.
const state = {
  firebase: Firebase.initializeApp(config),
  user: null, userdata: null
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {

  signInWithGoogle: function(context){
    const provider = new Firebase.auth.GoogleAuthProvider();
    context.getters.auth.signInWithRedirect(provider).then((result) => {
      context.state.user = result.user;
    }).catch(err => console.log(error))
  },
  signOut: function(context){
    context.getters.auth.signOut().then(() => {
      context.state.user = null;
    }).catch(err => console.log(error))
  },
  firebaseInit: function(context){

    context.getters.auth.getRedirectResult().then(function(result) {
      /*if (result.credential) {
        var token = result.credential.accessToken;
      }*/
      if(result.user !== null){
        context.state.user = result.user;
        context.getters.db.ref('emails/' + result.user.email.replace(/\./g, ',')).set({
          id: result.user.uid
        });
      }

    }).catch(function(error) {
      console.log(error);
    });


    context.state.firebase.auth().onAuthStateChanged(function(user) {
      context.state.user = user;
      if(user !== null){
        let path = '/users/' + context.state.user.uid;
        // context.getters.db.ref(path).once('value').then(function(snapshot) {
        //   if(JSON.stringify(snapshot) !== "null"){
        //     context.state.userdata = JSON.parse(JSON.stringify(snapshot));
        //   }
        // });
        context.getters.db.ref(path).on('value', function (snapshot) {
          if(JSON.stringify(snapshot) !== "null"){
            context.state.userdata = JSON.parse(JSON.stringify(snapshot));
          }
        });
      }
    });


  }


}

// getters are functions
const getters = {
  // user: state => {
  //   return state.firebase.auth().currentUser
  // },
  db: state => {
    return state.firebase.database();
  },
  auth: state => {
    return state.firebase.auth();
  }
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})