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
    this.$store.dispatch("firebaseInit");
  },
};
</script>

<style lang="scss">
.v-application {
  background: transparent !important;
}
</style>
