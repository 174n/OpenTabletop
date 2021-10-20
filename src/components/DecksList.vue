<template>
  <div>
    <v-list two-line v-if="!decks">
      <template v-for="(deck, index) in decks">
        <v-list-item :key="index">
          <v-list-item-avatar>
            <img :src="deck.back" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ deck.name }}</v-list-item-title>
            <v-list-item-subtitle>
              <timeago :datetime="deck.time" :auto-update="30"></timeago>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn text v-if="put" @click.native="putADeck(index)">Put</v-btn>
            <v-btn text v-else @click.stop="deckEditorDialog(index)">
              Edit
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="index" v-if="index + 1 < decks.length"></v-divider>
      </template>
    </v-list>
    <v-card-text v-else>No decks found</v-card-text>
  </div>
</template>

<script>
import emitter from "../helpers/event-bus.js";

export default {
  computed: {
    decks() {
      return this.$store.state.decks;
    }
  },
  props: ["put"],
  methods: {
    deckEditorDialog(index) {
      emitter.emit("deckEditorToggle", index);
    },
    putADeck(index) {
      this.$store.dispatch("addNewDeck", { index, x: 10, y: 10 });
    }
  }
};
</script>

<style lang="scss" scoped></style>
