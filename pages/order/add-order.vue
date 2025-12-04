<template>
  <view class="add-page">
    <u-navbar title="创建订单服务" placeholder bgColor="#FAF9F7">
      <view slot="left" class="u-flex">
        <text class="u-info" @click="backEdit">取消</text>
      </view>
      <view slot="right" class="u-flex">
        <text class="u-primary" @click="submit">保存</text>
      </view>
    </u-navbar>
    <u--form labelWidth="120px" :model="form" :rules="rules" ref="form">
      <view class="add-card">
        <u-form-item label="归属项目(一级)" prop="belongProject" borderBottom class="form-required">
          <r-select v-model="form.belongProject" isLink :list="aDict('belong_project')" @change="belongProjectChange" />
        </u-form-item>
        <u-form-item v-if="secondBelongProjectList.length" label="归属项目(二级)" prop="secondBelongProject" borderBottom>
          <r-select v-model="form.secondBelongProject" isLink :list="secondBelongProjectList" valueKey="id" labelKey="name" />
        </u-form-item>
        <u-form-item label="服务时间" prop="serveTime" borderBottom @click="showTime = true">
          <text v-if="form.serveTime">{{ form.serveTime }}</text>
          <text v-else class="u-place-color">请选择</text>
          <u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
        </u-form-item>
        <u-form-item label="服务对象" prop="memberId" borderBottom class="form-required" @click="toPage('/pages/order/service-object?isSelect=1')">
          <text v-if="vuex_orderMemberInfo.id">
            <text>{{ vuex_orderMemberInfo.name }} | {{ radioDict(vuex_orderMemberInfo.sex, 'vols_sex') }}</text>
            <text>{{ vuex_orderMemberInfo.age ? ' | ' + vuex_orderMemberInfo.age + '岁' : '' }}</text>
          </text>
          <text v-else class="u-place-color">请选择</text>
          <u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
        </u-form-item>
        <u-form-item v-if="form.memberId" label="服务地址" prop="address" class="form-required" borderBottom @click="toPage('/pages/order/components/service-address')">
          <text v-if="form.address">{{ form.address }}</text>
          <text v-else class="u-place-color">请选择</text>
          <u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
        </u-form-item>
      </view>
    </u--form>

    <u-datetime-picker v-if="showTime" @cancel="showTime = false" @confirm="changeTime" :show="showTime" v-model="time" closeOnClickOverlay @close="showTime = false" mode="datetime"> </u-datetime-picker>

    <r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false" @confirm="dialogConfirm">
      <view slot="content">
        <text class="u-text-center">当前页面已做出修改，是否不保存就退出</text>
      </view>
    </r-dialog>

    <r-dialog v-model="errorShow" title="提示" :cancelBtn="false" :content="errorContent" confirmText="我知道了" @confirm="errorShow = false"> </r-dialog>
  </view>
</template>

<script>
import { addStaffInfoUrl, memberAddressListUrl, belongItemlabelListUrl } from '@/api'

