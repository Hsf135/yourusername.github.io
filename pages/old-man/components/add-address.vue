<template>
  <view class="add-page">
    <!-- 新增标题 -->
    <u-navbar :title="title" placeholder bgColor="#FAF9F7">
      <u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="back"></u-icon>
      <view slot="right" class="u-flex">
        <text v-if="mode === 'edit'" class="u-primary" @click="submit">完成</text>
        <text v-else class="u-primary" @click="confirm">确认</text>
      </view>
    </u-navbar>

    <view v-if="mode === 'select'" class="tips">地址选择请按照层级进行选择，比如需要筛选到“街道”层级，请先选择“省”、“市”、“区”。</view>

    <u--form labelWidth="110px" :model="form" ref="form" :rules="rules">
      <view class="add-card">
        <u-form-item label="省" :prop="`${type}Province`" borderBottom>
          <r-select v-model="form[`${type}Province`]" title="请选择省" valueKey="code" labelKey="name" :list="provinceList"
            @change="provinceChange" />
        </u-form-item>
        <u-form-item label="市/地区" :prop="`${type}City`" borderBottom>
          <r-select v-model="form[`${type}City`]" title="请选择市/地区" limitTips="请先选择省" valueKey="code" labelKey="name"
            :list="cityList" @change="cityChange" />
        </u-form-item>
        <u-form-item label="区/县" :prop="`${type}County`" borderBottom>
          <r-select v-model="form[`${type}County`]" title="请选择区/县" limitTips="请先选择市/地区" valueKey="code" labelKey="name"
            :list="countyList" @change="countyChange" />
        </u-form-item>
        <u-form-item label="街道" :prop="`${type}Street`" borderBottom>
          <r-select v-model="form[`${type}Street`]" title="请选择街道" limitTips="请先选择区/县" valueKey="code" labelKey="name"
            :list="streetList" @change="streetChange" />
        </u-form-item>
        <u-form-item label="社区" :prop="`${type}Community`" borderBottom>
          <r-select v-model="form[`${type}Community`]" title="请选择社区" limitTips="请先选择街道" valueKey="code" labelKey="name"
            :list="communityList" @change="communityChange" />
        </u-form-item>

        <u-form-item labelWidth="0" label="" :prop="`${type}Village`" borderBottom>
          <u-input v-model="form[`${type}Village`]" clearable maxlength="32" border="none" placeholder="小区"> </u-input>
        </u-form-item>
        <u-form-item labelWidth="0" label="" :prop="`${type}Address`" borderBottom>
          <u-input v-model="form[`${type}Address`]" clearable maxlength="32" border="none" placeholder="详细地址">
          </u-input>
        </u-form-item>
      </view>
    </u--form>

    <view v-if="hasCopy" class="add-card">
      <view class="u-flex">
        <u-checkbox-group v-model="copy" activeColor="#FF9500" @change="copyChange">
          <u-checkbox name="1"></u-checkbox>
        </u-checkbox-group>
        <view :style="{ color: copy.length ? '#FF9500' : '#333' }">使用{{ label }}地址</view>
      </view>
      <view class="copytext">{{ vuex_addressInfoCopy[`${elseType}AllAddress`] }}</view>
    </view>

    <r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false"
      @confirm="dialogConfirm">
      <view slot="content" class="u-flex">
        <text>当前页面已做出修改，是否不保存就退出</text>
      </view>
    </r-dialog>
  </view>
</template>

<script>
import { getRegionUrl } from '@/api'

