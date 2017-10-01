<template>
  <v-app>
    <main>
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
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
</style>