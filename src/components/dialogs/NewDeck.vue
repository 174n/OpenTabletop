<template>
  <v-layout row justify-center style="position: relative">
    <v-dialog v-model="open" absolute width="500px">
      <v-card>
        <v-card-title>
          <div class="headline">New deck</div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="data.deck_name"
            label="Deck name"
          ></v-text-field>
          <v-text-field
            v-model="data.card_back"
            label="Card back url"
          ></v-text-field>
          <v-textarea v-model="data.card_urls" label="Card urls"></v-textarea>
          <v-layout row wrap>
            <v-flex sm6 xs12>
              <v-switch
                label="Custom size in %"
                v-model="data.custom_size"
                color="blue"
              ></v-switch>
            </v-flex>
            <v-flex sm6 xs12>
              <v-switch
                label="Real size"
                v-model="data.real_size"
                color="blue"
              ></v-switch>
            </v-flex>
          </v-layout>
          <template v-if="data.custom_size">
            <v-slider
              label="Size"
              v-model="data.size"
              thumb-label
              step="0.1"
            ></v-slider>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click.native="newDeck">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import emitter from "../../helpers/event-bus.js";

export default {
  data() {
    return {
      open: false,
      data: {
        deck_name: undefined,
        card_back: undefined,
        card_urls: undefined,
        custom_size: false,
        real_size: false,
        size: 12
      }
    };
  },
  created() {
    emitter.on("newDeckToggle", () => {
      this.open = !this.open;
    });
  },
  methods: {
    newDeck() {
      this.open = false;
      this.$store
        .dispatch("newDeck", {
          name: this.data.deck_name,
          back: this.data.card_back,
          urls: this.data.card_urls ? this.data.card_urls.split("\n") : [],
          size: this.data.custom_size ? this.data.size : false,
          real_size: this.data.real_size
        })
        .then(() => {
          this.data.deck_name = undefined;
          this.data.card_back = undefined;
          this.data.card_urls = undefined;
          this.data.custom_size = false;
          this.data.real_size = false;
          this.data.size = 12;
          emitter.emit("snackbarOpen", "New deck added");
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
