<template>
  <view class="u-p-b-50" :class="['detail-page', { 'fixed-footer-bottom': isEdit || isAudit }]">
    <u-navbar :title="title" placeholder bgColor="#FAF9F7">
      <u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
      <r-camera slot="right" />
    </u-navbar>
    <!-- <view v-if="errorPreview" class="u-flex u-error error-preview">
			<u-icon :name="aIcon('jinggao-1')" width="20" height="20"></u-icon>
			<text class="u-m-l-4">该订单还有照片未上传，请全部上传后再提交审核</text>
		</view> -->
    <view class="base-box">
      <view class="u-flex u-flex-between">
        <view v-show="info.id">
          <text :class="['status', 'u-font-12', `status-${info.statusCode}`]">{{ radioDict(info.statusCode, 'order_status') }}</text>
          <text class="u-m-l-5 status-title">订单编号：{{ info.orderNo }}</text>
        </view>
        <view v-if="isEdit && !info.finishOrderTime">
          <u-button type="error" :customStyle="{ height: '28px' }" plain text="取消订单" @click="toPage(`/pages/order/service-cancel?id=${info.id}`)"></u-button>
        </view>

        <view v-if="info.statusCode === '5'">
          <u-button type="error" :customStyle="{ height: '28px' }" plain text="无法执行" @click="noDealShow = true"></u-button>
        </view>
      </view>
    </view>

    <view class="map-box">
      <map v-show="mapShow" class="map" ref="map" id="map" :latitude="latitude" :longitude="longitude" :markers="marker" :scale="scale" @markertap="markertap"> </map>
    </view>

    <view class="title u-p-l-16 u-p-b-0 u-m-t-12">订单详情</view>

    <view class="base-box">
      <view class="main-box u-flex u-flex-between">
        <text class="u-bold">{{ info.serveName }}</text>
        <view>
          <text>x{{ info.serveCount }}</text>
          <text class="u-info" v-if="Number(info.statusCode) > 6">({{ info.beyondOrderNumber || '0.0' }})</text>
        </view>
      </view>
      <view class="main-box u-flex u-flex-between">
        <view class="u-flex">
          <text class="main-title">支付方式：</text>
          <text>{{ radioDict(info.paytypeId, 'order_pay_type') }}</text>
        </view>
        <view>
          <text class="u-error u-bold">￥{{ info.money }} </text>
          <text class="u-info" v-if="Number(info.statusCode) > 6">({{ info.payBeyondPrice || '0.00' }})</text>
        </view>
      </view>
      <view class="main-box u-flex u-flex-between" v-if="Number(info.statusCode) > 6">
        <text class="main-title">最终确认数量</text>
        <text>x{{ info.finalNumber }}</text>
      </view>
      <view class="main-box u-flex u-flex-between" v-if="Number(info.statusCode) > 6">
        <text class="main-title">最终确认金额</text>
        <text class="u-error u-bold">￥{{ info.finalPrice }}</text>
      </view>
      <view class="main-box u-border-top u-p-t-12">
        <text class="main-title">下单会员：</text>
        <text>{{ info.creatorName }}</text>
      </view>
      <view class="main-box">
        <text class="main-title">服务时间：</text>
        <text>{{ info.serveTime }}</text>
      </view>
      <view class="main-box">
        <text class="main-title">服务地址：</text>
        <text>{{ info.address }}</text>
      </view>
      <view class="main-box">
        <text class="main-title">联系人：</text>
        <text>{{ info.memberName }}</text>
      </view>
      <view class="main-box">
        <text class="main-title">联系电话：</text>
        <text class="u-line-1">{{ phoneEncrypted(info.memberMobilephone) }}</text>
      </view>
      <view class="main-box">
        <text class="main-title">备注：</text>
        <text>{{ info.remark || '暂未备注' }}</text>
      </view>
      <view class="u-content-color u-font-14 u-flex u-flex-between">
        <view class="u-flex">
          工单号：
          <text>{{ info.serveNo }}</text>
        </view>
        <view>
          <text class="pic-button" @click="handleChangeServeNo">修改</text>
        </view>
      </view>
    </view>

    <!-- 提交审核后可自由编辑 -->
    <view class="base-box" v-if="Number(info.statusCode) > 7">
      <view class="u-content-color u-font-14 u-flex u-flex-between">
        <view class="u-flex">
          语音评价：
          <view v-if="info.voice" class="recording u-flex" @click="voiceShow = true">
            <u-icon class="u-m-r-4" :name="aIcon('yvying')" color="#D27058" width="16" height="16"></u-icon>
            <text>{{ voiceTime }}</text>
          </view>
        </view>
        <view>
          <text v-if="info.voice" class="iconfont icon-a-mingchengshanchu-xian u-error u-font-20" @click="delVoiceShow = true"></text>
          <text v-else class="pic-button" @click="toPage(`/pages/plat-order/components/service-record?id=${id}`)">录音</text>
        </view>
      </view>
    </view>

    <!-- 执行情况 -->
    <view class="title u-p-l-16 u-p-b-0 u-m-t-12" v-if="Number(info.statusCode) > 5">执行情况</view>
    <!-- <view class="u-h-50" v-else></view> -->

    <view class="base-box" v-if="Number(info.statusCode) > 5">
      <view class="ul">
        <view v-for="(item, index) in statusList" :key="item.id" class="li">
          <text :class="['u-bold', `${!index ? 'active' : 'u-info'}`]">{{ item.name }}</text>
          <view :class="[`${!index ? 'active' : 'u-info'}`, 'u-font-12']">
            <view class="u-m-b-8 u-m-t-4">{{ formatDateString(item.operatTime, 'MM-DD HH:mm') }}</view>
            <view v-if="item.message" :class="[`${!index ? 'u-content-color' : ''}`]">服务记录：{{ item.message }}</view>
            <r-upload v-if="info.finishServePhotosList && item.name === '服务完成'" :imgList="info.finishServePhotosList" disabled :width="56" class="u-m-t-8" />
            <r-upload v-if="info.startServePhotosList && item.name === '服务开始'" :imgList="info.startServePhotosList" disabled :width="56" class="u-m-t-8" />
          </view>
        </view>
      </view>
    </view>

    <!-- 开始服务按钮 -->
    <view class="fixed-footer u-flex u-flex-between" v-if="info.statusCode === '5'">
      <view class="u-flex-1 u-m-r-10">
        <u-button type="primary" plain text="拨打电话" @click="phoneShow = true"></u-button>
      </view>
      <view class="u-flex-2">
        <u-button type="primary" text="开始服务" @click="toPage(`/pages/plat-order/components/service-start?id=${id}`)"></u-button>
      </view>
    </view>

    <!-- 完成服务按钮 -->
    <view class="fixed-footer u-flex u-flex-between" v-if="info.statusCode === '6'">
      <view class="u-flex-2">
        <u-button type="primary" text="完成服务" @click="toPage(`/pages/plat-order/components/service-finish?id=${id}`)"></u-button>
      </view>
    </view>

    <r-phone v-if="phoneShow" v-model="phoneShow" :name="info.memberName" :phone="info.memberMobilephone" />

    <r-dialog v-model="workShow" title="修改工单号" cancelText="取消" confirmText="确认" @cancel="closeWork" @confirm="handleWorkConfirm">
      <u-input slot="content" placeholder="20字以内数字或字母" :maxlength="20" border="surround" :customStyle="{ background: '#fff' }" v-model="serveNo" :formatter="handleServeNo"></u-input>
    </r-dialog>

    <r-dialog
      v-model="calendarShow"
      title="温馨提示"
      cancelText="不返回"
      confirmText="确认返回"
      content="即将返回日历页(可创建新的订单)，但本次订单不
