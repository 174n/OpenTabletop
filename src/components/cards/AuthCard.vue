<template>
  <v-card>
    <v-card-title primary-title> Authorization </v-card-title>
    <v-card-subtitle> Choose your nickname </v-card-subtitle>
    <v-card-text>
      <v-text-field
        v-model="nickname"
        :rules="rules"
        counter="25"
        maxlength="25"
        label="Nickname"
        @keyup.enter.prevent="auth"
        autocomplete="off"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue" right text @click="auth">
        Start using OpenTabletop
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      nickname: "",
      rules: [(v) => v.length <= 25 || "Max 25 characters"]
    };
  },
  computed: {
    redirect() {
      return this.$store.state.redirect;
    }
  },
  methods: {
    auth() {
      this.$store.commit("setNickname", this.nickname);
      if (this.redirect) {
        this.$router.push(this.redirect);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
