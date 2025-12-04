<template>
	<view class="add-page">
		<u-navbar title="完成服务确认" placeholder bgColor="#FAF9F7">
			<view slot="left" class="u-flex">
				<text class="u-tips-color" @click="handleBack">取消</text>
			</view>
			<view slot="right" class="u-flex">
				<text class="u-primary" @click="handleConfirm">确认</text>
			</view>
		</u-navbar>

		<u--form labelWidth="120px" :model="form" :rules="rules" ref="form">
			<view class="add-card u-p-b-12">
				<u-form-item label="共同服务人员" prop="money" borderBottom @click="staffDialog = true">
					<text v-if="form.commonStaffName">{{form.commonStaffName}}</text>
					<text v-else class="u-place-color">请选择</text>
					<u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
				</u-form-item>
				<u-form-item label="工单号" prop="workNumber" borderBottom class="form-required">
					<u-input v-model="form.workNumber" maxlength="64" border="none" placeholder="请输入工单号">
					</u-input>
				</u-form-item>
			</view>
		</u--form>

		<view class="add-card">
			<view class="u-m-b-8">
				工单照片 <text class="u-error">(“提交审核”时必填，至少1张，最多3张)</text>
			</view>
			<r-upload v-model="form.finishAddressPicture" :imgList="finishAddressPictureAttach" :maxCount="3" />
		</view>

		<view class="add-card">
			<view class="u-m-b-8">
				与服务对象合照 <text class="u-info">(最多上传3张)</text>
			</view>
			<r-upload v-model="form.finishObjectPicture" :imgList="finishObjectPictureAttach" :maxCount="3" />
		</view>

		<view class="add-card">
			<view class="u-m-b-8">
				备注内容
			</view>
			<r-textarea v-model="form.finishServeRemark" count :maxlength="300" placeholder="请输入内容" class="min-textarea"></r-textarea>
		</view>

		<r-dialog v-model="finishShow" title="确认完成服务？" cancelText="取消" confirmText="确定" @cancel="finishShow = false" @confirm="dialogConfirm">
			<view slot="content" class="u-flex">
				<text class="u-text-center">即将提交当前位置信息和时间信息，且不可修改。是否确认已完成服务?</text>
			</view>
		</r-dialog>

		<r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false" @confirm="toBack">
			<view slot="content">
				<text class="u-text-center">当前页面已做出修改，是否不保存就退出</text>
			</view>
		</r-dialog>

		<r-dialog v-model="staffDialog" :btnsShow="false" title="请选择共同服务类型">
			<view slot="content" class="staff-btn">
				<view class="u-m-b-12">
					<u-button type="primary" text="内部服务人员(有APP账号)" @click="handleSysStaff(true)"></u-button>
				</view>
				<u-button type="primary" text="外部服务人员(无APP账号)" @click="handleExtStaff(true)"></u-button>
			</view>
		</r-dialog>

		<r-location ref="rLocation" />
	</view>
</template>

