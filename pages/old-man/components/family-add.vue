<template>
  <view class="add-page">
    <!-- 新增标题 -->
    <u-navbar v-if="!id" title="添加家庭成员信息" placeholder bgColor="#FAF9F7">
      <u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="back"></u-icon>
      <view slot="right" class="u-flex">
        <text class="u-primary" @click="submit">完成</text>
      </view>
    </u-navbar>
    <!-- 详情编辑标题 -->
    <u-navbar v-else :title="isEdit ? '编辑家庭成员信息' : '家庭成员信息'" placeholder bgColor="#FAF9F7">
      <view v-if="isEdit" slot="left" class="u-flex">
        <text class="u-primary" @click="backEdit">取消</text>
      </view>
      <view v-if="isEdit" slot="right" class="u-flex">
        <text class="u-primary" @click="submit">完成</text>
      </view>
      <u-icon v-if="!isEdit" slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="back"></u-icon>
      <view v-if="!isEdit" slot="right" class="u-flex">
        <text class="u-primary" @click="isEdit = true">编辑</text>
      </view>
    </u-navbar>
    <!-- 编辑 -->
    <u--form v-if="isEdit" labelWidth="110px" :model="form" :rules="rules" ref="form">
      <view class="add-card">
        <text class="add-title">成员信息</text>
        <u-form-item v-if="isXiaMen" label="在12349做过登记" prop="isRegister" borderBottom>
          <u-radio-group activeColor="#FF9500" v-model="form.isRegister" placement="row">
            <u-radio :customStyle="{ marginRight: '24px' }" v-for="item in aDict('yes_no')" :key="item.value" :label="item.label" :name="item.value"> </u-radio>
          </u-radio-group>
        </u-form-item>
        <u-form-item label="角色" prop="role" borderBottom class="form-required">
          <r-select v-model="form.role" :list="aDict('family_role')" />
        </u-form-item>
        <u-form-item label="姓名" prop="name" borderBottom class="form-required">
          <u-input v-model="form.name" clearable maxlength="32" border="none" placeholder="请输入家庭成员姓名"> </u-input>
        </u-form-item>
        <u-form-item label="性别" prop="sex" borderBottom :class="{ 'form-required': !isXiaMen }">
          <u-radio-group activeColor="#FF9500" v-model="form.sex" placement="row">
            <u-radio :customStyle="{ marginRight: '24px' }" v-for="item in aDict('vols_sex')" :key="item.value" :label="item.label" :name="item.value"> </u-radio>
          </u-radio-group>
        </u-form-item>
        <u-form-item label="电话" prop="phone" borderBottom :class="{ 'form-required': !isXiaMen }">
          <u-input v-model="form.phone" clearable type="number" maxlength="12" border="none" placeholder="请输入家庭成员联系电话"> </u-input>
        </u-form-item>
        
        <u-form-item label="年龄(岁)" prop="age" borderBottom :class="{ 'form-required': !isXiaMen }">
          <u-input     @input="onAgeInput" v-model="form.age" type="number" clearable maxlength="32" border="none" placeholder="请输入家庭成员年龄"> </u-input>
        </u-form-item>
        <u-form-item label="工作性质" prop="workProperty" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="form.workProperty" :list="aDict('work_Property')" />
        </u-form-item>
        <u-form-item label="工作单位" prop="workCompany" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="form.workCompany" :list="aDict('work_unit')" />
        </u-form-item>
        <u-form-item label="收入范围" prop="incomeRange" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="form.incomeRange" :list="aDict('income_month')" />
        </u-form-item>
        <u-form-item label="与老人关系" prop="relation" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="form.relation" :list="aDict('elder_relation')" />
        </u-form-item>
        <u-form-item label="回家频率" prop="gohomeBend" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="form.gohomeBend" :list="aDict('gohome_bend')" />
        </u-form-item>
      </view>
    </u--form>
    <!-- 详情 -->
    <view v-else class="add-card">
      <view class="add-title">成员信息</view>
      <u-cell-group :border="false">
        <u-cell v-if="isXiaMen" title="在12349做过登记" :value="radioDict(form.isRegister, 'yes_no')"></u-cell>
        <u-cell title="角色" :value="radioDict(form.role, 'family_role')"></u-cell>
        <u-cell title="姓名" :value="form.name"></u-cell>
        <u-cell title="性别" :value="radioDict(form.sex, 'vols_sex')"></u-cell>
        <u-cell title="电话" :value="form.phone"></u-cell>
        <u-cell title="年龄" :value="form.age"></u-cell>
        <u-cell title="工作性质" :value="radioDict(form.workProperty, 'work_Property')"></u-cell>
        <u-cell title="工作单位" :value="radioDict(form.workCompany, 'work_unit')"></u-cell>
        <u-cell title="收入范围" :value="radioDict(form.incomeRange, 'income_month')"></u-cell>
        <u-cell title="与老人关系" :value="radioDict(form.relation, 'elder_relation')"></u-cell>
        <u-cell title="回家频率" :value="radioDict(form.gohomeBend, 'gohome_bend')"></u-cell>
      </u-cell-group>
    </view>

    <r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false" @confirm="dialogConfirm">
      <view slot="content" class="u-flex">
        <text>当前页面已做出修改，是否不保存就退出</text>
      </view>
    </r-dialog>
  </view>
