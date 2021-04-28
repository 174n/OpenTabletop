<template>
  <v-snackbar :timeout="3000" :color="color" v-model="snackbar">
    <span v-html="text"></span>
    <template v-slot:action="{ attrs }">
      <v-btn dark text v-bind="attrs" @click.native="snackbar = false"
        >Close</v-btn
      >
    </template>
  </v-snackbar>
</template>

<script>
import emitter from "../helpers/event-bus.js";

export default {
  data() {
    return {
      snackbar: false,
      color: "error",
      text: "There is an error",
    };
  },
  created() {
    emitter.on("snackbarOpen", (text = this.text, color = this.color) => {
      this.text = text;
      this.color = color;
      this.snackbar = true;
    });
  },
};
</script>

<style lang="scss" scoped>
.v-snack {
  font-family: "Roboto", sans-serif;
}
</style>
