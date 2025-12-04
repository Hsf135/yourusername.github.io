<template>
  <view>
    <view class="u-m-t-24"> </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loginStyle: { borderRadius: '8px' },
      password: true,
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.$u.vuex('vuex_token', '')
      this.$u.vuex('vuex_user', {})
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }
}
</script>

<style lang="scss" scoped></style>