<script>
	import { getStaffInfoDetailUrl, finishServiceUrl } from '@/api'

	export default {
		data() {
			return {
				unsave: false,
				finishShow: false,
				show: false,
				loading: false,
				isFirst: true,
				form: {
					finishAddressPicture: '',
					internalOperatorIds: '',
					internalOperatorNames: '',
					externalOperatorNames: '',
					commonStaffName: '',
					finishObjectPicture: '',
					finishServeRemark: ''
				},
				rules: { workNumber: { required: true, message: '工单号不可为空', trigger: ['blur', 'change'] } },
				finishAddressPictureAttach: [],
				finishObjectPictureAttach: [],
				staffDialog: false
			}
		},
		watch: {
			form: {
				handler: function() {
					this.unsave = true
				},
				deep: true
			}
		},
		onLoad({ id }) {
			this.form.id = id
			this.loadData()
		},
		onUnload() {
			this.$u.vuex('vuex_systemUser', {})
			this.$u.vuex('vuex_external', [])
		},
		onShow() {
			this.internalOperatorCallback()
			this.externalOperatorCallback()
		},
		methods: {
			async loadData() {
				const { data } = await uni.$u.http.post(`${getStaffInfoDetailUrl}?id=${this.form.id}`)
				this.isFirst = !data.finishOrderTime
				if (!this.isFirst) {
					this.finishAddressPictureAttach = data.finishAddressPictureAttach || []
					this.finishObjectPictureAttach = data.finishObjectPictureAttach || []
					this.form.finishAddressPicture = data.finishAddressPicture
					this.form.finishObjectPicture = data.finishObjectPicture
					this.form.finishServeRemark = data.finishServeRemark
					this.form.workNumber = data.workNumber
					this.form.internalOperatorIds = data.internalOperatorIds || ''
					this.form.internalOperatorNames = data.internalOperatorNames
					this.form.externalOperatorNames = data.externalOperatorNames
					this.form.commonStaffName = data.commonStaffName
				}
			},
			handleSysStaff(goPage = true) {
				const list = []
				const names = this.form.internalOperatorNames ? this.form.internalOperatorNames.split(',') : []
				this.form.internalOperatorIds.split(',').filter(l => l).forEach((item, index) => {
					list.push({ userId: Number(item), userName: names[index] })
				})
				uni.$u.vuex('vuex_systemUser', {
					type: '',
					title: '添加共同服务人员-内部',
					list
				})
				if (goPage) {
					this.handleExtStaff(false)
					const url = `/pages/common/add-system-user?attr=0&ancestors=${this.vuex_user.deptId}&excludeUserId=${this.vuex_user.id}`
					uni.navigateTo({ url })
					this.staffDialog = false
				}
			},
			internalOperatorCallback() {
				const data = this.vuex_systemUser
				if (!data.list || !data.list.length) {
					this.form.internalOperatorIds = ''
					this.form.internalOperatorNames = ''
					return
				}
				this.form.internalOperatorIds = data.list.map(item => item.userId).join(',')
				this.form.internalOperatorNames = data.list.map(item => item.userName).join(',')
				this.initComStaff()
			},
			handleExtStaff(goPage = true) {
				const list = this.form.externalOperatorNames ? this.form.externalOperatorNames.split(',') : []
				uni.$u.vuex('vuex_external', list.map((item, index) => ({ id: index, name: item })))
				if (goPage) {
					this.handleSysStaff(false)
					uni.navigateTo({ url: '/pages/order/components/add-external' })
					this.staffDialog = false
				}
			},
			externalOperatorCallback() {
				if (this.vuex_external && this.vuex_external.length) {
					this.form.externalOperatorNames = this.vuex_external.map(item => item.name).join(',')
				} else {
					this.form.externalOperatorNames = ''
				}
				this.initComStaff()
			},
			initComStaff() {
				this.form.commonStaffName = [this.form.internalOperatorNames, this.form.externalOperatorNames].filter(l => l).join(',')
			},
			handleBack() {
				if (this.unsave) {
					this.show = true
					return
				}
				uni.navigateBack()
			},
			toBack() {
				uni.navigateBack()
			},
			async handleConfirm() {
				await this.$refs.form.validate()
				if (this.isFirst) {
					const { longitude, latitude, address } = await this.$refs.rLocation.getAddress()
					this.form.finishLongitude = longitude
					this.form.finishLatitude = latitude
					this.form.finishOrderAddress = address
					this.finishShow = true
					return
				}
				this.dialogConfirm()
			},
			async dialogConfirm() {
				await uni.$u.http.post(finishServiceUrl, this.form)
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
	.add-page {
		box-sizing: border-box;
		background-color: #FAF9F7;
		position: relative;
		min-height: 100vh;
		padding: 12px 16px 24px;
	}

	.add-card {
		background: #ffffff;
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 12px;
	}

	.address-text {
		font-size: 14px;
		font-weight: 400;
		color: #333231;
		margin-bottom: 14px;
	}

	.address-tip {
		background: #fff9f0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #ff9500;
		padding: 2px 5px;
		margin-right: 5px;
	}

	/deep/ .u-textarea--no-radius {
		border: none;
	}

	.staff-btn {
		width: 200px;
		margin: 0 auto;
	}
</style>