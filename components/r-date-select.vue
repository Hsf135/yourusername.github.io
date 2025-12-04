<template>
  <view class="r-date-select u-flex u-flex-1">
    <view class="u-flex u-flex-1" @click="show = true">
      <view v-if="value" class="u-flex-1">{{ value }}</view>
      <view v-else class="placeholder-color u-flex-1">{{ placeholder }}</view>
      <u-icon :name="aIcon('xiala-zuo')" width="24" height="24" key="date-zuo"></u-icon>
    </view>
    <view>
      <u-datetime-picker :show="show" v-model="timestamp" :mode="mode" :minDate="-631152000000" closeOnClickOverlay @confirm="handleSelectTime" @cancel="show = false" @close="show = false"></u-datetime-picker>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    value: { require: true, type: String },
    placeholder: { type: String, default: ' ' },
    // date | datetime | time | year-month，具体看官方文档https://www.uviewui.com/components/datetimePicker.html
    // 本组件暂时只实现date和datetime和year-month三种类型
    mode: { type: String, default: 'date' }
  },
  data() {
    return { show: false }
  },
  computed: {
    timestamp: {
      get() {
        if (!this.value) return Date.now()
        return new Date(this.value.replace(/-/gi, '/')).valueOf()
      },
      set(value) {
        if (this.mode === 'date') {
          this.$emit('input', uni.$u.timeFormat(value, 'yyyy-mm-dd'))
        } else if (this.mode === 'datetime') {
          this.$emit('input', uni.$u.timeFormat(value, 'yyyy-mm-dd hh:MM:ss'))
        } else if (this.mode === 'year-month') {
          this.$emit('input', uni.$u.timeFormat(value, 'yyyy-mm'))
        }
      }
    }
  },
  methods: {
    // value为时间戳
    handleSelectTime({ value }) {
      this.show = false
    }
  }
}
</script>
