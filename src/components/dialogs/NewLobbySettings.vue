<template>
  <v-layout row justify-center style="position: relative">
    <v-dialog v-model="open" absolute width="500px">
      <v-card>
        <v-card-title>
          <div class="headline">Settings for new lobby</div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="signalhubUrl"
            label="SignalHub instance url"
            required
          />
          <v-textarea
            name="input-7-1"
            label="ICE Servers"
            v-model="customIceServers"
            value="[]"
            hint="A JSON array of stun/turn servers"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green darken-1" text @click.stop="open = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import emitter from "../../helpers/event-bus.js";

export default {
  data() {
    return {
      open: false
    };
  },
  computed: {
    signalhubUrl: {
      get() {
        return this.$store.state.signalhubUrl;
      },
      set(val) {
        this.$store.commit("setSignalhubUrl", val);
      }
    },
    customIceServers: {
      get() {
        return this.$store.state.customIceServers;
      },
      set(val) {
        this.$store.commit("setCustomIceServers", val);
      }
    }
  },
  created() {
    emitter.on("newLobbySettingsToggle", () => {
      this.open = !this.open;
    });
  }
};
</script>

<style lang="scss" scoped></style>
