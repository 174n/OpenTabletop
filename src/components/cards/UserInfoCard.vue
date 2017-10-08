<template>
  <v-card>
    <v-list>
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <img :src="user.photoURL" :alt="user.displayName">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{user.displayName}}</v-list-tile-title>
          <v-list-tile-sub-title>{{user.email}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn flat @click="logout">Logout</v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <!-- <v-divider></v-divider> -->
    <!-- <v-list>
      <v-list-tile>
        <v-list-tile-action>
          <v-switch color="purple"></v-switch>
        </v-list-tile-action>
        <v-list-tile-title>Enable messages</v-list-tile-title>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action>
          <v-switch color="purple"></v-switch>
        </v-list-tile-action>
        <v-list-tile-title>Enable hints</v-list-tile-title>
      </v-list-tile>
    </v-list> -->
    <!-- <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat>Cancel</v-btn>
      <v-btn color="primary" flat>Save</v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script>
export default {
  computed:{
    user(){
      return this.$store.state.user;
    }
  },
  methods:{
    logout(){
      this.$store.dispatch('logout');
    }
  }
}
</script>

<style lang="scss" scoped>
</style>