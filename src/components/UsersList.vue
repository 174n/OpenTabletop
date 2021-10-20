<template>
  <v-list>
    <v-subheader>{{ title }}</v-subheader>
    <template v-for="(name, i) in users">
      <v-skeleton-loader
        :key="i"
        type="list-item-avatar-two-line"
        v-if="!name"
      />
      <v-list-item :key="i" v-else>
        <v-list-item-avatar v-html="avatar(name)" />
        <v-list-item-content>
          <v-list-item-title>{{ name }}</v-list-item-title>
          <v-list-item-subtitle>{{
            i === 0 ? "That's you" : randDescription(name)
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>
<script>
import { setTemplates, sentence } from "txtgen";
import { createAvatar } from "@dicebear/avatars";
import * as maleStyle from "@dicebear/avatars-male-sprites";
import * as femaleStyle from "@dicebear/avatars-female-sprites";

export default {
  methods: {
    randDescription() {
      let templates = ["very {{adjective}} and {{adjective}}"];
      setTemplates(templates);
      return sentence();
    },
    avatar(name) {
      return createAvatar(
        name && name.match(/(a|а)$/g) ? femaleStyle : maleStyle,
        {
          seed: name
        }
      );
    }
  },
  props: ["users", "title"]
};
</script>