export default {
  data() {
    return {
      form: {
        belongProject: '',
        secondBelongProject: '',
        address: '',
        memberId: '',
        serveTime: ''
      },
      show: false,
      isEdit: false,
      customerId: undefined,
      showTime: false,
      unsave: false,
      secondBelongProjectList: [],
      time: new Date().getTime(),
      errorShow: false,
      errorContent: '',
      rules: {
        belongProject: [
          {
            required: true,
            message: '归属项目不可为空',
            trigger: ['blur', 'change']
          }
        ],
        memberId: [
          {
            required: true,
            type: 'number',
            message: '服务对象不可为空',
            trigger: ['blur', 'change']
          }
        ],
        address: [
          {
            required: true,
            message: '服务地址不可为空',
            trigger: ['blur', 'change']
          }
        ]
      }
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
  onShow() {
    this.addressCallback()
  },
  onUnload() {
    this.$u.vuex('vuex_orderMemberInfo', {})
  },
  onLoad() {
    const timeFormat = uni.$u.timeFormat
    this.form.serveTime = timeFormat(this.time, 'yyyy-mm-dd hh:MM')
    this.unsave = false
  },
  methods: {
    async loadAddress() {
      const { data } = await uni.$u.http.post(memberAddressListUrl, { memberid: this.form.memberId })
      const item = data.find(d => d.acquiescent)
      if (item) {
        this.form.province = item.province
        this.form.city = item.city
        this.form.county = item.county
        this.form.community = item.community
        this.form.street = item.street
        this.form.latitude = item.latitude
        this.form.longitude = item.longitude
        this.form.address = item.address
      } else {
        const { belongProject, memberId, serveTime } = this.form
        this.form = { belongProject, memberId, serveTime, address: '' }
      }
    },
    async belongProjectChange() {
      this.form.secondBelongProject = ''
      const params = { labelType: 'belong_project', deleted: 0, parentKey: this.form.belongProject }
      const { data } = await uni.$u.http.post(belongItemlabelListUrl, params)
      this.secondBelongProjectList = data
    },
    addressCallback() {
      if (this.vuex_orderMemberInfo.id) {
        this.form.memberId = this.vuex_orderMemberInfo.id
        this.form.contactman = this.vuex_orderMemberInfo.name
        this.form.mobilePhone = this.vuex_orderMemberInfo.mobilephone
        this.loadAddress()
      }
      this.unsave = false
    },
    toPage(url) {
      uni.navigateTo({ url })
    },
    submit() {
      this.$refs.form
        .validate()
        .then(() => {
          if (this.isEdit) {
            this.edit()
            return
          }
          this.add()
        })
        .catch(errors => {
          console.log(errors)
          uni.$u.toast('请完善必填项')
        })
    },
    backEdit() {
      if (this.unsave) {
        this.show = true
        return
      }
      this.toBack()
    },
    dialogConfirm() {
      this.toBack()
    },
    toBack() {
      uni.navigateBack()
    },
    async add() {
      try {
        const { data } = await uni.$u.http.post(addStaffInfoUrl, { ...this.form })
        uni.redirectTo({ url: `/pages/order/components/status?id=${data}` })
      } catch (e) {
        uni.hideToast()
        this.errorShow = true
        this.errorContent = e.msg
      }
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      if (type === 'day') {
        return `${value}日`
      }
      return value
    },
    changeTime(e) {
      const timeFormat = uni.$u.timeFormat
      this.form.serveTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM')
      this.time = timeFormat(e.value, 'yyyy-mm-dd hh:MM')
      this.showTime = false
    },
    save() {}
  }
}
</script>

<style scoped lang="scss">
.add-page {
  background-color: #faf9f7;
  position: relative;
  min-height: 90vh;
  padding: 12px 16px 24px;
}

.title {
  padding-bottom: 12px;
  color: $u-main-color;
  font-size: 16px;
  font-weight: bold;
}

.add-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

/deep/ uni-text {
  font-size: 14px !important;
}

/deep/ .u-navbar__content__title {
  font-size: 16px !important;
}

.add-item {
  display: flex;
  align-items: center;
  color: #ff9500;

  text {
    padding-left: 5px;
  }
}

.mobilephone {
  margin-top: 12px;
}

.check-phone {
  color: #e96848;
}

.u-text-center {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-box {
  margin-top: 16px;
  border: 1px solid #f5f3f0;
  border-radius: 8px;
  min-height: 40px;
  background-color: #fff;
  overflow: hidden;

  .repeat-item {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    min-height: 40px;
    padding: 11px 8px;
    border-bottom: 1px solid #f5f3f0;
    font-size: 12px;

    .repeat-name,
    .repeat-address,
    .repeat-remark {
      width: 31%;
    }

    .repeat-name {
      color: #333231;
    }

    .repeat-icon {
      width: 7%;
    }
  }
}
</style>
