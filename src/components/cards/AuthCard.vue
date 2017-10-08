<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Authorization</div>
        <span class="grey--text">You need to authorize with your google account to be able to create or join lobby</span>
      </div>
    </v-card-title>
    <v-card-actions>
      <v-btn class="blue--text" flat @click="auth">Auth with Google</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
  methods:{
    auth(){
      this.$store.dispatch('signInWithGoogle');
    }
  }
}
</script>

<style lang="scss" scoped>
</style>