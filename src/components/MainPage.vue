<template>
  <interface-wrapper>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <template v-if="userIsset">
          <v-flex md6 offset-md3 sm12>
            <auth-card />
          </v-flex>
        </template>
        <template v-else>
          <v-flex md6 offset-md3 sm12>
            <user-info-card />
          </v-flex>
          <v-flex md6 offset-md3 sm12>
            <new-lobby-card />
          </v-flex>
          <!-- <v-flex md6 offset-md3 sm12 class="decks_container">
            <decks-card></decks-card>
          </v-flex> -->
        </template>
      </v-layout>
    </v-container>
  </interface-wrapper>
</template>

<script>
import InterfaceWrapper from "./InterfaceWrapper.vue";
import NewLobbyCard from "./cards/NewLobbyCard.vue";
import AuthCard from "./cards/AuthCard.vue";
import UserInfoCard from "./cards/UserInfoCard.vue";
// import DecksCard from "./cards/DecksCard.vue";
// import NewLobby from "./dialogs/NewLobby.vue";
// import NewDeck from "./dialogs/NewDeck.vue";
// import DeckEditor from "./dialogs/DeckEditor.vue";

export default {
  components: {
    InterfaceWrapper,
    NewLobbyCard,
    // DecksCard,
    AuthCard,
    UserInfoCard
    // NewLobby,
    // NewDeck,
    // DeckEditor,
  },
  computed: {
    userIsset() {
      return !this.$store.state.user;
    }
  }
};
</script>

<style lang="scss" scoped>
.decks_container {
  width: 100%;
}
</style>
