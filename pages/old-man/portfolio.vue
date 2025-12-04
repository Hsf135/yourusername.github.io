<template>
  <view>
    <u-navbar title="档案信息" placeholder bgColor="transparent">
      <u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
    </u-navbar>
    <view class="unlive-info" v-if="alive === '0'"> 该老人已去世，个人信息不纳入饱和度统计。若需编辑信息，请进入"延伸信息"页面，将"是否健在"改为"是" </view>
    <view class="u-p-l-16 u-p-r-16">
      <view class="u-m-b-4">
        <text class="u-main-color">当前饱和度：</text>
        <text class="u-primary count">{{ info.generalInfoCount || 0 }} %</text>
      </view>
      <view class="u-font-12 u-tips-color">最后更新：{{ info.updaterName }} {{ info.updateTime }}</view>
    </view>

    <view class="base-box u-flex" @click="toPage(`/pages/old-man/base-info?id=${customerId}&alive=${alive}`)">
      <view class="icon u-m-r-12 u-flex u-flex-xy-center" :style="{ background: bgColor.b }">
        <u-icon :name="aIcon('jichuxinxi')" width="24" height="24"></u-icon>
      </view>
      <view class="u-flex-1">
        <view class="u-flex u-flex-between u-m-b-4">
          <text class="title">基础信息</text>
          <view>
            <u--text suffixIcon="arrow-right" size="13" color="#666462" :text="`${infoNum.baseInfoCount || 0}/${infoNum.baseInfoCountSum || 0}`" :iconStyle="iconStyle"></u--text>
          </view>
        </view>
        <view class="u-tips-color u-font-12">包含老人姓名、电话、地址、身份证等信息</view>
      </view>
    </view>

    <view class="base-box u-flex" @click="toPage(`/pages/old-man/demand-info?id=${customerId}&alive=${alive}`)">
      <view class="icon u-m-r-12 u-flex u-flex-xy-center" :style="{ background: bgColor.d }">
        <u-icon :name="aIcon('xuqiuxinxi')" width="24" height="24"></u-icon>
      </view>
      <view class="u-flex-1">
        <view class="u-flex u-flex-between u-m-b-4">
          <text class="title">需求信息</text>
          <view>
            <u--text suffixIcon="arrow-right" size="13" color="#666462" :text="`${infoNum.demandInfoCount || 0}/${infoNum.demandInfoCountSum || 0}`" :iconStyle="iconStyle"></u--text>
          </view>
        </view>
        <view class="u-tips-color u-font-12">包含老人的家政、生活、医疗需求等信息</view>
      </view>
    </view>

    <view class="base-box u-flex" @click="toPage(`/pages/old-man/exten-info?id=${customerId}&alive=${alive}`)">
      <view class="icon u-m-r-12 u-flex u-flex-xy-center" :style="{ background: bgColor.e }">
        <u-icon :name="aIcon('yanshenxinxi')" width="24" height="24"></u-icon>
      </view>
      <view class="u-flex-1">
        <view class="u-flex u-flex-between u-m-b-4">
          <text class="title">延伸信息</text>
          <view>
            <u--text suffixIcon="arrow-right" size="13" color="#666462" :text="`${infoNum.extenInfoCount || 0}/${infoNum.extenInfoCountSum || 0}`" :iconStyle="iconStyle"></u--text>
          </view>
        </view>
        <view class="u-tips-color u-font-12">包含老人分类、老人爱好、政府补助等信息</view>
      </view>
    </view>

    <view class="base-box u-flex" @click="toPage(`/pages/old-man/family?id=${customerId}&alive=${alive}`)">
      <view class="icon u-m-r-12 u-flex u-flex-xy-center" :style="{ background: bgColor.f }">
        <u-icon :name="aIcon('jiatingxinxi')" width="24" height="24"></u-icon>
      </view>
      <view class="u-flex-1">
        <view class="u-flex u-flex-between u-m-b-4">
          <text class="title">家庭信息</text>
          <u-icon name="arrow-right" size="13"></u-icon>
        </view>
        <view class="u-tips-color u-font-12">包含家庭成员的基本信息、关系等信息</view>
      </view>
    </view>

    <view class="base-box u-flex" @click="toPage(`/pages/old-man/health-info?id=${customerId}&alive=${alive}`)">
      <view class="icon u-m-r-12 u-flex u-flex-xy-center" :style="{ background: bgColor.h }">
        <u-icon :name="aIcon('jiankangxinxi')" width="24" height="24"></u-icon>
      </view>
      <view class="u-flex-1">
        <view class="u-flex u-flex-between u-m-b-4">
          <text class="title">健康信息</text>
          <view>
            <u--text suffixIcon="arrow-right" size="13" color="#666462" :text="`${infoNum.healthInfoCount || 0}/${infoNum.healthInfoCountSum || 0}`" :iconStyle="iconStyle"></u--text>
          </view>
        </view>
        <view class="u-tips-color u-font-12">包含身体状况、主要健康问题等信息</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getCustomerArchivesUrl, getCustomerExtendDetailUrl } from '@/api'
export default {
  data() {
    return {
      customerId: undefined,
      bgColor: { b: '#DFEEFF', d: '#FCF0DC', e: '#DEE8F2', f: '#FCDCE2', h: '#DEFFF8' },
      iconStyle: { color: '#666462', fontSize: '12px', marginLeft: '4px' },
      info: {},
      id: '',
      alive: undefined
    }
  },
  computed: {
    infoNum() {
      if (this.isXiaMen) {
        return {
          baseInfoCount: this.info.baseInfoCount,
          baseInfoCountSum: this.info.baseInfoCountSum,
          demandInfoCount: this.info.demandInfoCount,
          demandInfoCountSum: this.info.demandInfoCountSum,
          extenInfoCount: this.info.extenInfoCount,
          extenInfoCountSum: this.info.extenInfoCountSum,
          healthInfoCount: this.info.healthInfoCount,
          healthInfoCountSum: this.info.healthInfoCountSum
        }
      }
      return {
        baseInfoCount: this.info.baseInfoCountNone,
        baseInfoCountSum: this.info.baseInfoCountNoneSum,
        demandInfoCount: this.info.demandInfoCountNone,
        demandInfoCountSum: this.info.demandInfoCountNoneSum,
        extenInfoCount: this.info.extenInfoCountNone,
        extenInfoCountSum: this.info.extenInfoCountNoneSum,
        healthInfoCount: this.info.healthInfoCountNone,
        healthInfoCountSum: this.info.healthInfoCountNoneSum
      }
    }
  },
  onLoad(option) {
    this.customerId = option.id
    this.loadData()
  },
  onShow() {
    this.loadData() // 刷新数据的方法
  },
  methods: {
    async loadData() {
      const { data } = await uni.$u.http.post(`${getCustomerArchivesUrl}?customerId=${this.customerId}`)
      const res = await uni.$u.http.post(`${getCustomerExtendDetailUrl}?customerId=${this.customerId}`)
      this.info = data
      this.alive = res.data.deathFlag
    },
    toPage(url) {
      uni.navigateTo({ url })
    },
    handleBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 32px;
  height: 32px;
  border-radius: 14px;
}

.title {
  color: $u-main-color;
  font-weight: bold;
}

.count {
  font-weight: bold;
}
</style>
