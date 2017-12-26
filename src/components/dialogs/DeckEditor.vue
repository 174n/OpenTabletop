<template>
  <v-dialog v-model="open" lazy absolute width="500px">
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
        <v-btn flat="flat" @click.native="removeDeck">Delete</v-btn>
        <v-btn color="green darken-1" flat="flat" @click.native="editDeck">Edit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from '../../helpers/event-bus.js';

export default {
  data () {
    return {
      open: false,
      id: false,
      deck_name: undefined,
      card_back: undefined,
      card_urls: undefined
    }
  },
  computed:{
    decks(){
      return this.$store.state.decks;
    }
  },
  created(){
    EventBus.$on('deckEditorToggle', id => {
      this.open = !this.open;
      this.id = id;
      this.deck_name = this.decks[id].name;
      this.card_back = this.decks[id].back;
      this.card_urls = this.decks[id].urls.join('\n');
    });
  },
  methods:{
    editDeck(){
      this.open = false;
      this.$store.dispatch('editDeck',{
        'id': this.id,
        'data':{
          'name': this.deck_name,
          'back': this.card_back,
          'urls': this.card_urls ? this.card_urls.split('\n') : []
        }
      }).then(() => {
        this.deck_name = undefined;
        this.card_back = undefined;
        this.card_urls = undefined;
        EventBus.$emit('snackbarOpen', "Deck edited");
      });
    },
    removeDeck(){
      this.open = false;
      this.$store.dispatch('removeDeck',this.id).then(() => {
        this.deck_name = undefined;
        this.card_back = undefined;
        this.card_urls = undefined;
        EventBus.$emit('snackbarOpen', "Deck deleted");
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>