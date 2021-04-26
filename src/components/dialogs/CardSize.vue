<template>
  <v-layout row justify-center style="position: relative">
    <v-dialog v-model="open" absolute width="500px">
      <v-card>
        <v-card-title>
          <div class="headline">Card size</div>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex sm6 xs12>
              <v-switch
                label="Custom size in %"
                v-model="data.custom_size"
                color="blue"
              ></v-switch>
            </v-flex>
            <v-flex sm6 xs12>
              <v-switch
                label="Real size"
                v-model="data.real_size"
                color="blue"
              ></v-switch>
            </v-flex>
          </v-layout>
          <template v-if="data.custom_size">
            <v-slider
              label="Size"
              v-model="data.size"
              thumb-label
              step="0"
            ></v-slider>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click.native="changeSize"
            >Change</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { EventBus } from "../../helpers/event-bus.js";

export default {
  data() {
    return {
      open: false,
      data: {
        id: false,
        custom_size: false,
        real_size: false,
        size: 12,
      },
    };
  },
  computed: {
    objects() {
      return this.$store.state.game.objects;
    },
  },
  created() {
    EventBus.$on("cardSizeDialogToggle", (id) => {
      this.open = !this.open;
      this.data = { custom_size: false, real_size: false, size: 12 };
      this.data.id = id;
      let object = this.objects[id];
      this.data.custom_size =
        object.size === 12 || object.size === undefined ? false : true;
      this.data.size = object.size || 12;
      this.data.real_size = object.real_size || false;
    });
  },
  methods: {
    changeSize() {
      this.open = false;
      this.$store.commit("cardSizeChange", this.data);
    },
  },
};
</script>

<style lang="scss" scoped></style>
