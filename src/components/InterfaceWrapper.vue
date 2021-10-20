<template>
  <v-app>
    <v-app-bar class="red" dark fixed>
      <v-app-bar-title>OpenTabletop{{ subtitleText }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$router.go(-1)" v-if="backBtn">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-app-bar>
    <main class="mt-md-10 mt-5">
      <div class="mt-10">
        <v-container fluid v-if="loading">
          <v-layout row wrap justify-space-around>
            <v-progress-circular
              indeterminate
              v-bind:size="50"
            ></v-progress-circular>
          </v-layout>
        </v-container>
        <slot v-else />
      </div>
    </main>
  </v-app>
</template>

<script>
export default {
  props: {
    subtitle: String,
    backBtn: Boolean
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    loading() {
      return this.$store.state.loading;
    },
    subtitleText() {
      return this.subtitle ? ` - ${this.subtitle}` : "";
    }
  }
};
</script>
