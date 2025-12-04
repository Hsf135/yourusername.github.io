<template>
  <view>
    <u-navbar title="编辑残联对象信息" placeholder bgColor="#FAF9F7" @leftClick="handleBack">
      <template v-if="!info.id || (info.id && deathFlag === '1')">
        <view slot="left" class="u-flex">
          <text class="u-primary" @click="backEdit">取消</text>
        </view>
        <view slot="right" class="u-flex">
          <text class="u-primary" @click="submit">保存</text>
        </view>
      </template>
    </u-navbar>
    <view class="base-box" v-if="info.id && deathFlag === '0'">
      <u-cell-group :border="false">
        <u-cell title="是否持证" :value="radioDict(info.hasCertificate, 'yes_no')"></u-cell>
        <u-cell title="持证时间" :value="info.certificateTime"></u-cell>
        <u-cell title="残疾证号" :value="info.certificateNumber"></u-cell>
        <u-cell title="残疾类别" :value="radioDict(info.disableCategory, 'disability_category')"></u-cell>
        <u-cell title="残疾等级细分:" value=""></u-cell>
        <u-cell class="label-center" title="肢体等级" :value="radioDict(info.disablelevelMinceLimbs, 'disableLevel_mince')"></u-cell>
        <u-cell class="label-center" title="智力等级" :value="radioDict(info.disablelevelMinceIntelligence, 'disableLevel_mince')"></u-cell>
        <u-cell class="label-center" title="言语等级" :value="radioDict(info.disablelevelMinceSpeech, 'disableLevel_mince')"></u-cell>
        <u-cell class="label-center" title="视力等级" :value="radioDict(info.disablelevelMinceVision, 'disableLevel_mince')"></u-cell>
        <u-cell class="label-center" title="精神等级" :value="radioDict(info.disablelevelMinceSpirit, 'disableLevel_mince')"></u-cell>
        <u-cell class="label-center" title="听力等级" :value="checkDict(info.disablelevelMinceHearing, 'disableLevel_mince')"></u-cell>
      </u-cell-group>
    </view>

    <u--form labelWidth="110px" :model="info" ref="info" v-else>
      <view class="base-box">
        <u-form-item label="是否持证" prop="hasCertificate" borderBottom>
          <u-radio-group activeColor="#FF9500" v-model="info.hasCertificate" placement="row" @change="changeHasCertificate">
            <u-radio :customStyle="{ marginRight: '24px' }" v-for="item in aDict('yes_no')" :key="item.value" :label="item.label" :name="item.value"> </u-radio>
          </u-radio-group>
        </u-form-item>
        <!-- @click="showTime = true" -->
        <u-form-item v-if="info.hasCertificate === '1'" label="持证时间" prop="certificateTime" borderBottom>
          <!-- <text v-if="info.certificateTime">{{ info.certificateTime.slice(0, 10) }}</text>
          <text v-else class="u-place-color">请选择</text>
          <u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon> -->
          <r-date-select v-model="info.certificateTime" mode="datetime" placeholder="请选择持证时间"></r-date-select>
        </u-form-item>
        <u-form-item v-if="info.hasCertificate === '1'" label="残疾证号" prop="certificateNumber" borderBottom>
          <u-input v-model="info.certificateNumber" clearable maxlength="32" border="none" placeholder="请输入残疾证号"> </u-input>
        </u-form-item>
        <u-form-item label="残疾类别" prop="disableCategory" borderBottom>
          <r-select v-model="info.disableCategory" :list="aDict('disability_category')" />
        </u-form-item>
        <u-form-item label="残疾等级细分:" prop="disableCategory" borderBottom></u-form-item>
        <u-form-item label="肢体等级" prop="disablelevelMinceLimbs" borderBottom class="form-center">
          <r-select v-model="info.disablelevelMinceLimbs" :list="aDict('disableLevel_mince')" />
        </u-form-item>
        <u-form-item label="智力等级" prop="disablelevelMinceIntelligence" borderBottom class="form-center">
          <r-select v-model="info.disablelevelMinceIntelligence" :list="aDict('disableLevel_mince')" />
        </u-form-item>
        <u-form-item label="言语等级" prop="disablelevelMinceSpeech" borderBottom class="form-center">
          <r-select v-model="info.disablelevelMinceSpeech" :list="aDict('disableLevel_mince')" />
        </u-form-item>
        <u-form-item label="视力等级" prop="disablelevelMinceVision" borderBottom class="form-center">
          <r-select v-model="info.disablelevelMinceVision" :list="aDict('disableLevel_mince')" />
        </u-form-item>
        <u-form-item label="精神等级" prop="disablelevelMinceSpirit" borderBottom class="form-center">
          <r-select v-model="info.disablelevelMinceSpirit" :list="aDict('disableLevel_mince')" />
        </u-form-item>
        <u-form-item label="听力等级" prop="disablelevelMinceHearing" borderBottom class="form-center">
          <r-select v-model="info.disablelevelMinceHearing" :list="aDict('disableLevel_mince')" />
        </u-form-item>
      </view>
    </u--form>
    <!--  :formatter="formatter" -->
    <u-datetime-picker @cancel="showTime = false" @confirm="changeTime" :show="showTime" v-model="time" :minDate="-2209017943000" closeOnClickOverlay :maxDate="maxDate" @close="showTime = false" mode="datetime"> </u-datetime-picker>

    <r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false" @confirm="dialogConfirm">
      <view slot="content" class="u-flex">
        <text>当前页面已做出修改，是否不保存就退出</text>
      </view>
    </r-dialog>
  </view>
