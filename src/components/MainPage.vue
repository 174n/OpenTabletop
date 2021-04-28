<template>
  <v-app>
    <v-app-bar class="red" dark fixed>
      <v-app-bar-title>OpenTabletop</v-app-bar-title>
    </v-app-bar>
    <main class="pt-md-10">
      <div class="pt-md-10">
        <v-container fluid v-if="loading">
          <v-layout row wrap justify-space-around>
            <v-progress-circular
              indeterminate
              v-bind:size="50"
            ></v-progress-circular>
          </v-layout>
        </v-container>

        <v-container fluid grid-list-lg v-else>
          <v-layout row wrap>
            <template v-if="userIsset">
              <v-flex md6 offset-md3 sm12>
                <auth-card></auth-card>
              </v-flex>
            </template>
            <template v-else>
              <v-flex md6 offset-md3 sm12>
                <user-info-card></user-info-card>
              </v-flex>
              <v-flex md6 offset-md3 sm12>
                <new-lobby-card></new-lobby-card>
              </v-flex>
              <!-- <v-flex md6 offset-md3 sm12 class="decks_container">
                <decks-card></decks-card>
              </v-flex> -->
            </template>
          </v-layout>
        </v-container>
      </div>
    </main>
    <!-- <new-lobby></new-lobby> -->
    <!-- <new-deck></new-deck> -->
    <!-- <deck-editor></deck-editor> -->
  </v-app>
</template>

<script>
import NewLobbyCard from "./cards/NewLobbyCard.vue";
// import DecksCard from "./cards/DecksCard.vue";
import AuthCard from "./cards/AuthCard.vue";
import UserInfoCard from "./cards/UserInfoCard.vue";
// import NewLobby from "./dialogs/NewLobby.vue";
// import NewDeck from "./dialogs/NewDeck.vue";
// import DeckEditor from "./dialogs/DeckEditor.vue";

export default {
  components: {
    "new-lobby-card": NewLobbyCard,
    // "decks-card": DecksCard,
    "auth-card": AuthCard,
    "user-info-card": UserInfoCard,
    // "new-lobby": NewLobby,
    // "new-deck": NewDeck,
    // "deck-editor": DeckEditor,
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    loading() {
      return false;
    },
    userIsset() {
      return !this.user;
    },
  },
};
</script>

<style lang="scss" scoped>
.decks_container {
  width: 100%;
}
</style>
