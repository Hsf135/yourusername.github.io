<template>
  <view class="u-p-b-20">
    <u-navbar title="延伸信息" placeholder bgColor="#FAF9F7">
      <view v-if="isEdit" slot="left" class="u-flex">
        <text class="u-primary" @click="backEdit">取消</text>
      </view>
      <view v-if="isEdit" slot="right" class="u-flex">
        <text class="u-primary" @click="submit">完成</text>
      </view>
      <u-icon v-if="!isEdit" slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
      <view v-if="!isEdit" slot="right" class="u-flex">
        <text class="u-primary" @click="handleEdit">编辑</text>
      </view>
    </u-navbar>
    <view class="unlive-info" v-if="info.deathFlag === '0' && !isEdit"> 该老人已去世，个人信息不纳入饱和度统计。若需编辑信息，请进入"延伸信息"页面，将"是否健在"改为"是" </view>
    <view v-if="!isEdit">
      <view class="base-box">
        <view class="title">延伸信息</view>
        <u-cell-group :border="false">
          <u-cell title="是否人户一致" :value="radioDict(info.entryFamilyFlag, 'yes_no')"></u-cell>
          <u-cell title="是否纳入饱和度计算" :value="radioDict(info.saturationLevel, 'yes_no')"></u-cell>
          <u-cell title="老人分类" :value="radioDict(info.elderClassify, 'elder_classify')"></u-cell>
          <u-cell v-if="isXiaMen" title="养老方式" :value="radioDict(info.pensionMode, 'pension_mode')"></u-cell>
          <u-cell title="政府补助标准" :value="checkDict(info.subsidyStandard, 'subsidy_standard')"></u-cell>
          <u-cell v-if="isXiaMen" title="补偿类型" :value="radioDict(info.compensationType, 'compensation_type')"></u-cell>
          <u-cell v-if="isXiaMen" title="政府补助金额度" :value="radioDict(info.subsidyQuota, 'gov_grant_amount')"></u-cell>
          <u-cell title="信誉评价" :value="radioDict(info.reputationEvaluation, 'reputation_evaluation')"></u-cell>
          <u-cell title="老人类型" :value="radioDict(info.oldmanType, 'elder_type')"></u-cell>
          <u-cell title="居住情况" :value="radioDict(info.oldmanLive, 'live_situation')"></u-cell>
          <u-cell title="老人群体" :value="radioDict(info.oldmanGroup, 'elder_group')"></u-cell>
          <u-cell title="老人性格" :value="radioDict(info.personality, 'elder_character')"></u-cell>
          <u-cell title="老人爱好" :value="checkDict(info.oldmanHobby, 'elder_hobby')"></u-cell>
          <u-cell title="上网方式" :value="checkDict(info.internetMode, 'internet_mode')"></u-cell>
          <u-cell title="上网目的" :value="checkDict(info.internetAim, 'internet_aims')"></u-cell>
          <u-cell title="是否健在" :value="radioDict(info.deathFlag, 'yes_no')"></u-cell>
          <u-cell title="死亡时间" v-if="info.dateOfDeath" :value="info.dateOfDeath.slice(0, 10)"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box u-p-t-0">
        <u-cell-group :border="false">
          <u-cell title="是否为残联服务对象" :value="radioDict(info.disableInfo.disableObject, 'yes_no')"></u-cell>
          <u-cell title="是否持证" :value="radioDict(info.disableInfo.hasCertificate, 'yes_no')"></u-cell>
          <u-cell title="持证时间" :value="info.disableInfo.certificateTime"></u-cell>
          <u-cell title="残疾证号" :value="info.disableInfo.certificateNumber"></u-cell>
          <u-cell title="残疾类别" :value="radioDict(info.disableInfo.disableCategory, 'disability_category')"></u-cell>
          <u-cell title="残疾等级细分" :value="disableLevelStr"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box u-p-t-0" v-if="false">
        <u-cell-group :border="false">
          <u-cell title="是否绑定设备" :value="radioDict(info.subsidyQuota, 'gov_grant_amount')"></u-cell>
          <u-cell title="设备卡信息" :value="radioDict(info.subsidyQuota, 'gov_grant_amount')"></u-cell>
          <u-cell title="到期时间" :value="radioDict(info.subsidyQuota, 'gov_grant_amount')"></u-cell>
          <u-cell title="关联设备" :value="radioDict(info.subsidyQuota, 'gov_grant_amount')"></u-cell>
        </u-cell-group>
      </view>
    </view>

    <u--form v-if="isEdit" labelWidth="110px" :model="info" :rules="rules" ref="info">
      <view class="base-box">
        <view class="title">延伸信息</view>
        <u-form-item label="是否人户一致" prop="entryFamilyFlag" borderBottom>
          <u-radio-group activeColor="#FF9500" v-model="info.entryFamilyFlag" placement="row">
            <u-radio :customStyle="{ marginRight: '24px' }" label="是" :name="1" />
            <u-radio :customStyle="{ marginRight: '24px' }" label="否" :name="0" />
          </u-radio-group>
        </u-form-item>
        <u-form-item label="是否纳入饱和度计算" prop="saturationLevel" borderBottom>
          <u-radio-group activeColor="#FF9500" v-model="info.saturationLevel" placement="row">
            <u-radio :customStyle="{ marginRight: '24px' }" label="是" :name="1" />
            <u-radio :customStyle="{ marginRight: '24px' }" label="否" :name="0" />
          </u-radio-group>
        </u-form-item>
        <u-form-item label="老人分类" prop="elderClassify" borderBottom class="form-required">
          <r-select v-model="info.elderClassify" :list="aDict('elder_classify')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="养老方式" prop="pensionMode" borderBottom>
          <r-select v-model="info.pensionMode" :list="aDict('pension_mode')" />
        </u-form-item>
        <u-form-item label="政府补助标准" prop="subsidyStandard" borderBottom>
          <r-select v-model="info.subsidyStandard" multiple mutual="0" :list="aDict('subsidy_standard')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="补偿类型" prop="compensationType" borderBottom>
          <r-select v-model="info.compensationType" :list="aDict('compensation_type')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="政府补助金额度" prop="subsidyQuota" borderBottom>
          <r-select v-model="info.subsidyQuota" :list="aDict('gov_grant_amount')" />
        </u-form-item>
        <u-form-item label="信誉评价" prop="reputationEvaluation" borderBottom>
          <r-select v-model="info.reputationEvaluation" :list="aDict('reputation_evaluation')" />
        </u-form-item>
        <u-form-item label="老人类型" prop="oldmanType" borderBottom>
          <r-select v-model="info.oldmanType" :list="aDict('elder_type')" />
        </u-form-item>
        <u-form-item label="居住情况" prop="oldmanLive" borderBottom class="form-required">
          <r-select v-model="info.oldmanLive" :list="aDict('live_situation')" />
        </u-form-item>
        <u-form-item label="老人群体" prop="oldmanGroup" borderBottom>
          <r-select v-model="info.oldmanGroup" :list="aDict('elder_group')" />
        </u-form-item>
        <u-form-item label="老人性格" prop="personality" borderBottom>
          <r-select v-model="info.personality" :list="aDict('elder_character')" />
        </u-form-item>
        <u-form-item label="老人爱好" prop="oldmanHobby" borderBottom class="form-required">
          <r-select v-model="info.oldmanHobby" multiple mutual="0" :list="aDict('elder_hobby')" />
        </u-form-item>
        <u-form-item label="上网方式" prop="internetMode" borderBottom>
          <r-select v-model="info.internetMode" multiple mutual="0" :list="aDict('internet_mode')" />
        </u-form-item>
        <u-form-item label="上网目的" prop="internetAim" borderBottom>
          <r-select v-model="info.internetAim" multiple mutual="0" :list="aDict('internet_aims')" />
        </u-form-item>
        <u-form-item label="是否健在" prop="deathFlag" borderBottom>
          <u-radio-group activeColor="#FF9500" v-model="info.deathFlag" placement="row" @change="changeDeathFlag">
            <u-radio :customStyle="{ marginRight: '24px' }" v-for="item in aDict('yes_no')" :key="item.value" :label="item.label" :name="item.value"> </u-radio>
          </u-radio-group>
        </u-form-item>
        <u-form-item v-if="info.deathFlag === '0'" label="死亡时间" prop="dateOfDeath" borderBottom @click="showTime = true">
          <text v-if="info.dateOfDeath">{{ info.dateOfDeath.slice(0, 10) }}</text>
          <text v-else class="u-place-color">请选择</text>
          <u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
        </u-form-item>
      </view>

      <view class="base-box u-p-t-0">
        <u-form-item label="是否为残联服务对象" prop="disableObject" borderBottom>
          <u-radio-group activeColor="#FF9500" v-model="info.disableInfo.disableObject" placement="row">
            <u-radio :customStyle="{ marginRight: '24px' }" label="是" :name="1" />
            <u-radio :customStyle="{ marginRight: '24px' }" label="否" :name="0" />
          </u-radio-group>
        </u-form-item>
        <!-- 相关信息未编辑过的时候，是否健在选否可以编辑，编辑保存后，选否就不能编辑了 v-if="(!info.disableInfo.id && info.deathFlag === '0') || (info.disableInfo.id && info.deathFlag !== '0')" -->
        <view class="add-item mobilephone" @click="toPage(`/pages/old-man/components/exten-disabled?deathFlag=${info.deathFlag}`)">
          <u-icon :name="aIcon('bianji')" width="24" height="24"></u-icon>
          <text>请填写相关信息</text>
        </view>
      </view>
    </u--form>

    <u-datetime-picker v-if="showTime" @cancel="showTime = false" @confirm="changeTime" :show="showTime" :formatter="formatter" v-model="time" :minDate="-2209017943000" :maxDate="maxDate" closeOnClickOverlay @close="showTime = false" mode="date"> </u-datetime-picker>

    <r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false" @confirm="dialogConfirm">
      <view slot="content" class="u-flex">
        <text>当前页面已做出修改，是否不保存就退出</text>
      </view>
    </r-dialog>

    <!-- 是否健在为否 的完成操作弹窗 -->
    <r-dialog v-model="deathFlagEditShow" title="是否健在状态变更提醒" cancelText="取消" confirmText="确认修改" @cancel="deathFlagEditShow = false" @confirm="deathFlagEditConfirm">
      <view slot="content">
        <view>
          <text>改为“否”后，将产生一下变化：</text>
        </view>
        <view>
          <text>饱和度：该老人的将不纳入饱和度计算；</text>
        </view>
        <view class="u-font-16 u-main-color u-text-center u-bold u-m-t-16"> 是否确认修改为“否”？ </view>
      </view>
    </r-dialog>
  </view>
