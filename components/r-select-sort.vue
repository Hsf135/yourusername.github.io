<template>
  <view class="u-flex-1 u-flex" @click="handlePopup">
    <view v-if="label" class="label u-flex-1">{{ label }}</view>
    <view v-else class="u-place-color u-flex-1">{{ multiple ? `${placeholder}(多选)` : placeholder }}</view>
    <u-icon v-if="isLink" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>

    <r-dialog
      tips="请勾选五项，越先勾选的表示越重要"
      v-if="popupShow"
     v-model="popupShow" 
     :title="title" :autoCloseOnConfirm="false" :btnsShow="multiple" @cancel="cancel" @confirm="confirm">
      <view v-if="clearable" slot="title" class="u-flex u-flex-between u-flex-y-center u-m-b-16">
        <div class="title">{{ title }}</div>
        <view class="u-primary" @click="handleClear">清空选项</view>
      </view>

      <scroll-view scroll-y slot="content" class="content">
        <!-- 多选：根据勾选顺序给选中的项加序号 1、2、3...，取消前面的后面的序号会自动前移 -->
        <u-checkbox-group
          v-if="multiple"
          v-model="newValue"
          labelColor="#000"
          activeColor="#FF9500"
          placement="column"
          iconPlacement="right"
          @change="checkboxChange"
        >
          <u-checkbox
            v-for="l in list"
            :key="l[valueKey]"
            :label="l[labelKey]"
            :name="l[valueKey]"
            :disabled="l.disabled || false"
            :customStyle="{ padding: '10px 0' }"
          >
            <!-- 自定义图标：用编号代替对勾 -->
            <view slot="icon" class="order-icon">
              <text v-if="getOrderNumber(l)">{{ getOrderNumber(l) }}</text>
            </view>
          </u-checkbox>
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
    mutual: { type: [String, Number], default: '' }, // 有互斥
    beforeConfirm: { type: Function, default: null } // 新增：确定前的校验钩子
  },
  data() {
    return {
      popupShow: false,
      newValue: '',
      lastValue: [],
      snaphotValue: null, // 快照值，在打开弹窗时记录当前选中值
      snaphotOrder: [], // 勾选顺序的快照
      orderList: [] // 记录勾选的先后顺序，用于展示 1、2、3...
    }
  },
  computed: {
    label: {
      get() {
        if (this.allCheck) {
          return this.matchLabels(this.list, this.value)
        }
        if (this.multiple) {
          const values = Array.isArray(this.value) ? this.value : []
          return values
            .map(val => {
              const item = this.list.find(l => l[this.valueKey] === val)
              return item ? item[this.labelKey] : ''
            })
            .filter(Boolean)
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
      // 外部修改 v-model 时，同步初始化勾选顺序
      this.orderList = Array.isArray(this.value) ? [...this.value] : []
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
    // 初始挂载时，根据初始值生成勾选顺序
    this.orderList = Array.isArray(this.value) ? [...this.value] : []
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
      // 打开弹窗时保存当前值和排序的快照
      this.snaphotValue = Array.isArray(this.value) ? [...this.value] : this.value
      this.snaphotOrder = Array.isArray(this.orderList) ? [...this.orderList] : []
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
        // 不管是否 allCheck，这里都根据这次的变更更新勾选顺序 orderList
        const prevOrder = [...this.orderList]
        // 新增的那个值：在当前 list 中但不在之前的顺序里
        const added = list.find(v => !prevOrder.includes(v))
        // 被取消的那个值：在之前的顺序里但不在当前 list 中
        const removed = prevOrder.find(v => !list.includes(v))

        let nextOrder = prevOrder
        if (added !== undefined) {
          nextOrder = [...nextOrder, added]
        }
        if (removed !== undefined) {
          nextOrder = nextOrder.filter(v => v !== removed)
        }
        // 只保留当前仍然勾选的项，顺序即为“点击顺序”
        this.orderList = nextOrder.filter(v => list.includes(v))
        if (!this.orderList.length && list.length) {
          this.orderList = [...list]
        }
        if (this.multiple) {
          this.newValue = [...this.orderList]
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
    async confirm() {
      // 如果父组件传入了 beforeConfirm 函数，先执行校验
      if (this.beforeConfirm) {
        let result = this.beforeConfirm(this.newValue)
        // 支持异步校验：如果返回的是 Promise，则等待执行完成
        if (result && typeof result.then === 'function') {
          result = await result
        }
        // 如果返回 false，恢复到快照值并阻止关闭弹窗
        if (result === false) {
          this.newValue = Array.isArray(this.snaphotValue)
            ? [...this.snaphotValue]
            : this.snaphotValue
          this.orderList = Array.isArray(this.snaphotOrder) ? [...this.snaphotOrder] : []
          // r-dialog 在点击“确定”时，可能已经把 v-model 置为 false 了，这里强制保持弹窗打开
          return
        }
      }

      const emitValue = this.multiple ? [...this.orderList] : this.newValue
      this.newValue = emitValue
      this.$emit('input', emitValue)
      const label = this.getLabel()
      this.$emit('change', emitValue, label)
      this.popupShow = false
    },
    cancel() {
      this.newValue = Array.isArray(this.value) ? [...this.value] : this.value
      this.orderList = Array.isArray(this.value) ? [...this.value] : []
    },
    handleClear() {
      this.newValue = this.multiple ? [] : ''
      this.orderList = []
      if (!this.multiple) {
        this.confirm()
      }
    },
    // 解决回调
    getLabel() {
      if (this.multiple) {
        const orderedValues = this.orderList.length ? this.orderList : (Array.isArray(this.newValue) ? this.newValue : [])
        return orderedValues
          .map(val => {
            const item = this.list.find(l => l[this.valueKey] === val)
            return item ? item[this.labelKey] : ''
          })
          .filter(Boolean)
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
    },
    // 获取当前项的编号，用于显示在复选框图标中
    getOrderNumber(item) {
      const value = item[this.valueKey]
      if (!this.multiple) return ''
      const index = this.orderList.indexOf(value)
      if (index === -1) return ''
      return index + 1
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

/* 自定义排序数字图标样式，覆盖 u-checkbox 默认图标 */
.order-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 12px;
}
</style>