</template>

<script>
export default {
  data() {
    return {
      deathFlag: '', //是否健在0:否
      info: { ownerName: '', contactRole: '', phoneNumber: undefined, hasCertificate: '' },
      customerId: undefined,
      unsave: false,
      show: false,
      isEdit: false,
      index: undefined,
      showTime: false,
      time: Number(new Date()),
      maxDate: new Date().getTime()
    }
  },
  watch: {
    info: {
      handler: function () {
        this.unsave = true
      },
      deep: true
    }
  },
  onLoad({ deathFlag }) {
    this.deathFlag = deathFlag
  },
  onShow() {
    this.info = { ...this.vuex_disableInfo }
    this.time = this.vuex_disableInfo.certificateTime ? this.vuex_disableInfo.certificateTime.slice(0, 9) : Number(new Date())
    setTimeout(() => {
      this.unsave = false
    }, 10)
  },
  methods: {
    toPage(url) {
      uni.navigateTo({ url })
    },
    handleBack() {
      uni.navigateBack()
    },
    submit() {
      this.add()
    },
    add() {
      this.$u.vuex('vuex_disableInfo', this.info)
      uni.navigateBack()
    },
    backEdit() {
      if (this.unsave) {
        this.show = true
        return
      }
      uni.navigateBack()
    },
    dialogConfirm() {
      uni.navigateBack()
    },
    changeHasCertificate() {
      this.info.certificateTime = ''
      this.info.certificateNumber = ''
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
      this.info.certificateTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM:ss')
      this.time = timeFormat(e.value, 'yyyy-mm-dd')
      this.showTime = false
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 12px;
  color: $u-main-color;
  font-size: 16px;
  font-weight: bold;
}

/deep/ .u-form-item__body__left {
  line-height: 22px;
}

/deep/ .u-cell__body {
  padding: 10px 0;
  min-height: 44px;
  align-items: flex-start;
}

/deep/ .u-cell__body__content {
  width: 110px;
  flex: inherit;
}

/deep/ .u-cell__value {
  text-align: left;
}

.add-item {
  display: flex;
  align-items: center;
  color: #ff9500;
  margin-top: 12px;

  text {
    padding-left: 5px;
  }
}

.form-center {
  /deep/ .u-form-item__body__left__content__label {
    justify-content: center !important;
  }
}
.label-center {
  /deep/ .u-cell__title-text {
    text-align: center;
  }
}
</style>
