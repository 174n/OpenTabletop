<template>
  <div class="tabletop" :style="tabletopStyle">
    <template v-for="(object, i) in game.objects">
      <!-- card -->
      <div
        :key="i"
        v-if="object !== undefined && object.type === 'card'"
        @contextmenu.prevent="showMenu('card', object.x, object.y, i)"
        @dblclick="cardPreviewOpen(i)"
        @click.middle.prevent="cardMiddleClick($event, i)"
        class="card"
        :class="{
          inhand: object.hand === user.uid,
          pinned: !!object.pin,
          draggable: !object.pin,
        }"
        :data-id="i"
        :style="{
          transform:
            'translate(' +
            object.x +
            'px, ' +
            object.y +
            'px) rotate(' +
            (!!object.hand && object.hand !== user.uid ? -1 : 1) *
              object.rotation +
            'deg)',
        }"
      >
        <img
          alt="card"
          :src="
            !object.hand || object.hand === user.uid ? object.url : object.back
          "
          :style="{
            width: !object.real_size
              ? (object.size === undefined ? 111 : (925 * object.size) / 100) +
                'px'
              : 'initial',
          }"
        />
      </div>
      <!-- deck -->
      <div
        :key="i"
        v-else-if="object !== undefined && object.type === 'deck'"
        @contextmenu.prevent="showMenu('deck', object.x, object.y, i)"
        @dblclick="takeCard(i)"
        class="draggable deck"
        :class="{ empty_deck: object.cards.length <= 0 }"
        :data-id="i"
        :style="{
          transform:
            'translate(' +
            object.x +
            'px, ' +
            object.y +
            'px) rotate(' +
            (object.rotation || 0) +
            'deg)',
          backgroundColor: object.color,
          width: object.cards.length <= 0 ? '111px' : 'initial',
        }"
      >
        <div class="wrapper">
          <div
            class="header"
            :style="{ fontSize: (object.text.length > 8 ? '0.9' : '1') + 'em' }"
          >
            {{ object.text }}
          </div>
          <div class="count">{{ object.cards.length }}</div>
        </div>
        <img
          alt="deck"
          v-if="object.cards.length > 0"
          :src="object.fliped ? object.cards[0].url : object.cards[0].back"
          :style="{
            width: !object.cards[0].real_size
              ? (object.cards[0].size === undefined
                  ? 111
                  : (925 * object.cards[0].size) / 100) + 'px'
              : 'initial',
          }"
        />
        <!-- {{cardSize(object.cards[0].back)}} -->
      </div>
      <!-- counter -->

      <v-avatar
        :key="i"
        class="draggable counter"
        :class="[object.color]"
        @contextmenu.prevent="showMenu('counter', object.x, object.y, i)"
        v-else-if="object !== undefined && object.type === 'counter'"
        :data-id="i"
        :style="{
          transform: 'translate(' + object.x + 'px, ' + object.y + 'px)',
        }"
      >
        <span class="white--text headline">{{ object.count }}</span>
      </v-avatar>
    </template>
  </div>
</template>

<script>
import interact from "interactjs";
import { EventBus } from "../helpers/event-bus.js";

