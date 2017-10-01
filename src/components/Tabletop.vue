<template>
  <div class="tabletop">
    <template v-for="(object, i) in game.objects">
      <!-- card -->
      <div v-if="object.type === 'card'"
        @contextmenu.prevent="show('card',object.x,object.y,i)"
        @dblclick="cardPreviewOpen(i)"
        class="draggable card"
        :data-id="i"
        :style="{
          transform: 'translate('+object.x+'px, '+object.y+'px) rotate('+object.rotation+'deg)',
          backgroundImage: 'url('+object.url+')'
          }">
      </div>
      <!-- deck -->
      <div v-else-if="object.type === 'deck'"
        @contextmenu.prevent="show('deck',object.x,object.y,i)"
        @dblclick="takeCard(i)"
        class="draggable deck"
        :data-id="i"
        :style="{
          transform: 'translate('+object.x+'px, '+object.y+'px)',
          backgroundColor: object.color
          }">
        <div class="title">{{object.text}}</div>
        <div class="count">{{object.cards.length}}</div>
      </div>
      <!-- counter -->

      <v-avatar class="draggable red"
        v-else-if="object.type === 'counter'"
        :data-id="i"
        :style="{
          transform: 'translate('+object.x+'px, '+object.y+'px)'
          }">
        <span class="white--text headline">{{object.count}}</span>
      </v-avatar>
    </template>

    <!-- card rightclick menu -->
    <v-menu v-model="menu.card.show"
      z-index="100"
      :position-absolutely="true"
      :position-x="menu.card.x"
      :position-y="menu.card.y">
      <v-list>
        <v-list-tile @click="rotateCard(menu.card.id)">
          <v-list-tile-title>Rotate card</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="removeObject(menu.card.id)">
          <v-list-tile-title>Remove card</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    
    <!-- deck rightclick menu -->
    <v-menu v-model="menu.deck.show"
      :position-absolutely="true"
      :position-x="menu.deck.x"
      :position-y="menu.deck.y">
      <v-list>
        <v-list-tile @click="takeCard(menu.deck.id)">
          <v-list-tile-title>Take a card</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="deckListView(menu.deck.id)">
          <v-list-tile-title>Show cards</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="removeObject(menu.deck.id)">
          <v-list-tile-title>Remove deck</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>


    <deck-list></deck-list>
    <!-- card preview -->
    <v-dialog v-model="cardPreview.open" lazy absolute width="223">
      <img :src="cardPreview.url" alt="Card preview" class="cardPreview">
    </v-dialog>

    <v-speed-dial fixed bottom right v-model="speedDeal">
      <v-btn slot="activator" class="red darken-2" dark fab hover v-model="speedDeal">
        <v-icon>add</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn fab dark small class="green" v-tooltip:left="{ html: 'Add new deck' }" @click.native="addNewDeck">
        <v-icon>filter_none</v-icon>
      </v-btn>
      <v-btn fab dark small class="indigo" v-tooltip:left="{ html: 'Add a counter' }" @click.native="addNewCounter">
        <v-icon>plus_one</v-icon>
      </v-btn>
      <v-btn fab dark small class="red" v-tooltip:left="{ html: 'Roll a dice' }" @click.stop="rollDice">
        <v-icon>casino</v-icon>
      </v-btn>
      <v-btn fab dark small class="blue" v-tooltip:left="{ html: 'Open chat' }" @click.stop="sidebar=!sidebar">
        <v-icon>chat</v-icon>
      </v-btn>
    </v-speed-dial>

    <v-navigation-drawer v-model="sidebar" light>
      <v-layout>
        <v-flex xs12 sm10 offset-sm1>
          <v-text-field
            label="Message"
            single-line
            v-model="chatMsgValue"
            :append-icon-cb="chatMsg"
            append-icon="send">
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-list three-line>
        <v-list-tile avatar v-for="(msg, i) in game.chat.slice().reverse()" :key="i">
          <v-list-tile-content>
            <v-list-tile-title>{{msg.title}}</v-list-tile-title>
            <v-list-tile-sub-title>{{msg.msg}}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>
              <timeago :since="msg.time" :auto-update="30"></timeago>
            </v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
  
</template>

