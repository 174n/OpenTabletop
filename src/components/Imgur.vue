<template>
  <v-text-field
    label="Imgur album id"
    single-line
    v-model="imgur_url"
    @keyup.enter.prevent="getImgurData"
    :append-icon-cb="getImgurData"
    append-icon="send">
  </v-text-field>
</template>

<script>
import { EventBus } from '../helpers/event-bus.js';
import config from "../config/imgur.json";

export default {
  data () {
    return {
      imgur_url: "",
    }
  },
  methods:{
    imgurImageUrl(id){
      return "https://i.imgur.com/"+id+".jpg"
    },
    getImgurData(){
      if(/https:\/\/imgur.com\/a\/[a-zA-z0-9]{5}/g.test(this.imgur_url)){
        let imgur_id = /https:\/\/imgur.com\/a\/(.*)/g.exec(this.imgur_url)[1];
        this.$http.get('https://api.imgur.com/3/album/'+imgur_id, {headers: {'authorization': config.client_id}}).then(response => {
          let data = JSON.parse(response.bodyText).data;
          let params = {
            'urls':[],
            'title': data.title,
            'x': 10,
            'y': 10,
            'back': this.imgurImageUrl(data.images[0].id)
          };
          data.images.slice(1).forEach(i=>{
            params.urls.push(this.imgurImageUrl(i.id));
          });
          if(params.urls.length > 0){
            this.$store.dispatch('lobbyCommitMutation', {
              mutation: 'addNewDeckFromData',
              params
            });
          }
        }, response => {
          EventBus.$emit('snackbarOpen', "Wrong imgur id", "error");
        });
      }
      else{
        EventBus.$emit('snackbarOpen', "Wrong imgur url", "error");

      }
    }
  },
  computed: {
    
  },
  created(){
    
  }
}
</script>

<style lang="scss" scoped>

</style>