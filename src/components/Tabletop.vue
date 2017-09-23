<template>
  <div v-if="$store.state.user">
    <!-- <toolbar></toolbar> -->
    <!-- <router-link tag="md-button" to="/" v-if="$route.path!=='/'"><md-icon>navigate_before</md-icon></router-link> -->

    <md-speed-dial md-open="click" class="md-fab-bottom-right" md-theme="default">
      <md-button class="md-fab" md-fab-trigger>
        <md-icon md-icon-morph>close</md-icon>
        <md-icon>more_horiz</md-icon>
      </md-button>

      <md-button class="md-fab md-mini md-clean" href="#/">
        <md-icon>chevron_left</md-icon>
      </md-button>
      <md-button class="md-fab md-mini md-clean" @click="startConnection">
        <md-icon>compare_arrows</md-icon>
      </md-button>
      <!-- <md-button class="md-fab md-mini md-clean" @click="sendData(1)">
        <md-icon>send</md-icon>
      </md-button> -->
    </md-speed-dial>

    <div class="preloader" v-if="preloader">
      <div class="header">Not connected</div>
    </div>

    <div class="tabletop">
      <div
        v-for="(object, i) in game.objects"
        class="draggable"
        :class="[object.type]"
        :data-id="i"
        :style="{
          transform: 'translate('+object.x+'px, '+object.y+'px)',
          backgroundImage: 'url('+object.url+')'
          }"
      >
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from './Toolbar.vue';
import interact from 'interactjs';

export default {
  components:{
    'toolbar': Toolbar
  },
  data () {
    return {
      lobbyOwners: null,
      database: null,
      yourId: null,
      pc: null,
      dataChannel: null,
      pc: null,
      servers: {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'websitebeaver@mail.com'}]},
      preloader: true,
      game:{
        objects:[
          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417720&type=card",
            x: 0,
            y: 0
          },

          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423802&type=card",
            x: 150,
            y: 0
          },

          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417690&type=card",
            x: 0,
            y: 150
          }
        ]
      }

    }
  },
  methods:{
    dragMoveListener(event){
      var target = event.target,
        // x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        // y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        obj = this.game.objects[target.getAttribute("data-id")],
        x = (parseFloat(obj.x) || 0) + event.dx,
        y = (parseFloat(obj.y) || 0) + event.dy;
        this.sendData(JSON.stringify(this.game));

      obj.x = x;
      obj.y = y;

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    },
    sendMessage: function(senderId, data) {
     let msg = this.database.push({ sender: senderId, message: data });
     msg.remove();
    },

    readMessage: function(data) {
     let msg = JSON.parse(data.val().message);
     let sender = data.val().sender;
     if (sender != this.yourId) {
     if (msg.ice != undefined)
     this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
     else if (msg.sdp.type == "offer")
     this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
     .then(() => this.pc.createAnswer())
     .then(answer => this.pc.setLocalDescription(answer))
     .then(() => this.sendMessage(this.yourId, JSON.stringify({'sdp': this.pc.localDescription})));
     else if (msg.sdp.type == "answer")
     this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
     }
    },


    startConnection: function() {
     this.pc.createOffer()
     .then(offer => this.pc.setLocalDescription(offer) )
     .then(() => this.sendMessage(this.yourId, JSON.stringify({'sdp': this.pc.localDescription})) );
    },

    sendData: function(data) {
      this.dataChannel.send(data);
    }
  },
  created(){
    
    this.lobbyOwners = [this.$store.state.user.uid, this.$route.params.id].sort();

    this.database = this.$store.getters.db.ref('/users/'+this.lobbyOwners[0]+"/friends/"+this.lobbyOwners[1]+"/lobby/");
    this.yourId = Math.floor(Math.random()*1000000000);
    this.servers = {'icethis.servers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'websitebeaver@mail.com'}]};
    this.pc = new RTCPeerConnection(this.servers);
    this.dataChannel = this.pc.createDataChannel('sendDataChannel');

    this.pc.onicecandidate = (event => event.candidate?this.sendMessage(this.yourId, JSON.stringify({'ice': event.candidate})):this.preloader = false );
    let self = this;
    this.pc.ondatachannel = function (event) {
      let receiveChannel = event.channel;
      receiveChannel.onmessage = function(event){
        let game = JSON.parse(event.data);
        self.game = game;
        // let x = event.data.split(',');
        // document.getElementById("draggable").style.transform = 'translate(' + x[0] + 'px, ' + x[1] + 'px)';

      };
    }

    this.pc.onaddstream = (event => friendsVideo.srcObject = event.stream);

    this.database.on('child_added', this.readMessage);




  },
  mounted(){
    interact('.draggable')
      .draggable({
        // enable inertial throwing
        inertia: {
          resistance: 20
        },
        // keep the element within the area of it's parent
        restrict: {
          restriction: "parent",
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: this.dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
          console.log('moved a distance of '+ (Math.sqrt(event.dx * event.dx +event.dy * event.dy)|0) + 'px');
        }
      });
  }
}
</script>

<style lang="scss" scoped>
@import "./src/styles/settings.scss";


.tabletop{
  width: 100%;
  // height: calc(100vh - 64px);
  height: 100vh;
  background-color: #CACACA;
  position: absolute;
}

// .draggable{
//   width: 100px;
//   height: 100px;
//   background-color: #2194FF;
// }

.card{
  width: 111px;
  height: 155px;
  background-repeat: no-repeat;
  background-size: cover;
}

.preloader{
  position: absolute;
  z-index: 5;
  width: 100%;
  height: 100%;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  .header{
    font-size: 2em;
    color: #eee;
    font-weight: 300;
  }
}
</style>