<template>
  <div>
    <md-button class="md-raised" @click="signInWithGoogle" v-if="!user">SignIn with Google</md-button>
    <md-button class="md-raised md-accent" @click="signOut" v-else>Sign out</md-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed:{
    user:{
      get: function () {
        return this.$store.state.user;
      },
      set: function (newValue) {
        this.$store.state.user = newValue;
      }
    },
    firebase(){
      return this.$store.state.firebase;
    }
  },
  methods:{
    ...mapActions([
      "signInWithGoogle",
      "signOut",
      "firebaseInit"
    ])

  },
  created(){
    // let self = this;

    // this.firebase.auth().getRedirectResult().then(function(result) {
    //   /*if (result.credential) {
    //     var token = result.credential.accessToken;
    //   }*/
    //   self.user = result.user;
    // }).catch(function(error) {
    //   console.log(error);
    // });


    // this.firebase.auth().onAuthStateChanged(function(user) {
    //   self.user = user;
    // });

    this.firebaseInit();
  }
}
</script>

<style lang="scss" scoped>
@import "./src/styles/settings.scss";


</style>