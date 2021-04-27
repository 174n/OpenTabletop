<template>
  <v-navigation-drawer
    v-model="sidebar"
    absolute
    temporary
    :mobile-breakpoint="4000"
    width="320px"
  >
    <div class="sendMsgBox">
      <v-text-field
        label="Message"
        single-line
        v-model="chatMsgValue"
        @keyup.enter.prevent="chatMsg"
        @click:append="chatMsg"
        append-icon="send"
      >
      </v-text-field>
      <v-text-field
        label="Dice settings"
        v-model="dice"
        :rules="diceRules"
        required
        @keyup.enter.prevent="diceSet"
        @click:append="diceSet"
        append-icon="send"
      ></v-text-field>
    </div>

    <v-divider></v-divider>
    <v-list three-line>
      <v-list-item v-for="(msg, i) in game.chat.slice().reverse()" :key="i">
        <v-list-item-content>
          <v-list-item-title>{{ msg.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ msg.msg }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text>
            <timeago :datetime="msg.time" :auto-update="30"></timeago>
          </v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { EventBus } from "../helpers/event-bus.js";

export default {
  data() {
    return {
      sidebar: false,
      chatMsgValue: "",
      dice: "1d6",
      diceRules: [
        (v) => /^[0-9]{1,}d[0-9]{1,}$/.test(v) || "Dice code must be valid",
      ],
    };
  },
  methods: {
    chatMsg(e) {
      if (e !== undefined) e.target.blur();
      this.$store.commit("chatAddMsg", [
        this.user.displayName,
        this.chatMsgValue,
      ]);
      this.$store.dispatch("lobbyUpdateChat");
      this.chatMsgValue = "";
    },
    diceSet() {
      if (/^[0-9]{1,}d[0-9]{1,}$/.test(this.dice)) {
        this.$store.commit("diceChange", this.dice);
        EventBus.$emit("snackbarOpen", "Dice settings changed");
      } else {
        EventBus.$emit("snackbarOpen", "Wrong dice settings", "error");
      }
    },
  },
  computed: {
    game() {
      let game = this.$store.state.game;
      if (game.chat === undefined || game.chat === null) game.chat = [];
      return game;
    },
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    EventBus.$on("toggleChat", (val) => {
      if (val === undefined) this.sidebar = !this.sidebar;
      else this.sidebar = val;
    });
  },
};
</script>

<style lang="scss" scoped>
.sendMsgBox {
  padding: 0 15px;
}
</style>
