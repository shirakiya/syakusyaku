<template>
  <v-footer
    color="primary white--text"
    padless
    app
  >
    <v-col
      class="text-center"
      cols="12"
    >
      <a
        class="white--text"
        @click="openTerms"
        >利用規約</a
      >
      &copy;2021- created by
      <a
        href="https://twitter.com/shirakiya831"
        target="_blank"
        rel="noopener"
      >
        <strong class="white--text">@shirakiya</strong>
      </a>
    </v-col>
    <v-dialog
      v-model="isOpen"
      max-width="640"
    >
      <v-card>
        <v-card-title class="headline primary white--text">
          <span>利用規約</span>
          <v-spacer />
          <v-btn
            icon
            color="white"
            @click="closeTerms"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <h2>1. サイト運営者</h2>
            <p>
              当サイトは、<a href="https://twitter.com/shirakiya831"
                >shirakiya</a
              >が運営しています。お問い合わせがある場合にはTwitterにてMentionあるいはDMでのご連絡をお願いします。
            </p>
            <h2>2. サイト利用規約適用の範囲</h2>
            <p>
              本規約は、利用者による当サイトの利用全てに適用されます。利用者が当サイトを利用するには、本規約を遵守して頂くものとします。
            </p>
            <h2>3. 免責事項</h2>
            <p>
              当サイトにコンテンツを掲載するにあたって、その内容、機能等について細心の注意を払っておりますが、コンテンツの内容が正確であるかどうか、最新のものであるかどうか、安全なものであるか等について保証をするものではなく、何らの責任を負うものではありません。また、事前に通知することなく当サイトに掲載した情報の訂正、修正、追加、中断、削除等をいつでも行うことができるものとします。<br />
              また、当サイト、またはコンテンツのご利用により、万一、ご利用者様に何らかの不都合や損害が発生したとしても、当方は何らの責任を負うものではありません。
            </p>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    openTerms() {
      this.isOpen = true
    },
    closeTerms() {
      this.isOpen = false
    },
  },
}
</script>
