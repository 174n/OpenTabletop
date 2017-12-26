<template>
  <v-layout row justify-center style="position: relative;">
    <v-dialog v-model="open" lazy absolute scrollable width="500px">
      <v-card>
        <v-card-title>
          <div class="headline">Put a deck on tabletop</div>
        </v-card-title>
        <v-card-text>
          <decks-list put="true"></decks-list>
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

export default {
  components:{
    "decks-list": DecksList
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
      console.log(1);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>