<template>
  <v-app>
    <main>
      {{$route.params.id}}
      <tabletop></tabletop>
    </main>
  </v-app>
</template>

<script>
import Tabletop from './Tabletop.vue';

export default {
  components:{
    tabletop: Tabletop
  },
  created(){
    this.$store.dispatch('lobbyGetData', this.$route.params.id);
  }
}
</script>

<style lang="scss" scoped>
</style>