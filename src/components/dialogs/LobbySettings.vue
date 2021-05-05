<template>
  <v-dialog v-model="open" absolute width="500px">
    <v-card>
      <v-card-title>
        <div class="headline">Lobby settings</div>
      </v-card-title>
      <v-card-text>
        <v-tabs centered scrollable grow v-model="tab">
          <v-tabs-slider color="blue"></v-tabs-slider>
          <v-tab>Members</v-tab>
          <v-tab>Background</v-tab>
          <v-tab>Import / Export</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card text>
              <v-card-text>
                <users-list
                  title="Users online"
                  :users="peerNames"
                ></users-list>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card text>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="8">
                      <v-text-field
                        v-model="background.tabletop_url"
                        label="Tabletop background URL"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="background.tabletop_color"
                        label="Color"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="8">
                      <v-text-field
                        v-model="background.background_url"
                        label="Main background URL"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="background.background_color"
                        label="Color"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <v-btn
                  block
                  primary
                  depressed
                  @click.native="lobbyBackgroundChange"
                >
                  Save background
                </v-btn>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card text>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <div>
                        <v-btn
                          block
                          primary
                          dark
                          depressed
                          @click="exportLobby"
                        >
                          Export lobby in file
                        </v-btn>
                        <div v-if="download_link !== ''">
                          <a
                            :href="download_link"
                            download="export.json"
                            @click="download_link = ''"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                      <div class="pt-4">
                        <div class="file">
                          <v-btn block primary depressed>
                            Import lobby from file
                            <input type="file" @change="importLobby" />
                          </v-btn>
                        </div>
                      </div>
                      <div class="pt-4" v-if="imported_lobby !== null">
                        <v-btn
                          block
                          color="error"
                          depressed
                          @click="replaceLobby"
                        >
                          Replace all lobby data
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.native="open = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UsersList from "../UsersList.vue";
import emitter from "../../helpers/event-bus.js";

export default {
  components: {
    UsersList,
  },
  data() {
    return {
      open: false,
      tab: null,
      members: [],
      background: {
        tabletop_url: "",
        tabletop_color: "#eee",
        background_url: "",
        background_color: "#fafafa",
      },
      download_link: "",
      imported_lobby: null,
    };
  },
  computed: {
    game() {
      return this.$store.state.lobby.game;
    },
    user() {
      return this.$store.state.user;
    },
    peerNames() {
      return this.$store.getters.peerNames;
    },
  },
  created() {
    emitter.on("LobbySettings", () => {
      this.open = !this.open;
      this.background = {
        tabletop_url: this.game.background.tabletop_url,
        tabletop_color: this.game.background.tabletop_color,
        background_url: this.game.background.background_url,
        background_color: this.game.background.background_color,
      };
    });
  },
  methods: {
    lobbyBackgroundChange() {
      this.$store.commit("lobbySetBackground", this.background);
    },
    exportLobby() {
      let file =
        "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.game));
      this.download_link = file;
    },
    importLobby(evt) {
      //Retrieve the first (and only!) File from the FileList object
      let f = evt.target.files[0];
      let self = this;
      if (f) {
        let r = new FileReader();
        r.onload = function (e) {
          self.imported_lobby = JSON.parse(e.target.result);
        };
        r.readAsText(f);
      } else {
        emitter.emit("snackbarOpen", "Failed to load file", "error");
      }
    },
    replaceLobby() {
      let lobby = this.imported_lobby;
      this.$store
        .dispatch("lobbySetGame", {
          background: lobby.background,
          chat: lobby.chat,
          members: lobby.members,
          objects: lobby.objects,
          fullRotation: lobby.fullRotation || false,
          rules: lobby.rules || false,
          imported: Date.now(),
        })
        .then(() => {
          emitter.emit("snackbarOpen", "Successfully imported!");
          this.imported_lobby = null;
        });
    },

    // getMemberInfo(email){
    //   this.$http.get('http://picasaweb.google.com/data/entry/api/user/'+email+'?alt=json').then(response => {
    //     let data = response.body.entry;
    //     console.log(data.gphoto$nickname.$t,data.gphoto$thumbnail.$t);
    //   }, response => {
    //     emitter.emit('snackbarOpen', "Error after loading users info", "error");
    //   });
    // }
  },
};
</script>

<style lang="scss" scoped>
.card__title {
  padding-bottom: 0;
}
.file {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  input[type="file"] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    cursor: inherit;
    display: block;
  }
}
</style>
