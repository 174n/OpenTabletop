<template>
  <div>
    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleLeftSidenav" v-if="user">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title" style="flex: 1">OpenTabletop</h2>

      <auth></auth>
      <router-link tag="md-button" to="/" v-if="$route.path!=='/'"><md-icon>navigate_before</md-icon></router-link>
    </md-toolbar>


    <md-sidenav class="md-left" ref="leftSidenav" v-if="user">
      <md-toolbar class="md-account-header">
        <md-list class="md-transparent">
          <md-list-item>
            <md-avatar class="md-large">
              <img :src="user.photoURL" alt="Avatar">
            </md-avatar>
          </md-list-item>

          <md-list-item>
            <div class="md-list-text-container">
              <span>{{ user.displayName }}</span>
              <span>{{ user.email }}</span>
            </div>

            <md-button class="md-icon-button md-list-action" @click="$store.dispatch('signOut')">
              <md-icon>exit_to_app</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
      </md-toolbar>




      <md-list>

        <!-- <md-list-item v-for="item in menuList" key="item" @click="item.action">
          <md-icon>{{ item.icon }}</md-icon> <span>{{ item.title }}</span>
        </md-list-item>
        
        <md-divider class="md-inset"></md-divider> -->
        
        <template v-if="friends !== null && JSON.stringify(friends) !== '[null]' && friends.length > 0">
          <md-list-item v-for="friend in friends" key="friend">

            <md-menu md-align-trigger md-size="4">
              <md-avatar class="friend_avatar" md-menu-trigger>
                <img :src="friend.avatar" alt="Friend">
              </md-avatar>

              <md-menu-content>
                <md-menu-item @click="removeFromDB(friend.id)">Remove from friends</md-menu-item>
              </md-menu-content>
            </md-menu>

            <div class="md-list-text-container">
              <span>{{ friend.name }}</span>
              <span>{{ friend.email }}</span>
            </div>

            <md-button class="md-icon-button md-list-action" :href="'#/tabletop/'+friend.id">
              <md-icon>send</md-icon>
            </md-button>
          </md-list-item>
        </template>
        <md-list-item v-else>
          <md-icon>not_interested</md-icon>
          <span>No friends</span>
        </md-list-item>

      </md-list>


    </md-sidenav>

  </div>
</template>

<script>
import Auth from './Auth.vue';
import { mapGetters } from 'vuex'

export default {
  components:{
    'auth': Auth
  },
  computed:{
    ...mapGetters([
      'db'
    ]),
    userdata: function(){
      return this.$store.state.userdata
    },
    user: function(){
      return this.$store.state.user
    }
  },
  data () {
    return {
      menuList:[
        {
          "icon": "add_circle",
          "title": "Create new lobby",
          "action": () => this.$router.push("/tabletop")
        },
        {
          "icon": "settings",
          "title": "Settings",
          "action": () => this.$router.push("/")
        }
      ],
      friends: null
    }
  },
  methods: {
    toggleLeftSidenav() {
      this.$refs.leftSidenav.toggle();
    },
    removeFromDB(id){
      this.db.ref("/users/"+this.user.uid+"/friends/"+id).remove();
      console.log(id);
    }
  },
  watch: {
    userdata: function (val) {
      let obj = val.friends;

      const arrayOfPromises = Object.keys(obj).map(x => {
        return new Promise(resolve => {
          this.$http.get('http://picasaweb.google.com/data/entry/api/user/'+obj[x].email+'?alt=json')
            .then(result => resolve({
              "avatar": result.body.entry.gphoto$thumbnail.$t,
              "name": result.body.entry.gphoto$nickname.$t,
              "email": obj[x].email,
              "id": x
            }))
        })
      });

      Promise.all(arrayOfPromises).then(result => {
        this.friends = result;
      });

      // this.friends = Object.keys(obj).map(function*(x){

      //   this.$http.get('http://picasaweb.google.com/data/entry/api/user/'+obj[x].email+'?alt=json').then(response => {
      //     yield response.body;
      //   }, response => {
      //     console.log(response);
      //   });

      // });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/styles/settings.scss";

.friend_avatar{
  cursor: pointer;
}
</style>