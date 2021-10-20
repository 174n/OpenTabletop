<template>
  <v-card dark color="blue-grey">
    <new-lobby-settings />
    <v-card-title primary-title class="d-flex justify-sm-space-between">
      Create a blank lobby
      <v-btn icon @click="openNewLobbySettings">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle>
      Click the button below to create a blank lobby
    </v-card-subtitle>
    <v-card-actions>
      <v-btn text dark @click.stop="newLobby">Create lobby</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import shortid from "shortid";
import emitter from "../../helpers/event-bus.js";
import NewLobbySettings from "../dialogs/NewLobbySettings.vue";

export default {
  components: {
    NewLobbySettings
  },
  methods: {
    newLobby() {
      this.$store.dispatch("newLobby", shortid.generate());
      this.$router.push("lobby/" + this.$store.state.lobby.id);
    },
    openNewLobbySettings() {
      emitter.emit("newLobbySettingsToggle");
    }
  }
};
</script>

<style lang="scss" scoped></style>
