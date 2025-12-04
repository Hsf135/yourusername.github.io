<template>
	<view :style="{ paddingBottom: `calc(64px + ${bottomSafeHeight}px)` }">
		<u-navbar :title="form.id ? '编辑活动' : '添加活动'" placeholder bgColor="#FAF9F7">
			<view slot="left" class="u-flex">
				<text class="u-info" @click="backEdit">取消</text>
			</view>
			<view slot="right" class="u-flex">
				<text class="u-primary" @click="handleFinish">完成</text>
			</view>
		</u-navbar>
		<u--form labelWidth="110px" :model="form" :rules="rules" ref="formRef" style="padding: 0 12px;">
			<view class="form-card">
				<u-form-item label="活动标题" prop="title" labelPosition="top" borderBottom class="require-item">
					<r-textarea v-model="form.title" count autoHeight maxlength="64" placeholder="请输入活动标题" class="u-m-t-5"></r-textarea>
				</u-form-item>
			</view>
			<view class="form-card">
				<u-form-item label="参与社区" prop="activityCommunity" borderBottom class="require-item">
					<view v-if="isXiamen">{{form.activityCommunity}}</view>
					<view class="u-flex u-flex-1" @click="handleChooseCommunity" v-else>
						<view v-if="form.activityCommunity" class="u-flex-1 u-line-1">{{form.activityCommunity}}</view>
						<view v-else class="placeholder-color u-flex-1">请选择参与社区</view>
						<u-icon :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="活动地址" prop="activityAddress" borderBottom class="require-item">
					<view class="u-flex u-flex-1" @click="handleEditAddress">
						<view v-if="form.activityAddress" class="u-flex-1">{{form.activityAddress}}</view>
						<view v-else class="placeholder-color u-flex-1">请选择活动地址</view>
						<u-icon :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="开始时间" prop="startTime" borderBottom class="require-item">
					<r-date-select v-model="form.startTime" mode="datetime" placeholder="请选择活动开始时间"></r-date-select>
				</u-form-item>
				<u-form-item label="结束时间" prop="endTime" borderBottom class="require-item">
					<r-date-select v-model="form.endTime" mode="datetime" placeholder="请选择活动结束时间"></r-date-select>
				</u-form-item>
				<u-form-item label="活动性质" prop="assort" borderBottom class="require-item">
					<r-select v-model="form.assort" placeholder="请选择活动性质" :list="aDict('assort')" />
				</u-form-item>
				<u-form-item label="活动类型" prop="type" borderBottom class="require-item">
					<r-select v-model="form.type" placeholder="请选择活动类型" :list="aDict('comactivty_type')" />
				</u-form-item>
				<u-form-item label="活动分类" prop="activitySort" borderBottom class="require-item">
					<r-select v-model="form.activitySort" placeholder="请选择活动分类" :list="aDict('activity_sort')" />
				</u-form-item>
			</view>
			<view class="form-card" style="padding-bottom: 4px;">
				<u-form-item label="" prop="activityPhotos" labelWidth="0" class="photo-form-item">
					<view class="u-flex-1">
						<view>活动照片<text class="u-tips-color">(完成时必填2张，不超过10张)</text></view>
						<r-upload v-model="form.activityPhotos" :img-list="form.activityPhotoList" show-limit :maxCount="10" width="56px" height="56px" class="u-m-t-10"></r-upload>
						<!-- <r-media v-model="form.activityPhotos"></r-media> -->
					</view>
				</u-form-item>
			</view>
			<view class="form-card">
				<u-form-item label="" prop="content" labelWidth="0">
					<view class="u-flex-1">
						<view>活动内容<text class="u-tips-color">(完成时必填,不少于30字)</text></view>
						<r-textarea v-model="form.content"  count maxlength="1000" placeholder="请输入活动内容" class="min-textarea u-m-t-5"></r-textarea>
					</view>
				</u-form-item>
			</view>
		</u--form>
		<view class="footer" :style="{ paddingBottom: `calc(12px + ${bottomSafeHeight}px)` }" v-if="!form.id">
			<u-button :loading="loading" @click="handleSave">存草稿</u-button>
		</view>
		<view class="footer u-flex footer-2" :style="{ paddingBottom: `calc(12px + ${bottomSafeHeight}px)` }" v-else>
			<u-button type="error" plain class="del-btn" @click="showDialog = true">删除草稿</u-button>
			<u-button :loading="loading" @click="handleSave">存草稿</u-button>
		</view>
		<r-dialog v-model="showDialog" title="是否确认删除草稿？" cancelText="取消" confirmText="确认" @cancel="showDialog = false" @confirm="confirmDel">
			<view slot="content" style="height: 1px;"></view>
		</r-dialog>
		<r-dialog
			v-model="show"
			title="监测到未保存信息"
			cancelText="否"
			confirmText="是"
			@cancel="show = false"
			@confirm="dialogConfirm"
		>
			<view slot="content" class="u-flex">
				<text>当前页面已做出修改，是否不保存就退出</text>
			</view>
		</r-dialog>
		<ChooseCommunity ref="chooseCommunityRef" @updateCommunity="updateCommunity" v-if="!isXiamen" />
	</view>
