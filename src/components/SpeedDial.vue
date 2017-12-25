<template>
  <v-speed-dial fixed bottom right v-model="speedDeal">
    <v-btn slot="activator" class="red darken-2" dark fab hover v-model="speedDeal">
      <v-icon>add</v-icon>
      <v-icon>close</v-icon>
    </v-btn>
    <v-btn fab dark small class="green" v-tooltip:left="{ html: 'Add new deck' }" @click.native="addNewDeck">
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
    addNewDeck(event){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'addNewDeck',
        params: event
      });
    },
    addNewCounter(event){
      this.$store.dispatch('lobbyCommitMutation', {
        mutation: 'addNewCounter',
        params: event
      });
    },
    rollDice(){
      this.$store.commit('chatAddMsg', ["Dice roll: "+this.user.displayName,"[1d6] Result: "+this.randomInteger(1, 6)]);
      this.$store.dispatch('lobbyUpdateChat');
      // this.openChat();
    },
    openChat(){
      EventBus.$emit('toggleChat', true);
    }
  },
  computed: {
    user(){
      return this.$store.state.user
    }
  }
}
</script>

<style lang="scss" scoped>
</style>