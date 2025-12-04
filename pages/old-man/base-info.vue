<template>
  <view class="u-p-b-20">
    <u-navbar title="基础信息" placeholder bgColor="#FAF9F7">
      <u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
      <view slot="right" v-if="alive !== '0'" class="u-flex" @click="handleEdit">
        <text class="u-primary">编辑</text>
      </view>
    </u-navbar>
    <view class="unlive-info" v-if="alive === '0'"> 该老人已去世，个人信息不纳入饱和度统计。若需编辑信息，请进入"延伸信息"页面，将"是否健在"改为"是" </view>

    <view class="base-box">
      <view class="title">基础信息</view>
      <u-cell-group :border="false">
        <u-cell title="姓名" :value="info.name"></u-cell>
        <u-cell title="性别" :value="radioDict(info.sex, 'vols_sex')"></u-cell>
        <u-cell title="老人备注" :value="info.remark"></u-cell>
        <u-cell v-if="isXiaMen" title="APP账号" :value="info.appAcount"></u-cell>
        <u-cell title="联系电话" :value="info.mobilephone">
          <view slot="value" class="u-line-1 u-content-color">{{ info.mobilephone }}</view>
        </u-cell>
      </u-cell-group>
    </view>

    <view class="base-box">
      <view class="title">证件信息</view>
      <u-cell-group :border="false">
        <u-cell title="证件类型" :value="radioDict(info.idType, 'document_type')"></u-cell>
        <u-cell title="发证机关" :value="info.issuer"></u-cell>
        <u-cell title="证件号码" :value="info.idcard"></u-cell>
        <u-cell title="证件有效期" :value="radioDict(info.idEffective, 'id_effective')"></u-cell>
        <u-cell v-if="isXiaMen" title="出生年月" :value="info.birthday"></u-cell>
        <u-cell v-if="isXiaMen" title="年龄" :value="info.age"></u-cell>
        <u-cell title="户籍地地址" :value="info.domicileAllAddress"></u-cell>
        <u-cell title="现居地地址" :value="info.currentAllAddress"></u-cell>
      </u-cell-group>
    </view>

    <view class="base-box">
      <view class="title">其他信息</view>
      <u-cell-group :border="false">
        <u-cell title="文化程度" :value="radioDict(info.educationLevel, 'degree_education')"></u-cell>
        <u-cell title="职业" :value="radioDict(info.profession, 'occupation')"></u-cell>
        <u-cell v-if="isXiaMen" title="详细职业" :value="info.detaileProfession"></u-cell>
        <u-cell v-if="isXiaMen" title="退休" :value="radioDict(info.isRetire, 'yes_no')"></u-cell>
        <u-cell v-if="isXiaMen" title="主要经济来源" :value="radioDict(info.mainFinancially, 'main_economic_source')"></u-cell>
        <u-cell title="收入/月" :value="radioDict(info.income, 'income_month')"></u-cell>
        <u-cell title="婚姻状况" :value="radioDict(info.maritalStatus, 'marital_status')"></u-cell>
        <u-cell v-if="isXiaMen" title="子女数量" :value="info.childrennumSection"></u-cell>
        <u-cell v-if="isXiaMen" title="保险" :value="checkDict(info.insurance, 'insurance')"></u-cell>
        <u-cell v-if="isXiaMen" title="国籍" :value="radioDict(info.nation, 'nation')"></u-cell>
        <u-cell title="民族" :value="radioDict(info.nationality, 'nationality')"></u-cell>
        <u-cell v-if="isXiaMen" title="政治面貌" :value="radioDict(info.politicalstatus, 'political_status')"></u-cell>
        <u-cell v-if="isXiaMen" title="会员来源" :value="radioDict(info.customerType, 'customer_type')"></u-cell>
        <u-cell v-if="isXiaMen" title="会员级别" :value="radioDict(info.memberLevel, 'member_level')"></u-cell>
        <u-cell title="服务对象来源（一级）" :value="checkDict(info.serviceObjSource, 'service_obj_source')"></u-cell>
        <u-cell title="服务对象来源（二级）" :value="info.secondServiceSourceLabel"></u-cell>
        <u-cell title="一级服务标签" :value="checkDict(info.serviceLabel, 'service_label')"></u-cell>
        <u-cell title="二级服务标签" :value="checkDict(info.secondServiceLabel, 'second_service_label')"></u-cell>
        <u-cell title="三级服务标签" :value="checkDict(info.thirdServiceLabel, 'third_service_label')"></u-cell>
        <u-cell title="服务标准" :value="checkDict(info.serviceStandards, 'service_standards')"></u-cell>
      </u-cell-group>
    </view>

    <view class="base-box u-p-t-0">
      <u-cell-group :border="false">
        <u-cell title="个人特长" :value="info.speciality"></u-cell>
      </u-cell-group>
    </view>

    <view class="base-box u-p-t-0" v-if="isXiaMen && info.contactInfoList.length">
      <u-cell-group :border="false">
        <u-cell v-for="(item, index) in info.contactInfoList" :key="item.id" :title="`联系人${index + 1}`" :value="item.ownerName + ' ' + radioDict(item.contactRole, 'contact_role') + ' ' + item.phoneNumber"></u-cell>
      </u-cell-group>
    </view>
  </view>
</template>

<script>
import { getCustomerBaseDetailUrl } from '../../api'
export default {
  data() {
    return { info: { contactInfoList: [] }, customerId: undefined, alive: undefined }
  },
  onLoad(option) {
    this.customerId = option.id
    this.alive = option.alive || undefined
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const { data } = await uni.$u.http.post(`${getCustomerBaseDetailUrl}?id=${this.customerId}`)
      this.info = data
    },
    handleEdit() {
      if (!this.isSingleProject) {
        uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
        return
      }
      this.toPage(`/pages/old-man/add?id=${this.customerId}`)
    },
    toPage(url) {
      uni.navigateTo({ url })
    },
    handleBack() {
      uni.navigateBack()
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
