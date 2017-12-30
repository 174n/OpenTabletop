<template>
  <v-dialog v-model="open" lazy absolute width="500px">
    <v-card>
      <v-card-title>
        <div class="headline">Lobby settings</div>
      </v-card-title>
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
      members: []
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
    });
  },
  methods:{
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
</style>