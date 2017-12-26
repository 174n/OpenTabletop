<template>
  <div class="tabletop">
    <template v-for="(object, i) in game.objects">
      <!-- card -->
      <div v-if="object.type === 'card'"
        @contextmenu.prevent="showMenu('card',object.x,object.y,i)"
        @dblclick="cardPreviewOpen(i)"
        class="draggable card"
        :class="{ 'inhand': object.hand === user.uid }"
        :data-id="i"
        :style="{
          transform: 'translate('+object.x+'px, '+object.y+'px) rotate('+object.rotation+'deg)',
          backgroundImage: 'url('+(!object.hand || object.hand === user.uid ? object.url : object.back)+')'
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
          backgroundColor: object.color,
          backgroundImage: 'url('+(object.cards[0] !== undefined ? object.cards[0].back : 'none')+')'
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
    

  </div>
  
</template>

<script>
import interact from 'interactjs';
import { EventBus } from '../helpers/event-bus.js';

export default {
  computed: {
    game(){
      return this.$store.state.game
    },
    user(){
      return this.$store.state.user
    }
  },
  data () {
    return {
      tabletopCanvas: undefined
    }
  },
  methods:{
    dragMoveListener(event){
      // this.$store.commit('moveObject', event);

      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'moveObject',
        params: {
          event,
          scale: this.getTabletopScale()
        }
      });
    },
    showMenu(type,x,y,id) {
      let scale = this.getTabletopScale();
      let offset = document.querySelector(".draggable[data-id='"+id+"']").getBoundingClientRect();
      // console.log(offset);
      EventBus.$emit('openContextMenu', type,offset.x,offset.y,id);
    },
    takeCard(deckId){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'takeCardFromDeckById',
        params: [deckId]
      });
      // this.$store.commit('takeCardFromDeck', [deckId]);
    },
    // rotateCard(cardId){
    //   this.$store.commit('rotateCard', cardId);
    // },
    cardPreviewOpen(id){
      EventBus.$emit('toggleCardPreview', this.game.objects[id].url);
    },
    tabletopScroll(e){
      if(this.tabletopCanvas.options.drag.enabled){
        let target = document.querySelector(".tabletop");

        e.preventDefault();
        let delta = e.ds === undefined ? e.deltaY*(-0.001) : e.ds;
        let scale = this.getTabletopScale();
        scale += delta;
        // console.log(scale);
        if(scale>0.1 && scale < 3){
          let coords = this.getTabletopCoords();
          target.style.transform = "scale("+scale+")";
          target.style.marginLeft = (coords.x +delta*1500)+"px";
          target.style.marginTop = (coords.y +delta*1000)+"px";
        }
      }
    },
    dragTabletop(event){
      let scale = this.getTabletopScale();
      var target = document.querySelector(".tabletop"),
          coords = this.getTabletopCoords(),
          x = coords.x + event.dx,
          y = coords.y + event.dy;
      target.style.marginLeft = x+"px";
      target.style.marginTop = y+"px";
    },
    getTabletopScale(){
      let transform = document.querySelector(".tabletop").style.transform;
      if(transform === "") transform = "scale(1)";
      return parseFloat(transform.match(/[\w\.\-]+/g)[1])
    },
    getTabletopCoords(){
      let tabletop = document.querySelector(".tabletop");
      return {
        x: parseInt(tabletop.style.marginLeft.slice(0,-2) || 0),
        y: parseInt(tabletop.style.marginTop.slice(0,-2) || 0),
        rect: tabletop.getBoundingClientRect()
      };
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
        onmove: this.dragMoveListener
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
        // self.$store.commit('moveCardToDeck', [card,deck]);

        self.$store.dispatch('lobbyCommitMutation', {
          mutation: 'moveCardToDeck',
          params: [card,deck]
        });

      }
    });


    document.querySelector(".tabletop").addEventListener("wheel", this.tabletopScroll);
    this.tabletopCanvas = interact('.tabletop')
      .draggable({
        ignoreFrom: '.draggable',
        autoScroll: false,
        onmove: this.dragTabletop
      })
      .gesturable({
        onmove: this.tabletopScroll
      });

  }
}
</script>

<style lang="scss" scoped>

.tabletop{
  width: 3000px;
  height: 2000px;
  box-shadow: 0 0 20px 8px rgba(0,0,0,.1);
  background-color: #eee;
  border-radius: 7px;
  user-select: none;
  transform-origin: center center center;
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
.inhand{
  border: 5px #8BFF90 solid;
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
  // padding: 10px 5px;
  border-radius: 6px;
  background-size: cover;
  div{
    border-radius: 6px 6px 0 0;
    background-color: rgba(255,255,255,.7);
    padding: 10px;
  }
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