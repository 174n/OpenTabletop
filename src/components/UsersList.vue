<template>
  <v-list>
    <v-subheader>{{ title }}</v-subheader>
    <template v-for="(name, i) in users">
      <v-list-item :key="i">
        <template v-if="!name">
          <v-progress-linear
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </template>
        <template v-else>
          <v-list-item-avatar v-html="avatar(name)" />
          <v-list-item-content>
            <v-list-item-title>{{ name }}</v-list-item-title>
            <v-list-item-subtitle>{{
              randDescription(name)
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
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
          seed: name,
        }
      );
    },
  },
  props: ["users", "title"],
};
</script>