可再创建新的“服务项目”，是否确认返回?"
      @cancel="calendarShow = false"
      @confirm="handleCalendar"
    >
    </r-dialog>

    <r-dialog v-model="delVoiceShow" title="确定删除" cancelText="取消" confirmText="确认" content="是否要删除语音，重新评价？" @cancel="delVoiceShow = false" @confirm="handleDelVoice"> </r-dialog>

    <r-dialog v-model="noDealShow" title="温馨提示" cancelText="取消" confirmText="确认" content="是否确认无法执行？若确认,请与12349客服电话报备." @cancel="noDealShow = false" @confirm="handleNoDeal"> </r-dialog>

    <r-dialog v-model="voiceShow" title="语音播放" :btnsShow="false">
      <r-voice slot="content" v-if="info.voiceUrl" :src="preImgUrl + info.voiceUrl" />
    </r-dialog>

    <!-- 服务商审核 6为审核通过、8为未通过 -->
    <r-dialog v-model="auditShow" title="温馨提示" cancelText="取消" @cancel="auditShow = false">
      <view slot="content">
        <view v-if="auditForm.status === '6'" class="u-text-center">确定通过审核？</view>
        <r-textarea v-else v-model="auditForm.reason" count :maxlength="150" placeholder="请输入未通过原因(必填)" class="min-textarea"></r-textarea>
      </view>
      <u-button v-if="auditForm.status === '6'" slot="confirm" type="primary" text="审核通过" @click="handleAuditConfirm"></u-button>
      <u-button v-else slot="confirm" type="error" :disabled="!auditForm.reason" text="审核不通过" @click="handleAuditConfirm"></u-button>
    </r-dialog>

    <r-voice v-show="false" v-if="info.voiceUrl" :src="preImgUrl + info.voiceUrl" @ready="voiceReady" />

    <Submit v-if="submitShow" v-model="submitShow" :info="info" />
  </view>
