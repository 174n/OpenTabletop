<template>
  <v-speed-dial fixed bottom right v-model="speedDeal">
    <v-btn slot="activator" class="red darken-2" dark fab hover v-model="speedDeal">
      <v-icon>add</v-icon>
      <v-icon>close</v-icon>
    </v-btn>
    <v-btn fab dark small class="green" v-tooltip:left="{ html: 'Add new deck' }" @click.stop="addNewDeck">
      <v-icon>filter_none</v-icon>
    </v-btn>
    <v-btn fab dark small class="indigo" v-tooltip:left="{ html: 'Add a counter' }" @click.native="addNewCounter">
      <v-icon>plus_one</v-icon>
    </v-btn>
    <v-btn fab dark small class="red" v-tooltip:left="{ html: 'Roll a dice' }" @click.stop="rollDice">
      <v-icon>casino</v-icon>
    </v-btn>
    <v-btn fab dark small class="blue" v-tooltip:left="{ html: 'Open chat' }" @click.stop="openChat">
      <v-icon>chat</v-icon>
    </v-btn>
    <v-btn fab dark small class="gray" v-if="user !== null && lobbyAdmin === user.email" v-tooltip:left="{ html: 'Lobby settings' }" @click.stop="lobbySettings">
      <v-icon>settings</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
import { EventBus } from '../helpers/event-bus.js';

export default {
  data () {
    return {
      speedDeal: false
    }
  },
  methods:{
    randomInteger(min, max){
      return Math.round(min + Math.random() * (max - min));
    },
    diceRoller(dice){
      if(/^[0-9]{1,}d[0-9]{1,}$/.test(dice)){
        let options = dice.split('d');
        if(parseInt(options[0]) >= 1 && parseInt(options[1]) >= 2){
          let out = 0;
          for(var i = 1; i <= parseInt(options[0]); i++) {
            out += this.randomInteger(1,parseInt(options[1]));
          }
          return '['+dice+'] Result: '+out;
        }
        else return false;
      }
      else return false;
    },
    addNewDeck(event){
      /*this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'addNewDeck',
        params: event
      });*/
      EventBus.$emit('placeUserDeckToggle', event);
    },
    addNewCounter(event){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'addNewCounter',
        params: event
      });
    },
    rollDice(){
      this.$store.commit('chatAddMsg', ["Dice roll: "+this.user.displayName,this.diceRoller(this.dice)]);
      this.$store.dispatch('lobbyUpdateChat');
      // this.openChat();
    },
    openChat(){
      EventBus.$emit('toggleChat', true);
    },
    lobbySettings(){
      EventBus.$emit('LobbySettings');
    }
  },
  computed: {
    user(){
      return this.$store.state.user
    },
    lobbyAdmin(){
      return this.$store.state.lobbyAdmin
    },
    dice(){
      return this.$store.state.dice
    }
  }
}
</script>

<style lang="scss" scoped>
</style>