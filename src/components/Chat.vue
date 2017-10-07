<template>
  <v-navigation-drawer v-model="sidebar" light>
    <div class="sendMsgBox">
      <v-text-field
        label="Message"
        single-line
        v-model="chatMsgValue"
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
    chatMsg(){
      this.$store.commit('chatAddMsg', ["Nickname",this.chatMsgValue]);
      this.chatMsgValue = "";
    }
  },
  computed: {
    game(){
      return this.$store.state.game
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