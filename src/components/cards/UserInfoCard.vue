<template>
  <v-card>
    <v-list>
      <v-list-item>
        <v-list-item-avatar v-html="avatar"></v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ user.nickname }}</v-list-item-title>
          <v-list-item-subtitle>That's you</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn text @click="logout">Change</v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { createAvatar } from "@dicebear/avatars";
import * as maleStyle from "@dicebear/avatars-male-sprites";
import * as femaleStyle from "@dicebear/avatars-female-sprites";

export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
    avatar() {
      return createAvatar(
        this.user.nickname.match(/(a|а)$/g) ? femaleStyle : maleStyle,
        {
          seed: this.user.nickname
        }
      );
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style lang="scss" scoped></style>
