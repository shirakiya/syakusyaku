<template>
  <v-app>
    <nav-header :initial-open="isFirstVisit" />
    <main-content />
    <nav-footer />
  </v-app>
</template>

<script>
import { VApp } from 'vuetify/lib'
import NavHeader from './components/navHeader.vue'
import MainContent from './components/mainContent.vue'
import NavFooter from './components/navFooter.vue'

export default {
  components: {
    MainContent,
    NavHeader,
    NavFooter,
    VApp,
  },
  computed: {
    isFirstVisit() {
      return this.$store.getters.isFirstVisit
    },
  },
}
</script>
