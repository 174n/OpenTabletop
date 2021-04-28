<template>
  <v-app>
    <main v-if="readyToPlay">
      <!-- {{$route.params.id}} -->
      <div class="background" :style="backgroundStyle"></div>
      <tabletop></tabletop>

      <chat></chat>
      <deck-list></deck-list>
      <!-- <card-preview></card-preview> -->
      <speed-dial></speed-dial>
      <context-menu></context-menu>
      <place-user-deck></place-user-deck>
      <lobby-settings></lobby-settings>
      <card-size></card-size>
      <!-- <rules-view></rules-view> -->
    </main>
  </v-app>
</template>

<script>
import Tabletop from "./Tabletop.vue";

import Chat from "./Chat.vue";
import DeckList from "./dialogs/DeckList.vue";
// import CardPreview from './dialogs/CardPreview.vue';
import SpeedDial from "./SpeedDial.vue";
import ContextMenu from "./ContextMenu.vue";
import PlaceUserDeck from "./dialogs/PlaceUserDeck.vue";
import LobbySettings from "./dialogs/LobbySettings.vue";
import CardSize from "./dialogs/CardSize.vue";
// import RulesView from './dialogs/RulesView.vue';
import { observe, unobserve, generate } from "fast-json-patch";
import emitter from "../helpers/event-bus.js";

export default {
  components: {
    "deck-list": DeckList,
    chat: Chat,
    // "card-preview": CardPreview,
    "speed-dial": SpeedDial,
    "context-menu": ContextMenu,
    tabletop: Tabletop,
    "place-user-deck": PlaceUserDeck,
    "lobby-settings": LobbySettings,
    "card-size": CardSize,
    // "rules-view": RulesView,
  },
  computed: {
    background() {
      return this.$store.state.lobby?.game?.background;
    },
    backgroundStyle() {
      return this.background
        ? {
            backgroundImage: this.background.background_url
              ? `url(${this.background.background_url})`
              : "none",
            backgroundColor: `url(${this.background.background_color})`,
          }
        : {};
    },
    lobby() {
      return this.$store.state.lobby;
    },
    readyToPlay() {
      return this.lobby && this.$store.state.user;
    },
  },
  data() {
    return {
      observer: null,
    };
  },
  methods: {
    sendPatch(patches) {
      this.$store.dispatch("sendPatch", patches);
    },
  },
  mounted() {
    if (!this.readyToPlay) {
      this.$store.commit("setRedirect", this.$router.history.current.path);
      this.$router.push("/");
    }
    this.$store.dispatch("connectToALobby", this.lobby.id);
    this.observer = observe(this.lobby?.game, this.sendPatch);
    emitter.on("gameChanged", () => {
      this.$store.dispatch("sendPatch", generate(this.observer));
    });
  },
  beforeUnmount() {
    unobserve(this.lobby?.game, this.observer);
  },
};
</script>

<style lang="scss">
html,
body {
  position: static;
  background: #fafafa;
  overflow: hidden;
  background-size: cover !important;
}
.speed-dial {
  z-index: 4;
}
.application--light {
  background-color: inherit;
}
.background {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
}
</style>
