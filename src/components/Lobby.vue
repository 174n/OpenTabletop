<template>
  <v-app>
    <main>
      <!-- {{$route.params.id}} -->
      <tabletop></tabletop>

      <chat></chat>
      <deck-list></deck-list>
      <!-- <card-preview></card-preview> -->
      <speed-dial></speed-dial>
      <context-menu></context-menu>
      <place-user-deck></place-user-deck>
      <lobby-settings></lobby-settings>
      <card-size></card-size>
    </main>
  </v-app>
</template>

<script>
import Tabletop from './Tabletop.vue';

import Chat from './Chat.vue';
import DeckList from './dialogs/DeckList.vue';
// import CardPreview from './dialogs/CardPreview.vue';
import SpeedDial from './SpeedDial.vue';
import ContextMenu from './ContextMenu.vue';
import PlaceUserDeck from './dialogs/PlaceUserDeck.vue';
import LobbySettings from './dialogs/LobbySettings.vue';
import CardSize from './dialogs/CardSize.vue';

export default {
  components:{
    "deck-list": DeckList,
    "chat": Chat,
    // "card-preview": CardPreview,
    "speed-dial": SpeedDial,
    "context-menu": ContextMenu,
    "tabletop": Tabletop,
    "place-user-deck": PlaceUserDeck,
    "lobby-settings": LobbySettings,
    "card-size": CardSize,
  },
  data () {
    return {
      onlineInterval: null,
    }
  },
  created(){
    this.$store.dispatch('lobbyGetData', this.$route.params.id);
    // this.$store.watch((state) => {
    //   return state.game;
    // }, (val) => {
    //   // this.$store.dispatch('lobbyPutData');
    //   // console.log(val);
    // },{deep: true});
    this.onlineInterval = setInterval(() => {
      this.$store.dispatch('lobbyMemberLastOnline');
    }, 10*1000);
  },
  mounted(){
    setTimeout(()=>{
      if(!this.$store.state.firebaseLoading && this.$store.state.user === null){
        this.$router.push({ path: '/' })
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.onlineInterval);
  },
}
</script>

<style lang="scss">
html,body{
  position: static;
  background: #fafafa;
  overflow: hidden;
}
.speed-dial{
  z-index: 999;
}
</style>