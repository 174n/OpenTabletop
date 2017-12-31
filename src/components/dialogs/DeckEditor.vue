<template>
  <v-dialog v-model="open" lazy absolute width="500px">
    <v-card>
      <v-card-title>
        <div class="headline">Deck edit</div>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="data.deck_name" label="Deck name"></v-text-field>
        <v-text-field v-model="data.card_back" label="Card back url"></v-text-field>
        <v-text-field v-model="data.card_urls" label="Card urls" multi-line></v-text-field>
        <v-layout row wrap>
          <v-flex sm6 xs12>
            <v-switch label="Custom size in %" v-model="data.custom_size" color="blue"></v-switch>
          </v-flex>
          <v-flex sm6 xs12>
            <v-switch label="Real size" v-model="data.real_size" color="blue"></v-switch>
          </v-flex>
        </v-layout>
        <template v-if="data.custom_size">
          <v-slider label="Size" v-model="data.size" thumb-label step="0"></v-slider>
        </template>
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
      data:{
        deck_name: undefined,
        card_back: undefined,
        card_urls: undefined,
        custom_size: false,
        real_size: false,
        size: 12
      }
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
      this.data.deck_name = this.decks[id].name;
      this.data.card_back = this.decks[id].back;
      this.data.card_urls = this.decks[id].urls.join('\n');
      this.data.size = this.decks[id].size || 12;
      this.data.custom_size = this.data.size === 12 ? false : true;
      this.data.real_size = this.decks[id].real_size || false;
    });
  },
  methods:{
    editDeck(){
      this.open = false;
      this.$store.dispatch('editDeck',{
        'id': this.id,
        'data':{
          'name': this.data.deck_name,
          'back': this.data.card_back,
          'urls': this.data.card_urls ? this.data.card_urls.split('\n') : [],
          'size': this.data.custom_size ? this.data.size : false,
          'real_size': this.data.real_size
        }
      }).then(() => {
        this.data.deck_name = undefined;
        this.data.card_back = undefined;
        this.data.card_urls = undefined;
        this.data.custom_size = false;
        this.data.real_size = false;
        this.data.size = 12;
        EventBus.$emit('snackbarOpen', "Deck edited");
      });
    },
    removeDeck(){
      this.open = false;
      this.$store.dispatch('removeDeck',this.id).then(() => {
        this.data.deck_name = undefined;
        this.data.card_back = undefined;
        this.data.card_urls = undefined;
        this.data.custom_size = false;
        this.data.real_size = false;
        this.data.size = 12;
        EventBus.$emit('snackbarOpen', "Deck deleted");
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>