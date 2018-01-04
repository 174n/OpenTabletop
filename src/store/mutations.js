import Vue from 'vue';
import shuffle from "shuffle-array";
// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.

function randomColor(){
  let colors = ["red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","blue-grey","grey"];
  return shuffle.pick(colors);
}

export default {


  /* Objects
  =======================================*/
  takeCardFromDeck(state, [deckId,amount=1,hand=false]){
    /*let deckId = params[0];
    let amount = params[1] !== undefined ? params[1] : 1;*/

    let deck = state.game.objects[deckId];
    let card = deck.cards.slice(amount*(-1));
    
    card.forEach(v => {
      v.x = state.game.objects[deckId].x+30;
      v.y = state.game.objects[deckId].y+30;
      v.hand = hand ? state.user.uid : false;
      v.new = true;
      state.game.objects.push(v);
      deck.cards.splice(-1);
    });

    deck.new = true;
  },

  takeCardFromDeckById(state, [deckId,id=0]){
    /*let deckId = params[0];
    let id = params[1] !== undefined ? params[1] : 0;*/

    let deck = state.game.objects[deckId];
    let card = deck.cards[id];

    card.x = deck.x+30;
    card.y = deck.y+30;
    card.new = true;

    state.game.objects.push(card);
    deck.cards.splice(id,1);
    deck.new = true;

  },

  moveCardToDeck(state, [cardId,deckId]){
    let objects = state.game.objects;
    let deck = objects[deckId];

    objects[cardId].rotation = 0;
    deck.cards.push(objects[cardId]);

    objects.splice(cardId, 1);
    objects.push({
      type: "updateAll"
    });
  },

  removeObject(state, objectId){
    let objects = state.game.objects;
    if(objects[objectId] !== undefined){

      objects.splice(objectId, 1);
      objects.push({
        type: "updateAll"
      });
    }
  },

  rotateCard(state, cardId){
    let card = state.game.objects[cardId];
    if(card.type === "card") card.rotation = 
      (state.game.fullRotation || false) ?
      (card.rotation < 360 ? card.rotation + 90 : 0):
      (card.rotation === 0 ? 90 : 0);
    card.new = true;
  },

  handMoveCard(state, cardId){
    let card = state.game.objects[cardId];
    if(card.type === "card") card.hand = !card.hand ? state.user.uid : false;
    card.new = true;
  },

  pinCard(state, cardId){
    let card = state.game.objects[cardId];
    if(card.type === "card") card.pin = card.pin ? false : true;
    card.new = true;
  },

  cardSizeChange(state, data){
    let card = state.game.objects[data.id];
    if(card.type === "card"){
      card.size = data.custom_size === true ? data.size : 12;
      card.real_size = data.real_size;
    };
    card.new = true;
  },

  addNewDeck(state, data){
    let id = data.index;
    state.game.objects.push({
      type: "deck",
      x: data.x,y: data.y,
      color: "#ccc",
      text: state.decks[id].name,
      cards: state.decks[id].urls.map(url => {
        return {
          type: "card",
          url,
          back: state.decks[id].back,
          real_size: state.decks[id].real_size || false,
          size: state.decks[id].size || 12,
          hand: false,
          x: 0,y: 0, rotation: 0
        }
      }),
      new: true
    });
  },

  addNewDeckFromData(state, data){
    state.game.objects.push({
      type: "deck",
      x: data.x,y: data.y,
      color: "#ccc",
      text: data.title,
      cards: data.urls.map(url => {
        return {
          type: "card",
          url,
          back: data.back,
          hand: false,
          real_size: data.real_size || false,
          size: data.size || 12,
          x: 0,y: 0, rotation: 0
        }
      }),
      new: true
    });
  },


  addNewCounter(state, event){
    state.game.objects.push({
      type: "counter",
      x: event.clientX-50,y: event.clientY-100,
      count: 0,
      color: randomColor(),
      new: true
    });
  },


  moveObject(state, data){
    let event = data.event,
        scale = data.scale;
    var target = event.target,
      obj = state.game.objects[target.getAttribute("data-id")],
      x = (parseFloat(obj.x) || 0) + event.dx / scale,
      y = (parseFloat(obj.y) || 0) + event.dy / scale;
    obj.x = x;
    obj.y = y;
    obj.new = true;
  },

  shuffleDeck(state, deckId){
    let deck = state.game.objects[deckId];
    let cards = deck.cards;
    cards = shuffle(cards);
    deck.new = true;
  },

  counterChangeNumber(state, [id,num=1]){
    let counter = state.game.objects[id]
    counter.count+=num;
    counter.new = true;
  },

  counterChangeColor(state, id){
    let counter = state.game.objects[id]
    counter.color=randomColor();
    counter.new = true;
  },


  /* Chat
  =======================================*/

  chatAddMsg(state, data){
    state.game.chat.push({
      title: data[0],
      msg: data[1],
      time: {".sv":"timestamp"}
    });
  },



  /* Lobby
  =======================================*/

  updateGame(state, {id="firstLoad", val}){

    // Object.values(val.objects).forEach((v) => {
    //   if(v.type==="deck" && v.cards===undefined) v.cards = [];
    // });
    // state.game = val;

    if(id === "chat"){
      state.game.chat = val;
    }

    else if(id === "members"){
      state.game.members = val;
    }

    else if(id === "background"){
      state.game.background = val;
      if (val !== undefined) {
        document.body.style.background = val.background_color;
        document.body.style.backgroundImage = val.background_url.length > 0 && ( 'url('+val.background_url+')' ) || 'none'
      }

    }

    else if(id === "firstLoad"){
      if(val !== null || val !== undefined){
        if(val !== undefined && (val.objects === null || val.objects === undefined)) val.objects = [];
        Object.values(val.objects).forEach((v) => {
          if(v.type==="deck" && v.cards===undefined) v.cards = [];
        });
      }
      state.game = val;
    }

    else{
      if(val.type==="deck" && val.cards===undefined) val.cards = [];
      Vue.set(state.game.objects, id, val);
    }



  },



  lobbyAdminUpdate(state, admin){
    state.lobbyAdmin = admin;
  },





  /* Other
  =======================================*/


  syncTypeChange(state){
    if (state.sync === "full") state.sync = "advanced"
    else state.sync = "full";
  },

  deckOptionsChange(state, newData){
    state.deckOptions = newData;
  },

  diceChange(state, dice){
    state.dice = dice;
  },

}