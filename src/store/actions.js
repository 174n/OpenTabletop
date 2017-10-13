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




  /* Data manangment
  ==================================*/

  lobbyGetData(context, id){
    context.state.lobbyId = id;
    firebase.database().ref('lobbies/' + id).on('value', function(snapshot){
      let val = snapshot.val().game;
      if(val.chat === undefined || val.chat === null) val = Object.assign(val,{"chat":[]});
      // console.log(snapshot);
      context.commit('updateGame',val);
    });
  },

  lobbyPutData(context){
    let lobbyId = context.state.lobbyId;
    firebase.database().ref('/lobbies/'+lobbyId+'/game/').set(context.state.game);
  },

  lobbyUpdateState(context, state){
    let lobbyId = context.state.lobbyId;
    firebase.database().ref('/lobbies/'+lobbyId+'/game/'+state.path).update(state.data);
  },

  lobbySetState(context, state){
    let lobbyId = context.state.lobbyId;
    firebase.database().ref('/lobbies/'+lobbyId+'/game/'+state.path).set(state.data);
  },

  lobbyMoveObject(context, [from,to]){
    let lobbyId = context.state.lobbyId;
    let oldRef = firebase.database().ref('/lobbies/'+lobbyId+'/game/'+from);
    let newRef = firebase.database().ref('/lobbies/'+lobbyId+'/game/'+to);

    oldRef.once('value', function(snap){
      newRef.set( snap.value(), function(error){
        if(!error){ oldRef.remove(); }
        else EventBus.$emit('snackbarOpen', error);
      });
    });
  },

  lobbyRemoveObject(context, path){
    let lobbyId = context.state.lobbyId;
    firebase.database().ref('/lobbies/'+lobbyId+'/game/'+path).remove();
  },

  lobbyPushObject(context, [path,data]){
    let lobbyId = context.state.lobbyId;
    firebase.database().ref('/lobbies/'+lobbyId+'/game/'+path).push(data);
  },




  lobbyUpdateNewObjects(context){
    let objects = context.state.game.objects;
    objects.forEach((v,i) => {

      if(v.new === true){
        delete v.new;
        context.dispatch("lobbyUpdateState", {
          path: "objects/"+i,
          data: v
        });
        // console.log(v.type, i);
      }
      else if(v.type === "updateAll"){
        objects.splice(i, 1);
        context.dispatch("lobbyPutData");
      }

    });
  },

  lobbyCommitMutation({commit, dispatch}, {mutation, params}){
    // console.log(mutation, params);
    commit(mutation, params);
    dispatch("lobbyUpdateNewObjects");
  },


    lobbyUpdateChat(context){
      let lobbyId = context.state.lobbyId;
      firebase.database().ref('/lobbies/'+lobbyId+'/game/chat').set(context.state.game.chat);
    },


  /* State updates
  ====================================*/

  // moveObject(context, event){
  //   var target = event.target,
  //     id = target.getAttribute("data-id"),
  //     obj = context.state.game.objects[id],
  //     x = (parseFloat(obj.x) || 0) + event.dx,
  //     y = (parseFloat(obj.y) || 0) + event.dy;
  //   context.dispatch("lobbyUpdateState", {
  //     path: "objects/"+id,
  //     data: {x: x, y: y}
  //   });
  // },


  // // Objects

  // takeCardFromDeck(context, [deckId,amount=1]){

  //   let deck = context.state.game.objects[deckId].cards;
  //   let card = deck.slice(amount*(-1));
    
  //   card.forEach(v => {
  //     v.x = context.state.game.objects[deckId].x+30;
  //     v.y = context.state.game.objects[deckId].y+30;
  //     context.state.game.objects.push(v);
  //     deck.splice(-1);
  //     // context.dispatch("lobbyPushObject", ["objects/",v]);
  //   });

  //   // context.dispatch("lobbySetState", {
  //   //   path: "objects/"+deckId+"/cards",
  //   //   data: deck
  //   // });
  //   context.dispatch("lobbyPutData");
    
  // },

  // takeCardFromDeckById(state, [deckId,id=0]){

  //   let deck = state.game.objects[deckId].cards;
  //   let card = deck[id];
  //   card.x = state.game.objects[deckId].x+30;
  //   card.y = state.game.objects[deckId].y+30;
  //   state.game.objects.push(card);
  //   deck.splice(id,1);
    
  //   // context.dispatch("lobbyPushObject", ["objects/",card]);

  //   // context.dispatch("lobbySetState", {
  //   //   path: "objects/"+deckId+"/cards",
  //   //   data: deck
  //   // });
  //   context.dispatch("lobbyPutData");

  // },

  // moveCardToDeck(context, [card,deck]){

  //   let objects = context.state.game.objects;
  //   objects[card].rotation = 0;

  //   objects[deck].cards.push(objects[card]);
  //   objects.splice(card, 1);

  //   context.dispatch("lobbyPutData");

  //   // context.dispatch("lobbyRemoveObject", "objects/"+card);

  //   // context.dispatch("lobbySetState", {
  //   //   path: "objects/"+deck+"/cards",
  //   //   data: objects[deck].cards
  //   // });

  // },














  

  // removeObject(state, objectId){
  //   let objects = state.game.objects;
  //   if(objects[objectId] !== undefined){
  //     objects.splice(objectId, 1);
  //   }
  // },

  // rotateCard(state, cardId){
  //   let card = state.game.objects[cardId];
  //   if(card.type === "card") card.rotation = card.rotation === 0 ? 90 : 0;
  // },

  // addNewDeck(state, event){
  //   state.game.objects.push({
  //     type: "deck",
  //     x: event.screenX-150,y: event.screenY-150,
  //     color: "#ccc",
  //     text: "New Deck",
  //     cards:[]
  //   });
  // },


  // addNewCounter(state, event){
  //   state.game.objects.push({
  //     type: "counter",
  //     x: event.screenX-50,y: event.screenY-100,
  //     count: 0,
  //     color: randomColor()
  //   });
  // },

  // shuffleDeck(state, deckId){
  //   let cards = state.game.objects[deckId].cards;
  //   cards = shuffle(cards);
  // },

  // counterChangeNumber(state, [id,num=1]){
  //   state.game.objects[id].count+=num;
  // },

  // counterChangeColor(state, id){
  //   state.game.objects[id].color=randomColor();
  // },


  // // Chat

  // chatAddMsg(state, data){
  //   state.game.chat.push({
  //     title: data[0],
  //     msg: data[1],
  //     time: Date.now()
  //   });
  // }














}