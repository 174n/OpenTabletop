import adapter from "webrtc-adapter";
console.log(adapter);

import Vue from "vue";
import App from "./App.vue";

import VueRouter from "vue-router";
import VueTimeago from "vue-timeago";

import VueResource from "vue-resource";
import AsyncMethods from "vue-async-methods";

import store from "./store";

import Routes from "./routes";
import vuetify from "./plugins/vuetify";

const router = new VueRouter({
  routes: Routes,
});

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueTimeago, {
  name: "timeago",
  locale: "en-US",
});
Vue.use(AsyncMethods, {
  createComputed: true,
});

new Vue({
  el: "#app",
  router: router,
  store,
  vuetify,
  render: (h) => h(App),
});
