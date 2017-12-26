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
          <v-btn flat>Edit</v-btn>
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
  }
}
</script>

<style lang="scss" scoped>

</style>