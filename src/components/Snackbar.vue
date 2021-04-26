<template>
  <v-snackbar :timeout="3000" :color="color" v-model="snackbar">
    <span v-html="text"></span>
    <v-btn dark text @click.native="snackbar = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { EventBus } from "../helpers/event-bus.js";

export default {
  data() {
    return {
      snackbar: false,
      color: "error",
      text: "There is an error",
    };
  },
  created() {
    EventBus.$on("snackbarOpen", (text = this.text, color = this.color) => {
      this.text = text;
      this.color = color;
      this.snackbar = true;
    });
  },
};
</script>

<style lang="scss" scoped></style>
