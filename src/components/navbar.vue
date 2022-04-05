<template>
  <v-app-bar
    class
    color="white"
    fixed
    dark
    app
  >
    <!-- dummy for spacing -->
    <v-btn
      text
      disabled
    />
    <v-spacer />
    <v-app-bar-nav-icon>
      <a href="/">
        <v-img
          alt="brand logo"
          max-height="40"
          max-width="40"
          :src="logoImg"
        />
      </a>
    </v-app-bar-nav-icon>
    <v-app-bar-title>
      <span class="indigo--text font-weight-bold">尺々</span>
    </v-app-bar-title>
    <v-spacer />
    <v-btn
      text
      color="primary"
      @click="openHowToUse"
    >
      使い方
    </v-btn>
    <v-dialog
      v-model="isOpen"
      max-width="640"
    >
      <how-to-use-card @close="closeHowToUse" />
    </v-dialog>
  </v-app-bar>
</template>

<script>
import howToUseCard from './howToUseCard.vue'
import logoImg from '../assets/logo.png'

export default {
  components: {
    howToUseCard,
  },
  props: {
    initialOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      logoImg: logoImg,
      isOpen: this.initialOpen,
    }
  },
  methods: {
    openHowToUse() {
      this.isOpen = true
    },
    closeHowToUse() {
      this.isOpen = false
    },
  },
}
</script>
