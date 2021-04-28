<template>
  <div>
    <router-view></router-view>
    <snackbar></snackbar>
  </div>
</template>

<script>
import Snackbar from "./components/Snackbar.vue";
export default {
  components: {
    snackbar: Snackbar,
  },
  created() {
    this.$store.commit("initUser");
  },
};
</script>

<style lang="scss">
.v-application {
  background: transparent !important;
}
</style>
