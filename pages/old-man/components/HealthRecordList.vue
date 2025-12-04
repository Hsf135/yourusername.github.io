<template>
  <view class="full-page">
    <z-paging ref="paging" v-model="list" @query="loadData" :fixed="true" :auto="false" bg-color="#fff" empty-view-img="/static/imgs/common/empty.png" :emptyViewText="emptyText">
      <view class="box">
        <view class="list">
          <view class="header u-p-l-5 u-flex">
            <view class="u-flex-2 cell">时间</view>
            <view class="u-flex-1 cell">血压</view>
            <view class="u-flex-1 cell">心率</view>
            <view class="u-flex-2 cell">状态</view>
          </view>
          <view v-for="l in list" :key="l.id" class="u-p-l-5 u-flex u-border-bottom">
            <view class="u-flex-2 cell">
              <view class="u-font-12 u-content-color u-line-1">{{ formatTime(l.measureTime) }}</view>
            </view>
            <view class="u-flex-1 cell">
              <view class="u-font-12 u-content-color u-line-1">{{ l.highBlood }}/{{ l.lowBlood }}</view>
            </view>
            <view class="u-flex-1 cell">
              <view class="u-font-12 u-content-color u-line-1">{{ l.heartRate }}</view>
            </view>
            <view class="u-flex-2 cell status">
              <u--text size="12" :color="l.bloodPressure === '2' ? '#666462' : '#e96848'" :text="radioDict(l.bloodPressure, 'blood_pressure_situation')"></u--text>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script>
import { getCustomerBpDataUrl } from '@/api'

export default {
  props: {
    customerId: {
      type: String,
      default: undefined
    },
    dateRange: {
      type: String,
      default: 'week'
    },
    tabIndex: {
      type: Number,
      default: 0
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      today: new Date(),
      current: 0,
      firstLoaded: false,
      list: [],
      emptyText: '暂无健康信息~',
      form: {
        customerId: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      params: {
        tab: 0,
        page: 1
      }
    }
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        if (newVal === this.tabIndex) {
          //懒加载，当滑动到当前的item时，才去加载
          if (!this.firstLoaded) {
            setTimeout(() => {
              this.$refs.paging.reload()
            }, 5)
          }
        }
      },
      immediate: true
    }
  },
  computed: {
    thisWeekRange() {
      const today = this.today
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)))
      const lastDayOfWeek = new Date(firstDayOfWeek.getTime())
      lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6)

      return [`${this.formatDate(firstDayOfWeek)}`, `${this.formatDate(lastDayOfWeek)}`]
    },
    thisMonthRange() {
      const year = this.today.getFullYear()
      const month = this.today.getMonth()
      const firstDayOfMonth = new Date(year, month, 1)
      const lastDayOfMonth = new Date(year, month + 1, 0)

      return [`${this.formatDate(firstDayOfMonth)}`, `${this.formatDate(lastDayOfMonth)}`]
    }
  },
  methods: {
    async loadData(current) {
      this.params.page = current
      if (this.dateRange === 'week') {
        const dateRange = this.thisWeekRange
        this.form.beginTime = dateRange[0]
        this.form.endTime = dateRange[1]
      }
      if (this.dateRange === 'month') {
        const dateRange = this.thisMonthRange
        this.form.beginTime = dateRange[0]
        this.form.endTime = dateRange[1]
      }
      this.form.customerId = this.customerId
      const { data } = await uni.$u.http.post(getCustomerBpDataUrl, { ...this.form })
      this.$refs.paging.complete(data.list)
      this.firstLoaded = true
    },
    change(index) {
      this.current = index
      this.$refs.paging.reload()
    },
    findDict(key, dict) {
      return this.aDict(dict).find(item => key === item.value)?.label
    },
    formatDate(date) {
      const day = ('0' + date.getDate()).slice(-2)
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const year = date.getFullYear()
      return `${year}-${month}-${day}`
    },
    formatTime(time) {
      const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let week = new Date(time).getDay()

      let hour = time.slice(11, 16)
      return `${weekMap[week]} ${hour}`
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px 8px 0 0;
}

.list {
  overflow: hidden;
  color: $u-main-color;
  font-size: 12px;
  border-radius: 8px;
  border: 1rpx solid #f5f3f0;
}

.header {
  color: $u-main-color;
  font-size: 14px;
  background: #fff9f0;
}

.cell {
  padding: 10px 5px;
}
</style>
