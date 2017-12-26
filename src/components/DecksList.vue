<template>
  <v-list two-line>
    <template v-for="(deck, index) in decks">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <img :src="deck.back">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{deck.name}}</v-list-tile-title>
          <v-list-tile-sub-title>
            <timeago :since="deck.time" :auto-update="30"></timeago>
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn flat v-if="put" @click.native="putADeck(index)">Put</v-btn>
          <v-btn flat v-else @click.stop="deckEditorDialog(index)">Edit</v-btn>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider v-if="index + 1 < decks.length"></v-divider>
    </template>
  </v-list>
</template>

<script>
import { EventBus } from '../helpers/event-bus.js';

export default {
  computed:{
    decks(){
      return this.$store.state.decks;
    }
  },
  props:["put"],
  methods:{
    deckEditorDialog(index){
      EventBus.$emit('deckEditorToggle', index);
    },
    putADeck(index){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'addNewDeck',
        params: {
          index,
          x: 10,
          y: 10
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>