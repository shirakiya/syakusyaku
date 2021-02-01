<template>
  <v-app-bar class color="white" absolute dark app>
    <v-spacer />
    <v-app-bar-nav-icon>
      <a href="/">
        <v-img
          src="/static/logo.png"
          alt="brand logo"
          max-height="40"
          max-width="40"
        />
      </a>
    </v-app-bar-nav-icon>
    <v-app-bar-title>
      <span class="indigo--text font-weight-bold">尺々</span>
    </v-app-bar-title>
    <v-spacer />
    <v-btn text color="primary" @click="openHowToUse">
      使い方
    </v-btn>
    <v-dialog
      v-model="isOpen"
      max-width="640"
    >
      <v-card>
        <v-card-title class="headline primary white--text">
          使い方
        </v-card-title>
        <v-card-text>
          <v-container>
            <p class="font-weight-bold">
              「尺々」はGoogle Mapsに好きな距離の円を置くことができるシンプルな無料Webアプリです。家から会社までの距離を測るときなど、使い方は様々です。
            </p>
            <!-- TODO: 使い方の紹介 -->
            <v-divider />
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    openHowToUse() {
      this.isOpen = true
    },
  },
}
</script>
