<template>
  <transition name="fade">
    <div class="cardDialog" v-if="isOpen" @click.stop="close">
      <div class="wrapper">
        <img
          :src="url"
          alt="Card preview"
          class="cardPreview"
          @click.stop="rotate"
          :style="{
            transform: 'rotate(' + rotation + 'deg)',
            width: zoom + 'px',
          }"
        />
      </div>
      <div class="zoom">
        <div class="minus" @click.stop="onZoom(false)">
          <v-icon dark>zoom_out</v-icon>
        </div>
        <div class="plus" @click.stop="onZoom(true)">
          <v-icon dark>zoom_in</v-icon>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { EventBus } from "../../helpers/event-bus.js";

export default {
  data() {
    return {
      isOpen: false,
      url: "",
      rotation: 0,
      zoom: 223,
    };
  },
  created() {
    EventBus.$on("toggleCardPreview", (url) => {
      this.url = url;
      // this.rotation = 0;
      // this.zoom = 223;
      this.isOpen = !this.isOpen;
    });
  },
  methods: {
    rotate() {
      this.rotation = this.rotation < 360 ? this.rotation + 90 : 90;
    },
    onZoom(e) {
      this.zoom += e ? 100 : -100;
    },
    close(e) {
      if (e.target.className === "cardDialog") {
        this.isOpen = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cardDialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: default;
}
.cardPreview {
  user-select: none;
  cursor: crosshair;
}
.zoom {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .plus,
  .minus {
    padding: 10px;
    flex-grow: 1;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
