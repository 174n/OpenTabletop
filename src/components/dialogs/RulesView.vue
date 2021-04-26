<template>
  <v-dialog v-model="isOpen" fullscreen transition="dialog-bottom-transition">
    <v-card v-if="rules || false">
      <v-toolbar dark class="red">
        <v-btn icon @click.native="isOpen = false" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Game rules</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-btn dark icon flat @click.native="pageSwitch()"><v-icon>navigate_before</v-icon></v-btn>
              {{page}} / {{pages}}
              <v-btn dark icon flat @click.native="pageSwitch(true)"><v-icon>navigate_next</v-icon></v-btn> -->
      </v-toolbar>
      <div class="progress" v-if="loading !== 100">
        <v-progress-circular
          :size="100"
          :width="15"
          :rotate="360"
          :value="loading"
          color="red"
        ></v-progress-circular>
      </div>
      <pdf
        style="display: none"
        v-if="rules || false"
        :src="'https://cors-anywhere.herokuapp.com/' + rules"
        @num-pages="pages = new Array($event)"
      />
      <pdf
        v-for="(page, index) in pages"
        :key="index"
        :src="'https://cors-anywhere.herokuapp.com/' + rules"
        :page="index + 1"
        @progress="progress"
        @error="error"
        class="contract-container"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from "../../helpers/event-bus.js";
import pdf from "vue-pdf";

export default {
  components: {
    pdf,
  },
  data() {
    return {
      isOpen: false,
      url: "",
      page: 1,
      pages: [],
      rules: false,
      loading: 0,
    };
  },
  created() {
    EventBus.$on("toggleRules", (url) => {
      this.isOpen = !this.isOpen;
      this.pages = [];
      this.rules = false;
      this.rules = url;
    });
  },
  computed: {},
  methods: {
    progress(status) {
      this.loading = status * 100;
    },
    error() {
      EventBus.$emit("snackbarOpen", "Error while loading game rules", "error");
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  z-index: 999;
}
.progress {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
