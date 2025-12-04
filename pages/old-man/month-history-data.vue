<template>
  <view>
    <u-navbar :title="title" placeholder bgColor="transparent">
      <u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
    </u-navbar>
    <view class="box">
      <view class="list">
        <view class="header u-p-l-5 u-flex">
          <view class="u-flex-2 cell">时间</view>
          <view class="u-flex-1 cell">血压</view>
          <view class="u-flex-1 cell">心率</view>
          <view class="u-flex-2 cell">状态</view>
        </view>
        <template v-if="list.length">
          <view v-for="l in list" :key="l.id" class="u-p-l-5 u-flex row-item">
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
        </template>
      </view>
      <view v-if="list.length" class="u-text-center tip">已加载全部内容~</view>
      <view v-else class="u-flex-y u-flex-middle u-p-t-85">
        <u-icon name="/static/imgs/common/empty.png" width="142" height="120"></u-icon>
      </view>
    </view>
  </view>
</template>
<script>
import { getCustomerBpDataListUrl } from '@/api'
export default {
  data() {
    return {
      list: [],
      search: {
        customerId: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      today: new Date()
    }
  },
  onLoad(option) {
    this.title = option.title
    this.search.customerId = option.id
    this.search.beginTime = this.thisMonthRange[0]
    this.search.endTime = this.thisMonthRange[1]
    this.loadData()
  },
  computed: {
    thisMonthRange() {
      const date = new Date(this.title.replace('年', '-').replace('月', ''))
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDayOfMonth = new Date(year, month, 1)
      const lastDayOfMonth = new Date(year, month + 1, 0)
      return [`${this.formatDate(firstDayOfMonth)}`, `${this.formatDate(lastDayOfMonth)}`]
    }
  },
  methods: {
    handleBack() {
      uni.navigateBack()
    },
    async loadData() {
      const { data } = await uni.$u.http.post(getCustomerBpDataListUrl, this.search)
      // this.list = []
      this.list = data
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
  height: calc(100vh - 136rpx);
  overflow: scroll;
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
.row-item {
  border-bottom: 0.5px solid $u-border-color !important;
  &:last-child {
    border-bottom: 0px !important;
  }
}
.cell {
  padding: 10px 5px;
}
.tip {
  color: #999693;
  font-size: 24rpx;
  margin-top: 32rpx;
}
</style>
