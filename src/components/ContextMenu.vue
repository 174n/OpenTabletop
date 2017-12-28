<template>
    <v-menu v-model="show"
      :position-absolutely="true"
      close-on-click
      :position-x="x"
      :position-y="y">
      <v-list>
        <template v-for="item in menu[type]">
          <v-list-tile @click="item.func" :key="item.title">
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile>
        </template>
      </v-list>
    </v-menu>
</template>

<script>
import { EventBus } from '../helpers/event-bus.js';

export default {
  data () {
    return {
      show: false,
      x: 0, y: 0, id: 0,
      type: "deck",
      menu:{
        "deck":[
          {
            "title": "Take a card",
            "func": this.takeCard
          },
          {
            "title": "Take a card to hand",
            "func": this.takeCardToHand
          },
          {
            "title": "Show cards",
            "func": this.deckListView
          },
          {
            "title": "Shuffle deck",
            "func": this.shuffleDeck
          },
          {
            "title": "Remove deck",
            "func": this.removeObject
          }
        ],
        "card":[
          {
            "title": "Rotate card",
            "func": this.rotateCard
          },
          {
            "title": "Move to/from hand",
            "func": this.handMoveCard
          },
          {
            "title": "Remove card",
            "func": this.removeObject
          }
        ],
        "counter":[
          {
            "title": "Counter +1",
            "func": this.counterInc
          },
          {
            "title": "Counter -1",
            "func": this.counterDecr
          },
          {
            "title": "Change color",
            "func": this.counterChangeColor
          },
          {
            "title": "Remove counter",
            "func": this.removeObject
          }
        ],
        "cardList":[
          {
            "title": "Take card",
            "func": this.takeCardToObjects
          }
        ]
      }
    }
  },
  methods:{
    removeObject(){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'removeObject',
        params: this.id
      });
    },
    takeCard(e,hand=false){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'takeCardFromDeck',
        params: [this.id,1,hand]
      });
    },
    takeCardToHand(){
      this.takeCard(null,true);
    },
    deckListView(){
      EventBus.$emit('deckViewToggle', this.id);
    },
    rotateCard(){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'rotateCard',
        params: this.id
      });
    },
    handMoveCard(){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'handMoveCard',
        params: this.id
      });
    },
    takeCardToObjects(){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'takeCardFromDeckById',
        params: [this.id].concat(this.params)
      });
    },
    shuffleDeck(){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'shuffleDeck',
        params: this.id
      });
    },
    counterInc(){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'counterChangeNumber',
        params: [this.id]
      });
    },
    counterDecr(){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'counterChangeNumber',
        params: [this.id,-1]
      });
    },
    counterChangeColor(){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'counterChangeColor',
        params: this.id
      });
    }
  },
  created(){
    EventBus.$on('openContextMenu', (type,x,y,id,params=[]) => {
      if(type==="card" || type==="deck" || type==="counter" || type==="cardList"){
        this.type = type;
        this.x = x+5;
        this.y = y+5;
        this.id = id;
        this.params = params;
        this.show = true;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
</style>