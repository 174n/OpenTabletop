<template>
  <div>
    <v-dialog v-model="open" lazy fullscreen transition="dialog-bottom-transition">
      <!-- <v-btn primary dark slot="activator">Open Dialog</v-btn> -->
      <v-card>
        <v-toolbar dark class="red">
          <v-toolbar-title>Deck "{{deck.text}}"</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="shuffleDeck">Shuffle deck</v-btn>
            <v-btn dark flat @click.native="open = false">Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          

          <div class="container">
            <template v-for="(card,i) in deck.cards">
              <img
                :src="card.url"
                alt="card"
                class="card"
                :key="card.url"
                @dblclick="cardPreviewOpen(i)"
                @contextmenu.prevent="showMenu(i,$event)">
            </template>
          </div>

        </v-card-text>
      </v-card>

    </v-dialog>
  </div>
</template>

<script>
import { EventBus } from '../../helpers/event-bus.js';


export default {
  data () {
    return {
      open: false,
      deck: [],
      deckId: 0
    }
  },
  computed: {
    game(){
      return this.$store.state.game
    }
  },
  created(){
    EventBus.$on('deckViewToggle', id => {
      this.open = !this.open;
      this.deckId = id;
      this.deck = this.game.objects[id];
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
      this.open = false;
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
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;
}
</style>