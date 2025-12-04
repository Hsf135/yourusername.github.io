<template>
  <view class="full-height">
    <z-paging-swiper bg-color="#fff">
      <view slot="top">
        <u-navbar title="健康数据" placeholder bgColor="transparent">
          <u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
        </u-navbar>
        <u-tabs ref="tabs" :list="tabs" :current="current" :scrollable="false" :activeStyle="activeStyle" lineColor="#FF9500" @change="change"> </u-tabs>
      </view>
      <swiper class="full-height" :current="swiperCurrent" @animationfinish="animationfinish">
        <swiper-item>
          <HealthRecordList dateRange="week" :customerId="customerId" :tabIndex="0" :currentIndex="swiperCurrent" />
        </swiper-item>
        <swiper-item>
          <HealthRecordList dateRange="month" :customerId="customerId" :tabIndex="1" :currentIndex="swiperCurrent" />
        </swiper-item>
        <swiper-item>
          <!-- <HealthRecordList dateRange="history" :customerId="customerId" :tabIndex="2" :currentIndex="swiperCurrent" /> -->
          <HistoryDataList :customerId="customerId" :tabIndex="2" :currentIndex="swiperCurrent" />
        </swiper-item>
      </swiper>
    </z-paging-swiper>
  </view>
</template>

<script>
import HealthRecordList from './components/HealthRecordList.vue'
import HistoryDataList from './components/HistoryDataList.vue'
export default {
  components: {
    HealthRecordList,
    HistoryDataList
  },
  data() {
    return {
      customerId: undefined,
      current: 0,
      swiperCurrent: 0,
      tabs: [
        {
          name: '本周数据'
        },
        {
          name: '本月数据'
        },
        {
          name: '历史数据'
        }
      ],
      activeStyle: {
        color: '#FF9500',
        fontWeight: 'bold',
        transform: 'scale(1.1)'
      }
    }
  },
  onLoad(option) {
    this.customerId = option.id
  },
  methods: {
    change({ index }) {
      this.swiperCurrent = index
    },
    animationfinish({ detail: { current } }) {
      this.swiperCurrent = current
      this.current = current
    },
    handleBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style></style>
