<template>
  <view class="add-page">
    <u-navbar :title="title" placeholder bgColor="#FAF9F7">
      <view slot="left" class="u-flex">
        <text class="u-info" @click="toBack">取消</text>
      </view>
      <view slot="right" class="u-flex">
        <text class="u-primary" @click="handleConfirm">确认</text>
      </view>
    </u-navbar>
    <u--form labelWidth="120px" :model="form" :rules="rules" ref="form">
      <view class="add-card u-p-12">
        <text class="u-bold">项目名称: {{ form.serveName }}</text>
      </view>
      <view class="add-card u-p-b-12">
        <u-form-item label="项目金额(元)" prop="money" borderBottom>
          <u-input v-model.number="form.money" type="number" maxlength="6" border="none" placeholder="非必填,最高9999.99"> </u-input>
        </u-form-item>
        <u-form-item label="项目数量" prop="count" borderBottom>
          <u-input v-model.number="form.count" type="number" maxlength="2" border="none" placeholder="0-99,数量和时长必选其一"> </u-input>
        </u-form-item>
        <u-form-item label="项目时长(分钟)" prop="serveMinute" borderBottom>
          <u-input v-model.number="form.serveMinute" type="number" maxlength="3" border="none" placeholder="1-999,数量和时长必选其一"> </u-input>
        </u-form-item>
      </view>
    </u--form>

    <view v-if="delBtn === '1'" class="btn">
      <u-button type="error" plain text="删除该项目" class="btn-loginOut" @click="showDel = true"></u-button>
    </view>

    <r-dialog v-model="showDel" title="温馨提示" cancelText="取消" confirmText="确认" content="确认删除项目?" @cancel="showDel = false" @confirm="handleDel"> </r-dialog>
  </view>
</template>

<script>
import { updateServeItemUrl, removeServeItemUrl } from '@/api'

export default {
  data() {
    return {
      form: {},
      showDel: false,
      delBtn: false,
      rules: {
        money: [{ type: 'number', min: 0, max: 9999.99, message: '项目金额最高9999.99', trigger: ['blur', 'change'] }],
        count: [{ type: 'number', min: 0, max: 99, message: '项目数量在0-99之间', trigger: ['blur', 'change'] }],
        serveMinute: [{ type: 'number', min: 1, max: 999, message: '项目时长1-999分钟', trigger: ['blur', 'change'] }]
      }
    }
  },
  computed: {
    title() {
      return '修改服务项目' + this.form.index
    }
  },
  onUnload() {
    this.$u.vuex('vuex_projectEdit', {})
  },
  onLoad({ delBtn = '1' }) {
    this.delBtn = delBtn
    this.form = { ...this.vuex_projectEdit }
  },
  methods: {
    async handleConfirm() {
      if (!this.form.count && !this.form.serveMinute) {
        uni.$u.toast('数量和时长必选其一')
        return
      }
      await this.$refs.form.validate()
      await uni.$u.http.post(updateServeItemUrl, this.form)
      uni.navigateBack()
    },
    async handleDel() {
      const url = `${removeServeItemUrl}?id=${this.form.id}`
      await uni.$u.http.post(url)
      this.showDel = false
      uni.navigateBack()
    },
    toBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped lang="scss">
.add-page {
  background-color: #faf9f7;
  position: relative;
  min-height: 100vh;
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
  padding: 0 12px;
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

.btn {
  position: absolute;
  left: 15%;
  bottom: 80px;
  width: 70%;
}
</style>
