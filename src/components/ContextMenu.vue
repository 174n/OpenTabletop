<template>
  <v-menu
    v-model="show"
    :position-absolutely="true"
    close-on-click
    :position-x="x"
    :position-y="y"
  >
    <v-list>
      <template v-for="item in menu[type]">
        <v-list-item @click.prevent="item.func" :key="item.title">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
import emitter from "../helpers/event-bus.js";

export default {
  data() {
    return {
      show: false,
      x: 0,
      y: 0,
      id: 0,
      type: "deck",
      menu: {
        deck: [
          {
            title: "Take a card",
            func: this.takeCard,
          },
          {
            title: "Take a card to hand",
            func: this.takeCardToHand,
          },
          {
            title: "Show cards",
            func: this.deckListView,
          },
          {
            title: "Reverse deck",
            func: this.reverseDeck,
          },
          {
            title: "Flip deck",
            func: this.flipDeck,
          },
          {
            title: "Shuffle deck",
            func: this.shuffleDeck,
          },
          {
            title: "Remove deck",
            func: this.removeObject,
          },
        ],
        card: [
          {
            title: "Rotate card",
            func: this.rotateCard,
          },
          {
            title: "Move to/from hand",
            func: this.handMoveCard,
          },
          {
            title: "Flip card",
            func: this.flipCard,
          },
          {
            title: "Pin / Unpin",
            func: this.pinCard,
          },
          {
            title: "Change size",
            func: this.changeCardSize,
          },
          {
            title: "Remove card",
            func: this.removeObject,
          },
        ],
        counter: [
          {
            title: "Counter +1",
            func: this.counterInc,
          },
          {
            title: "Counter -1",
            func: this.counterDecr,
          },
          {
            title: "Change color",
            func: this.counterChangeColor,
          },
          {
            title: "Remove counter",
            func: this.removeObject,
          },
        ],
        cardList: [
          {
            title: "View card",
            func: this.viewCard,
          },
          {
            title: "Take card",
            func: this.takeCardToObjects,
          },
        ],
      },
    };
  },
  methods: {
    removeObject() {
      this.$store.commit("removeObject", this.id);
    },
    takeCard(e, hand = false) {
      this.$store.commit("takeCardFromDeck", [this.id, 1, hand]);
    },
    takeCardToHand() {
      this.takeCard(null, true);
    },
    deckListView() {
      emitter.emit("deckViewToggle", this.id);
    },
    rotateCard() {
      this.$store.commit("rotateCard", this.id);
    },
    handMoveCard() {
      this.$store.commit("handMoveCard", this.id);
    },
    pinCard() {
      this.$store.commit("pinCard", this.id);
    },
    flipCard() {
      this.$store.commit("flipCard", this.id);
    },
    changeCardSize() {
      emitter.emit("cardSizeDialogToggle", this.id);
    },
    takeCardToObjects() {
      this.$store.commit("takeCardFromDeckById", {
        deckId: this.params,
        id: this.id,
      });
      emitter.emit("deckViewUpdate");
    },
    viewCard() {
      emitter.emit(
        "toggleCardPreview",
        this.$store.state.lobby.game.objects[this.id].cards[this.params].url
      );
    },
    shuffleDeck() {
      this.$store.commit("shuffleDeck", this.id);
    },
    reverseDeck() {
      this.$store.commit("reverseDeck", this.id);
    },
    flipDeck() {
      this.$store.commit("flipDeck", this.id);
    },
    counterInc() {
      this.$store.commit("counterChangeNumber", [this.id]);
    },
    counterDecr() {
      this.$store.commit("counterChangeNumber", [this.id, -1]);
    },
    counterChangeColor() {
      this.$store.commit("counterChangeColor", this.id);
    },
  },
  created() {
    emitter.on("openContextMenu", ({ type, x, y, id, params }) => {
      if (type?.match(/^card|deck|counter|cardList$/g)) {
        this.type = type;
        this.x = x + 5;
        this.y = y + 5;
        this.id = id;
        this.params = params;
        this.show = true;
      }
    });
  },
};
</script>

<style lang="scss" scoped></style>
