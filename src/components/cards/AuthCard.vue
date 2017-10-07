<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Authorization</div>
        <span class="grey--text">You need to authorize with your google account to be able to create or join lobby</span>
      </div>
    </v-card-title>
    <v-card-actions>
      <v-btn class="blue--text" flat to="lobby"> Auth with Google</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
</style>