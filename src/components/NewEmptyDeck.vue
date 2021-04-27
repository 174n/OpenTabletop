<template>
  <v-text-field
    label="Deck name"
    single-line
    v-model="deck_name"
    @keyup.enter.prevent="createDeck"
    @click:append="createDeck"
    append-icon="send"
  >
  </v-text-field>
</template>

<script>
export default {
  data() {
    return {
      deck_name: "",
    };
  },
  methods: {
    imgurImageUrl(id) {
      return "https://i.imgur.com/" + id + ".jpg";
    },
    createDeck() {
      this.$store.dispatch("lobbyCommitMutation", {
        mutation: "addNewDeckFromData",
        params: {
          urls: [],
          title: this.deck_name,
          x: 10,
          y: 10,
        },
      });
      this.deck_name = "";
    },
  },
  computed: {},
  created() {},
};
</script>

<style lang="scss" scoped></style>
