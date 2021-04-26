<template>
  <v-card class="blue-grey darken-2 white--text">
    <v-card-title primary-title>
      <div>
        <div class="headline">Create a new lobby</div>
        <span class="grey--text"
          >Click the button below to create a new lobby</span
        >
      </div>
    </v-card-title>
    <v-card-actions>
      <v-btn text dark @click.stop="newLobbyDialog">Create lobby</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { EventBus } from "../../helpers/event-bus.js";

export default {
  methods: {
    newLobbyDialog() {
      EventBus.$emit("newLobbyToggle");
    },
  },
};
</script>

<style lang="scss" scoped></style>
