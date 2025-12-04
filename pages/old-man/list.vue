<template>
  <view class="full-height">
    <z-paging-swiper bg-color="#fff">
      <view slot="top">
        <view class="top">
          <u-navbar title="老人列表" placeholder bgColor="transparent">
            <u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
            <view slot="right" class="u-flex">
              <u-icon :name="aIcon('shaixuan')" width="24" height="24" class="u-m-r-12" @click="handleFilter"></u-icon>
              <u-icon :name="aIcon('add')" width="24" height="24" @click="handleAdd"></u-icon>
            </view>
          </u-navbar>
          <u-tabs ref="tabs" :list="tabs" :current="current" :scrollable="false" :activeStyle="activeStyle" lineColor="#FF9500" @change="change"> </u-tabs>
          <view class="box">
            <view class="search u-flex" @click="toSearchResult">
              <u-search searchIcon=" " disabled bgColor="#FAF9F7" placeholder="搜索姓名/电话/身份证/备注" :showAction="false" @click.native="toSearchResult"></u-search>
              <u-icon :name="aIcon('search')" width="24" height="24"></u-icon>
            </view>
            <view class="header u-p-l-5 u-flex">
              <view class="u-flex-1 cell">基础信息</view>
              <view class="u-flex-1 cell">身份信息</view>
              <view class="u-flex-1 cell">现居地址+备注</view>
            </view>
          </view>
        </view>
      </view>
      <swiper class="full-height" :current="swiperCurrent" @animationfinish="animationfinish">
        <swiper-item>
          <Collect ref="collect" :tabIndex="0" :currentIndex="swiperCurrent" :from="from" />
        </swiper-item>
        <swiper-item>
          <All ref="all" :tabIndex="1" :currentIndex="swiperCurrent" :from="from" />
        </swiper-item>
      </swiper>
    </z-paging-swiper>
    <Create ref="createRef" />
  </view>
</template>

<script>
import Collect from './components/Collect'
import All from './components/All'
import Create from './components/Create.vue'

export default {
  onLoad({ from }) {
    if (from) {
      this.from = from
    }
  },
  components: { Collect, All, Create },
  data() {
    return {
      from: '', // 来自于哪个页面
      current: 0,
      swiperCurrent: 0,
      tabs: [{ name: '已收藏老人' }, { name: '所有老人' }],
      activeStyle: { color: '#FF9500', fontWeight: 'bold', transform: 'scale(1.1)' }
    }
  },
  methods: {
    change({ index }) {
      this.swiperCurrent = index
    },
    animationfinish({ detail: { current } }) {
      this.swiperCurrent = current
      this.current = current
    },
    handleFilter() {
      uni.navigateTo({ url: this.from ? '/pages/old-man/data-filter?from=visiting-data-filter' : '/pages/old-man/data-filter' })
    },
    handleAdd() {
      if (!this.isSingleProject) {
        uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行新增', icon: 'none' })
        return
      }
      if (this.from) {
        this.$refs.createRef.open()
      } else {
        this.toPage('/pages/old-man/add')
      }
    },
    toSearchResult() {
      uni.navigateTo({ url: this.from ? '/pages/old-man/search-result?from=visiting-search-result' : '/pages/old-man/search-result' })
    }
  },
  onShow() {
    !this.current && this.$refs.collect && this.$refs.collect.reload()
  }
}
</script>

<style lang="scss" scoped>
.top {
  background: #fff9f0;
}

.box {
  margin-top: 8px;
  padding: 12px 16px 0;
  background: #fff;
}

.search {
  margin-bottom: 12px;
  padding: 0 12px;
  background: #faf9f7;
  border-radius: 8px;
}

.header {
  color: $u-main-color;
  font-size: 14px;
  background: #fff9f0;
  border-radius: 8px 8px 0 0;
  border: 1px solid #f5f3f0;
  border-bottom: 0;
}

.cell {
  padding: 10px 5px;
}
</style>