export default {
  data() {
    return {
      loading: false,
      isEdit: false,
      show: false,
      unsave: false,
      form: {},
      provinceList: [],
      cityList: [],
      countyList: [],
      streetList: [],
      communityList: [],
      copy: [],
      type: ''
    }
  },
  computed: {
    title() {
      return `${this.mode === 'select' ? '选择' : '编辑'}${this.type === 'domicile' ? '户籍' : '现居'}地址`
    },
    rules() {
      return {
        [`${this.type}Province`]: { required: true, message: '请选择省', trigger: ['blur', 'change'] },
        [`${this.type}City`]: { required: true, message: '请选择市/地区', trigger: ['blur', 'change'] },
        [`${this.type}County`]: { required: true, message: '请选择区/县', trigger: ['blur', 'change'] },
        [`${this.type}Street`]: { required: true, message: '请选择街道', trigger: ['blur', 'change'] },
        [`${this.type}Community`]: { required: true, message: '请选择社区', trigger: ['blur', 'change'] }
      }
    },
    elseType() {
      return this.type === 'domicile' ? 'current' : 'domicile'
    },
    hasCopy() {
      return this.vuex_addressInfoCopy[`${this.elseType}AllAddress`]
    },
    label() {
      return this.elseType === 'domicile' ? '户籍' : '现居地'
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
  onLoad({ type = 'domicile', mode = 'edit' }) {
    // mode: edit: 编辑；select： 选择
    // type: domicile: 户籍；current
    this.type = type
    this.mode = mode
    this.loadProvince()
    this.init()
  },
  onReady() {
    //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
    if (this.mode === 'edit') {
      this.$refs.form.setRules(this.rules)
    }
  },
  methods: {
    async loadProvince() {
      const { list } = await uni.$u.http.get(getRegionUrl)
      this.provinceList = list
    },
    async loadCity() {
      const params = { params: { parentCode: this.form[`${this.type}Province`] } }
      const { list } = await uni.$u.http.get(getRegionUrl, params)
      this.cityList = list
    },
    async loadCounty() {
      const params = { params: { parentCode: this.form[`${this.type}City`] } }
      const { list } = await uni.$u.http.get(getRegionUrl, params)
      this.countyList = list
    },
    async loadStreet() {
      const params = { params: { parentCode: this.form[`${this.type}County`] } }
      const { list } = await uni.$u.http.get(getRegionUrl, params)
      this.streetList = list
    },
    async loadCommunity() {
      const params = { params: { parentCode: this.form[`${this.type}Street`] } }
      const { list } = await uni.$u.http.get(getRegionUrl, params)
      this.communityList = list
      // 如果是编辑模式且已有社区值，确保重新赋值触发响应
      if (this.mode === 'edit' && this.form[`${this.type}Community`]) {
        this.$nextTick(() => {
          const community = this.form[`${this.type}Community`]
          this.$set(this.form, `${this.type}Community`, community)
        })
      }
    },
    async provinceChange(value, label) {
      this.$set(this.form, `${this.type}ProvinceName`, label)
      this.$set(this.form, `${this.type}City`, '')
      this.$set(this.form, `${this.type}County`, '')
      this.$set(this.form, `${this.type}Street`, '')
      this.$set(this.form, `${this.type}Community`, '')
      this.cityList = []
      this.countyList = []
      this.streetList = []
      this.communityList = []
      await this.loadCity()
    },
    async cityChange(value, label) {
      this.$set(this.form, `${this.type}CityName`, label)
      this.$set(this.form, `${this.type}County`, '')
      this.$set(this.form, `${this.type}Street`, '')
      this.$set(this.form, `${this.type}Community`, '')
      this.countyList = []
      this.streetList = []
      this.communityList = []
      await this.loadCounty()
    },
    async countyChange(value, label) {
      this.$set(this.form, `${this.type}CountyName`, label)
  this.$set(this.form, `${this.type}Street`, '')
  this.$set(this.form, `${this.type}Community`, '')
  this.streetList = []
  this.communityList = []
  await this.loadStreet()
    },
    async streetChange(value, label) {
      this.$set(this.form, `${this.type}StreetName`, label)
      // 先清空社区相关的值
      this.$set(this.form, `${this.type}Community`, '')
      this.$set(this.form, `${this.type}CommunityName`, '')
      // 再清空列表
      this.communityList = []
      // 最后加载新数据
      await this.loadCommunity()
    },
    async communityChange(value, label) {
      // 使用 $nextTick 确保 DOM 更新
      this.$nextTick(() => {
        this.$set(this.form, `${this.type}CommunityName`, label)      
      })
    },
    init() {
      this.form = {
        [`${this.type}Province`]: '',
        [`${this.type}ProvinceName`]: '',  // 新增
        [`${this.type}City`]: '',
        [`${this.type}CityName`]: '',      // 新增
        [`${this.type}County`]: '',
        [`${this.type}CountyName`]: '',    // 新增
        [`${this.type}Street`]: '',
        [`${this.type}StreetName`]: '',    // 新增
        [`${this.type}Community`]: '',
        [`${this.type}CommunityName`]: '', // 新增
        [`${this.type}Village`]: '',       // 新增
        [`${this.type}Address`]: ''        // 新增
      }
      if (this.mode === 'edit' && this.vuex_addressInfo[`${this.type}AllAddress`]) {
        Object.assign(this.form, this.vuex_addressInfo)
        this.loadCity()
        this.loadCounty()
        this.loadStreet()
        this.loadCommunity()
      }
      setTimeout(() => {
        this.unsave = false
      }, 10)

      if (this.mode === 'select') {
        this.$set(this.form, `${this.type}Province`, '350000000000')
        this.$set(this.form, `${this.type}City`, '350200000000')
        // 等待省份列表加载完成后，设置省份和城市名称
        this.$nextTick(async () => {
          // 如果省份列表还没加载完成，等待一下
          if (!this.provinceList || this.provinceList.length === 0) {
            await this.loadProvince()
          }
          // 设置省份名称
          const provinceItem = this.provinceList.find(item => String(item.code) === '350000000000')
          if (provinceItem) {
            this.$set(this.form, `${this.type}ProvinceName`, provinceItem.name)
          }
          // 加载城市列表并设置城市名称
          await this.loadCity()
          const cityItem = this.cityList.find(item => String(item.code) === '350200000000')
          if (cityItem) {
            this.$set(this.form, `${this.type}CityName`, cityItem.name)
          }
          // 加载区县列表
          await this.loadCounty()
        })
      }
    },
    back() {
      if (this.unsave) {
        this.show = true
      } else {
        uni.navigateBack()
      }
    },
    submit() {
      this.$refs.form
        .validate()
        .then(() => {
          this.confirm()
        })
        .catch(e => {
          console.log(e)
          uni.$u.toast('请完善必填项')
        })
    },
    confirm() {
      let allAddress = `${this.form[`${this.type}ProvinceName`] || ''}`
      allAddress += `${this.form[`${this.type}CityName`] || ''}`
      allAddress += `${this.form[`${this.type}CountyName`] || ''}`
      allAddress += `${this.form[`${this.type}StreetName`] || ''}`
      allAddress += `${this.form[`${this.type}CommunityName`] || ''}`
      allAddress += `${this.form[`${this.type}Village`] || ''}`
      allAddress += `${this.form[`${this.type}Address`] || ''}`
      this.form[`${this.type}AllAddress`] = allAddress
      this.form.addrType = this.type
      this.$u.vuex('vuex_addressInfo', this.form)
      uni.navigateBack()
    },
    dialogConfirm() {
      if (this.isEdit) {
        this.isEdit = false
        return
      }
      uni.navigateBack()
    },
    copyChange(list) {
      for (let key in this.vuex_addressInfoCopy) {
        const formKey = key.replace(this.elseType, this.type)
        this.form[formKey] = list.length ? this.vuex_addressInfoCopy[key] : ''
      }
      if (list.length) {
        this.loadCity()
        this.loadCounty()
        this.loadStreet()
        this.loadCommunity()
      }
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

.add-title {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 20px;
}

.add-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
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

.title {
  padding-bottom: 12px;
  color: $u-main-color;
  font-size: 16px;
  font-weight: bold;
}

/deep/ .u-cell__body {
  padding: 10px 0;
  align-items: flex-start;
}

/deep/ .u-cell__body__content {
  width: 110px;
  flex: inherit;
}

/deep/ .u-cell__value {
  text-align: left;
}

.tips {
  margin-bottom: 12px;
  line-height: 20px;
  color: #999693;
  font-size: 14px;
}

.copytext {
  margin-top: 10px;
  line-height: 16px;
  color: #999693;
  font-size: 12px;
}
</style>
