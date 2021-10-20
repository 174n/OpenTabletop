<template>
  <v-card color="primary" dark>
    <v-card-title class="text-h5"> Lobby ID: {{ lobbyId }} </v-card-title>
    <v-card-text>
      <v-text-field
        dense
        label="Full lobby url"
        :value="fullURL"
      ></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    lobbyId: String
  },
  computed: {
    fullURL() {
      return location.href;
    }
  }
};
</script>

<style lang="scss" scoped></style>
