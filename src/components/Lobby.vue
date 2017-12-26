<template>
  <v-app>
    <main>
      <!-- {{$route.params.id}} -->
      <tabletop></tabletop>

      <chat></chat>
      <deck-list></deck-list>
      <card-preview></card-preview>
      <speed-dial></speed-dial>
      <context-menu></context-menu>
      <place-user-deck></place-user-deck>
    </main>
  </v-app>
</template>

<script>
import Tabletop from './Tabletop.vue';

import Chat from './Chat.vue';
import DeckList from './dialogs/DeckList.vue';
import CardPreview from './dialogs/CardPreview.vue';
import SpeedDial from './SpeedDial.vue';
import ContextMenu from './ContextMenu.vue';
import PlaceUserDeck from './dialogs/PlaceUserDeck.vue';

export default {
  components:{
    "deck-list": DeckList,
    "chat": Chat,
    "card-preview": CardPreview,
    "speed-dial": SpeedDial,
    "context-menu": ContextMenu,
    "tabletop": Tabletop,
    "place-user-deck": PlaceUserDeck
  },
  created(){
    this.$store.dispatch('lobbyGetData', this.$route.params.id);
    // this.$store.watch((state) => {
    //   return state.game;
    // }, (val) => {
    //   // this.$store.dispatch('lobbyPutData');
    //   // console.log(val);
    // },{deep: true});

  }
}
</script>

<style lang="scss">
html,body{
  position: static;
  background: #fafafa;
  overflow: hidden;
}
</style>