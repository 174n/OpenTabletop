<template>
  <v-speed-dial fixed bottom right v-model="speedDeal">
    <v-btn
      slot="activator"
      class="red darken-2"
      dark
      fab
      hover
      v-model="speedDeal"
    >
      <v-icon v-if="speedDeal">close</v-icon>
      <v-icon v-else>add</v-icon>
    </v-btn>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          class="green"
          @click.stop="addNewDeck"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>filter_none</v-icon>
        </v-btn>
      </template>
      <span>Add new deck</span>
    </v-tooltip>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          class="indigo"
          @click.native="addNewCounter"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>plus_one</v-icon>
        </v-btn>
      </template>
      <span>Add a counter</span>
    </v-tooltip>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          class="red"
          @click.stop="rollDice"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>casino</v-icon>
        </v-btn>
      </template>
      <span>Roll a dice</span>
    </v-tooltip>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          class="orange"
          v-if="rules || false"
          :href="rules"
          target="_blank"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>description</v-icon>
        </v-btn>
      </template>
      <span>Rules</span>
    </v-tooltip>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          class="blue"
          @click.stop="openChat"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>chat</v-icon>
        </v-btn>
      </template>
      <span>Chat & Settings</span>
    </v-tooltip>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          class="gray"
          v-if="user !== null && lobbyAdmin === user.email"
          @click.stop="lobbySettings"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>settings</v-icon>
        </v-btn>
      </template>
      <span>Lobby settings</span>
    </v-tooltip>
  </v-speed-dial>
</template>
<script>
import { EventBus } from "../helpers/event-bus.js";

export default {
  data() {
    return {
      speedDeal: false,
    };
  },
  methods: {
    randomInteger(min, max) {
      return Math.round(min + Math.random() * (max - min));
    },
    diceRoller(dice) {
      if (/^[0-9]{1,}d[0-9]{1,}$/.test(dice)) {
        let options = dice.split("d");
        if (parseInt(options[0]) >= 1 && parseInt(options[1]) >= 2) {
          let out = 0;
          for (var i = 1; i <= parseInt(options[0]); i++) {
            out += this.randomInteger(1, parseInt(options[1]));
          }
          return "[" + dice + "] Result: " + out;
        } else return false;
      } else return false;
    },
    addNewDeck(event) {
      /*this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'addNewDeck',
        params: event
      });*/
      EventBus.$emit("placeUserDeckToggle", event);
    },
    addNewCounter(event) {
      this.$store.dispatch("lobbyCommitMutation", {
        mutation: "addNewCounter",
        params: event,
      });
    },
    rollDice() {
      this.$store.commit("chatAddMsg", [
        "Dice roll: " + this.user.displayName,
        this.diceRoller(this.dice),
      ]);
      this.$store.dispatch("lobbyUpdateChat");
      // this.openChat();
    },
    openChat() {
      EventBus.$emit("toggleChat", true);
    },
    lobbySettings() {
      EventBus.$emit("LobbySettings");
    },
    openRules() {
      EventBus.$emit("toggleRules", this.rules);
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    rules() {
      return this.$store.state.game.rules;
    },
    lobbyAdmin() {
      return this.$store.state.lobbyAdmin;
    },
    dice() {
      return this.$store.state.dice;
    },
  },
};
</script>
<style lang="scss" scoped></style>
