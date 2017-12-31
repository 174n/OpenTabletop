<template>
  <v-layout row justify-center style="position: relative;">
    <v-dialog v-model="open" width="500px">
      <v-card>
        <v-card-title>
          <div class="headline">Put a deck on tabletop</div>
        </v-card-title>
        <v-card-text>
          <v-tabs centered scrollable grow>
            <v-tabs-bar class="white" dark>
              <v-tabs-slider class="blue"></v-tabs-slider>
              <v-tabs-item href="#decks_tab">Your decks</v-tabs-item>
              <v-tabs-item href="#imgur_tab">From Imgur</v-tabs-item>
              <v-tabs-item href="#empty_deck_tab">Empty deck</v-tabs-item>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content id="decks_tab">
                <v-card flat>
                  <v-card-text><decks-list put="true"></decks-list></v-card-text>
                </v-card>
              </v-tabs-content>
              <v-tabs-content id="imgur_tab">
                <v-card flat>
                  <v-card-text><imgur></imgur></v-card-text>
                </v-card>
              </v-tabs-content>
              <v-tabs-content id="empty_deck_tab">
                <v-card flat>
                  <v-card-text><new-empty-deck></new-empty-deck></v-card-text>
                </v-card>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
          
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="putADeck">Put</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { EventBus } from '../../helpers/event-bus.js';
import DecksList from "../DecksList.vue";
import Imgur from '../Imgur.vue';
import NewEmptyDeck from '../NewEmptyDeck.vue';

export default {
  components:{
    "decks-list": DecksList,
    "imgur": Imgur,
    "new-empty-deck": NewEmptyDeck
  },
  data () {
    return {
      open: false
    }
  },
  created(){
    EventBus.$on('placeUserDeckToggle', () => {
      this.open = !this.open;
    });
  },
  methods:{
    putADeck(){
      this.open = false;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>