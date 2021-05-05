<template>
  <div v-if="user">
    <interface-wrapper subtitle="Lobby" :backBtn="true" v-if="!gameStarted">
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex md6 offset-md3 sm12>
            <user-info-card />
            <div class="mt-5">
              <lobby-info-card :lobbyId="$route.params.id" />
            </div>
            <div class="mt-5">
              <v-card>
                <users-list title="In Lobby" :users="users"></users-list>
              </v-card>
            </div>
            <v-btn
              class="mt-5"
              depressed
              color="primary"
              block
              large
              @click="startGame"
            >
              Start the game
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </interface-wrapper>
    <Game v-else />
  </div>
</template>

<script>
import UserInfoCard from "./cards/UserInfoCard.vue";
import LobbyInfoCard from "./cards/LobbyInfoCard.vue";
import UsersList from "./UsersList.vue";
import InterfaceWrapper from "./InterfaceWrapper.vue";
import Game from "./Game.vue";
import emitter from "../helpers/event-bus.js";

export default {
  name: "Lobby",
  components: {
    UserInfoCard,
    LobbyInfoCard,
    InterfaceWrapper,
    UsersList,
    Game,
  },
  computed: {
    lobby() {
      return this.$store.state.lobby;
    },
    user() {
      return this.$store.state.user;
    },
    gameStarted() {
      return this.$store.state.gameStarted;
    },
    peers() {
      return this.$store.state.peers;
    },
    users() {
      return [this.user.nickname, ...this.$store.getters.peerNames];
    },
    readyToPlay() {
      return this.user;
    },
  },
  methods: {
    startGame() {
      this.$store.dispatch(
        "broadcastToPeers",
        JSON.stringify({
          nickname: this.user.nickname,
          data: "startGame",
          event: "encounter",
        })
      );
      this.$store.commit("startGame");
    },
  },
  mounted() {
    if (!this.readyToPlay) {
      this.$store.commit("setRedirect", this.$router.history.current.path);
      this.$router.push("/");
      return;
    } else {
      if (!this.lobby) {
        this.$store.dispatch("newLobby", this.$route.params.id);
      }
      this.$store.dispatch("initHub");
    }
    emitter.on("peer-broadcast", (msg) => {
      try {
        const { data, event, nickname } = JSON.parse(msg);

        if (nickname !== this.user.nickname) {
          if (event === "encounter" && data === "startGame") {
            this.$store.commit("startGame");
          } else if (event === "patch") {
            this.$store.commit("patchLobby", data);
          } else if (event === "fetch") {
            this.$store.commit("setGame", data);
          }
        }
      } catch (err) {
        console.log(err, msg);
      }
    });
    // this.$store.dispatch("connectToALobby", this.lobby.id);
    // this.observer = observe(this.lobby?.game, this.sendPatch);
    // emitter.on("gameChanged", () => {
    //   this.$store.dispatch("sendPatch", generate(this.observer));
    // });
  },
  beforeUnmount() {
    this.$store.dispatch("destroyHub");
  },
};
</script>

<style lang="scss" scoped></style>
