<template>
  <v-app-bar color="white" absolute dark app>
    <div class="logo">
      <a href="/">
        <v-img
          src="/static/logo.png"
          alt="brand logo"
        />
      </a>
    </div>
    <v-toolbar-title>
      <span class="indigo--text text--darken-4 font-weight-black">尺々</span>
      <span class="indigo--text text--darken-4 font-weight-light subheading">- 地図から直線距離を見る -</span>
    </v-toolbar-title>
    <v-spacer />
  </v-app-bar>
</template>

<script>
export default {}
</script>

<style lang='sass' scoped>
.nav-title
  color: white

.logo
  width: 40px
</style>
