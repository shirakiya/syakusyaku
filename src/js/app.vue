<template>
  <v-app>
    <navbar />
    <main-content />
    <nav-footer />
  </v-app>
</template>

<script>
import { VApp } from 'vuetify/lib'
import MainContent from './components/mainContent.vue'
import Navbar from './components/navbar.vue'
import NavFooter from './components/navFooter.vue'

export default {
  components: {
    NavFooter,
    MainContent,
    Navbar,
    VApp,
  },
}
</script>
