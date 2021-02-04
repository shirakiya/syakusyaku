<template>
  <v-app>
    <navbar />
    <main-content />
    <nav-footer />
  </v-app>
</template>

<script>
import { VApp } from 'vuetify/lib'
import Navbar from './components/navbar.vue'
import MainContent from './components/mainContent.vue'
import NavFooter from './components/navFooter.vue'

export default {
  components: {
    MainContent,
    Navbar,
    NavFooter,
    VApp,
  },
}
</script>
