<template>
  <v-dialog v-model="open" lazy absolute fullscreen transition="dialog-bottom-transition">
    <!-- <v-btn primary dark slot="activator">Open Dialog</v-btn> -->
    <v-card>
      <v-toolbar dark class="red">
        <v-toolbar-title>Deck "{{deck.text}}"</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark flat @click.native="open = false">Close</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        
        <v-container fluid grid-list-xs>
          <v-layout row wrap>
            <v-flex xs4 v-for="card in deck.cards" :key="card.url">
              <img :src="card.url" alt="card" width="100%" height="100%">
            </v-flex>
          </v-layout>
        </v-container>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from '../helpers/event-bus.js';

export default {
  data () {
    return {
      open: false,
      deck:[]
    }
  },
  created(){
    EventBus.$on('deckViewToggle', deck => {
      this.open = !this.open;
      this.deck = deck;
    });
  }
}
</script>

<style lang="scss" scoped>
</style>