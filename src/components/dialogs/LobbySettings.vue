<template>
  <v-dialog v-model="open" lazy absolute width="500px">
    <v-card>
      <v-card-title>
        <div class="headline">Lobby settings</div>
      </v-card-title>
      <v-card-text>

        
        <v-tabs centered scrollable grow>
          <v-tabs-bar class="white" dark>
            <v-tabs-slider class="blue"></v-tabs-slider>
            <v-tabs-item href="#members_tab">Members</v-tabs-item>
            <v-tabs-item href="#background_tab">Background</v-tabs-item>
            <v-tabs-item href="#import_export_tab">Import / Export</v-tabs-item>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content id="members_tab">
              <v-card flat>
                <v-card-text>

                  <v-list two-line>
                    <v-subheader>Users online</v-subheader>
                    <template v-for="(member,index) in game.members">
                      <v-list-tile avatar>
                        <v-list-tile-avatar>
                          <img :src="member.avatar">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>{{member.name}} <small>{{member.email}}</small></v-list-tile-title>
                          <v-list-tile-sub-title>
                            <timeago :since="member.online" :auto-update="5"></timeago>
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-list>

                </v-card-text>
              </v-card>
            </v-tabs-content>
            <v-tabs-content id="background_tab">
              <v-card flat>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex sm8 xs12>
                      <v-text-field v-model="background.tabletop_url" label="Tabletop background URL"></v-text-field>
                    </v-flex>
                    <v-flex sm3 xs12 offset-sm1>
                      <v-text-field v-model="background.tabletop_color" label="Color"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex sm8 xs12>
                      <v-text-field v-model="background.background_url" label="Main background URL"></v-text-field>
                    </v-flex>
                    <v-flex sm3 xs12 offset-sm1>
                      <v-text-field v-model="background.background_color" label="Color"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-btn block primary @click.native="lobbyBackgroundChange">Save background</v-btn>

                </v-card-text>
              </v-card>
            </v-tabs-content>
            <v-tabs-content id="import_export_tab">
              <v-card flat>
                <v-card-text>
                  <v-btn block primary dark @click.native="exportLobby">Export lobby in file</v-btn>
                  <div v-if="download_link!==''">
                    <a :href="download_link" download="export.json" @click="download_link=''">Download</a>
                  </div>
                  <div class="file">
                    <v-btn block primary>Import lobby from file<input type="file" @change="importLobby"></v-btn>
                  </div>
                  <div v-if="imported_lobby !== null">
                    <v-btn block error @click.native="replaceLobby">Replace all lobby data</v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>


      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat="flat" @click.native="open = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from '../../helpers/event-bus.js';

export default {
  data () {
    return {
      open: false,
      members: [],
      background:{
        tabletop_url: "",
        tabletop_color: "#eee",
        background_url: "",
        background_color: "#fafafa"
      },
      download_link: "",
      imported_lobby: null
    }
  },
  computed: {
    game(){
      return this.$store.state.game;
    },
    user(){
      return this.$store.state.user
    }
  },
  created(){
    EventBus.$on('LobbySettings', () => {
      this.open = !this.open;
      this.background = {
        tabletop_url: this.game.background.tabletop_url,
        tabletop_color: this.game.background.tabletop_color,
        background_url: this.game.background.background_url,
        background_color: this.game.background.background_color
      }
    });
  },
  methods:{
    lobbyBackgroundChange(){
      this.$store.dispatch('lobbySetState', {
        path: "background",
        data: this.background
      });
      console.log(this.background);
    },
    exportLobby(){
      let file = 'data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify(this.game));
      this.download_link = file;
    },
    readSingleFile(evt) {
      //Retrieve the first (and only!) File from the FileList object
      let f = evt.target.files[0];
      let self = this;
      if (f) {
        let r = new FileReader();
        r.onload = function(e){
          self.imported_lobby = JSON.parse(e.target.result);
        }
        r.readAsText(f);
      } else {
        EventBus.$emit('snackbarOpen', "Failed to load file", "error");
      }
    },
    importLobby(e){
      this.readSingleFile(e);
    },
    replaceLobby(){
      let lobby = this.imported_lobby;
      this.$store.dispatch('lobbySetState', {
        path: "",
        data: {
          background: lobby.background,
          chat: lobby.chat,
          members: lobby.members,
          objects: lobby.objects,
          imported: {".sv":"timestamp"}
        }
      }).then(()=>{
        EventBus.$emit('snackbarOpen', "Successfully imported!");
        this.imported_lobby = null;
      });
    }

    // getMemberInfo(email){
    //   this.$http.get('http://picasaweb.google.com/data/entry/api/user/'+email+'?alt=json').then(response => {
    //     let data = response.body.entry;
    //     console.log(data.gphoto$nickname.$t,data.gphoto$thumbnail.$t);
    //   }, response => {
    //     EventBus.$emit('snackbarOpen', "Error after loading users info", "error");
    //   });
    // }
  }
}
</script>

<style lang="scss" scoped>
.card__title{
  padding-bottom: 0;
}
.file{
  cursor: pointer;
  position: relative;
  overflow: hidden;
  input[type=file] {
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