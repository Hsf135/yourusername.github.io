<template>
  <view class="add-page">
    <u-navbar title="完成服务确认" placeholder bgColor="#FAF9F7">
      <view slot="left" class="u-flex">
        <text class="u-tips-color" @click="handleBack">取消</text>
      </view>
      <view slot="right" class="u-flex">
        <text class="u-primary" @click="handleConfirm">确认</text>
      </view>
    </u-navbar>

    <view class="add-card u-flex">
      <text>服务工单号： </text>
      <u-input v-model="serveNo" placeholder="20字以内数字或字母" :maxlength="20" border="none"
        :formatter="handleServeNo"></u-input>
    </view>

    <view class="add-card">
      <r-textarea v-model="form.finishServeRemark" count :maxlength="300" placeholder="请输入内容(非必填)"
        class="min-textarea"></r-textarea>
    </view>

    <view class="add-card">
      <r-upload v-model="form.finishServePhotos" :imgList="finishServePhotosAttach" :maxCount="3" :width="56" />
    </view>

    <view class="add-card">
      <view class="u-m-b-8">支付方式：<text class="content-color">{{ radioDict(info.paytypeId, 'order_pay_type') }}</text>
      </view>
      <view class="u-m-b-8">订单金额：<text class="content-color">￥{{ info.money }}</text>
      </view>
      <view class="u-p-b-12 u-border-bottom">订单数量：<text class="content-color">{{ info.serveCount }}</text>
      </view>
      <view class="u-flex u-flex-between u-p-t-8 u-p-b-8 u-border-bottom" @click="outPriceShowFun">
        <view v-if="form.payBeyondPrice">超出金额：<text class="content-color">{{ form.payBeyondPrice }}</text>
        </view>
        <text class="content-color" v-else>若订单有金额超出，请设置</text>
        <u-icon :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
      </view>
      <view class="u-flex u-flex-between u-p-t-8 u-p-b-8 u-border-bottom u-m-b-12" @click="outNumberShowFun">
        <view v-if="form.beyondOrderNumber">超出数量：<text class="content-color">{{ form.beyondOrderNumber }}</text>
        </view>
        <text class="content-color" v-else>若订单有数量超出，请设置</text>
        <u-icon :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
      </view>
      <view class="u-flex u-flex-between u-m-b-12 u-bold">
        <text class="content-color">本单总金额：</text>
        <text class="content-color">￥{{ Number(info.money) + (Number(form.payBeyondPrice) || 0) }}</text>
      </view>
      <view class="u-flex u-flex-between u-bold">
        <view class="content-color u-flex">实收金额：<u-icon :name="aIcon('tishi')" width="20" height="20"
            @click="explainShow = true"></u-icon></view>
        <text class="u-error">￥{{ info.paytypeId === '2' ? Number(info.money) + (Number(form.payBeyondPrice) || 0) :
          form.payBeyondPrice || 0 }}</text>
      </view>
    </view>

    <!-- 订单超出金额 -->
    <r-dialog v-model="outPriceShow" title="订单超出金额" cancelText="取消" confirmText="确认" @cancel="cancelPrice"
      @confirm="outPriceConfirm">
      <view slot="content" class="rela">
        <view class="u-tips-color u-text-center u-m-b-12"> 请选择超出金额部分的支付方式 </view>
        <u-radio-group class="u-m-b-10" v-model="tempOnlinePay" placement="column" activeColor="#FF9500">
          <!-- 支付方式是服务商的才需要显示 -->
          <template v-if="info.paytypeId === '1'">
            <u-radio v-for="item in servePacketList" :key="item.name" :customStyle="{ padding: '10px 0' }"
              :label="item.label" :name="item.name"></u-radio>
            <!-- <u-radio :customStyle="{ padding: '10px 0' }" label="支付给服务商" name="1"></u-radio> -->
          </template>
          <u-radio :customStyle="{ padding: '10px 0' }" label="线下支付" name="2"></u-radio>
        </u-radio-group>
        <u-input type="number" placeholder="请输入超出部分金额" :maxlength="20" border="surround"
          :customStyle="{ background: '#fff' }" v-model="tempPayBeyondPrice" @blur="payBeyondPriceChange"></u-input>
        <text class="u-tips-color unit">元</text>
        <text class="u-error clear-button" @click="clearPrice">清除</text>
      </view>
    </r-dialog>

    <!-- 订单超出数量 -->
    <r-dialog v-model="outNumberShow" title="订单超出数量" cancelText="取消" confirmText="确认" @cancel="cancelNumber"
      @confirm="outNumberConfirm">
      <view slot="content" class="rela">
        <u-input type="number" placeholder="请输入超出部分数量" :maxlength="20" border="surround"
          :customStyle="{ background: '#fff' }" v-model="tempBeyondOrderNumber"
          @blur="beyondOrderNumberChange"></u-input>
        <text class="u-error clear-button" @click="clearNumber">清除</text>
      </view>
    </r-dialog>

    <!-- 说明 -->
    <r-dialog v-model="explainShow" title="说明" :btnsShow="false" @cancel="explainShow = false">
      <view slot="content">
        <view class="content-color u-bold u-m-b-8">本单总金额</view>
        <view class="u-content-color u-m-b-24">最后总金额=订单金额+超出金额</view>
        <view class="content-color u-m-b-8">
          <text class="u-bold">实收金额</text>
          <text class="u-tips-color">(根据支付方式计算)</text>
        </view>
        <view class="u-content-color">
          <view class="u-flex-start u-m-b-8">
            <text class="u-m-r-5">①</text>
            <view>
              <view>支付方式：货到付款</view>
              <view>"超出金额支付方式"只能选"支付给服务商、线下支付", 实收金额=订单金额+超出金额</view>
            </view>
          </view>
          <view class="u-flex-start u-m-b-8">
            <text class="u-m-r-5">②</text>
            <view>
              <view>支付方式：微信支付、支付宝支付、套餐、政府结算</view>
              <view>超出金额支付方式为"线下付款、服务商支付"时，实收金额=超出金额</view>
            </view>
          </view>
          <view class="u-flex-start u-m-b-8">
            <text class="u-m-r-5">③</text>
            <view>
              <view>支付方式：服务包</view>
              <view>A."超出金额支付方式"为"服务包"时, 实收金额=0</view>
              <view>B."超出金额支付方式"为"支付给服务商、线下支付"时，实收金额=超出金额</view>
            </view>
          </view>
          <view class="u-flex-start u-m-b-8">
            <text class="u-m-r-5">④</text>
            <view>
              <view>支付方式：小程序商城</view>
              <view>超出金额方式为"小程序商城"时，实收金额=超出金额</view>
            </view>
          </view>
        </view>
      </view>
    </r-dialog>

    <r-dialog v-model="startShow" title="确认完成服务？" cancelText="取消" confirmText="确定" @cancel="startShow = false"
      @confirm="dialogConfirm">
      <view slot="content" class="u-flex">
        <text class="u-text-center">提交后不可修改状态，请确保已到达服务时间和地址。是否确认完成服务?</text>
      </view>
    </r-dialog>

    <r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false" @confirm="toBack">
      <view slot="content">
        <text class="u-text-center">当前页面已做出修改，是否不保存就退出</text>
      </view>
    </r-dialog>

    <r-location ref="rLocation" />
  </view>
