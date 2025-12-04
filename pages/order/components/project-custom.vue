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
    <u--form :model="form" ref="form" :rules="rules" labelWidth="120px">
      <view class="add-card u-p-b-12">
        <u-form-item label="项目名称" prop="serveName" borderBottom class="form-required">
          <u-input v-model.number="form.serveName" maxlength="6" border="none" placeholder="必填"> </u-input>
        </u-form-item>
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

    <r-dialog v-model="show" title="选择自定义项目" @cancel="show = false">
      <view slot="content" class="content">
        <view v-for="c in customServeList" :key="c.id" class="custom-item u-border-bottom" @click="handleCustom(c)">{{ c.name }}</view>
      </view>
      <view slot="btns" class="btn" @click="show = false">以上都不是，自己填写</view>
    </r-dialog>
  </view>
</template>

<script>
import { saveServeItemUrl, customServeListUrl } from '@/api'

export default {
  data() {
    return {
      show: true,
      customServeList: [],
      form: { serveName: '' },
      rules: {
        serveName: { required: true, message: '项目名称不可为空', trigger: ['blur', 'change'] },
        money: [{ type: 'number', min: 0, max: 9999.99, message: '项目金额最高9999.99', trigger: ['blur', 'change'] }],
        count: [{ type: 'number', min: 0, max: 99, message: '项目数量在0-99之间', trigger: ['blur', 'change'] }],
        serveMinute: [{ type: 'number', min: 1, max: 999, message: '项目时长1-999分钟', trigger: ['blur', 'change'] }]
      }
    }
  },
  computed: {
    title() {
      return '服务项目-自定义'
    }
  },
  onLoad({ id }) {
    this.form.staffOrderId = id
    this.loadData()
  },
  methods: {
    async loadData() {
      const { data } = await uni.$u.http.post(customServeListUrl)
      this.customServeList = data
    },
    handleConfirm() {
      this.$refs.form.validate().then(async () => {
        if (!this.form.count && !this.form.serveMinute) {
          uni.$u.toast('数量和时长必选其一')
          return
        }
        await this.$refs.form.validate()
        await uni.$u.http.post(saveServeItemUrl, this.form)
        uni.navigateBack({ delta: 2 })
      })
    },
    handleCustom({ id, name }) {
      this.form.customServeId = id
      this.form.serveName = name
      this.show = false
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

/deep/ .dialog {
  width: 60vw;
}

.content {
  max-height: 40vh;
  overflow-y: auto;
}

.custom-item {
  padding: 10px;
  text-align: center;
}

.btn {
  padding-top: 15px;
  text-align: center;
  color: $u-primary;
  border-top: 1px solid #ccc;
}
</style>