export default {
  computed: {
    game() {
      return this.$store.state.game;
    },
    user() {
      return this.$store.state.user;
    },
    tabletopStyle() {
      return this.game.background
        ? {
            backgroundColor: this.game.background.tabletop_color || "#eee",
            backgroundImage: this.game.background
              ? `url(${this.game.background.tabletop_url})`
              : "none",
            transform: "scale(1)",
          }
        : {};
    },
  },
  data() {
    return {
      tabletopCanvas: undefined,
    };
  },
  asyncMethods: {
    cardSize(url) {
      return new Promise((resolve) => {
        let img = document.createElement("img");
        img.src = url;
        img.onload = function () {
          resolve(this.naturalWidth, this.naturalHeight);
        };
      }).then((width, height) => {
        console.log(width, height);
        return { width, height };
      });
    },
  },
  methods: {
    dragMoveListener(event) {
      // this.$store.commit('moveObject', event);
      this.$store.dispatch("lobbyCommitMutation", {
        mutation: "moveObject",
        params: {
          event,
          scale: this.getTabletopScale(),
        },
      });
    },
    showMenu(type, x, y, id) {
      let offset = document
        .querySelector(".tabletop div[data-id='" + id + "']")
        .getBoundingClientRect();
      // console.log(offset);
      EventBus.$emit("openContextMenu", type, offset.x, offset.y, id);
    },
    cardMiddleClick(e, id) {
      if (e.button === 1) {
        this.$store.dispatch("lobbyCommitMutation", {
          mutation: "rotateCard",
          params: id,
        });
      }
    },
    takeCard(deckId) {
      this.$store.dispatch("lobbyCommitMutation", {
        mutation: "takeCardFromDeckById",
        params: [deckId],
      });
      // this.$store.commit('takeCardFromDeck', [deckId]);
    },
    // rotateCard(cardId){
    //   this.$store.commit('rotateCard', cardId);
    // },
    cardPreviewOpen(id) {
      let url =
        !this.game.objects[id].hand ||
        this.game.objects[id].hand === this.user.uid
          ? this.game.objects[id].url
          : this.game.objects[id].back;
      EventBus.$emit("toggleCardPreview", url);
    },
    tabletopScroll(e) {
      if (this.tabletopCanvas.options.drag.enabled) {
        let target = document.querySelector(".tabletop");

        e.preventDefault();
        let delta = e.ds === undefined ? e.deltaY * -0.001 : e.ds;
        let scale = this.getTabletopScale();
        scale += delta;
        // console.log(scale);
        if (scale > 0.1 && scale < 3) {
          let coords = this.getTabletopCoords();
          target.style.transform = "scale(" + scale + ")";
          target.style.marginLeft = coords.x + delta * 1500 + "px";
          target.style.marginTop = coords.y + delta * 1000 + "px";
        }
      }
    },
    dragTabletop(event) {
      var target = document.querySelector(".tabletop"),
        coords = this.getTabletopCoords(),
        x = coords.x + event.dx,
        y = coords.y + event.dy;
      target.style.marginLeft = x + "px";
      target.style.marginTop = y + "px";
    },
    getTabletopScale() {
      let transform = document.querySelector(".tabletop").style.transform;
      if (transform === "") transform = "scale(1)";
      return parseFloat(transform.match(/[\w.-]+/g)[1]);
    },
    getTabletopCoords() {
      let tabletop = document.querySelector(".tabletop");
      return {
        x: parseInt(tabletop.style.marginLeft.slice(0, -2) || 0),
        y: parseInt(tabletop.style.marginTop.slice(0, -2) || 0),
        rect: tabletop.getBoundingClientRect(),
      };
    },
  },
  mounted() {
    let self = this;

    interact(".draggable").draggable({
      ignoreFrom: ".pinned",
      inertia: {
        resistance: 60,
      },
      restrict: {
        restriction: "parent",
        endOnly: false,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
      },
      autoScroll: true,
      onmove: this.dragMoveListener,
    });

    interact(".deck").dropzone({
      accept: ".card",
      overlap: 0.1, //% of element
      ondragenter: function (event) {
        event.target.classList.add("drop-target");
        event.relatedTarget.classList.add("drop-relatedTarget");
      },
      ondragleave: function (event) {
        event.relatedTarget.classList.remove("drop-relatedTarget");
        event.target.classList.remove("drop-target");
      },
      ondrop: function (event) {
        event.relatedTarget.classList.remove("drop-relatedTarget");
        event.target.classList.remove("drop-target");

        let card = event.relatedTarget.getAttribute("data-id");
        let deck = event.target.getAttribute("data-id");
        // self.$store.commit('moveCardToDeck', [card,deck]);

        self.$store.dispatch("lobbyCommitMutation", {
          mutation: "moveCardToDeck",
          params: [card, deck],
        });
      },
    });

    document
      .querySelector(".tabletop")
      .addEventListener("wheel", this.tabletopScroll);
    this.tabletopCanvas = interact(".tabletop")
      .draggable({
        ignoreFrom: ".draggable",
        autoScroll: false,
        onmove: this.dragTabletop,
      })
      .gesturable({
        onmove: this.tabletopScroll,
      });
  },
};
</script>

<style lang="scss" scoped>
.tabletop {
  width: 3000px;
  height: 2000px;
  box-shadow: 0 0 20px 8px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  user-select: none;
  transform-origin: center center center;
  background-position: center center !important;
  background-size: cover !important;
}
.draggable {
  position: absolute;
  // cursor: move;
}
.pinned {
  z-index: 1 !important;
  cursor: move;
}

.card {
  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 3;
  border-radius: 6px;
  img {
    margin-bottom: -6px;
  }
}
.inhand {
  border: 5px #8bff90 solid;
}

.deck {
  transition: width ease-in-out 0.2s, height ease-in-out 0.2s,
    margin ease-in-out 0.2s;
  box-shadow: 3px 3px 0px 1px rgba(0, 0, 0, 0.7);
  user-select: none;
  display: inline-block;
  // padding: 10px 5px;
  border-radius: 6px;
  background-size: cover;
  overflow: hidden;
  z-index: 2;
  .header {
    text-align: center;
    width: 100%;
    font-weight: bold;
  }
  .header,
  .count {
    border-radius: 6px 6px 0 0;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 10px;
  }

  .wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    user-select: none;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
  }
  img {
    margin-bottom: -6px;
  }
}
.empty_deck {
  height: 160px;
}

.counter {
  user-select: none;
  cursor: move;
  z-index: 4 !important;
}

.drop-target {
  img {
    transition: width ease-in-out 0.2s, height ease-in-out 0.2s,
      margin ease-in-out 0.2s;
    // margin: -3px;
    width: 117px;
  }
}
.drop-relatedTarget {
  transition: opacity ease-in-out 0.2s;
  opacity: 0.6;
}
</style>