</template>

<script>
import { getOrderDetailUrl, statusOperateUrl, getServePacketListUrl, updateServeNoUrl } from '@/api'

export default {
  data() {
    return {
      unsave: false,
      startShow: false,
      explainShow: false,
      outNumberShow: false,
      outPriceShow: false,
      show: false,
      serveNo: '',
      loading: false,
      info: {},
      isFirst: true,
      form: { finishServePhotos: '', finishServeRemark: '', statusCode: '7', finshOrderAddress: '河北省秦皇岛市昌黎县靖安镇靖安南村' },
      finishServePhotosAttach: [],
      servePacketList: [],
      tempOnlinePay: undefined,
      tempPayBeyondPrice: undefined,
      tempBeyondOrderNumber: undefined,
      payRemarkId: '',  //服务包ID
    }
  },
  watch: {
    form: {
      handler: function () {
        this.unsave = true
      },
      deep: true
    }
  },
  onLoad({ id }) {
    this.form.serveorderId = id
    this.loadData()
  },
  methods: {
    async loadData() {
      const { data } = await uni.$u.http.post(`${getOrderDetailUrl}?id=${this.form.serveorderId}`)
      this.payRemarkId = data.payRemarkId || ''
      this.serveNo = data.serveNo || ''
      this.info = data
      this.isFirst = !data.startOrderTime
      if (!this.isFirst) {
        this.finishServePhotosAttach = data.finishServePhotosAttach || []
        this.form.finishServeRemark = data.finishServeRemark
      }
      this.loadServePacket()  
    },
    async loadServePacket() { 
      const { data } = await uni.$u.http.post(getServePacketListUrl, { includeId: this.payRemarkId, customerId: this.info.memberId })
      this.servePacketList = data.map(item => {
        return {
          name: item.servePacketId,
          label: item.servePacketName
        }
      })
    },
    handleBack() {
      if (this.unsave) {
        this.show = true
        return
      }
      uni.navigateBack()
    },
    toBack() {
      uni.navigateBack()
    },
    async handleConfirm() {
      if (!this.serveNo) {
        uni.$u.toast('工单号不能为空')
        return
      }
      if (this.isFirst) {
        const { longitude, latitude, address } = await this.$refs.rLocation.getAddress()
        this.form.finishLongitude = longitude
        this.form.finishLatitude = latitude
        this.form.finshOrderAddress = address
        this.startShow = true
        return
      }
      this.dialogConfirm()
    },
    async dialogConfirm() {
      await uni.$u.http.post(`${updateServeNoUrl}?id=${this.form.serveorderId}&serveNo=${this.serveNo}`)
      await uni.$u.http.post(statusOperateUrl, this.form)
      uni.$u.toast('操作成功')
      uni.navigateBack()
    },
    clearNumber() {
      this.tempBeyondOrderNumber = undefined
    },
    cancelNumber() {
      this.tempBeyondOrderNumber = undefined
      this.outNumberShow = false
    },
    clearPrice() {
      this.tempPayBeyondPrice = undefined
      this.tempOnlinePay = undefined
    },
    cancelPrice() {
      this.outPriceShow = false
      this.tempPayBeyondPrice = undefined
      this.tempOnlinePay = undefined
    },
    handleServeNo(value) {
      return value.replace(/[^a-zA-Z0-9]/g, '')
    },
    payBeyondPriceChange(val) {
      const value = Number(val)
      if (value < 0) {
        this.tempPayBeyondPrice = '0.00'
      } else {
        this.tempPayBeyondPrice = value.toFixed(2)
      }
    },

    beyondOrderNumberChange(val) {
      const value = Number(val)
      if (value < 0) {
        this.tempBeyondOrderNumber = '0.0'
      } else {
        this.tempBeyondOrderNumber = value.toFixed(1)
      }
    },
    outPriceShowFun() {
      this.tempPayBeyondPrice = this.form.payBeyondPrice
      this.tempOnlinePay = this.form.onlinePay
      this.outPriceShow = true
    },
    outPriceConfirm() {
      this.form.payBeyondPrice = this.tempPayBeyondPrice
      this.form.onlinePay = this.tempOnlinePay
      this.outPriceShow = false
    },

    outNumberShowFun() {
      this.tempBeyondOrderNumber = this.form.beyondOrderNumber
      this.outNumberShow = true
    },
    outNumberConfirm() {
      this.form.beyondOrderNumber = this.tempBeyondOrderNumber
      this.outNumberShow = false
    }
  }
}
</script>

<style scoped lang="scss">
.add-page {
  box-sizing: border-box;
  background-color: #faf9f7;
  position: relative;
  min-height: 100vh;
  padding: 12px 16px 24px;
}

.add-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.address-text {
  font-size: 14px;
  font-weight: 400;
  color: #333231;
  margin-bottom: 14px;
}

.address-tip {
  background: #fff9f0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #ff9500;
  padding: 2px 5px;
  margin-right: 5px;
}

/deep/ .u-textarea--no-radius {
  border: none;
}

/deep/ .u-textarea {
  padding: 0;
}

.remark {
  min-height: 224px;
}

.unit {
  position: absolute;
  bottom: 10px;
  right: 12px;
}

.clear-button {
  position: absolute;
  padding: 10px;
  right: 0;
  top: -47px;
  font-size: 15px;
}
</style>
