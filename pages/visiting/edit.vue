<template>
	<view>
		<u-navbar :title="navTitle" placeholder bgColor="#FAF9F7">
			<view slot="left" class="u-flex">
				<text class="u-info" @click="backEdit">取消</text>
			</view>
			<view slot="right" class="u-flex">
				<text class="u-primary" v-if="form.id" @click="handleFinish">完成</text>
				<template v-else>
					<text class="u-primary" v-if="form.visitMode === '1' && isXiaMen" @click="handleSave">存草稿</text>
					<text class="u-primary" v-else @click="handleFinish">完成</text>
				</template>
			</view>
		</u-navbar>
		<view class="location" v-if="form.visitLocationCode" @click="handleToMap">
			<u-icon name="map-fill" color="#999693"></u-icon>
			<text class="location-text">{{form.visitLocationCode}}</text>
		</view>
		<u--form labelWidth="120px" :model="form" :rules="rules" ref="formRef" style="padding: 0 12px;">
			<view class="form-card" v-if="isXiaMen">
				<u-form-item label="拜访标签" prop="visitLabel" borderBottom>
					<r-select v-model="form.visitLabel" :list="labelList" multiple placeholder="请选择拜访标签" />
				</u-form-item>
			</view>
			<view class="form-card" style="padding-bottom: 0;">
				<u-form-item prop="visitPhotos" labelWidth="0">
					<view class="u-flex-1">
						<view>拜访照片<text class="u-tips-color u-font-14">{{form.visitMode === '1' ? '(最少上传1张，最多上传5张)' : '(非必填)' }}</text></view>
						<r-upload v-model="form.visitPhotos" :img-list="form.visitPhotoList" show-limit watermark :waterInfo="waterInfo" :maxCount="5" width="56px" height="56px" class="u-m-t-10"></r-upload>
					</view>
				</u-form-item>
			</view>
			<view class="form-card">
				<u-form-item prop="visitContent" label-width="0">
					<view class="u-flex-1">
						<view>拜访内容<text class="u-tips-color u-font-14">(完成时必填)</text></view>
						<r-textarea v-model="form.visitContent" count maxlength="300" placeholder="请输入拜访内容" class="min-textarea u-m-t-4"></r-textarea>
					</view>
				</u-form-item>
			</view>
			<view class="form-card" v-if="isXiaMen">
				<u-form-item label="信息反馈" prop="infoFeedback" labelPosition="top">
					<r-textarea v-model="form.infoFeedback" count maxlength="300" placeholder="请输入信息反馈" class="min-textarea u-m-t-4"></r-textarea>
				</u-form-item>
			</view>
			<view class="form-card" v-if="isXiaMen">
				<u-form-item label="结果跟踪" prop="resultTracking" labelPosition="top">
					<r-textarea v-model="form.resultTracking" count maxlength="300" placeholder="请输入结果跟踪" class="min-textarea u-m-t-4"></r-textarea>
				</u-form-item>
			</view>
			<view class="form-card">
				<u-form-item label="所属区域" prop="belongRegion" borderBottom>
					<view class="u-flex u-flex-1" @click="handleEditBelong">
						<view v-if="form.belongRegion" class="u-flex-1">{{form.belongRegion}}</view>
						<view v-else class="placeholder-color u-flex-1">请选择所属区域</view>
						<u-icon :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="拜访时间" prop="visitTime" borderBottom>
					<r-date-select v-model="form.visitTime" mode="datetime" placeholder="请选择拜访时间"></r-date-select>
				</u-form-item>
				<u-form-item label="拜访老人" prop="visitCustomerName" borderBottom>
					<view class="u-flex u-flex-1" @click="handleChooseOldMan">
						<view v-if="form.visitCustomerName" class="u-flex-1">{{form.visitCustomerName}}</view>
						<view v-else class="placeholder-color u-flex-1">请选择拜访老人(必填)</view>
						<u-icon v-if="!form.id && visiting_edit_name" :name="aIcon('xiala-zuo')" width="24" height="24" ></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="拜访地址" prop="visitAllAddress" borderBottom v-if="form.visitCustomerName && form.visitMode === '1'">
					<view class="u-flex u-flex-1" @click="handleEditVisit">
						<view v-if="form.visitAllAddress" class="u-flex-1">{{form.visitAllAddress}}</view>
						<view v-else class="placeholder-color u-flex-1">请选择拜访地址</view>
						<u-icon :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="共同拜访" prop="operatorNames" class="gray-label1" borderBottom v-if="form.visitMode === '1'">
					<view class="u-flex u-flex-1" @click="handleChoosePerson('operatorNames')">
						<view v-if="form.operatorNames" class="u-flex-1 u-line-1">{{form.operatorNames}}</view>
						<view v-else class="placeholder-color u-flex-1">请选择共同拜访(内部)</view>
						<u-icon :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="共同拜访" prop="externalNames" class="gray-label2" borderBottom v-if="form.visitMode === '1'">
					<view class="u-flex u-flex-1" @click="handleEditExternal">
						<view v-if="form.externalNames" class="u-flex-1 u-line-1">{{form.externalNames}}</view>
						<view v-else class="placeholder-color u-flex-1">请选择共同拜访(外部)</view>
						<u-icon :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="共同拜访" prop="volunteerNames" class="gray-label3" borderBottom v-if="form.visitMode === '1' && false">
					<view class="u-flex u-flex-1" @click="handleChoosePerson('volunteerNames')">
						<view v-if="form.volunteerNames" class="u-flex-1 u-line-1">{{form.volunteerNames}}</view>
						<view v-else class="placeholder-color u-flex-1">请选择共同拜访(志愿者)</view>
						<u-icon :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
					</view>
				</u-form-item>
			</view>
			<view class="form-card" style="padding-bottom: 0;" v-if="form.visitMode === '1'">
				<u-form-item label="语音评价">
					<view class="u-flex u-flex-between u-flex-1" v-if="form.voice">
						<view class="voice-box u-flex" @click="showVoice = true">
							<u-icon class="u-m-r-4" :name="aIcon('yvying')" color="#D27058" width="16" height="16"></u-icon>
							<text class="u-font-12 u-primary">{{form.voiceLength}}</text>
						</view>
						<u-icon name="trash" color="#f56c6c" @click="showVoiceDialog = true"></u-icon>
					</view>
					<view class="u-flex u-flex-1 u-flex-end" v-else>
						<text class="u-tips-color">点击开始录音</text>
						<view class="voice-btn" @click="handleRecordVoice">录音</view>
					</view>
				</u-form-item>
			</view>
			<view class="form-card" v-if="form.finishPhoto">
				<u-form-item label="拜访时长">
					<view>{{form.visitMinute}}</view>
				</u-form-item>
				<view class="finish-photo-box">
					<image :src="form.finishPhotoAttach && form.finishPhotoAttach.url" class="finish-photo" @click="handlePreviewFinishPhoto"></image>
					<view class="u-primary" @click="showUpdatePhotoDialog = true" v-if="form.editStatus == 0">点击更新时长和照片</view>
				</view>
			</view>
			<TakePhoto :waterInfo="waterInfo" @setFinishPhoto="setFinishPhoto" v-if="form.id && form.visitMode === '1' && isXiaMen && !form.finishPhoto" />
		</u--form>
		<view class="footer" v-if="!form.id">
			<u-button @click="handleSave">存草稿</u-button>
		</view>
		<view class="footer u-flex footer-2" v-else>
			<u-button type="error" plain class="del-btn" @click="showDialog = true">删除草稿</u-button>
			<u-button @click="handleSave">存草稿</u-button>
		</view>
		<r-dialog v-model="showDialog" title="是否确认删除草稿？" cancelText="取消" confirmText="确认" @cancel="showDialog = false" @confirm="confirmDel">
			<view slot="content" style="height: 1px;"></view>
		</r-dialog>
		<r-dialog v-model="showVoiceDialog" title="确认删除录音？" cancelText="取消" confirmText="确认" @cancel="showVoiceDialog = false" @confirm="confirmVoiceDel">
			<view slot="content">删除录音不可恢复，将需要重新录音，确认删除?</view>
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
		<RecordVoice ref="recordVoiceRef" @updateVoice="updateVoice" />
		<r-dialog v-model="showVoice" title="语音播放" :btnsShow="false">
			<r-voice slot="content" v-if="form.voiceUrl" :src="form.voiceUrl" />
		</r-dialog>
		<!-- 这个r-voice隐藏看不见，为了获取音频时长 -->
		<r-voice v-show="false" v-if="form.voice" :src="form.voiceUrl" @ready="voiceReady" />
		<r-dialog v-model="showLocation" title="需开启定位权限" cancelText="取消" confirmText="去开启" @cancel="cancelLocation" @confirm="confirmLocation">
			<view slot="content">“定位权限”未开启，请进入手机设置中开启权限，否则将无法使用“入户拜访记录”功能</view>
		</r-dialog>
		<r-dialog v-model="showUpdatePhotoDialog" title="提示" @cancel="showUpdatePhotoDialog = false" @confirm="confirmUpdatePhoto">
			<view slot="content">本次操作后，将重新计算拜访时长并且替换之前的照片。是否确认更新时长和照片?</view>
		</r-dialog>
	</view>