<script>
import interact from 'interactjs';
import DeckList from './DeckList.vue';
import { EventBus } from '../helpers/event-bus.js';

export default {
  components:{
    "deck-list": DeckList
  },
  data () {
    return {
      speedDeal: false,
      sidebar: true,
      chatMsgValue: "",
      cardPreview: {
        url: "",
        open: false
      },
      menu:{
        deck:{
          show: false,
          x:0,y:0,
          id:false
        },
        card:{
          show: false,
          x:0,y:0,
          id:false
        }
      },
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
            cards:[]
          },
          {
            type: "counter",
            x: 400,y: 300,
            count:0
          }
        ],
        chat:[]
      }
    }
  },
  methods:{
    dragMoveListener(event){
      var target = event.target,
        obj = this.game.objects[target.getAttribute("data-id")],
        x = (parseFloat(obj.x) || 0) + event.dx,
        y = (parseFloat(obj.y) || 0) + event.dy;
      obj.x = x;
      obj.y = y;
    },
    show(type,x,y,id) {
      let menu = this.menu[type];
      menu.x = x+5;
      menu.y = y+5;
      menu.id = id;
      menu.show = true;
    },
    takeCard(id){
      let deck = this.game.objects[id].cards,
          card = deck[deck.length-1];
      if(card !== undefined){
        card.rotation = 0;
        card.x = this.game.objects[id].x+30;
        card.y = this.game.objects[id].y+30;
        this.game.objects.push(card);
        deck.splice(-1, 1);
      }
    },
    removeObject(id){
      let objects = this.game.objects;
      if(objects[id] !== undefined){
        objects.splice(id, 1);
      }
    },
    rotateCard(id){
      let card = this.game.objects[id];
      card.rotation = card.rotation === 0 ? 90 : 0;
    },
    cardPreviewOpen(id){
      let card = this.game.objects[id];
      this.cardPreview.url = card.url;
      this.cardPreview.open = true;
    },
    deckListView(id){
      EventBus.$emit('deckViewToggle', this.game.objects[id]);
    },
    addNewDeck(event){
      this.game.objects.push({
        type: "deck",
        x: event.screenX-150,y: event.screenY-150,
        color: "#ccc",
        text: "New Deck",
        cards:[]
      });
    },
    addNewCounter(event){
      this.game.objects.push({
        type: "counter",
        x: event.screenX-150,y: event.screenY-150,
        count: 0
      });
    },
    randomInteger(min, max){
      return Math.round(min + Math.random() * (max - min));
    },
    rollDice(){
      this.game.chat.push({
        title: "Dice roll",
        msg: "[1d6] Result: "+this.randomInteger(1, 6),
        time: Date.now()
      });
      this.sidebar = true;
    },
    chatMsg(){
      this.game.chat.push({
        title: "Nickname",
        msg: this.chatMsgValue,
        time: Date.now()
      });
      this.chatMsgValue = "";
    }
  },
  mounted(){
    let self = this;
    interact('.draggable')
      .draggable({
        inertia: {
          resistance: 60
        },
        restrict: {
          restriction: "parent",
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        autoScroll: true,
        onmove: this.dragMoveListener,
        onend: function (event) {
          console.log('moved a distance of '+ (Math.sqrt(event.dx * event.dx +event.dy * event.dy)|0) + 'px');
        }
      });

    interact('.deck').dropzone({
      accept: '.card',
      overlap: 0.6, //% of element
      ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
      },
      ondrop: function (event) {
        let objects = self.game.objects,
            card = event.relatedTarget.getAttribute("data-id"),
            deck = event.target.getAttribute("data-id");
        objects[deck].cards.push(objects[card]);
        objects.splice(card, 1);
      }
    });
  }
}
</script>

<style lang="scss" scoped>

.tabletop{
  height: 100vh;
}
.draggable{
  position: absolute;
  // cursor: move;
}

.card{
  width: 111px;
  height: 155px;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 2;
  border-radius: 6px;
}

.deck{
  width: 111px;
  height: 155px;
  box-shadow: 3px 3px 0px 1px rgba(0, 0, 0, .7);
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 10px 5px;
  border-radius: 6px;
}

.cardPreview{
  max-width: 223px;
}

</style>