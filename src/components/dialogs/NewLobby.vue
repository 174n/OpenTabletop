<template>
  <v-layout row justify-center style="position: relative">
    <v-dialog v-model="open" absolute>
      <v-card>
        <v-card-title>
          <div class="headline">New lobby</div>
        </v-card-title>
        <v-card-text>
          Lobby options
          <v-switch
            value
            input-value="true"
            disabled
            label="Link only"
          ></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click.native="newLobby">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { EventBus } from "../../helpers/event-bus.js";

export default {
  data() {
    return {
      open: false,
    };
  },
  created() {
    EventBus.$on("newLobbyToggle", () => {
      this.open = !this.open;
    });
  },
  methods: {
    newLobby() {
      this.open = false;
      this.$store.dispatch("newLobby").then((id) => {
        this.$router.push("lobby/" + id);
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