</template>

<script>
import { addFamilyUrl, updateFamilyUrl, getFamilyDetailUrl } from '../../../api'
export default {
  data() {
    return {
      form: { name: '' },
      loading: false,
      isEdit: false,
      show: false,
      unsave: false,
      customerId: undefined,
      id: undefined
    }
  },
  onLoad(option) {
    this.customerId = option.id
    if (option.memberId) {
      this.id = option.memberId
      this.loadData()
      this.title = '家庭成员详情'
    } else {
      this.isEdit = true
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
  computed: {
    rules() {
      return {
        role: [
          {
            required: !this.isXiaMen,
            message: '角色不可为空',
            trigger: ['change']
          }
        ],
        name: [
          {
            required: !this.isXiaMen,
            message: '姓名不可为空',
            trigger: ['blur']
          }
        ],
        sex: [
          {
            required: !this.isXiaMen,
            message: '姓名不可为空',
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          {
            required: !this.isXiaMen,
            pattern: /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/,
            message: '请输入正确的手机号码',
            trigger: ['blur']
          }
        ],
        age: [{ required: !this.isXiaMen, type: 'number', min: 0, max: 130, message: '请输入有效年龄', trigger: ['blur', 'change'] }],
        workProperty: [
          {
            required: !this.isXiaMen,
            message: '工作性质不可为空',
            trigger: ['blur', 'change']
          }
        ],
        workCompany: [
          {
            required: !this.isXiaMen,
            message: '工作单位不可为空',
            trigger: ['blur', 'change']
          }
        ],
        incomeRange: [
          {
            required: !this.isXiaMen,
            message: '收入范围不可为空',
            trigger: ['blur', 'change']
          }
        ],
        relation: [
          {
            required: !this.isXiaMen,
            message: '与老人关系不可为空',
            trigger: ['blur', 'change']
          }
        ],
        gohomeBend: [
          {
            required: !this.isXiaMen,
            message: 'gohomeBend不可为空',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    async loadData() {
      if (!this.id) {
        return
      }
      const { data } = await uni.$u.http.post(`${getFamilyDetailUrl}?id=${this.id}`)
      data.phone = data.phone ? data.phone : undefined
      data.age = data.age ? data.age : undefined
      this.form = data
      setTimeout(() => {
        this.unsave = false
      }, 10)
    },
    back() {
      if (this.unsave) {
        this.show = true
      } else {
        uni.navigateBack()
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
    submit() {
      this.$refs.form
        .validate()
        .then(res => {
          if (this.isEdit && this.id) {
            this.editFamily()
            return
          }
          this.addFamily()
        })
        .catch(errors => {
          uni.$u.toast('请完善必填项')
        })
    },
    onAgeInput(value) {
      // 只保留数字，过滤掉所有非数字字符
      const numbersOnly = value.replace(/\D/g, '')
      if (numbersOnly === '') {
        this.form.age = ''
      } else {
        this.form.age = Number(numbersOnly)
      }
      console.log(this.form.age  , 'age')
    },
    async addFamily() {
      try {
        const res = await uni.$u.http.post(addFamilyUrl, { ...this.form, customerId: this.customerId })
        if (res.code === 200) {
          uni.$u.toast('添加成功')
          uni.navigateBack()
        }
      } catch (e) {
        uni.$u.toast(e.msg)
      }
    },
    cancelEdut() {
      if (this.unsave) {
        this.show = true
      } else {
        this.isEdit = false
        this.loadData()
      }
    },
    async editFamily() {
      try {
        const res = await uni.$u.http.post(updateFamilyUrl, { ...this.form, customerId: this.customerId })
        if (res.code === 200) {
          uni.$u.toast('修改成功')
          this.isEdit = false
          this.loadData()
        }
      } catch (e) {
        uni.$u.toast(e.msg)
      }
    },
    dialogConfirm() {
      if (this.form.id) {
        this.isEdit = false
        this.loadData()
        return
      }
      uni.navigateBack()
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

.phone {
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
</style>
