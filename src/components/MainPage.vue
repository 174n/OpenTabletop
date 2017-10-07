<template>
  <v-app>
    <v-toolbar class="red" dark fixed>
      <v-toolbar-title>OpenTabletop</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <auth-card></auth-card>
          </v-flex>
          <v-flex xs12>
            <new-lobby-card></new-lobby-card>
          </v-flex>
        </v-layout>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import NewLobbyCard from "./cards/NewLobbyCard.vue";
import AuthCard from "./cards/AuthCard.vue";

export default {
  components:{
    "new-lobby-card": NewLobbyCard,
    "auth-card": AuthCard
  },
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
</style>