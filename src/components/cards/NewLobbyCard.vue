<template>
  <v-card dark color="blue-grey">
    <v-card-title primary-title> Create a blank lobby </v-card-title>
    <v-card-subtitle>
      Click the button below to create a blank lobby
    </v-card-subtitle>
    <v-card-actions>
      <v-btn text dark @click.stop="newLobby">Create lobby</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  methods: {
    newLobby() {
      this.$store.dispatch("newLobby");
      this.$router.push("lobby/" + this.$store.state.lobby.id);
    },
  },
};
</script>

<style lang="scss" scoped></style>
