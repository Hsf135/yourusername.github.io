<template>
  <view class="u-p-b-20">
    <u-navbar title="需求信息" placeholder bgColor="#FAF9F7">
      <view v-if="isEdit" slot="left" class="u-flex">
        <text class="u-primary" @click="backEdit">取消</text>
      </view>
      <view v-if="isEdit" slot="right" class="u-flex">
        <text class="u-primary" @click="submit">完成</text>
      </view>
      <u-icon v-if="!isEdit" slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
      <view v-if="!isEdit" slot="right" class="u-flex">
        <text class="u-primary" v-if="alive !== '0'" @click="handleEdit">编辑</text>
      </view>
    </u-navbar>
    <view class="unlive-info" v-if="alive === '0'"> 该老人已去世，个人信息不纳入饱和度统计。若需编辑信息，请进入"延伸信息"页面，将"是否健在"改为"是" </view>
    <view v-if="!isEdit">
      <view class="base-box">
        <view class="title">需求情况</view>
        <u-cell-group :border="false">
          <u-cell v-if="isXiaMen" title="接受电话关怀精神慰问" :value="radioDict(info.isCare, 'yes_no')"></u-cell>
          <u-cell title="家政需求" :value="checkDict(info.domesticDemand, 'domestic_demand')"></u-cell>
          <u-cell title="生活需求" :value="checkDict(info.livingDemand, 'living_demand')"></u-cell>
          <u-cell title="医疗需求" :value="checkDict(info.medicalDemand, 'medical_demand')"></u-cell>
          <u-cell title="安全需求" :value="checkDict(info.securityDemand, 'security_demand')"></u-cell>
          <u-cell title="精神需求" :value="checkDict(info.spiritDemand, 'spirit_demand')"></u-cell>
          <u-cell
            v-if="isXiaMen"
            title="需求重要程度"
            :value="formatDemandImportant(info.demandImportantLevel)"
          ></u-cell>
          <u-cell title="其他需求" :value="info.otherDemand"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box">
        <view class="title">消费情况</view>
        <u-cell-group :border="false">
          <u-cell title="当前主要消费" :value="matchLabels(info.currMainConsumption, 'curr_main_consumption')"></u-cell>
          <u-cell title="每年次消费" :value="radioDict(info.everyYearConsumption, 'every_year_consumption')"></u-cell>
          <u-cell title="喜欢的旅游方式" :value="checkDict(info.fondTourismType, 'fond_tourism_type')"></u-cell>
          <u-cell title="旅游频次" :value="radioDict(info.tourismFrequency, 'tourism_frequency')"></u-cell>
          <u-cell title="旅游距离" :value="checkDict(info.fondTourismDistance, 'fond_tourism_distance')"></u-cell>
          <u-cell v-if="isXiaMen" title="健康项目需求" :value="checkDict(info.wishHealthyObject, 'wish_healthy_object')"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box">
        <view class="title">分析总结</view>
        <u-cell-group :border="false">
          <u-cell title="分析总结" :value="info.analysisSummary"></u-cell>
          <u-cell title="特殊情况" :value="info.specialInstructions"></u-cell>
        </u-cell-group>
      </view>
    </view>

    <u--form v-if="isEdit" labelWidth="110px" :model="info" :rules="rules" ref="info">
      <view class="base-box">
        <view class="title">需求情况</view>
        <u-form-item v-if="isXiaMen" label="接受电话关怀精神慰问" prop="isCare" borderBottom>
          <u-radio-group activeColor="#FF9500" v-model="info.isCare" placement="row">
            <u-radio :customStyle="{ marginRight: '24px' }" v-for="item in aDict('yes_no')" :key="item.value" :label="item.label" :name="item.value"> </u-radio>
          </u-radio-group>
        </u-form-item>
        <u-form-item label="家政需求" prop="domesticDemand" borderBottom class="form-required">
          <r-select v-model="info.domesticDemand" multiple mutual="0" :list="aDict('domestic_demand')" />
        </u-form-item>
        <u-form-item label="生活需求" prop="livingDemand" borderBottom class="form-required">
          <r-select v-model="info.livingDemand" multiple mutual="0" :list="aDict('living_demand')" />
        </u-form-item>
        <u-form-item label="医疗需求" prop="medicalDemand" borderBottom class="form-required">
          <r-select v-model="info.medicalDemand" multiple mutual="0" :list="aDict('medical_demand')" />
        </u-form-item>
        <u-form-item label="安全需求" prop="securityDemand" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="info.securityDemand" multiple mutual="0" :list="aDict('security_demand')" />
        </u-form-item>
        <u-form-item label="精神需求" prop="spiritDemand" borderBottom class="form-required">
          <r-select v-model="info.spiritDemand" multiple mutual="0" :list="aDict('spirit_demand')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="需求重要程度" prop="demandImportantLevel" borderBottom>
          <r-select-sort :beforeConfirm="validateDemandLevel" v-model="info.demandImportantLevel" multiple :list="aDict('demand_important_level')" />
        </u-form-item>
        <u-form-item label="其他需求" prop="otherDemand" borderBottom :class="{ 'form-required': !isXiaMen }">
          <u-input v-model="info.otherDemand" clearable maxlength="32" border="none" placeholder="请输入其他需求"> </u-input>
        </u-form-item>
      </view>

      <view class="base-box">
        <view class="title">消费情况</view>
        <u-form-item label="当前主要消费" prop="currMainConsumption" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="info.currMainConsumption" multiple mutual="11" allcheck :list="aDict('curr_main_consumption')" />
        </u-form-item>
        <u-form-item label="每年次消费" prop="everyYearConsumption" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="info.everyYearConsumption" :list="aDict('every_year_consumption')" />
        </u-form-item>
        <u-form-item label="喜欢的旅游方式" prop="fondTourismType" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="info.fondTourismType" multiple mutual="0" :list="aDict('fond_tourism_type')" />
        </u-form-item>
        <u-form-item label="旅游频次" prop="tourismFrequency" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="info.tourismFrequency" :list="aDict('tourism_frequency')" />
        </u-form-item>
        <u-form-item label="旅游距离" prop="fondTourismDistance" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="info.fondTourismDistance" multiple mutual="0" :list="aDict('fond_tourism_distance')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="健康项目需求" prop="wishHealthyObject" borderBottom>
          <r-select v-model="info.wishHealthyObject" multiple mutual="0" :list="aDict('wish_healthy_object')" />
        </u-form-item>
      </view>

      <view class="base-box">
        <view class="title">分析总结</view>
        <u-form-item label="分析总结" prop="analysisSummary" borderBottom :class="{ 'form-required': isXiaMen }">
          <u-input v-model="info.analysisSummary" clearable maxlength="1000" border="none" placeholder="请输入分析总结"> </u-input>
        </u-form-item>
        <u-form-item label="特殊情况" prop="specialInstructions" borderBottom>
          <u-input v-model="info.specialInstructions" clearable maxlength="1000" border="none" placeholder="请输入其他需求"> </u-input>
        </u-form-item>
      </view>
    </u--form>

    <r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false" @confirm="dialogConfirm">
      <view slot="content" class="u-flex">
        <text>当前页面已做出修改，是否不保存就退出</text>
      </view>
    </r-dialog>
  </view>
