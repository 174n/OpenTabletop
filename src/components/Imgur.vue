<template>
  <div>
    <v-text-field
      label="Imgur album url"
      single-line
      v-model="imgur_url"
      @keyup.enter.prevent="getImgurData"
      @click:append="getImgurData"
      append-icon="send"
    >
    </v-text-field>
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
        step="0.1"
      ></v-slider>
    </template>
  </div>
</template>

<script>
import emitter from "../helpers/event-bus.js";
import config from "../../config.json";

export default {
  data() {
    return {
      imgur_url: "",
      data: {
        custom_size: false,
        real_size: false,
        size: 12,
      },
    };
  },
  methods: {
    imgurImageUrl(id) {
      return "https://i.imgur.com/" + id + ".jpg";
    },
    getImgurData() {
      if (/https:\/\/imgur.com\/a\/[a-zA-z0-9]{5}/g.test(this.imgur_url)) {
        let imgur_id = /https:\/\/imgur.com\/a\/(.*)/g.exec(this.imgur_url)[1];
        this.$http
          .get("https://api.imgur.com/3/album/" + imgur_id, {
            headers: { authorization: config.imgur_client_id },
          })
          .then(
            (response) => {
              let data = JSON.parse(response.bodyText).data;
              let params = {
                urls: [],
                title: data.title,
                x: 10,
                y: 10,
                back: this.imgurImageUrl(data.images[0].id),
                real_size: this.data.real_size || false,
                size: this.data.custom_size ? this.data.size : 12,
              };
              data.images.slice(1).forEach((i) => {
                params.urls.push(this.imgurImageUrl(i.id));
              });
              if (
                params.urls.length > 0 &&
                params.title !== undefined &&
                params.title !== null
              ) {
                this.$store.dispatch("addNewDeckFromData", params);
                this.imgur_url = "";
                this.data = {
                  custom_size: false,
                  real_size: false,
                  size: 12,
                };
              }
            },
            () => {
              emitter.emit("snackbarOpen", "Wrong imgur id", "error");
            }
          );
      } else {
        emitter.emit("snackbarOpen", "Wrong imgur url", "error");
      }
    },
  },
  computed: {},
  created() {},
};
</script>

<style lang="scss" scoped></style>