</template>

<script>
import { getOrderDetailUrl, updateVoiceByIdUrl, orgAuditUrl, getServeorderstatusUrl, updateServeNoUrl, serveOrderStatusUrl } from '@/api'
import { copy, phoneEncrypted, formatDateString } from '@/utils'
import Submit from '../order/components/Submit.vue'
import { preImgUrl } from '../../config'

export default {
  components: { Submit },
  data() {
    return {
      preImgUrl,
      phoneEncrypted,
      formatDateString,
      id: '',
      info: { serveItems: [] },
      statusList: [],
      serveNo: '',
      phoneShow: false,
      workShow: false,
      calendarShow: false,
      submitShow: false,
      delVoiceShow: false,
      voiceShow: false,
      voiceTime: 0,
      auditShow: false,
      carryActive: true,
      // 6为审核通过、8为未通过
      auditForm: { id: '', reason: '', status: '' },
      longitude: 0, // 你的经度
      latitude: 0, // 你的纬度
      scale: 18, // 地图缩放级别
      marker: [
        {
          id: 0,
          latitude: 34.79977, //纬度
          longitude: 113.66072, //经度
          iconPath: '/static/home/Path.png', //显示的图标
          rotate: 0, // 旋转度数
          width: 20, //宽
          height: 20, //高
          // title: '', //标注点名
          alpha: 0.5, //透明度
          callout: {
            //自定义标记点上方的气泡窗口 点击有效
            content: '', //文本
            color: '#ffffff', //文字颜色
            fontSize: 15, //文本大小
            borderRadius: 15, //边框圆角
            padding: '10',
            bgColor: '#406390', //背景颜色
            display: 'ALWAYS' //常显
          }
        }
      ],
      noDealShow: false
    }
  },
  computed: {
    isEdit() {
      return ['3', '4', '8'].includes(this.info.status) && this.isSingleProject
    },
    isOrderPreview() {
      return this.info.status === '4' && this.info.finishOrderTime
    },
    title() {
      return '订单详情'
    },
    isAudit() {
      // 服务商并且待审核状态
      return this.info.status === '5' && this.fwryappFuwushang
    },
    mapShow() {
      return !this.phoneShow && !this.workShow && !this.calendarShow && !this.delVoiceShow && !this.noDealShow && !this.voiceShow && !this.auditShow && !this.submitShow
    }
  },
  onLoad({ id }) {
    this.id = id
  },
  onShow() {
    this.loadData()
    this.loadStatus()
  },
  methods: {
    async loadData() {
      const { data } = await uni.$u.http.post(`${getOrderDetailUrl}?id=${this.id}`)
      this.formatData(data)
      this.info = data
      this.latitude = data.latitude
      this.longitude = data.longitude
      this.marker[0].latitude = data.latitude
      this.marker[0].longitude = data.longitude
      this.marker[0].callout.content = data.address
    },
    async loadStatus() {
      const { data } = await uni.$u.http.post(getServeorderstatusUrl, {
        serveorderId: this.id,
        display: '1'
      })
      this.statusList = data.reverse().filter(item => item.act === '1' && Number(item.code) > 5)
    },
    handleSubmit() {
      if (this.errorPreview) {
        uni.$u.toast('该订单还有图片未上传')
        return
      }
      this.submitShow = true
    },
    handleEditProject(s, index) {
      s.index = index
      this.$u.vuex('vuex_projectEdit', s)
      this.toPage('/pages/order/components/project-edit')
    },
    handleProjectPhoto(s, index) {
      s.index = index
      this.$u.vuex('vuex_projectEdit', s)
      this.toPage('/pages/order/components/project-photo')
    },
    async handleDelVoice() {
      await uni.$u.http.post(`${updateVoiceByIdUrl}?id=${this.id}`)
      this.loadData()
    },
    async handleAuditConfirm() {
      await uni.$u.http.post(orgAuditUrl, this.auditForm)
      if (this.auditForm.status === '6') {
        uni.$u.toast('已提交中心审核')
      }
      this.loadData()
      this.auditShow = false
    },
    handleServeNo(value) {
      return value.replace(/[^a-zA-Z0-9]/g, '')
    },
    handleChangeServeNo() {
      this.serveNo = this.info.serveNo
      this.workShow = true
    },
    closeWork() {
      this.workShow = false
    },
    async handleWorkConfirm() {
      if (!this.serveNo) {
        uni.$u.toast('工单号不能为空')
        return
      }
      await uni.$u.http.post(`${updateServeNoUrl}?id=${this.id}&serveNo=${this.serveNo}`)
      uni.$u.toast('修改工单号成功')
      this.loadData()
      this.workShow = false
    },
    handleAudit(status) {
      this.auditForm = { id: this.id, reason: '', status }
      this.auditShow = true
    },
    toPage(url) {
      uni.navigateTo({ url })
    },
    handleCalendar() {
      uni.reLaunch({ url: '/pages/calendar/index' })
    },
    handleStartPhotoPreview() {
      uni.previewImage({ urls: this.info.startPhoto.map(s => s.url) })
    },
    handleFinishPhotoPreview() {
      uni.previewImage({ urls: this.info.finishPhoto.map(s => s.url) })
    },
    handleCopy() {
      copy(this.info.serveNo)
    },
    voiceReady(voiceTime) {
      this.voiceTime = voiceTime
    },
    formatData(data) {
      // 容错处理，接口应返回数组，结果返回null
      data.startPhoto = []
      if (data.startAddressPictureAttach) {
        data.startPhoto = data.startPhoto.concat(data.startAddressPictureAttach)
      } else {
        data.startAddressPictureAttach = []
      }
      if (data.startObjectPictureAttach) {
        data.startPhoto = data.startPhoto.concat(data.startObjectPictureAttach)
      } else {
        data.startObjectPictureAttach = []
      }
      data.finishPhoto = []
      if (data.finishAddressPictureAttach) {
        data.finishPhoto = data.finishPhoto.concat(data.finishAddressPictureAttach)
      } else {
        data.finishAddressPictureAttach = []
      }
      if (data.finishObjectPictureAttach) {
        data.finishPhoto = data.finishPhoto.concat(data.finishObjectPictureAttach)
      } else {
        data.finishObjectPictureAttach = []
      }
      data.cancelPictureAttach = data.cancelPictureAttach || []
    },
    onMarkerTap() {
      console.log('Marker tapped:')
    },
    //地图点击事件
    markertap(e) {
      console.log('你点击了标记点', e)
    },
    async handleNoDeal() {
      await uni.$u.http.post(serveOrderStatusUrl, { serveorderId: this.id, statusCode: '51' })
      uni.$u.toast('无法执行成功')
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  padding: 12px;
  color: $u-main-color;
  font-size: 16px;
  font-weight: bold;
}

.map-box {
  margin: 0 16px;
  width: calc(100% -32px);
  height: 192px;
  background: url('/static/imgs/common/map.jpg') no-repeat;
  background-size: 100% 100%;
}

.map {
  width: 100%;
  height: 192px;
}

.status {
  padding: 2px 8px 3px;
  background: #f7bc18;
  border-radius: 4px;
  color: #ffffff;

  &-4 {
    background: #e0dedc;
  }

  &-7 {
    background: $uni-color-success;
  }

  &-8 {
    background: $uni-color-error;
  }

  &-9 {
    background: #e0dedc;
  }

  &-10 {
    background: #e0dedc;
  }
}

.mobilephone {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical !important;
}

.phone {
  width: 32px;
  height: 32px;
  background: #fff9f0;
  border-radius: 8px;
}

.address {
  width: calc(100% - 120px);
}

.detail-page {
  padding-bottom: 10px;
}

.address-tip {
  background: #f7bc18;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  padding: 2px 5px;
  margin-right: 5px;
}

.status-title {
  font-weight: bolder;
  color: #333231;
}

/deep/ .u-form-item__body__right__content__slot {
  color: #666462;
}

.pic-button {
  background: #ffffff;
  border: 1px solid #ff9500;
  border-radius: 8px;
  font-size: 14px;
  padding: 2px 8px;
  color: #ff9500;
  flex-shrink: 0;
}

.time-tip {
  font-size: 14px;
  font-weight: 600;
  color: #333231;
}

.recording {
  background: #fff9f0;
  border-radius: 10px;
  padding: 2px 8px;
  color: #ff9500;
}

.error-preview {
  margin: 12px 16px;
}

.main-box {
  display: flex;
  padding-bottom: 12px;
  color: #333231;
  font-size: 14px;
  font-weight: 400;
}

.main-title {
  flex-shrink: 0;
  font-size: 14px;
  color: #666462;
}

.ul {
  padding: 0;
  padding-left: 10px;
  margin-left: 10px;

  .active {
    color: $u-primary;
  }

  .active::before {
    position: absolute;
    left: -17px;
    top: 2px;
    content: ' ';
    width: 12px;
    height: 12px;
    display: inline-block;
    border-radius: 50%;
    background: #ffe1b8;
  }

  .li {
    position: relative;
    padding-bottom: 14px;

    &::after {
      position: absolute;
      left: -12px;
      top: 13px;
      content: ' ';
      display: inline-block;
      width: 2px;
      height: calc(100% - 10px);
      background: #ff9500;
    }

    &::before {
      z-index: 5;
      position: absolute;
      left: -14px;
      top: 5px;
      content: ' ';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ff9500;
    }

    &:last-of-type::after {
      display: none;
    }
  }
}
</style>