</template>

<script>
import { getCustomerExtendDetailUrl, updateCustomerExtendUrl } from '../../api'
export default {
  data() {
    return {
      deathFlagEditShow: false,
      initDeathFlag: '', //是否健在字段的原有值
      info: { disableInfo: {} },
      customerId: undefined,
      alive: undefined,
      disableLevel_type: [
        { name: '肢体', value: 'disablelevelMinceLimbs' },
        { name: '智力', value: 'disablelevelMinceIntelligence' },
        { name: '多重', value: 'disablelevelMinceMultiple' },
        { name: '言语', value: 'disablelevelMinceSpeech' },
        { name: '视力', value: 'disablelevelMinceVision' },
        { name: '精神', value: 'disablelevelMinceSpirit' },
        { name: '听力', value: 'disablelevelMinceHearing' }
      ],
      disableLevelStr: '',
      isEdit: false,
      unsave: false,
      show: false,
      rules: {
        elderClassify: [
          {
            required: true,
            message: '老人分类不可为空',
            trigger: ['change']
          }
        ],
        oldmanLive: [
          {
            required: true,
            message: '居住情况不可为空',
            trigger: ['change']
          }
        ],
        oldmanHobby: [
          {
            required: true,
            type: 'array',
            message: '老人爱好不可为空',
            trigger: ['change']
          }
        ]
      },
      showTime: false,
      time: new Date(),
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
  onLoad(option) {
    this.customerId = option.id
    this.alive = option.alive || undefined
    this.loadData()
  },
  onShow() {
    this.info.disableInfo = {
      ...this.info.disableInfo,
      ...this.vuex_disableInfo
    }
    setTimeout(() => {
      this.unsave = false
    }, 10)
  },
  methods: {
    async loadData() {
      const { data } = await uni.$u.http.post(`${getCustomerExtendDetailUrl}?customerId=${this.customerId}`)
      this.initDeathFlag = data.deathFlag
      this.info = data
      this.$u.vuex('vuex_disableInfo', data.disableInfo)
      this.time = data.dateOfDeath ? data.dateOfDeath : new Date()
      this.disableLevel()
      setTimeout(() => {
        this.unsave = false
      }, 10)
    },
    disableLevel() {
      const newArr = this.disableLevel_type.map(level => {
        return this.info.disableInfo[level.value] ? level.name + this.aDict('disableLevel_mince').find(item => item.value === this.info.disableInfo[level.value]).label : ''
      })
      this.disableLevelStr = newArr.filter(item => item !== '').join('，')
    },
    toPage(url) {
      uni.navigateTo({ url })
    },
    handleBack() {
      uni.navigateBack()
      this.$u.vuex('vuex_disableInfo', {})
    },
    submit() {
      this.$refs.info
        .validate()
        .then(res => {
          if (this.isEdit) {
            //修改了 是否健在 从 “是” 改成 “否”
            if (this.info.deathFlag === '0' && this.initDeathFlag === '1') {
              this.deathFlagEditShow = true
              return
            }
            this.edit()
            return
          }
        })
        .catch(errors => {
          // console.log(errors)
          uni.$u.toast('请完善必填项')
        })
    },
    //确认修改
    async deathFlagEditConfirm() {
      await this.edit()
      this.deathFlagEditShow = false
    },
    async edit() {
      try {
        const res = await uni.$u.http.post(updateCustomerExtendUrl, { ...this.info, customerId: this.customerId })
        if (res.code === 200) {
          uni.$u.toast('修改成功')
          this.isEdit = false
          this.loadData()
        }
      } catch (e) {
        uni.$u.toast(e.msg)
      }
    },
    backEdit() {
      if (this.unsave) {
        this.show = true
        return
      }
      this.isEdit = false
      this.loadData()
    },
    dialogConfirm() {
      if (this.isEdit) {
        this.isEdit = false
        this.loadData()
        return
      }
      uni.navigateBack()
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
      this.info.dateOfDeath = timeFormat(e.value, 'yyyy-mm-dd')
      this.time = timeFormat(e.value, 'yyyy-mm-dd')
      this.showTime = false
    },
    changeDeathFlag() {
      this.info.dateOfDeath = undefined
      this.time = new Date()
    },
    handleEdit() {
      if (!this.isSingleProject) {
        uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
        return
      }
      this.isEdit = true
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
</style>
