<template>
  <v-layout row justify-center style="position: relative">
    <v-dialog v-model="open" width="500px">
      <v-card>
        <v-card-title>
          <div class="headline">Put a deck on tabletop</div>
        </v-card-title>
        <v-card-text>
          <v-tabs centered scrollable grow v-model="tab">
            <v-tabs-slider color="blue"></v-tabs-slider>
            <v-tab>Your decks</v-tab>
            <v-tab>From Imgur</v-tab>
            <v-tab>Empty deck</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card flat>
                <v-card-text><decks-list put="true"></decks-list></v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text><imgur></imgur></v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text><new-empty-deck></new-empty-deck></v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click.native="putADeck">Put</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import emitter from "../../helpers/event-bus.js";
import DecksList from "../DecksList.vue";
import Imgur from "../Imgur.vue";
import NewEmptyDeck from "../NewEmptyDeck.vue";

export default {
  components: {
    "decks-list": DecksList,
    imgur: Imgur,
    "new-empty-deck": NewEmptyDeck,
  },
  data() {
    return {
      open: false,
      tab: null,
    };
  },
  created() {
    emitter.on("placeUserDeckToggle", () => {
      this.open = !this.open;
    });
  },
  methods: {
    putADeck() {
      this.open = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
