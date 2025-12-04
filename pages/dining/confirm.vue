<template>
  <view>
    <u-navbar title="确认选择老人" placeholder bgColor="#faf9f7">
      <u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
    </u-navbar>
    <view class="card">
      <view class="u-flex u-flex-between" @click="toPage(`/pages/order/components/object-detail?id=${detail.memberId}`)">
        <view class="u-flex">
          <image src="../../static/imgs/logo.png" class="avatar"></image>
          <view class="u-m-l-12">
            <view class="u-font-16 u-m-b-4 u-bold u-main-color">{{ detail.memberName }}</view>
            <view class="u-tips-color">{{ info }}</view>
          </view>
        </view>
        <u-icon name="arrow-right"></u-icon>
      </view>
      <view class="u-content-color u-m-t-12 u-m-b-10">身份证号: {{ detail.idCard }}</view>
      <view class="u-content-color u-line-1">联系电话: {{ phoneEncrypted(detail.mobilePhone) }}</view>
    </view>
    <view class="subsidy-box" v-if="detail.subsidyCard && subsidyList.length">
      <view class="u-flex u-p-10 title-box">
        <view class="title">已绑卡</view>
        <view class="card-no">{{ detail.subsidyCard }}</view>
        <text class="iconfont icon-a-mingchengfuzhi" @click="handleCopy"></text>
      </view>
      <view class="subsidy-card">
        <view class="subsidy-item u-flex" v-for="(item, index) in subsidyList" :key="item.subsidyInfoId">
          <view class="left">
            <view class="u-font-12" :class="{ 'u-tips-color': item.usingStatus === '3' }">可用余额</view>
            <view class="price u-error" :class="{ 'u-tips-color': item.usingStatus === '3' }">{{ item.balance }}</view>
          </view>
          <view class="right u-flex u-flex-between">
            <view class="right-left">
              <view class="u-main-color u-line-1">{{ item.name }}</view>
              <view class="u-font-12 u-tips-color">补贴 {{ item.sortKey }}</view>
            </view>
            <view class="status" :class="`status${item.usingStatus}`">{{ radioDict(item.usingStatus, 'subsidy_using_status') }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="empty-box" v-else>
      <image src="../../static/imgs/common/no-money.png" class="empty-img"></image>
      <view class="u-m-t-20 u-tips-color">老人当前没有补贴信息</view>
    </view>
    <view class="fixed-footer">
      <u-button type="primary" @click="handleConfirm">确认选择</u-button>
    </view>
  </view>
</template>

<script>
import { oldManDetailUrl, subsidyUrl } from '@/api/dining.js'
	import { phoneEncrypted } from '@/utils'

export default {
  onLoad({ id }) {
    this.loadData(id)
    this.loadSubsidyList(id)
  },
  data() {
    return {
			phoneEncrypted,
      detail: {
        age: '',
        idCard: '',
        memberId: '',
        memberName: '',
        mobilePhone: '',
        sex: '',
        subsidyCard: '',
        subsidyCardId: ''
      },
      subsidyList: [] // { balance=余额, name=补贴名称, subsidyCustomerId=补贴客户表id subsidyInfoId=补贴id, usingStatus=使用状态,1=未使用 2=使用中 3=停止使用 }[]
    }
  },
  computed: {
    info() {
      const sex = this.detail.sex === '1' ? '男' : this.detail.sex === '2' ? '女' : ''
      const age = this.detail.age
      if (sex && age) return `${sex} | ${age}岁`
      if (sex) return sex
      if (age) return `${age}岁`
      return ''
    }
  },
  methods: {
    async loadData(id) {
      const { data } = await uni.$u.http.post(`${oldManDetailUrl}?id=${id}`)
      this.detail = data
    },
    // 获取补贴列表
    async loadSubsidyList(id) {
      const date = new Date()
      let month = (date.getMonth() + 1).toString()
      month = month.padStart(2, '0')
      const { data } = await uni.$u.http.post(subsidyUrl, {
        customerId: id,
        serveTime: `${date.getFullYear()}-${month}`
      })
      this.subsidyList = data
    },
    handleConfirm() {
      const date = new Date()
      let month = (date.getMonth() + 1).toString()
      month = month.padStart(2, '0')
      this.$u.vuex('vuex_zhucanInfo', {
        // 接口所需字段
        customerName: this.detail.memberName,
        customerPhone: this.detail.mobilePhone,
        memberId: this.detail.memberId,
        month: `${date.getFullYear()}-${month}`,
        source: '1', // 数据字典station_source，1=APP
        subsidyCard: this.detail.subsidyCard,
        subsidyCardId: this.detail.subsidyCardId,
        // 展示所需字段
        sex: this.detail.sex === '1' ? '男' : this.detail.sex === '2' ? '女' : '',
        age: this.detail.age,
        subsidyList: this.subsidyList.filter(item => item.usingStatus !== '3')
      })
      uni.navigateTo({ url: '/pages/dining/choose-menu' })
    },
    handleCopy() {
      uni.setClipboardData({
        data: this.detail.subsidyCard,
        success: function () {
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin: 12px 16px;
  padding: 12px;
  border-radius: 8px;
  background-color: #fff;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.empty-box {
  padding: 60px 0 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-img {
  width: 146px;
  height: 120px;
}

.subsidy-box {
  margin: 12px 16px;
  border-radius: 8px;
  border: 2px solid #fc881c;
  background: linear-gradient(130deg, #f86f56, #ff9500 100%);
  .iconfont {
    color: #fff;
  }
}

.title-box {
  color: #fff;
}

.title {
  padding-right: 10px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 8px;
    background-color: #fff;
  }
}

.card-no {
  font-size: 16px;
  font-style: italic;
  font-weight: bold;
  margin: 0 10px;
}

.subsidy-card {
  border-radius: 8px;
  background-color: #fff;
  padding: 12px;
}

.subsidy-item {
  padding: 12px 0;
  background-color: #faf9f7;
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
}

.left {
  width: 100px;
  height: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px dashed #e0dedc;
}

.price {
  font-size: 16px;
  font-weight: bold;
  margin-top: 2px;
  &::before {
    content: '￥';
    font-size: 12px;
    font-weight: normal;
  }
}

.right {
  padding: 0 12px;
  flex: 1;
  height: 42px;
}

.right-left {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.status {
  flex-shrink: 0;
  white-space: nowrap;
  margin-left: 10px;
  line-height: 20px;
  border-radius: 4px;
  color: #fff;
  padding: 0 8px;
  font-size: 12px;
  &1 {
    background-color: #f7bc18;
  }
  &2 {
    background-color: #5cd7a8;
  }
  &3 {
    background-color: #e0dedc;
  }
}
</style>
