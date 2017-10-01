<template>
  <v-app>
    <v-toolbar class="red" dark fixed>
      <v-toolbar-title>OpenTabletop</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid>
        <v-card class="blue-grey darken-2 white--text">
          <v-card-title primary-title>
            <div>
              <div class="headline">Create a new lobby</div>
              <span class="grey--text">Click the button below to create a new lobby</span>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat dark to="lobby">Create lobby</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
</style>