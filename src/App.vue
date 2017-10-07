<template>
  <div>
    <router-view></router-view>
    <snackbar></snackbar>
  </div>
</template>

<script>
import Snackbar from "./components/Snackbar.vue";
  export default {
    components:{
      "snackbar": Snackbar
    }
  }
</script>
