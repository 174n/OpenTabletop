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
  takeCardFromDeck(state, [deckId,amount=1]){
    /*let deckId = params[0];
    let amount = params[1] !== undefined ? params[1] : 1;*/

    let deck = state.game.objects[deckId].cards;
    let card = deck.slice(amount*(-1));
    
    card.forEach(v => {
      v.x = state.game.objects[deckId].x+30;
      v.y = state.game.objects[deckId].y+30;
      state.game.objects.push(v);
      deck.splice(-1);
    });

  },

  takeCardFromDeckById(state, [deckId,id=0]){
    /*let deckId = params[0];
    let id = params[1] !== undefined ? params[1] : 0;*/

    let deck = state.game.objects[deckId].cards;
    let card = deck[id];
    card.x = state.game.objects[deckId].x+30;
    card.y = state.game.objects[deckId].y+30;
    state.game.objects.push(card);
    deck.splice(id,1);

  },

  moveCardToDeck(state, [card,deck]){
    let objects = state.game.objects;
    objects[card].rotation = 0;

    objects[deck].cards.push(objects[card]);
    objects.splice(card, 1);
  },

  removeObject(state, objectId){
    let objects = state.game.objects;
    if(objects[objectId] !== undefined){
      objects.splice(objectId, 1);
    }
  },

  rotateCard(state, cardId){
    let card = state.game.objects[cardId];
    if(card.type === "card") card.rotation = card.rotation === 0 ? 90 : 0;
  },

  addNewDeck(state, event){
    state.game.objects.push({
      type: "deck",
      x: event.screenX-150,y: event.screenY-150,
      color: "#ccc",
      text: "New Deck",
      cards:[]
    });
  },


  addNewCounter(state, event){
    state.game.objects.push({
      type: "counter",
      x: event.screenX-50,y: event.screenY-100,
      count: 0,
      color: randomColor()
    });
  },


  moveObject(state, event){
    var target = event.target,
      obj = state.game.objects[target.getAttribute("data-id")],
      x = (parseFloat(obj.x) || 0) + event.dx,
      y = (parseFloat(obj.y) || 0) + event.dy;
    obj.x = x;
    obj.y = y;
  },

  shuffleDeck(state, deckId){
    let cards = state.game.objects[deckId].cards;
    cards = shuffle(cards);
  },

  counterChangeNumber(state, [id,num=1]){
    state.game.objects[id].count+=num;
  },

  counterChangeColor(state, id){
    state.game.objects[id].color=randomColor();
  },


  /* Chat
  =======================================*/

  chatAddMsg(state, data){
    state.game.chat.push({
      title: data[0],
      msg: data[1],
      time: Date.now()
    });
  },



  /* Lobby
  =======================================*/

  updateGame(state, val){
    state.game = val;
  }

}