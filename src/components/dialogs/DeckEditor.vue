<template>
  <v-layout row justify-center style="position: relative;">
    <v-dialog v-model="open" lazy absolute max-width="500px">
      <v-card>
        <v-card-title>
          <div class="headline">Deck edit</div>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="deck_name" label="Deck name"></v-text-field>
          <v-text-field v-model="card_back" label="Card back url"></v-text-field>
          <v-text-field v-model="card_urls" label="Card urls" multi-line></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="newDeck">Edit</v-btn>
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
    EventBus.$on('deckEditorToggle', (data) => {
      this.open = !this.open;
      this.deck_name = data.deck_name;
      this.card_back = data.card_back;
      this.card_urls = data.card_urls;
    });
  },
  methods:{
  }
}
</script>

<style lang="scss" scoped>
</style>