<template>
  <v-layout row justify-center style="position: relative;">
    <v-dialog v-model="open" lazy absolute width="500px">
      <v-card>
        <v-card-title>
          <div class="headline">New deck</div>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="deck_name" label="Deck name"></v-text-field>
          <v-text-field v-model="card_back" label="Card back url"></v-text-field>
          <v-text-field v-model="card_urls" label="Card urls" multi-line></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="newDeck">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { EventBus } from '../../helpers/event-bus.js';

export default {
  data () {
    return {
      open: false,
      deck_name: undefined,
      card_back: undefined,
      card_urls: undefined
    }
  },
  created(){
    EventBus.$on('newDeckToggle', () => {
      this.open = !this.open;
    });
  },
  methods:{
    newDeck(){
      this.open = false;
      this.$store.dispatch('newDeck',{
        'name': this.deck_name,
        'back': this.card_back,
        'urls': this.card_urls ? this.card_urls.split('\n') : []
      }).then(() => {
        this.deck_name = undefined;
        this.card_back = undefined;
        this.card_urls = undefined;
        EventBus.$emit('snackbarOpen', "New deck added");
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>