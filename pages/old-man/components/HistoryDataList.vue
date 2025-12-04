<template>
  <view class="history-data-page-wrapper">
    <u-collapse :border="false">
      <u-collapse-item v-for="(item, index) in list" :key="index" :title="item.measureYear" :name="item.measureYear" :border="false">
        <view class="u-flex u-flex-between data-item-content" v-for="(i, ind) in item.list" :key="ind" @click="turnToPage(i)">
          <text>{{ i.measureYearAndMonth }}</text>
          <u-icon name="arrow-right" width="12" height="12"></u-icon>
        </view>
      </u-collapse-item>
    </u-collapse>
  </view>
</template>
<script>
import { bpDataHistoryDateUrl } from '@/api'
export default {
  props: {
    customerId: {
      type: String,
      default: undefined
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
      firstLoaded: false,
      list: [],
      emptyText: '暂无健康信息~'
    }
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        if (newVal === this.tabIndex) {
          //懒加载，当滑动到当前的item时，才去加载
          if (!this.firstLoaded) {
            setTimeout(() => {
              this.loadData(this.customerId)
            }, 5)
          }
        }
      },
      immediate: true
    }
  },
  onLoad() {
    this.loadData(this.customerId)
  },
  methods: {
    async loadData(customerId) {
      const { data } = await uni.$u.http.post(bpDataHistoryDateUrl, { customerId })
      data.push({
        measureYear: '2023年',
        list: [
          {
            customerId: null,
            id: null,
            measureYear: '2023年',
            measureYearAndMonth: '2023年10月'
          },
          {
            customerId: null,
            id: null,
            measureYear: '2023年',
            measureYearAndMonth: '2024年9月'
          }
        ]
      })
      this.list = data
      this.firstLoaded = true
    },
    turnToPage(item) {
      uni.navigateTo({ url: `/pages/old-man/month-history-data?id=${this.customerId}&title=${item.measureYearAndMonth}` })
    }
  }
}
</script>
<style lang="scss" scoped>
.history-data-page-wrapper {
  padding: 24rpx 32rpx;
  background-color: #fff;
  border-top-left-radius: 16rpx;
  border-top-right-radius: 16rpx;
  height: calc(100vh - 176rpx);
  overflow: scroll;
}

.data-item-content {
  margin-top: 24rpx;
  &:last-child {
    margin-bottom: 24rpx;
  }
}
/deep/.u-cell__title-text {
  font-weight: 500;
}
/deep/.u-icon__icon--info {
  color: #333231;
}
/deep/.u-collapse-item {
  margin-bottom: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  &:last-child {
    margin-bottom: 0;
  }
  .u-cell {
    background-color: #faf9f7;
    .u-cell__body {
      padding: 12rpx 24rpx;
    }
  }
}
/deep/.u-collapse-item__content {
  background-color: #faf9f7;
  height: auto;
}
/deep/.u-collapse-item__content__text.content-class {
  padding: 0;
  margin: 0 24rpx;
  border-top: 2rpx solid #ebe9e6;
}
</style>
