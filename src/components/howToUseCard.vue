<template>
  <v-card>
    <v-card-title class="headline primary white--text">
      <span>使い方</span>
      <v-spacer />
      <v-btn
        icon
        color="white"
        @click="closeDialog"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container>
        <p class="font-weight-bold">
          「尺々」はGoogle Mapsに好きな距離の円を置くことができるシンプルな無料Webアプリです。家から会社までの距離を測るときなど、使い方は様々です。
        </p>

        <v-stepper
          v-model="step"
          alt-labels
        >
          <v-stepper-header>
            <v-stepper-step step="1" editable>
              追加ボタン
            </v-stepper-step>

            <v-divider />

            <v-stepper-step step="2" editable>
              マップ上でクリック
            </v-stepper-step>

            <v-divider />

            <v-stepper-step step="3" editable>
              半径の調整
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-content step="1">
            <p>
              まずはじめに「中心地点を追加する」ボタンを選択します。
            </p>

            <div class="d-flex justify-center pb-2">
              <v-img
                alt="how to use 1"
                max-width="400"
                :src="howToUseImg1"
              />
            </div>
            <v-btn
              color="primary"
              @click="step = 2"
            >
              次へ
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <p>
              マップの上をクリックし、マップ上に描く円の中心地点を決定します。
            </p>
            <div class="d-flex justify-center pb-2">
              <v-img
                alt="how to use 2"
                max-width="400"
                :src="howToUseImg2"
              />
            </div>
            <v-btn
              color="primary"
              @click="step = 3"
            >
              次へ
            </v-btn>
            <v-btn text @click="step = 1">
              戻る
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <p>
              円の半径をお好きな距離に調整します。単位がメートルであることにご注意ください。<br>
              また、これまでと同じ操作を行うことで複数の円を描くことができます。
            </p>
            <div class="d-flex justify-center pb-2">
              <v-img
                alt="how to use 3"
                max-width="400"
                :src="howToUseImg3"
              />
            </div>
            <v-btn
              color="primary"
              @click="closeDialog"
            >
              閉じる
            </v-btn>
            <v-btn
              text
              @click="step = 2"
            >
              戻る
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import howToUseImg1 from '../assets/how-to-use-1.png'
import howToUseImg2 from '../assets/how-to-use-2.png'
import howToUseImg3 from '../assets/how-to-use-3.png'

export default {
  props: {
    initialStep: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      step: this.initialStep,
      howToUseImg1: howToUseImg1,
      howToUseImg2: howToUseImg2,
      howToUseImg3: howToUseImg3,
    }
  },
  mounted() {
    this.$store.dispatch('visited')
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
  },
}
</script>