</template>

<script>
import { getCustomerDemandDetailUrl, updateCustomerDemandUrl } from '../../api'
import rSelectSort from '../../components/r-select-sort.vue'
export default {
  components: { rSelectSort },
  data() {
    return {
      info: {},
      alive: undefined,
      customerId: undefined,
      isEdit: false,
      unsave: false,
      show: false
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
  computed: {
    rules() {
      return {
        isCare: [
          {
            required: false,
            message: '接受电话关怀精神慰问不可为空',
            trigger: ['blur', 'change']
          }
        ],
        domesticDemand: [
          {
            required: true,
            type: 'array',
            message: '家政需求不可为空',
            trigger: ['blur', 'change']
          }
        ],
        livingDemand: [
          {
            required: true,
            type: 'array',
            message: '生活需求不可为空',
            trigger: ['blur', 'change']
          }
        ],
        medicalDemand: [
          {
            required: true,
            type: 'array',
            message: '医疗需求不可为空',
            trigger: ['blur', 'change']
          }
        ],
        securityDemand: [
          {
            required: !this.isXiaMen,
            type: 'array',
            message: '安全需求不可为空',
            trigger: ['blur', 'change']
          }
        ],
        spiritDemand: [
          {
            required: true,
            type: 'array',
            message: '精神需求不可为空',
            trigger: ['blur', 'change']
          }
        ],
        analysisSummary: [
          {
            required: this.isXiaMen,
            message: '分析总结不可为空',
            trigger: ['blur', 'change']
          }
        ],
        otherDemand: [
          {
            required: !this.isXiaMen,
            message: '其他需求不可为空',
            trigger: ['blur']
          }
        ],
        currMainConsumption: [
          {
            required: !this.isXiaMen,
            type: 'array',
            message: '当前主要消费不可为空',
            trigger: ['blur', 'change']
          }
        ],
        everyYearConsumption: [
          {
            required: !this.isXiaMen,
            message: '每年次消费不可为空',
            trigger: ['blur', 'change']
          }
        ],
        fondTourismType: [
          {
            type: 'array',
            required: !this.isXiaMen,
            message: '喜欢的旅游方式不可为空',
            trigger: ['blur', 'change']
          }
        ],
        tourismFrequency: [
          {
            required: !this.isXiaMen,
            message: '旅游频次不可为空',
            trigger: ['blur', 'change']
          }
        ],
        fondTourismDistance: [
          {
            type: 'array',
            required: !this.isXiaMen,
            message: '旅游距离不可为空',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  onLoad(option) {
    this.customerId = option.id
    this.alive = option.alive || undefined
    this.loadData()
  },
  methods: {
    formatDemandImportant(values) {
      if (!Array.isArray(values) || !values.length) {
        return ''
      }
      const dict = this.aDict('demand_important_level')
      return values
        .map(val => {
          const item = dict.find(d => d.value === val || d.value === String(val))
          return item ? item.label : ''
        })
        .filter(Boolean)
        .join('，')
    },
    validateDemandLevel(value) {
      const min = 5

      if (!value || value.length === 0) {
        uni.$u.toast('请至少选择一项需求重要程度')
        return false
      }

      if (value.length < min) {
        uni.$u.toast(`需求重要程度需至少勾选${min}项（当前已选${value.length}项）`)
        return false
      }

      // 检查是否包含"无"选项（假设"无"的值是'0'）
      if (value.includes('0')) {
        uni.$u.toast('需求重要程度不能选择"无"')
        return false
      }

      return true
    },

    async loadData() {
      const { data } = await uni.$u.http.post(`${getCustomerDemandDetailUrl}?customerId=${this.customerId}`)
      this.info = data
      setTimeout(() => {
        this.unsave = false
      }, 10)
    },
    toPage(url) {
      uni.navigateTo({ url })
    },
    handleBack() {
      uni.navigateBack()
    },
    submit() {
      this.$refs.info
        .validate()
        .then(res => {
          if (this.isEdit) {
            this.edit()
            return
          }
        })
        .catch(errors => {
          uni.$u.toast('请完善必填项')
        })
    },
    async edit() {
      try {
        const res = await uni.$u.http.post(updateCustomerDemandUrl, { ...this.info, customerId: this.customerId })
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
</style>
