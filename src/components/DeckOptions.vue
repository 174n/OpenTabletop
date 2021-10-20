<template>
  <div>
    <v-text-field v-model="data.deck_name" label="Deck name"></v-text-field>
    <v-text-field v-model="data.card_back" label="Card back url"></v-text-field>
    <v-text-field
      v-model="data.card_urls"
      label="Card urls"
      multi-line
    ></v-text-field>
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
  </div>
</template>

<script>
export default {
  computed: {
    data: {
      get: () => {
        return this.$store.state.deckOptions;
      },
      set: (newValue) => {
        this.$store.commit("deckOptionsChange", newValue);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
