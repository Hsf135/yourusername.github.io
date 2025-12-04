<template>
  <view class="u-flex-1 u-flex" @click="handlePopup">
    <view v-if="label" class="label u-flex-1">{{ label }}</view>
    <view v-else class="u-place-color u-flex-1">{{ multiple ? `${placeholder}(多选)` : placeholder }}</view>
    <u-icon v-if="isLink" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>

    <r-dialog v-if="popupShow" v-model="popupShow" :title="title" :btnsShow="multiple" @cancel="cancel" @confirm="confirm">
      <view v-if="clearable" slot="title" class="u-flex u-flex-between u-flex-y-center u-m-b-16">
        <div class="title">{{ title }}</div>
        <view class="u-primary" @click="handleClear">清空选项</view>
      </view>

      <scroll-view scroll-y slot="content" class="content">
        <!-- 多选 -->
        <u-checkbox-group v-if="multiple" v-model="newValue" labelColor="#000" activeColor="#FF9500" placement="column" iconPlacement="right" @change="checkboxChange">
          <u-checkbox v-for="l in list" :key="l[valueKey]" :label="l[labelKey]" :name="l[valueKey]" :disabled="l.disabled || false" :customStyle="{ padding: '10px 0' }"></u-checkbox>
        </u-checkbox-group>
        <!-- 单选 -->
        <u-radio-group v-else v-model="newValue" labelColor="#000" activeColor="#FF9500" placement="column" iconPlacement="right" @change="confirm">
          <u-radio v-for="l in list" :key="l[valueKey]" :label="l[labelKey]" :name="l[valueKey]" :disabled="l.disabled || false" :customStyle="{ padding: '10px 0' }"></u-radio>
        </u-radio-group>
      </scroll-view>
    </r-dialog>
  </view>
</template>

<script>
export default {
  name: 'r-select',
  props: {
    value: { type: [String, Array, Number], default: '' },
    list: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
    allCheck: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择' },
    title: { type: String, default: '请选择' },
    limitTips: { type: String, default: '' }, // 限制弹窗提示语
    valueKey: { type: String, default: 'value' },
    labelKey: { type: String, default: 'label' },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    isLink: { type: Boolean, default: true },
    mutual: { type: [String, Number], default: '' } // 有互斥
  },
  data() {
    return {
      popupShow: false,
      newValue: '',
      lastValue: []
    }
  },
  computed: {
    label: {
      get() {
        if (this.allCheck) {
          return this.matchLabels(this.list, this.value)
        }
        if (this.multiple) {
          return this.list
            .filter(l => this.value.includes(l[this.valueKey]))
            .map(l => l[this.labelKey])
            .join('，')
        }
        return this.list
          .filter(l => this.value === l[this.valueKey])
          .map(l => l[this.labelKey])
          .join('，')
      },
      set(val) {
        return val
      }
    }
  },
  watch: {
    value() {
      this.newValue = Array.isArray(this.value) ? [...this.value] : this.value
    },
    // label发生改变时，有时候需要通知父组件，及时更新label值
    label(val) {
      this.$emit('getLabel', val)
    }
  },
  mounted() {
    this.newValue = Array.isArray(this.value) ? [...this.value] : this.value
    if (this.multiple && !this.value) {
      this.newValue = []
    }
  },
  methods: {
    handlePopup() {
      if (this.disabled) {
        return
      }

      if (this.limitTips && !this.list.length) {
        uni.$u.toast(this.limitTips)
        return
      }
      this.popupShow = true
      uni.hideKeyboard()
    },
    checkboxChange(list = []) {
      // 有互斥
      this.$nextTick(() => {
        if (this.mutual) {
          this.formarMutual(list)
        }
        if (this.allCheck) {
          this.lastValue = this.lastValue.filter(val => list.includes(val)) // 先移除未选中的项
          list.forEach(val => {
            if (!this.lastValue.includes(val)) {
              this.lastValue.push(val) // 添加新选中的项
            }
          })
          this.newValue = this.lastValue
        }
      })
    },
    formarMutual(list) {
      // 如果mutual只有一项
      if (list.includes(this.mutual)) {
        if (this.lastValue.includes(this.mutual)) {
          const index = list.findIndex(l => l === this.mutual)
          this.newValue.splice(index, 1)
        } else {
          this.newValue = [this.mutual]
        }
        this.lastValue = this.newValue
      }

      // 如果mutual有多项
      if (this.mutual.includes(',')) {
        const mList = this.mutual.split(',')
        mList.forEach(m => {
          if (list.includes(m) && list.length > 1) {
            if (this.lastValue.includes(m)) {
              const index = list.findIndex(l => l === m)
              this.newValue.splice(index, 1)
            } else {
              this.newValue = [m]
            }
          }
        })
        this.lastValue = this.newValue
      }
    },
    confirm() {
      this.$emit('input', this.newValue)
      const label = this.getLabel()
      this.$emit('change', this.newValue, label)
      this.popupShow = false
    },
    cancel() {
      this.newValue = this.value
    },
    handleClear() {
      this.newValue = this.multiple ? [] : ''
      this.confirm()
    },
    // 解决回调
    getLabel() {
      if (this.multiple) {
        return this.list
          .filter(l => this.newValue.includes(l[this.valueKey]))
          .map(l => l[this.labelKey])
          .join(',')
      }
      return this.list
        .filter(l => this.newValue === l[this.valueKey])
        .map(l => l[this.labelKey])
        .join(',')
    },
    // 处理排序
    matchLabels(dict, numbers) {
      const labelArray = numbers.map((num, index) => {
        const matchingItem = dict.find(item => item.value === num.toString())
        return matchingItem ? index + 1 + '.' + matchingItem.label : null
      })

      return labelArray.join('，')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .u-input {
  padding: 0 !important;
}

.title {
  color: $u-main-color;
  font-size: 16px;
  font-weight: bold;
}

.content {
  max-height: 40vh;
  overflow-y: auto;
}

.label {
  color: #666462;
  line-height: 24px;
}
</style>
