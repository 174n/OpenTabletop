<template>
  <div>
    <card-preview></card-preview>
    <v-dialog v-model="open" lazy fullscreen transition="dialog-bottom-transition">
      <!-- <v-btn primary dark slot="activator">Open Dialog</v-btn> -->
      <v-card>
        <v-toolbar dark class="red">
          <v-toolbar-title v-if="deckId">Deck "{{deck.text}}"</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="shuffleDeck">Shuffle deck</v-btn>
            <v-btn dark flat @click.native="open = false">Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          

          <div class="container" v-if="deckId">
            <draggable v-model="deck.cards" :options="{group:'cards'}" @update="deckUpdate">
              <transition-group>
                <template v-for="(card,i) in deck.cards">
                  <img
                    :src="card.url"
                    alt="card"
                    class="card"
                    :key="i"
                    @dblclick.stop="cardPreviewOpen(i)"
                    @contextmenu.prevent="showMenu(i,$event)">
                </template>
              </transition-group>
            </draggable>
          </div>

        </v-card-text>
      </v-card>

    </v-dialog>
  </div>
</template>

<script>
import { EventBus } from '../../helpers/event-bus.js';
import CardPreview from './CardPreview.vue';
import draggable from 'vuedraggable'

export default {
  components:{
    "card-preview": CardPreview,
    draggable
  },
  data () {
    return {
      open: false,
      deck: [],
      deckId: false,
    }
  },
  computed: {
    game(){
      return this.$store.state.game
    },
    user(){
      return this.$store.state.user
    },
  },
  created(){
    EventBus.$on('deckViewToggle', id => {
      this.open = !this.open;
      this.deckId = id;
      this.deck = this.game.objects[id];
      let name = this.user.displayName;
      this.$store.commit('chatAddMsg', [name+" viewed a deck",name+": "+this.game.objects[id].text]);
      this.$store.dispatch('lobbyUpdateChat');
    });
    EventBus.$on('deckViewUpdate', () => {
      this.deck = this.game.objects[this.deckId];
      this.$forceUpdate();
    });
  },
  methods:{
    showMenu(id, event) {
      let x = event.screenX-20;
      let y = event.screenY-20;
      EventBus.$emit('openContextMenu','cardList',x,y,this.deckId,id);
    },
    cardPreviewOpen(id){
      EventBus.$emit('toggleCardPreview', this.game.objects[this.deckId].cards[id].url);
    },
    shuffleDeck(){
      this.$store.commit('shuffleDeck', this.deckId);
      EventBus.$emit('deckViewUpdate');
      // this.open = false;
    },
    deckUpdate(e){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'updateDeck',
        params: this.deckId
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.card{
  width: 111px;
  margin: 10px;
}

.container{
  // margin: 0;
  // padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;
  // justify-content: space-between;
  width: 100%;
}
</style>