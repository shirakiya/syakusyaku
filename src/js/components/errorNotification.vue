<template>
  <v-snackbar
    v-model="error"
    color="error"
    multi-line
    right
    top
  >
    エラーが起きました。<br>
    もう一度やり直す、またはしばらく時間を置いてから再度お試しください。
  </v-snackbar>
</template>

<script>
export default {
  props: {
    error: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
