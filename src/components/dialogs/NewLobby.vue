<template>
  <v-layout row justify-center style="position: relative">
    <v-dialog v-model="open" absolute width="500px">
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
import shortid from "shortid";
import emitter from "../../helpers/event-bus.js";

export default {
  data() {
    return {
      open: false
    };
  },
  created() {
    emitter.on("newLobbyToggle", () => {
      this.open = !this.open;
    });
  },
  methods: {
    async newLobby() {
      this.open = false;
      const id = await this.$store.dispatch("newLobby", shortid.generate());
      this.$router.push("lobby/" + id);
    }
  }
};
</script>

<style lang="scss" scoped></style>
