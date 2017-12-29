<template>
  <v-dialog v-model="isOpen" lazy width="223">
    <img :src="url" alt="Card preview" class="cardPreview">
  </v-dialog>
</template>

<script>
import { EventBus } from '../../helpers/event-bus.js';

export default {
  data () {
    return {
      isOpen: false,
      url: ""
    }
  },
  created(){
    EventBus.$on('toggleCardPreview', url => {
      this.url = url;
      this.isOpen = !this.isOpen;
    });
  }
}
</script>

<style lang="scss" scoped>
.cardPreview{
  max-width: 223px;
  margin-bottom: -6px;
}
</style>