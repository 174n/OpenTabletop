<template>
  <div>
    <toolbar></toolbar>
    <welcome-card></welcome-card>
  </div>
</template>

<script>
import Toolbar from './Toolbar.vue';
import WelcomeCard from './WelcomeCard.vue';

export default {
  components:{
    'toolbar': Toolbar,
    'welcome-card': WelcomeCard
  },
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/styles/settings.scss";


</style>