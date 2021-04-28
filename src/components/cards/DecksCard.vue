<template>
  <v-card>
    <!-- <v-card-title primary-title>
      <div>
        <div class="headline">Decks</div>
        <span class="grey--text">List of all your decks</span>
      </div>
    </v-card-title>
    <v-card-text> -->
    <decks-list></decks-list>
    <!-- </v-card-text> -->

    <v-card-actions>
      <v-btn text @click.stop="newDeckDialog">Create deck</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import emitter from "../../helpers/event-bus.js";
import DecksList from "../DecksList.vue";

export default {
  components: {
    "decks-list": DecksList,
  },
  methods: {
    newDeckDialog() {
      emitter.emit("newDeckToggle");
    },
  },
};
</script>

<style lang="scss" scoped></style>
