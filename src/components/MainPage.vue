<template>
  <v-app>
    <v-toolbar class="red" dark fixed>
      <v-toolbar-title>OpenTabletop</v-toolbar-title>
    </v-toolbar>
    <main>
      <div>
        <v-container fluid v-if="firebaseLoading">
          <v-layout row wrap justify-space-around>
              <v-progress-circular indeterminate v-bind:size="50"></v-progress-circular>
          </v-layout>
        </v-container>

        <v-container fluid grid-list-lg v-else>
          <v-layout row wrap>
            <template v-if="userIsset">
              <v-flex xs12>
                <auth-card></auth-card>
              </v-flex>
            </template>
            <template v-else>
              <v-flex xs12>
                <user-info-card></user-info-card>
              </v-flex>
              <v-flex xs12>
                <new-lobby-card></new-lobby-card>
              </v-flex>
            </template>
          </v-layout>
        </v-container>
      </div>
    </main>
    <new-lobby></new-lobby>
  </v-app>
</template>

<script>
import NewLobbyCard from "./cards/NewLobbyCard.vue";
import AuthCard from "./cards/AuthCard.vue";
import UserInfoCard from "./cards/UserInfoCard.vue";
import NewLobby from "./dialogs/NewLobby.vue";

export default {
  components:{
    "new-lobby-card": NewLobbyCard,
    "auth-card": AuthCard,
    "user-info-card": UserInfoCard,
    "new-lobby": NewLobby
  },
  computed:{
    user(){
      return this.$store.state.user;
    },
    firebaseLoading(){
      return this.$store.state.firebaseLoading
    },
    userIsset(){
      return this.user===null || this.user === undefined;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>