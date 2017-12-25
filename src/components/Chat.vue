<template>
  <v-navigation-drawer v-model="sidebar" :mobile-break-point="4000">
    <div class="sendMsgBox">
      <v-text-field
        label="Message"
        single-line
        v-model="chatMsgValue"
        @keyup.enter.prevent="chatMsg"
        :append-icon-cb="chatMsg"
        append-icon="send">
      </v-text-field>
    </div>
    
    <v-divider></v-divider>
    <v-list three-line>
      <v-list-tile avatar v-for="(msg, i) in game.chat.slice().reverse()" :key="i">
        <v-list-tile-content>
          <v-list-tile-title>{{msg.title}}</v-list-tile-title>
          <v-list-tile-sub-title>{{msg.msg}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-list-tile-action-text>
            <timeago :since="msg.time" :auto-update="30"></timeago>
          </v-list-tile-action-text>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { EventBus } from '../helpers/event-bus.js';

export default {
  data () {
    return {
      sidebar: false,
      chatMsgValue: ""
    }
  },
  methods:{
    chatMsg(e){
      if(e !== undefined) e.target.blur();
      this.$store.commit('chatAddMsg', [this.user.displayName,this.chatMsgValue]);
      this.$store.dispatch('lobbyUpdateChat');
      this.chatMsgValue = "";
    }
  },
  computed: {
    game(){
      let game = this.$store.state.game;
      if(game.chat === undefined || game.chat === null) game.chat = []
      return game
    },
    user(){
      return this.$store.state.user
    }
  },
  created(){
    EventBus.$on('toggleChat', val => {
      if(val === undefined) this.sidebar = !this.sidebar
        else this.sidebar = val;
    });
  }
}
</script>

<style lang="scss" scoped>
.sendMsgBox{
  padding: 0 15px;
}
</style>