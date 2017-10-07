<template>
  <div class="tabletop">
    <template v-for="(object, i) in game.objects">
      <!-- card -->
      <div v-if="object.type === 'card'"
        @contextmenu.prevent="showMenu('card',object.x,object.y,i)"
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
        @contextmenu.prevent="showMenu('deck',object.x,object.y,i)"
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

      <v-avatar class="draggable counter"
        :class="[object.color]"
        @contextmenu.prevent="showMenu('counter',object.x,object.y,i)"
        v-else-if="object.type === 'counter'"
        :data-id="i"
        :style="{
          transform: 'translate('+object.x+'px, '+object.y+'px)'
          }">
        <span class="white--text headline">{{object.count}}</span>
      </v-avatar>
    </template>
    

    <chat></chat>
    <deck-list></deck-list>
    <card-preview></card-preview>
    <speed-dial></speed-dial>
    <context-menu></context-menu>

  </div>
  
</template>

<script>
import interact from 'interactjs';
import { EventBus } from '../helpers/event-bus.js';

import Chat from './Chat.vue';
import DeckList from './dialogs/DeckList.vue';
import CardPreview from './dialogs/CardPreview.vue';
import SpeedDial from './SpeedDial.vue';
import ContextMenu from './ContextMenu.vue';

export default {
  components:{
    "deck-list": DeckList,
    "chat": Chat,
    "card-preview": CardPreview,
    "speed-dial": SpeedDial,
    "context-menu": ContextMenu
  },
  computed: {
    game(){
      return this.$store.state.game
    }
  },
  data () {
    return {
    }
  },
  methods:{
    dragMoveListener(event){
      this.$store.commit('moveObject', event);
    },
    showMenu(type,x,y,id) {
      EventBus.$emit('openContextMenu', type,x,y,id);
    },
    takeCard(deckId){
      this.$store.commit('takeCardFromDeck', [deckId]);
    },
    rotateCard(cardId){
      this.$store.commit('rotateCard', cardId);
    },
    cardPreviewOpen(id){
      EventBus.$emit('toggleCardPreview', this.game.objects[id].url);
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
      ondragenter: function (event) {
        event.target.classList.add('drop-target');
        event.relatedTarget.classList.add('drop-relatedTarget');
      },
      ondragleave: function (event) {
        event.relatedTarget.classList.remove('drop-relatedTarget');
        event.target.classList.remove('drop-target');
      },
      ondrop: function (event) {
        event.relatedTarget.classList.remove('drop-relatedTarget');
        event.target.classList.remove('drop-target');

        let card = event.relatedTarget.getAttribute("data-id");
        let deck = event.target.getAttribute("data-id");
        self.$store.commit('moveCardToDeck', [card,deck]);
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
  transition: width ease-in-out 0.2s,height ease-in-out 0.2s,margin ease-in-out 0.2s;
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

.counter{
  user-select: none;
  cursor: move;
}

.drop-target{
  transition: width ease-in-out 0.2s,height ease-in-out 0.2s,margin ease-in-out 0.2s;
  margin: -3px;
  width: 117px;
  height: 161px;
}
.drop-relatedTarget{
  transition: opacity ease-in-out 0.2s;
  opacity: .6;
}
</style>