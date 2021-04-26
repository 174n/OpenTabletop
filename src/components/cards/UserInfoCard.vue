<template>
  <v-card>
    <v-list>
      <v-list-item>
        <v-list-item-avatar>
          <img :src="user.photoURL" :alt="user.displayName" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ user.displayName }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn text @click="logout">Logout</v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <!-- <v-divider></v-divider> -->
    <!-- <v-list>
      <v-list-item>
        <v-list-item-action>
          <v-switch color="purple"></v-switch>
        </v-list-item-action>
        <v-list-item-title>Enable messages</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-action>
          <v-switch color="purple"></v-switch>
        </v-list-item-action>
        <v-list-item-title>Enable hints</v-list-item-title>
      </v-list-item>
    </v-list> -->
    <!-- <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text>Cancel</v-btn>
      <v-btn color="primary" text>Save</v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style lang="scss" scoped></style>