</template>

<script>
import { activitySaveUrl, activityUpdateUrl, activityDetailUrl, activityRemoveUrl } from '@/api/activity.js'
import ChooseCommunity from './components/choose-community.vue'

export default {
  components: {
    ChooseCommunity
  },
  onLoad({ id }) {
    this.isXiamen = this.vuex_user.dept.city === '350200000000'
    this.$u.vuex('vuex_commonAddress', {}) // 重置vuex数据，避免离开页面后再次进来，地址数据还在的问题
    if (id) {
      this.loadData(id)
    } else {
      this.form.activityCommunity = this.vuex_user.dept.communityName || ''
      this.form.operatorIds = this.vuex_user.id
      this.form.comNameAndOrg = `${this.vuex_user.id}:${this.vuex_user.dept.name}`
      this.form.idNameComString = `${this.vuex_user.id};${this.vuex_user.nickname};${this.vuex_user.dept.name}`
      this.form.startTime = uni.$u.timeFormat(Date.now(), 'yyyy-mm-dd hh:MM')
      setTimeout(() => {
        this.unsave = false
      }, 100)
    }
  },
  onShow() {
    this.addressCallback()
  },
  onBackPress() {
    if (this.unsave && !this.finish) {
      this.show = true
      return true
    }
  },
  data() {
    return {
      showDialog: false,
      showCommunityDialog: false,
      form: {
        activityAddress: '', // 活动地址，省市区街道社区+详细地址
        activityCommunity: '', // 参与组织名称（逗号拼接）
        activityFiles: [],
        activityPhotos: [],
        activityPhotoList: [],
        activitySort: '', // 活动分类（字典-activity_sort）
        assort: '', // 分类（字典-assort）
        city: '',
        comNameAndOrg: '', // 参与人员id、组织名称；数据格式=人员1id:组织名称,人员2id:组织名称
        community: '',
        communityId: '', // 照料中心id(无用)
        content: '',
        county: '',
        customerIds: '', // 参加活动的老人ids（英文逗号分隔）
        delCustomerIds: '', // 移除活动的老人ids（英文逗号分隔）
        detailAddress: '',
        endTime: '',
        flag: '', // 标识（0-助老，1-照料）
        id: '',
        idNameComString: '', // 参与人员id;人员名称;组织名称；数据格式=人员1id,人员2id;姓名1,姓名2;组织名称1,组织名称2
        operatorIds: '', // 参与人员ids（英文逗号分隔）
        personalStatus: '', // 个人状态(无用)
        platform: '2', // 所属平台
        province: '',
        regionCode: '', // 地区代码，传给后端时逗号拼接
        remark: '',
        startTime: '',
        street: '',
        taskStatus: '', // 活动状态（0-草稿，1-已发布[1未开始2进行中]，3-已关闭，4-已完成）
        title: '',
        type: '', // 类型（字典-comactivt_type）
        village: '', // 小区名称
        verificationCode: ''
      },
      isXiamen: false,
      loading: false,
      show: false,
      unsave: false, // 是否未保存
      finish: false // 如果是点击“完成”按钮，则标记finish为true，用于onBackPress的处理
    }
  },
  computed: {
    rules() {
      const validateEndTime = (rule, value, callback) => {
        if (!value) return callback(new Error('请选择活动结束时间'))
        if (new Date(this.form.startTime) >= new Date(this.form.endTime)) return callback(new Error('开始时间不得晚于结束时间'))
        callback()
      }
      const validateContent = (rule, value, callback) => {
        if (!value) return callback(new Error('活动内容不能为空'))
        if (value.length < 30) return callback(new Error('活动内容字数不得少于30字'))
        callback()
      }
      const validatePhoto = (rule, value, callback) => {
        if (!this.form.activityPhotos.length) return callback(new Error('请上传活动照片'))
        if (this.form.activityPhotos.length < 2) return callback(new Error('请至少上传2张活动照片'))
        callback()
      }
      return {
        title: { required: true, message: '请输入标题', trigger: 'none' },
        activityCommunity: { required: true, message: '请选择参与社区', trigger: 'none' },
        activityAddress: { required: true, message: '请选择活动地址', trigger: 'none' },
        startTime: { required: true, message: '请选择活动开始时间', trigger: 'none' },
        endTime: { required: true, validator: validateEndTime, trigger: 'none' },
        assort: { required: true, message: '请选择活动性质', trigger: 'none' },
        type: { required: true, message: '请选择活动类型', trigger: 'none' },
        activitySort: { required: true, message: '请选择活动分类', trigger: 'none' },
        content: { required: true, validator: validateContent, trigger: 'none' },
        activityPhotos: { required: true, validator: validatePhoto, trigger: 'none' }
      }
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
  methods: {
    async loadData(id) {
      const params = { params: { id } }
      const { data } = await uni.$u.http.get(activityDetailUrl, params)
      this.form.activityAddress = data.activityAddress
      this.form.activityCommunity = data.activityCommunity
      this.form.activityPhotoList = data.activityPhotoList || []
      this.form.activityPhotos = data.activityPhotos || []
      this.form.activityFiles = data.activityFiles || []
      this.form.activitySort = data.activitySort
      this.form.assort = data.assort
      this.form.city = data.city
      this.form.comNameAndOrg = data.comNameAndOrg
      this.form.community = data.community
      this.form.content = this.htmlToPlainText(data.content)
      this.form.county = data.county
      this.form.customerIds = data.customerInfoVOList && data.customerInfoVOList.length ? data.customerInfoVOList.map(item => item.id).join(',') : ''
      this.form.detailAddress = data.detailAddress
      this.form.endTime = data.endTime
      this.form.id = data.id
      this.form.idNameComString = data.idNameComString
      this.form.operatorIds = data.operatorIds && data.operatorIds.length ? data.operatorIds.join(',') : ''
      this.form.platform = data.platform
      this.form.province = data.province
      this.form.regionCode = data.regionCode
      this.form.startTime = data.startTime
      this.form.street = data.street
      this.form.taskStatus = data.taskStatus
      this.form.title = data.title
      this.form.type = data.type
      this.form.verificationCode = data.verificationCode
      this.form.village = data.village
      this.form.startTime = data.startTime
      this.form.endTime = data.endTime
      setTimeout(() => {
        this.unsave = false
      }, 100)
    },
    async handleSave() {
      if (this.loading) return
      if (this.form.title.trim() === '') {
        uni.$u.toast('请填写活动标题')
        return
      }
      if (!this.form.endTime) {
        uni.$u.toast('请选择活动结束时间')
        return
      }
      try {
        this.loading = true
        await uni.$u.http.post(this.form.id ? activityUpdateUrl : activitySaveUrl, this.getParams('0'))
        this.finish = true
        this.loading = false
        uni.navigateBack()
      } catch {
        this.loading = false
      }
    },
    handleFinish() {
      if (this.loading) return
      this.$refs.formRef
        .validate()
        .then(async () => {
          this.loading = true
          await uni.$u.http.post(this.form.id ? activityUpdateUrl : activitySaveUrl, this.getParams('4'))
          this.finish = true
          this.loading = false
          uni.navigateBack()
        })
        .catch(err => {
          this.loading = false
          if (Object.prototype.toString.call(err) === '[object Array]') {
            // 如果是数组，说明是表单校验的报错
            uni.$u.toast(err[0] && err[0].message)
            return
          }
          uni.$u.toast(err.message || err.msg || '请求出错，请联系管理员')
        })
    },
    handleChooseCommunity() {
      this.$refs.chooseCommunityRef.open(this.form.activityCommunity)
    },
    updateCommunity(name) {
      this.form.activityCommunity = name
    },
    async confirmDel() {
      await uni.$u.http.post(activityRemoveUrl, { id: this.form.id }, { header: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      uni.navigateBack()
    },
    getParams(taskStatus) {
      return {
        activityAddress: this.form.activityAddress, // 活动地址，省市区街道社区
        activityCommunity: this.form.activityCommunity, // 参与组织名称（逗号拼接）
        activityFiles: this.form.activityFiles.join(','),
        activityPhotos: this.form.activityPhotos.join(','),
        activitySort: this.form.activitySort, // 活动分类（字典-activity_sort）
        assort: this.form.assort, // 分类（字典-assort）
        city: this.form.city,
        comNameAndOrg: this.form.comNameAndOrg, // 参与人员id、组织名称；数据格式=人员1id:组织名称,人员2id:组织名称
        community: this.form.community,
        content: this.form.content,
        county: this.form.county,
        customerIds: this.form.customerIds, // 参加活动的老人ids（英文逗号分隔）
        detailAddress: this.form.detailAddress,
        endTime: this.form.endTime ? this.form.endTime.padEnd(19, ':00') : '',
        id: this.form.id,
        idNameComString: this.form.idNameComString, // 参与人员id;人员名称;组织名称；数据格式=人员1id,人员2id;姓名1,姓名2;组织名称1,组织名称2
        operatorIds: this.form.operatorIds, // 参与人员ids（英文逗号分隔）
        platform: '2', // 所属平台
        province: this.form.province,
        regionCode: `${this.form.province},${this.form.city},${this.form.county},${this.form.street},${this.form.community}`, // 地区代码
        remark: this.form.remark,
        startTime: this.form.startTime ? this.form.startTime.padEnd(19, ':00') : '',
        street: this.form.street,
        taskStatus, // 活动状态（0-草稿，1-已发布[1未开始2进行中]，3-已关闭，4-已完成）
        title: this.form.title,
        type: this.form.type, // 类型（字典-comactivt_type）
        village: this.form.village, // 小区名称
        verificationCode: this.form.verificationCode
      }
    },
    handleEditAddress() {
      if (this.form.province) {
        this.$u.vuex('vuex_commonAddress', {
          province: this.form.province,
          city: this.form.city,
          county: this.form.county,
          street: this.form.street,
          community: this.form.community,
          village: this.form.village,
          detailAddress: this.form.detailAddress
        })
      } else {
        const dept = this.vuex_user.dept
        const keys = ['province', 'city', 'county', 'street', 'community']
        const data = {
          province: '',
          city: '',
          county: '',
          street: '',
          community: '',
          village: '',
          detailAddress: ''
        }
        keys.forEach(key => {
          data[key] = dept[key] || ''
        })
        this.$u.vuex('vuex_commonAddress', data)
      }
      uni.navigateTo({ url: '/pages/common/add-address' })
    },
    addressCallback() {
      const data = this.vuex_commonAddress || {}
      if (!(data.province && data.city && data.county && data.street && data.community)) return
      this.form.province = data.province
      this.form.city = data.city
      this.form.county = data.county
      this.form.street = data.street
      this.form.community = data.community
      this.form.village = data.village
      this.form.detailAddress = data.detailAddress
      this.form.activityAddress = `${data.provinceName}${data.cityName}${data.countyName}${data.streetName}${data.communityName}${data.village}${data.detailAddress}`
    },
    backEdit() {
      if (this.unsave) {
        this.show = true
      } else {
        uni.navigateBack()
      }
    },
    dialogConfirm() {
      this.unsave = false
      uni.navigateBack()
    },
    stripHtmlTags(html) {
      return html.replace(/<[^>]+>/g, '')
    },
    decodeHtmlEntities(text) {
      const entities = {
        '&nbsp;': ' ',
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&quot;': '"',
        '&apos;': "'"
      }
      return text.replace(/&[a-zA-Z0-9#]+;/g, match => entities[match] || match)
    },
    htmlToPlainText(html) {
      let text = this.stripHtmlTags(html)
      text = this.decodeHtmlEntities(text)
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
.form-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 0 12px 12px 12px;
  margin: 12px 0;
}

/deep/ .u-textarea {
  padding: 10px 0;
}

.footer {
  padding: 12px 40px;
  background-color: #fff;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  .del-btn {
    width: 45%;
    margin-right: 12px;
  }
}

.require-item {
  /deep/ .u-form-item__body__left__content__label {
    &::after {
      content: '*';
      color: $u-error;
    }
  }
}

.photo-form-item {
  /deep/ .u-form-item__body {
    padding: 10px 0 0 0;
  }
}
</style>