</template>

<script>
	import { visitTagUrl, visitSaveUrl, visitUpdateUrl, visitDetailUrl, visitRemoveUrl } from '@/api/visiting.js'
	import { getCustomerBaseDetailUrl } from '@/api/index.js'
	import RecordVoice from './components/record-voice.vue'
	import TakePhoto from './components/take-photo.vue'
	import {
		checkPermission,
		checkSystemEnableLocation,
		gotoSystemLocatonSetting
	} from '@/utils/permission'
	
	export default {
		components: { RecordVoice, TakePhoto },
		onLoad ({ id, visitMode, customerId ,visiting_edit_name}) {
			// 将字符串参数转换为布尔值，如果没有传递参数则默认为 true
			this.visiting_edit_name = visiting_edit_name !== undefined ? visiting_edit_name !== 'false' : true
			if (!this.vuex_user.dept.city) {
				uni.showToast({
					title: '用户本职部门区域信息为空，无法创建记录',
					duration: 4000,
					mask: true,
					icon: 'none'
				})
				const timer = setTimeout(() => {
					clearTimeout(timer)
					uni.navigateBack()
				}, 4000)
				return
			}
			this.resetVuexData()
			this.init(id, visitMode)
			this.loadLabelList()
			if (customerId) {
				this.fromPage = 'oldManDetail' // 标记，从老人详情页进入的编辑页面
				this.loadCustomerDetail(customerId, true)
			}
			// #ifdef APP
			if (!id && visitMode === '1') {
				this.getLocation()
			}
			// #endif
		},
		onShow () {
			// if (!this.isXiaMen) return // 如果没有用户本职所属区域，则不做操作
			this.belongAddressCallback()
			this.customerCallback()
			this.addressCallback()
			this.externalCallback()
			this.personCallback()
			// #ifdef APP
			if (!this.form.id && this.form.visitMode === '1' && !this.form.visitLocationCode) {
				this.getLocation()
			}
			// #endif
		},
		data () {
			return {
				visiting_edit_name:true, 
				showDialog: false,
				fromPage: '', // 标记从哪里进入的编辑页面，如果不是从拜访列表进入，则保存后，返回拜访列表，而不是uni.navigateBack()
				form: {
					belongCity: '', // 所属城市
					belongCommunity: '', // 所属社区
					belongCounty: '', // 所属县/区
					belongProjectId: '',
					belongProjectName: '', // 项目名称
					belongProjectType: '', // 项目类型
					belongProvince: '', // 所属省份
					belongRegion: '', // 所属区域字符串拼接
					belongStreet: '', // 所属街道
					belongList: [],
					companyName: '',
					creatorName: '', // 前端显示字段，创建者
					customerId: '', // 被访客户id
					editStatus: '', // 编辑状态 0=草稿 1-已完成
					externalNames: '',
					finishPhoto: '', // 拜访结束照片
					finishPhotoAttach: {},
					id: '',
					imgHeight: '', // 图片高度
					imgWidth: '', // 图片宽度
					infoFeedback: '', // 信息反馈
					isRead: false, // 已读标志
					isSent: false, // 发送标志
					isVerify: false, // 校验标志
					latitude: '', // 纬度
					longitude: '', // 经度
					minzhengId: '', // 民政id
					oldId: '', // 旧id
					operatorDepartments: '', // 拜访人员部门
					operatorIds: [], // 共同拜访内部
					operatorNameColors: '', // 拜访人员心情
					operatorNames: '', // 共同拜访内部
					org: '', // 组织机构
					platform: '', // 平台
					regionCode: '', // 拜访地区代码
					registerAddress: '', // 登记地址
					remark: '',
					resultTracking: '', // 结果跟踪
					successPackContentId: '', // 成功包内容ID
					userId: '', // 用户ID
					visitAppendAddress: '', // 拜访附加地址
					visitAllAddress: '', // 前端自定义字段，地址拼接
					visitCity: '',
					visitCityCode: '',
					visitCommunity: '', // 拜访社区
					visitCommunityCode: '', // 拜访社区编码
					visitContent: '', // 拜访内容
					visitCounty: '',
					visitCountyCode: '',
					visitCustomerIdCard: '', // 被访客户身份证号
					visitCustomerMobilePhone: '', // 被访客户手机号
					visitCustomerName: '', // 被访客户姓名
					visitDetailAddress: '', // 拜访详细地址
					visitLabel: [], // 拜访标签，提交后端时是逗号分隔的字符串
					visitLocationCode: '', // 定位地址
					visitMinute: '', // 拜访时长
					visitMode: '', // 拜访方式
					visitOperatorId: '', // 拜访人id
					visitOperatorName: '', // 拜访人姓名
					visitPhotos: [], // 拜访照片
					visitPhotoList: [],
					visitProvince: '',
					visitProvinceCode: '',
					visitStreet: '',
					visitStreetCode: '',
					visitTime: '', // 拜访时间
					visitVillage: '', // 拜访小区
					voice: '', // 声音
					voiceUrl: '', // 前端自定义字段，存储音频url
					voiceLength: '', // 声音长度
					volunteerDepartments: '', // 志愿者部门
					volunteerIds: [], // 志愿者ids
					volunteerNameColors: '', // 志愿者心情
					volunteerNames: '', // 志愿者姓名
					workTaskId: '' // 工作任务ID
				},
				labelList: [],
				loading: false,
				show: false,
				unsave: false, // 是否未保存
				finish: false, // 如果是点击“完成”按钮，则标记finish为true，用于onBackPress的处理
				oldManAddress: {}, // 所选老人的现居地址
				showVoice: false,
				showVoiceDialog: false,
				showLocation: false,
				locationType: '', // system=系统定位功能 app=app定位权限
				showUpdatePhotoDialog: false
			}
		},
		computed: {
			navTitle () {
				const ope = this.form.id ? '编辑' : '新增'
				return `${ope}拜访信息-${this.form.visitMode === '1' ? '入户' : this.form.visitMode === '2' ? '电话' : '活动'}`
			},
			rules () {
				const validateTime = (rule, value, callback) => {
					if (!value) return callback(new Error('请选择拜访时间'))
					if (new Date(value) >= new Date()) return callback(new Error('拜访时间不得大于当前时间'))
					callback()
				}
				const validateAddress = (rule, value, callback) => {
					if (!value) return callback(new Error('请选择拜访地址'))
					if (!(this.form.visitProvinceCode && this.form.visitCityCode && this.form.visitCountyCode && this.form.visitStreetCode && this.form.visitCommunityCode)) {
						return callback(new Error('请选择拜访地址'))
					}
					if (!this.form.visitVillage) return callback(new Error('小区名称不可为空'))
					if (!this.form.visitDetailAddress) return callback(new Error('请输入详细地址'))
					callback()
				}
				const validateBelongRegion = (rule, value, callback) => {
					if (!this.form.belongRegion) return callback(new Error('请选择所属区域'))
					if (!this.form.belongProvince) return callback(new Error('所属区域省份不可为空'))
					if (!this.form.belongCity) return callback(new Error('所属区域市区不可为空'))
					if (!this.form.belongCounty) return callback(new Error('所属区域县/区不可为空'))
					if (!this.form.belongStreet) return callback(new Error('所属区域街道不可为空'))
					if (!this.form.belongCommunity) return callback(new Error('所属区域社区不可为空'))
					callback()
				}
				return {
					visitLabel: { required: true, type: 'array', message: '请选择拜访标签', trigger: 'none' },
					visitPhotos: { required: this.form.visitMode === '1', type: 'array', message: '请上传拜访照片', trigger: 'none' },
					visitContent: { required: true, message: '请输入拜访内容', trigger: 'none' },
					belongRegion: { required: true, validator: validateBelongRegion, trigger: 'none' },
					visitTime: { required: true, validator: validateTime, trigger: 'none' },
					visitCustomerName: { required: true, message: '请选择老人', trigger: 'none' },
					visitAllAddress: { required: true, validator: validateAddress, trigger: 'none' },
					finishPhoto: { required: true, message: '请上传拜访结束照片', trigger: 'none' }
				}
			},
			finishPhotoList () {
				if (this.form.finishPhotoAttach && this.form.finishPhotoAttach.id) return [this.form.finishPhotoAttach]
				return []
			},
			waterInfo() {
				return {
					firstLine: `助老员：${this.vuex_user.username}`,
					secondLine: uni.$u.timeFormat(Date.now(), 'yyyy-mm-dd hh:MM'),
					thirdLine: this.form.visitLocationCode
				}
			}
		},
		onBackPress () {
			if (this.$refs.recordVoiceRef.show) { // 录音弹窗是否是打开状态
				this.$refs.recordVoiceRef.close()
				return true
			}
			if (this.unsave && !this.finish) {
				this.show = true
				return true
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
			init (id, visitMode) {
				this.form.visitMode = visitMode
				if (id) {
					this.loadData(id)
				} else {
					this.form.belongProvince = this.vuex_user.dept.province
					this.form.belongCity = this.vuex_user.dept.city
					this.form.belongCounty = this.vuex_user.dept.county
					this.form.belongStreet = this.vuex_user.dept.street
					this.form.belongCommunity = this.vuex_user.dept.community
					this.form.belongList = [this.form.belongProvince, this.form.belongCity, this.form.belongCounty, this.form.belongStreet, this.form.belongCommunity]
					this.form.belongRegion = `${this.vuex_user.dept.provinceName || ''}${this.vuex_user.dept.cityName || ''}${this.vuex_user.dept.countyName || ''}${this.vuex_user.dept.streetName || ''}${this.vuex_user.dept.communityName || ''}`
					this.form.visitOperatorId = this.vuex_user.id
					this.form.visitOperatorName = this.vuex_user.nickname
					this.form.visitTime = uni.$u.timeFormat(Date.now(), 'yyyy-mm-dd hh:MM')
					this.resetUnSave()
				}
			},
			getLocation () {
				uni.getLocation({
					geocode: true,
					isHighAccuracy: true,
					highAccuracyExpireTime: 10000,
					type: 'gcj02',
					success: res => {
						this.form.latitude = res.latitude
						this.form.longitude = res.longitude
						const { country = '', province = '', city, district, street, streetNum, poiName } = res.address
						this.form.visitLocationCode = country + province + city + district + street + streetNum + poiName
						this.resetUnSave()
					},
					fail: async () => {
						if (!checkSystemEnableLocation()) { // 检查系统的定位功能是否开启
							this.locationType = 'system'
							this.showLocation = true
							return
						}
						if (!await checkPermission('location')) { // 检查app是否授权了定位权限
							this.locationType = 'app'
							this.showLocation = true
						}
					}
				})
			},
			// 重置vuex数据，避免离开页面再进来以后，vuex数据还在
			resetVuexData () {
				this.$u.vuex('vuex_commonAddress', {})
				this.$u.vuex('vuex_visitAddress', {})
				this.$u.vuex('vuex_oldMan', {})
				this.$u.vuex('vuex_external', [])
				this.$u.vuex('vuex_systemUser', {})
			},
			confirmLocation () {
				if (this.locationType === 'app') {
					gotoAppPermissionSetting()
					return
				}
				gotoSystemLocatonSetting()
			},
			cancelLocation () {
				uni.showToast({ title: '定位权限未开启，无法使用该功能', icon: 'none', duration: 2000, mask: true })
				const timeId = setTimeout(() => {
					clearTimeout(timeId)
					uni.navigateBack()
				}, 2000)
			},
			async loadLabelList () {
				const { data } = await uni.$u.http.post(visitTagUrl, { pageNum: 1, pageSize: 1000, isFilter: 1 })
				this.labelList = data.list.map(item => ({ label: item.name, value: item.name }))
			},
			async loadData (id) {
				const params = { params: { id } }
				const { data } = await uni.$u.http.get(visitDetailUrl, params)
				this.form.belongCity = data.belongCity
				this.form.belongCommunity = data.belongCommunity
				this.form.belongCounty = data.belongCounty
				this.form.belongProvince = data.belongProvince
				this.form.belongRegion = data.belongRegion
				this.form.belongStreet = data.belongStreet
				this.form.companyName = data.companyName
				this.form.customerId = data.customerId
				this.form.externalNames = data.externalNames
				this.form.finishPhoto = data.finishPhoto
				this.form.finishPhotoAttach = data.finishPhotoAttach || {}
				this.form.id = data.id
				this.form.infoFeedback = data.infoFeedback
				this.form.latitude = data.latitude
				this.form.longitude = data.longitude
				this.form.operatorIds = data.operatorIds && data.operatorIds.length ? data.operatorIds.map(id => Number(id)) : []
				this.form.operatorNames = data.operatorNames && data.operatorNames.length ? data.operatorNames.join(',') : ''
				this.form.resultTracking = data.resultTracking
				this.form.visitCity = data.visitCity
				this.form.visitCityCode = data.visitCityCode
				this.form.visitCommunity = data.visitCommunity
				this.form.visitCommunityCode = data.visitCommunityCode
				this.form.visitContent = data.visitContent
				this.form.visitCounty = data.visitCounty
				this.form.visitCountyCode = data.visitCountyCode
				this.form.visitCustomerIdCard = data.visitCustomerIdCard
				this.form.visitCustomerMobilePhone = data.visitCustomerMobilePhone
				this.form.visitCustomerName = data.visitCustomerName
				this.form.visitDetailAddress = data.visitDetailAddress
				this.form.visitAllAddress = `${data.visitProvince || ''}${data.visitCity || ''}${data.visitCounty || ''}${data.visitStreet || ''}${data.visitCommunity || ''}${data.visitVillage || ''}${data.visitDetailAddress}`
				this.form.visitAppendAddress = data.visitAppendAddress
				this.form.visitLabel = data.visitLabel
				this.form.visitLocationCode = data.visitLocationCode
				this.form.visitMode = data.visitMode
				this.form.visitOperatorId = data.visitOperatorId
				this.form.visitOperatorName = data.visitOperatorName
				this.form.visitPhotos = data.visitPhotos || []
				this.form.visitPhotoList = data.visitPhotoList || []
				this.form.visitProvince = data.visitProvince
				this.form.visitProvinceCode = data.visitProvinceCode
				this.form.visitStreet = data.visitStreet
				this.form.visitStreetCode = data.visitStreetCode
				this.form.visitTime = data.visitTime
				this.form.visitVillage = data.visitVillage
				this.form.voice = data.voice
				this.form.voiceUrl = data.voiceFile && data.voiceFile.url
				this.form.voiceLength = data.voiceLength ? uni.$u.timeFormat(data.voiceLength * 1000, 'MM:ss') : ''
				this.form.volunteerIds = data.volunteerIds && data.volunteerIds.length ? data.volunteerIds.map(id => Number(id)) : [] // 志愿者ids
				this.form.volunteerNames = data.volunteerNames && data.volunteerNames.length ? data.volunteerNames.join(',') : ''
				this.loadCustomerDetail(this.form.customerId)
				this.resetUnSave()
			},
			setFinishPhoto (data) {
				this.form.finishPhoto = data.id
				this.form.finishPhotoAttach = data
				const start = new Date(this.form.visitTime)
				const end = data.time
				const diff = (end - start) / 1000 // 总秒数
				const minute = Math.ceil(diff / 60)
				this.form.visitMinute = minute > 0 ? `${minute}分钟` : '1分钟'
			},
			handlePreviewFinishPhoto () {
				uni.previewImage({
					urls: [this.form.finishPhotoAttach.url],
					current: 0,
					indicator: 'number'
				})
			},
			confirmUpdatePhoto () {
				this.form.finishPhoto = ''
				this.form.finishPhotoAttach = {}
				this.form.visitMinute = ''
			},
			// callback: 是否需要执行customerCallback(只有在老人详情页里，点击添加拜访记录进来的情况，才需要有callback)
			async loadCustomerDetail (id, callback) {
				const { data } = await uni.$u.http.post(`${getCustomerBaseDetailUrl}?id=${id}`)
				this.oldManAddress = {
					province: data.currentProvince,
					city: data.currentCity,
					county: data.currentCounty,
					street: data.currentStreet,
					community: data.currentCommunity,
					village: data.currentVillage,
					detailAddress: data.currentAddress,
					allAddress: `${data.currentProvinceName}${data.currentCityName}${data.currentCountyName}${data.currentStreetName}${data.currentCommunityName}${data.currentVillage || ''}${data.currentAddress || ''}`
				}
				if (callback) {
					this.$u.vuex('vuex_oldMan', data)
					this.customerCallback()
				}
			},
			async handleSave () {
				if (this.loading) return
				if (!this.form.visitCustomerName) {
					uni.$u.toast('请选择老人')
					return
				}
				try {
					this.loading = true
					await uni.$u.http.post(this.form.id ? visitUpdateUrl : visitSaveUrl, this.getParams(0))
					this.finish = true
					if (this.fromPage === 'oldManDetail') {
						uni.redirectTo({ url: '/pages/visiting/list' })
					} else {
						uni.navigateBack()
					}
				} catch {
					this.loading = false
				}
			},
			handleFinish () {
				if (this.loading) return
				this.$refs.formRef.validate().then(async () => {
					this.loading = true
					await uni.$u.http.post(this.form.id ? visitUpdateUrl : visitSaveUrl, this.getParams(1))
					this.finish = true
					if (this.fromPage === 'oldManDetail') {
						uni.redirectTo({ url: '/pages/visiting/list' })
					} else {
						uni.navigateBack()
					}
				}).catch(err => {
					this.loading = false
					if (Object.prototype.toString.call(err) === '[object Array]') { // 如果是数组，说明是表单校验的报错
						uni.$u.toast(err[0] && err[0].message)
						return
					}
					uni.$u.toast(err.message || err.msg || '请求出错，请联系管理员')
				})
			},
			// 确认删除草稿
			async confirmDel () {
				await uni.$u.http.post(visitRemoveUrl, { ids: this.form.id }, { header: { 'Content-Type': 'application/x-www-form-urlencoded' } })
				uni.navigateBack()
			},
			// 获取音频时间
			getVoiceTime () {
				if (!this.form.voiceLength) return 0
				const parts = this.form.voiceLength.split(':')
				// 将分钟和秒转换为数字
				const minutes = parseInt(parts[0], 10)
				const seconds = parseInt(parts[1], 10)
				// 计算总秒数
				return minutes * 60 + seconds
			},
			// 在APP端，editStatus不管传什么，都会保存成草稿状态，因为手机端无法一次完成
			getParams (editStatus) {
				return {
					belongCity: this.form.belongCity, // 所属城市
					belongCommunity: this.form.belongCommunity, // 所属社区
					belongCounty: this.form.belongCounty, // 所属县/区
					belongProvince: this.form.belongProvince, // 所属省份
					belongRegion: this.form.belongRegion, // 所属区域字符串拼接
					belongStreet: this.form.belongStreet, // 所属街道
					companyName: this.form.companyName,
					customerId: this.form.customerId, // 被访客户id
					editStatus, // 编辑状态 0=草稿 1-已完成
					externalNames: this.form.externalNames,
					finishPhoto: this.form.finishPhoto, // 拜访结束照片
					id: this.form.id,
					infoFeedback: this.form.infoFeedback, // 信息反馈
					latitude: this.form.latitude, // 纬度
					longitude: this.form.longitude, // 经度
					operatorIds: this.form.operatorIds.join(','), // 共同拜访内部
					operatorNames: this.form.operatorNames, // 共同拜访内部
					platform: '2', // 平台
					resultTracking: this.form.resultTracking, // 结果跟踪
					visitCity: this.form.visitCity,
					visitCityCode: this.form.visitCityCode,
					visitCommunity: this.form.visitCommunity, // 拜访社区
					visitCommunityCode: this.form.visitCommunityCode, // 拜访社区编码
					visitContent: this.form.visitContent, // 拜访内容
					visitCounty: this.form.visitCounty,
					visitCountyCode: this.form.visitCountyCode,
					visitCustomerIdCard: this.form.visitCustomerIdCard, // 被访客户身份证号
					visitCustomerMobilePhone: this.form.visitCustomerMobilePhone, // 被访客户手机号
					visitCustomerName: this.form.visitCustomerName, // 被访客户姓名
					visitDetailAddress: this.form.visitDetailAddress, // 拜访详细地址
					visitLabel: this.form.visitLabel.join(','), // 拜访标签，提交后端时是逗号分隔的字符串
					visitMode: this.form.visitMode, // 拜访方式
					visitOperatorId: this.form.visitOperatorId, // 拜访人id
					visitOperatorName: this.form.visitOperatorName, // 拜访人名字
					visitPhotos: this.form.visitPhotos.join(','), // 拜访照片
					visitProvince: this.form.visitProvince,
					visitProvinceCode: this.form.visitProvinceCode,
					visitStreet: this.form.visitStreet,
					visitStreetCode: this.form.visitStreetCode,
					visitTime: this.form.visitTime, // 拜访时间
					visitVillage: this.form.visitVillage, // 拜访小区
					visitLocationCode: this.form.visitLocationCode,
					voice: this.form.voice, // 声音
					voiceLength: this.getVoiceTime(), // 声音长度
					volunteerIds: this.form.volunteerIds.join(','), // 志愿者ids
					volunteerNames: this.form.volunteerNames // 志愿者姓名
				}
			},
			// 编辑所属区域
			handleEditBelong () {
				this.$u.vuex('vuex_commonAddress', {
					province: this.form.belongProvince,
					city: this.form.belongCity,
					county: this.form.belongCounty,
					street: this.form.belongStreet,
					community: this.form.belongCommunity
				})
				uni.navigateTo({ url: '/pages/common/add-address' })
			},
			// 所属区域回调
			belongAddressCallback () {
				const data = this.vuex_commonAddress || {}
				if (!(data.province && data.city && data.county && data.street && data.community)) return
				this.form.belongProvince = data.province
				this.form.belongCity = data.city
				this.form.belongCounty = data.county
				this.form.belongStreet = data.street
				this.form.belongCommunity = data.community
				this.form.belongRegion = `${data.provinceName}${data.cityName}${data.countyName}${data.streetName}${data.communityName}`
			},
			// 编辑拜访地址
			handleEditVisit () {
				this.$u.vuex('vuex_visitAddress', {
					province: this.form.visitProvinceCode,
					city: this.form.visitCityCode,
					county: this.form.visitCountyCode,
					street: this.form.visitStreetCode,
					community: this.form.visitCommunityCode,
					village: this.form.visitVillage,
					detailAddress: this.form.visitDetailAddress,
					oldManAddress: this.oldManAddress
				})
				uni.navigateTo({ url: '/pages/visiting/add-address' })
			},
			// 拜访地址回调
			addressCallback() {
				const data = this.vuex_visitAddress
				if (!(data.province && data.city && data.county && data.street && data.community)) return
				this.form.visitProvince = data.provinceName
				this.form.visitProvinceCode = data.province
				this.form.visitCity = data.cityName
				this.form.visitCityCode = data.city
				this.form.visitCounty = data.countyName
				this.form.visitCountyCode = data.county
				this.form.visitStreet = data.streetName
				this.form.visitStreetCode = data.street
				this.form.visitCommunity = data.communityName
				this.form.visitCommunityCode = data.community
				this.form.visitVillage = data.village
				this.form.visitDetailAddress = data.detailAddress
				this.form.visitAllAddress = `${data.provinceName || ''}${data.cityName || ''}${data.countyName || ''}${data.streetName || ''}${data.communityName || ''}${data.village || ''}${data.detailAddress || ''}`
			},
			// 选择老人
			handleChooseOldMan () {
				if(!this.visiting_edit_name) return
				if (this.form.id ) return
				uni.navigateTo({ url: '/pages/old-man/list?from=visiting' })
			},
			// 选择老人回调
			customerCallback () {
				const data = this.vuex_oldMan
				if (!(data.id)) return
				this.form.customerId = data.id
				this.form.visitCustomerIdCard = data.idcard
				this.form.visitCustomerMobilePhone = data.mobilephone
				this.form.visitCustomerName = data.name
				if (this.form.visitMode === '1') {
					this.form.visitProvince = data.currentProvinceName
					this.form.visitProvinceCode = data.currentProvince
					this.form.visitCity = data.currentCityName
					this.form.visitCityCode = data.currentCity
					this.form.visitCounty = data.currentCountyName
					this.form.visitCountyCode = data.currentCounty
					this.form.visitStreet = data.currentStreetName
					this.form.visitStreetCode = data.currentStreet
					this.form.visitCommunity = data.currentCommunityName
					this.form.visitCommunityCode = data.currentCommunity
					this.form.visitVillage = data.currentVillage
					this.form.visitDetailAddress = data.currentAddress
					this.form.visitAllAddress = `${data.currentProvinceName || ''}${data.currentCityName || ''}${data.currentCountyName || ''}${data.currentStreetName || ''}${data.currentCommunityName || ''}${data.currentVillage || ''}${data.currentAddress || ''}`
					this.oldManAddress = {
						province: data.currentProvince,
						city: data.currentCity,
						county: data.currentCounty,
						street: data.currentStreet,
						community: data.currentCommunity,
						village: data.currentVillage,
						detailAddress: data.currentAddress,
						allAddress: `${data.currentProvinceName || ''}${data.currentCityName || ''}${data.currentCountyName || ''}${data.currentStreetName || ''}${data.currentCommunityName || ''}${data.currentVillage || ''}${data.currentAddress || ''}`
					}
				}
			},
			handleEditExternal () {
				const list = this.form.externalNames ? this.form.externalNames.split(',') : []
				uni.$u.vuex('vuex_external', list.map(item => ({ id: Math.random().toString(), name: item })))
				uni.navigateTo({ url: '/pages/visiting/add-external' })
			},
			externalCallback () {
				if (this.vuex_external) {
					this.form.externalNames = this.vuex_external.map(item => item.name).join(',')
				}
			},
			// 选择共同拜访人员
			handleChoosePerson (type) {
				const list = []
				if (type === 'operatorNames') {
					const names = this.form.operatorNames ? this.form.operatorNames.split(',') : []
					this.form.operatorIds.forEach((item, index) => {
						list.push({ userId: item, userName: names[index] })
					})
				} else {
					const names = this.form.volunteerNames ? this.form.volunteerNames.split(',') : []
					this.form.volunteerIds.forEach((item, index) => {
						list.push({ userId: item, userName: names[index] })
					})
				}
				uni.$u.vuex('vuex_systemUser', {
					type,
					title: type === 'operatorNames' ? '共同拜访(内部)' : '共同拜访(志愿者)',
					list
				})
				uni.navigateTo({ url: '/pages/common/add-system-user?attr=0' })
			},
			// 共同拜访人员回调
			personCallback () {
				const data = this.vuex_systemUser
				if (!(data && data.type)) return
				if (data.type === 'operatorNames') {
					this.form.operatorIds = data.list.map(item => item.userId)
					this.form.operatorNames = data.list.map(item => item.userName).join(',')
				} else {
					this.form.volunteerIds = data.list.map(item => item.userId)
					this.form.volunteerNames = data.list.map(item => item.userName).join(',')
				}
			},
			handleRecordVoice () {
				this.$refs.recordVoiceRef.open()
			},
			updateVoice (data) {
				this.form.voice = data.id
				this.form.voiceUrl = data.path
			},
			voiceReady(voiceTime) {
				this.form.voiceLength = voiceTime
			},
			confirmVoiceDel () {
				this.form.voice = ''
				this.form.voiceUrl = ''
				this.form.voiceLength = ''
			},
			backEdit () {
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
			handleToMap () {
				if (this.form.latitude && this.form.longitude) {
					uni.navigateTo({ url: `/pages/visiting/location-map?latitude=${this.form.latitude}&longitude=${this.form.longitude}&name=${this.form.visitLocationCode}` })
				}
			},
			resetUnSave () {
				const timeId = setTimeout(() => {
					this.unsave = false
					clearTimeout(timeId)
				}, 100)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.location {
		display: flex;
		align-items: flex-start;
		padding: 12px;
		color: $u-tips-color;
	}
	
	/deep/ .gray-label1 {
		.u-form-item__body__left__content__label {
			&::after {
				content: '(内部)';
				color: #999;
			}
		}
	}
	/deep/ .gray-label2 {
		.u-form-item__body__left__content__label {
			&::after {
				content: '(外部)';
				color: #999;
			}
		}
	}
	/deep/ .gray-label3 {
		.u-form-item__body__left__content__label {
			&::after {
				content: '(志愿者)';
				color: #999;
			}
		}
	}
	
	.location-text {
		transform: translateY(-2px);
	}
	
	.form-card {
		background-color: #fff;
		border-radius: 8px;
		padding: 0 12px 12px 12px;
		margin: 12px 0;
	}
	
	/deep/ .u-textarea {
		padding: 10px 0;
	}
	
	.voice-btn {
		line-height: 24px;
		padding: 0 8px;
		border-radius: 8px;
		border: 1px solid $u-primary;
		color: $u-primary;
		font-size: 12px;
		margin-left: 8px;
	}
	
	.voice-box {
		height: 20px;
		border-radius: 10px;
		background-color: rgba($u-primary, 0.05);
		padding: 0 8px;
	}
	
	.footer {
		padding: 12px 40px;
		background-color: #fff;
		.del-btn {
			width: 45%;
			margin-right: 12px;
		}
	}
	
	.finish-photo {
		width: 80px;
		height: 80px;
		border-radius: 4px;
	}
	
	.finish-photo-box {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
</style>