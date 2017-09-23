<template>
  <div>
    <md-card md-with-hover class="welcome_card">
      <md-card-header>
        <div class="md-title">OpenTabletop</div>
        <div class="md-subhead">Play any card games with your friends</div>
      </md-card-header>

      <md-card-content>
        This is a browser-based online project in which you can play any card games with your friends.
        This app supports p2p connection, so all data will be synchronized on a very high speed.
      </md-card-content>

      <md-card-actions>
        <md-button @click="openDialog('addfriend')" id="addfriend">Add a friend</md-button>
        <!-- <router-link tag="md-button" to="settings">Settings</router-link> -->
      </md-card-actions>
    </md-card>


    <md-dialog md-open-from="#addfriend" md-close-to="#addfriend" ref="addfriend">
      <md-dialog-title>Add a new friend</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-input-container>
            <label>Email</label>
            <md-input v-model="email"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="firebaseAddFriend">Add</md-button>
        <md-button class="md-primary" @click="closeDialog('addfriend')">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>



    <md-snackbar md-position="bottom center" ref="success" md-duration="2000">
      <span>Successfully added</span>
    </md-snackbar>
    <md-snackbar md-position="bottom center" ref="error">
      <span>Whoops... There is an error</span>
      <md-button class="md-accent" @click="openDialog('addfriend');$refs.snackbar.close()">Retry</md-button>
    </md-snackbar>

  </div>
</template>

<script>

export default {
  data () {
    return {
      email: ""
    }
  },
  methods:{
    openDialog(ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      this.$refs[ref].close();
    },
    firebaseAddFriend: function(){
      let userId = this.$store.state.user.uid;

      let self = this;
      this.$store.getters.db.ref('/emails/' + this.email.replace(/\./g, ',')).once('value').then(function(snapshot) {
        let parsed = JSON.parse(JSON.stringify(snapshot));
        if (parsed != null){
          let id =  parsed.id

          self.$store.getters.db.ref('users/' + userId + "/friends/" + id)
          .set({
            email: self.email
          })
          .then(() => {
            self.$refs.success.open();
            self.closeDialog('addfriend');
          },
          (err) => {
            self.$refs.error.open();
            console.log(err);
          });
        }
        else self.$refs.error.open();

      });


    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/styles/settings.scss";

.welcome_card{
  margin: 20px;
}
</style>