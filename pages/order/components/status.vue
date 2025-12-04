<template>
	<view :class="['detail-page', {'fixed-footer-bottom': isEdit || isAudit}]">
		<u-navbar :title="title" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
			<r-camera slot="right" />
		</u-navbar>
		<view v-if="errorPreview" class="u-flex u-error error-preview">
			<u-icon :name="aIcon('jinggao-1')" width="20" height="20"></u-icon>
			<text class="u-m-l-4">该订单还有照片未上传，请全部上传后再提交审核</text>
		</view>
		<view class="base-box">
			<view class="u-flex u-flex-between">
				<view v-show="info.id">
					<text v-if="!['3', '4'].includes(info.status)" :class="['status u-m-r-5', `status-${info.status}`]">{{radioDict(info.status,'staff_status')}}</text>
					<text class="status-title">订单编号：{{ info.orderNumber }}</text>
				</view>
				<view v-if="isEdit && !info.finishOrderTime">
					<u-button type="error" :customStyle="{height: '28px'}" plain text="取消订单" @click="toPage(`/pages/order/service-cancel?id=${info.id}`)"></u-button>
				</view>
			</view>
		</view>

		<u--form labelWidth="100px" :model="info" ref="form">
			<view class="base-box u-p-t-0">
				<u-form-item label="归属项目(一级)" borderBottom>
					<text>{{ radioDict(info.belongProject,'belong_project') }}</text>
				</u-form-item>
				<u-form-item v-if="info.secondBelongProjectName" label="归属项目(二级)" borderBottom>
					<text>{{ info.secondBelongProjectName }}</text>
				</u-form-item>
				<u-form-item label="服务时间" borderBottom>
					<text>{{info.serveTime}}</text>
				</u-form-item>
				<u-form-item label="服务对象" borderBottom @click="toPage(`/pages/order/components/object-detail?id=${info.memberId}`)">
					<view class="u-flex">
						<text>{{info.memberName}} | {{ radioDict(info.sex,'vols_sex') }} {{ info.age? ' | ' + info.age + '岁' : '' }}</text>
						<view v-if="info.status === '3'" class="u-flex u-m-l-10" @click.stop="phoneShow = true">
							<u-icon :name="aIcon('dianhua-1')" width="20" height="20" />
							<text class="u-primary">拨打电话</text>
						</view>
					</view>
					<u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
				</u-form-item>
				<u-form-item label="服务地址" prop="address" borderBottom>
					<text>{{info.address}}</text>
				</u-form-item>
			</view>
		</u--form>

		<!-- 开始时间 -->
		<view class="base-box" v-if="info.startOrderTime">
			<view class="u-border-bottom u-flex u-flex-between u-p-b-12 u-m-b-12">
				<view>
					<view class="time-tip u-m-b-5">开始时间：{{info.startOrderTime}} </view>
					<view class="u-flex u-tips-color u-font-12">
						<u-icon name="map-fill" color="#999693" size="16"></u-icon>
						<text>{{info.startOrderAddress || '未获取到位置信息'}}</text>
					</view>
				</view>
				<text v-if="isEdit" class="pic-button" @click="toPage(`/pages/order/components/service-start?id=${id}`)">编辑</text>
				<text v-else class="pic-button" @click="handleStartPhotoPreview">查看图片</text>
			</view>
			<view v-if="isEdit">
				<view class="u-flex u-flex-between u-m-b-8">
					<view class="u-content-color u-font-14">
						相关照片：
						<text class="u-main-color">
							{{info.startPhoto ? info.startPhoto.length :'暂未上传照片'}}
						</text>
					</view>
					<text v-if="isEdit" class="pic-button" @click="toPage(`/pages/order/components/service-start?id=${id}`)">编辑</text>
				</view>
				<r-upload :imgList="info.startPhoto" disabled :width="56" class="u-m-b-8" />
			</view>
			<text v-if="isOrderPreview && !info.startAddressPictureAttach.length" class="u-error">暂未上传相关照片，无法提交审核</text>
			<view v-if="info.startServeRemark" class="u-content-color u-font-12">备注内容：{{info.startServeRemark}}</view>
		</view>

		<!-- 完成时间 -->
		<view class="base-box" v-if="info.finishOrderTime">
			<view class="u-border-bottom u-flex u-flex-between u-p-b-12 u-m-b-12">
				<view>
					<view class="time-tip u-m-b-5">完成时间：{{info.finishOrderTime}}</view>
					<view class="u-flex u-tips-color u-font-12">
						<u-icon name="map-fill" color="#999693" size="16"></u-icon>
						<text>{{info.finishOrderAddress || '未获取到位置信息'}}</text>
					</view>
				</view>
				<text v-if="isEdit" class="pic-button" @click="toPage(`/pages/order/components/service-finish?id=${id}`)">编辑</text>
				<text v-else class="pic-button" @click="handleFinishPhotoPreview">查看图片</text>
			</view>
			<view v-if="isEdit && !info.finishOrderTime">
				<view class="u-flex u-flex-between u-m-b-8">
					<view class="u-content-color u-font-14">
						相关照片：
						<text class="u-main-color">
							{{info.finishPhoto ? info.finishPhoto.length :'暂未上传照片'}}
						</text>
					</view>
					<text v-if="isEdit && !info.finishOrderTime" class="pic-button" @click="toPage(`/pages/order/components/service-finish?id=${id}`)">编辑</text>
				</view>
				<r-upload :imgList="info.finishPhoto" disabled :width="56" class="u-m-b-8" />
			</view>
			<text v-if="isOrderPreview && !info.finishAddressPictureAttach.length" class="u-error">暂未上传相关照片，无法提交审核</text>
			<view v-if="info.finishServeRemark" class="u-content-color u-font-12">备注内容：{{info.finishServeRemark}}</view>
		</view>

		<!-- 取消原因 -->
		<view class="base-box" v-if="info.cancelTime">
			<view class="u-border-bottom u-flex u-flex-between u-p-b-12 u-m-b-12">
				<view class="time-tip u-m-b-5">取消原因：{{info.cancelReason}}</view>
			</view>
			<view class="u-font-14">
				<view class="u-content-color u-m-b-10">相关照片：{{info.cancelPictureAttach.length}}</view>
				<r-upload :imgList="info.cancelPictureAttach" disabled width="56" />
			</view>
		</view>

		<!-- 不通过和作废原因 -->
		<view class="base-box" v-if="info.reason">
			<view class="u-border-bottom u-flex u-flex-between u-p-b-12 u-m-b-12">
				<view v-if="info.status === '8'" class="time-tip u-m-b-5">未通过原因：{{info.reason}}</view>
				<view v-if="info.status === '10'" class="time-tip u-m-b-5">作废原因：{{info.reason}}</view>
			</view>
			<view class="u-font-14">
				<view class="u-content-color u-m-b-10">
					<text v-if="info.status === '8'">{{info.noPassTime}}</text>
					<text v-if="info.status === '10'">{{info.deleteTime}}</text>
				</view>
			</view>
		</view>

		<!-- 工单信息 -->
		<view class="base-box" v-if="info.finishOrderTime">
			<view class="u-content-color u-m-b-14 u-font-14 u-flex u-flex-between">
				<view>
					工单编号：
					<text class="u-main-color">{{info.workNumber}}</text>
				</view>
				<text v-if="isEdit" class="pic-button" @click="toPage(`/pages/order/components/service-finish?id=${id}`)">编辑</text>
				<text v-else class="pic-button" @click="handleCopy">复制</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14">
				服务时长：
				<text class="u-main-color">{{info.serveDuration}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14">
				项目数量：
				<text class="u-main-color">{{info.serNumber}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14">
				服务总金额：
				<text class="u-main-color">{{info.money}}元</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14">
				共同服务人员：
				<text class="u-main-color">{{info.commonStaffName}}</text>
			</view>
			<view class="u-content-color u-font-14 u-flex u-flex-between">
				<view>
					支付方式：
					<text class="u-main-color">{{radioDict(info.payType,'staff_pay_type')}}</text>
				</view>
				<!-- <text class="pic-button">修改</text> -->
			</view>
		</view>

		<!-- 提交审核后可自由编辑 -->
		<view class="base-box" v-if="info.status > 4">
			<view class="u-content-color u-font-14 u-flex u-flex-between">
				<view class="u-flex">
					语音评价：
					<view v-if="info.voice" class="recording u-flex" @click="voiceShow = true">
						<u-icon class="u-m-r-4" :name="aIcon('yvying')" color="#D27058" width="20" height="20"></u-icon>
						<text>{{voiceTime}}</text>
					</view>
				</view>
				<view v-if="!isAudit">
					<text v-if="info.voice" class="iconfont icon-a-mingchengshanchu-xian u-error del-icon" @click="delVoiceShow =true"></text>
					<text v-else class="pic-button" @click="toPage(`/pages/order/components/service-record?id=${id}`)">修改</text>
				</view>
			</view>
		</view>

		<!-- 服务项目 -->
		<view v-if="info.serveItems.length">
			<view v-for="(s, sIndex) in info.serveItems" :key="s.id" class="base-box">
				<view class="u-border-bottom u-p-b-12 u-m-b-12">
					<view class="u-flex u-flex-between">
						<view class="time-tip u-m-b-5">
							<text class="address-tip">项目{{sIndex+1}}</text>
							<text>{{s.serveName}}</text>
						</view>
						<view v-if="isEdit" class="u-flex" @click="handleEditProject(s, sIndex+1)">
							<text class="u-primary">修改</text>
							<text key="del-icon" class="iconfont icon-a-mingchengxiala-zuo del-icon"></text>
						</view>
					</view>
					<view class="u-flex u-tips-color u-font-12">
						金额：{{s.money}}元 | 数量：{{s.count}} | 时长：{{s.serveMinute ? `${s.serveMinute}分钟` : '无'}}
					</view>
				</view>
				<view class="u-flex u-flex-between u-m-b-8">
					<view class="u-content-color u-font-14">
						相关照片：
						<text v-if="isOrderPreview && !s.beforePictureAttach.length" class="u-error">暂未上传相关照片，无法提交审核</text>
						<text v-else>{{s.beforePictureAttach.length || '暂未上传'}}</text>
					</view>
					<text v-if="isEdit" class="pic-button" @click="handleProjectPhoto(s, sIndex + 1)">{{s.beforePictureAttach.length ? '编辑' : '上传'}}</text>
				</view>
				<r-upload :imgList="s.beforePictureAttach" disabled :width="56" />
			</view>
		</view>
		<u-empty v-if="!info.serveItems.length && info.status === '3'" marginTop="30" text="您还未添加服务项目" textColor="#999693" icon="/static/imgs/common/data-empty.png"></u-empty>


		<!-- 按钮 -->
		<view v-if="isEdit && !info.finishOrderTime" class="fixed-footer u-flex u-flex-between">
			<view v-if="info.status === '3'" class="u-flex-1 u-m-r-10">
				<u-button type="primary" plain text="开始服务" @click="toPage(`/pages/order/components/service-start?id=${id}`)"></u-button>
				<u-button v-if="info.status === '4' && info.serveItems.length" type="primary" plain text="完成服务"
					@click="toPage(`/pages/order/components/service-finish?id=${id}`)"></u-button>
			</view>
			<view v-if="info.status === '4' && info.serveItems.length" class="u-flex-1 u-m-r-10">
				<u-button type="primary" plain text="完成服务" @click="toPage(`/pages/order/components/service-finish?id=${id}`)"></u-button>
			</view>
			<view class="u-flex-2">
				<u-button type="primary" text="添加服务项目" @click="handleProjectAdd"></u-button>
			</view>
		</view>

		<view v-if="isEdit && info.finishOrderTime" class="fixed-footer u-flex u-flex-between">
			<view class="u-flex-1 u-m-r-10">
				<u-button v-if="info.status === '8'" type="primary" plain text="添加服务" @click="handleProjectAdd"></u-button>
				<u-button v-if="info.status === '4'" type="primary" plain text="返回日历" @click="calendarShow = true"></u-button>
			</view>
			<view class="u-flex-2">
				<u-button type="primary" text="提交审核" @click="handleSubmit"></u-button>
			</view>
		</view>

		<!-- 审核按钮 -->
		<view v-if="isAudit" class="fixed-footer u-flex u-flex-between">
			<view class="u-flex-1 u-m-r-10">
				<u-button type="error" plain text="不通过" @click="handleAudit('8')"></u-button>
			</view>
			<view class="u-flex-2">
				<u-button type="primary" text="通过" @click="handleAudit('6')"></u-button>
			</view>
		</view>

		<r-phone v-if="phoneShow" v-model="phoneShow" :name="info.memberName" :phone="info.mobilePhone" />

		<r-dialog v-model="calendarShow" title="温馨提示" cancelText="不返回" confirmText="确认返回" content="即将返回日历页(可创建新的订单)，但本次订单不
可再创建新的“服务项目”，是否确认返回?" @cancel="calendarShow = false" @confirm="handleCalendar">
		</r-dialog>

		<r-dialog v-model="delVoiceShow" title="确定删除" cancelText="取消" confirmText="确认" content="是否要删除语音，重新评价？" @cancel="delVoiceShow = false"
			@confirm="handleDelVoice">
		</r-dialog>

		<r-dialog v-model="voiceShow" title="语音播放" :btnsShow="false">
			<r-voice slot="content" v-if="info.voiceAttach" :src="info.voiceAttach.url" />
		</r-dialog>

		<!-- 服务商审核 6为审核通过、8为未通过 -->
		<r-dialog v-model="auditShow" title="温馨提示" cancelText="取消" @cancel="auditShow = false">
			<view slot="content">
				<view v-if="auditForm.status === '6'" class="u-text-center">确定通过审核？</view>
				<r-textarea v-else v-model="auditForm.reason" placeholder="请输入未通过原因(必填)" count :maxlength="150" class="min-textarea"></r-textarea>
			</view>
			<u-button v-if="auditForm.status === '6'" slot="confirm" type="primary" text="审核通过" @click="handleAuditConfirm"></u-button>
			<u-button v-else slot="confirm" type="error" :disabled="!auditForm.reason" text="审核不通过" @click="handleAuditConfirm"></u-button>
		</r-dialog>

		<r-voice v-show="false" v-if="info.voiceAttach" :src="info.voiceAttach.url" @ready="voiceReady" />

		<Submit v-if="submitShow" v-model="submitShow" :info="info" />
	</view>
</template>

<script>
	import { getStaffInfoDetailUrl, uploadVoiceUrl, orgAuditUrl } from '@/api'
	import { copy } from '@/utils'
	import Submit from './Submit'

	export default {
		components: { Submit },
		data() {
			return {
				id: '',
				info: { serveItems: [] },
				phoneShow: false,
				calendarShow: false,
				submitShow: false,
				delVoiceShow: false,
				voiceShow: false,
				voiceTime: 0,
				auditShow: false,
				// 6为审核通过、8为未通过
				auditForm: { id: '', reason: '', status: '' }
			}
		},
		computed: {
			isEdit() {
				return ['3', '4', '8'].includes(this.info.status) && this.isSingleProject && this.info.creatorId === this.vuex_user.id
			},
			isOrderPreview() {
				return this.info.status === '4' && this.info.finishOrderTime
			},
			title() {
				if (this.isOrderPreview) {
					return '服务订单预览'
				}
				if (this.info.status === '8') {
					const type = this.info.noPassType === 0 ? '机构审核' : '平台审核'
					return `不通过-${type}`
				}
				return `服务-${this.radioDict(this.info.status,'staff_status')}`
			},
			errorPreview() {
				const { startAddressPicture, finishAddressPicture, serveItems } = this.info
				const isEmptySPhoto = serveItems.some(s => s.beforePicture)
				const isEmptyPhoto = !startAddressPicture || !finishAddressPicture || !isEmptySPhoto
				return this.isOrderPreview && isEmptyPhoto
			},
			isAudit() {
				// 服务商并且待审核状态
				return this.info.status === '5' && this.fwryappFuwushang
			}
		},
		onLoad({ id }) {
			this.id = id
		},
		onShow() {
			this.loadData()
		},
		methods: {
			async loadData() {
				const { data } = await uni.$u.http.post(`${getStaffInfoDetailUrl}?id=${this.id}`)
				this.formatData(data)
				this.info = data
			},
			handleSubmit() {
				if (this.errorPreview) {
					let tips = '服务项目图片还未上传'
					const { startAddressPicture, finishAddressPicture } = this.info
					if (!startAddressPicture) {
						tips = '开始服务-服务地点门牌号照片还未上传'
					}
					if (!finishAddressPicture) {
						tips = '完成服务-工单照片还未上传'
					}
					uni.$u.toast(tips)
					return
				}
				this.submitShow = true
			},
			handleProjectAdd() {
				if (!this.info.startOrderTime && !this.isXiaMen) {
					uni.$u.toast('请先开始服务，才能添加服务项目')
					return
				}
				this.toPage(`/pages/order/components/project-add?id=${this.id}`)
			},
			handleEditProject(s, index) {
				s.index = index
				this.$u.vuex('vuex_projectEdit', s)
				this.toPage(`/pages/order/components/project-edit?delBtn=${this.info.finishOrderTime ? '0' : '1'}`)
			},
			handleProjectPhoto(s, index) {
				s.index = index
				this.$u.vuex('vuex_projectEdit', s)
				this.toPage('/pages/order/components/project-photo')
			},
			async handleDelVoice() {
				await uni.$u.http.post(uploadVoiceUrl, { id: this.id })
				this.loadData()
			},
			async handleAuditConfirm() {
				await uni.$u.http.post(orgAuditUrl, this.auditForm)
				if (this.auditForm.status === '6') {
					uni.$u.toast('已提交中心审核')
				}
				this.loadData()
				this.auditShow = false
			},
			handleAudit(status) {
				this.auditForm = { id: this.id, reason: '', status }
				this.auditShow = true
			},
			toPage(url) {
				uni.navigateTo({ url })
			},
			handleCalendar() {
				uni.reLaunch({ url: '/pages/calendar/index' })
			},
			handleStartPhotoPreview() {
				uni.previewImage({ urls: this.info.startPhoto.map(s => s.url) })
			},
			handleFinishPhotoPreview() {
				uni.previewImage({ urls: this.info.finishPhoto.map(s => s.url) })
			},
			handleCopy() {
				copy(this.info.workNumber)
			},
			voiceReady(voiceTime) {
				this.voiceTime = voiceTime
			},
			formatData(data) {
				// 容错处理，接口应返回数组，结果返回null
				data.startPhoto = []
				if (data.startAddressPictureAttach) {
					data.startPhoto = data.startPhoto.concat(data.startAddressPictureAttach)
				} else {
					data.startAddressPictureAttach = []
				}
				if (data.startObjectPictureAttach) {
					data.startPhoto = data.startPhoto.concat(data.startObjectPictureAttach)
				} else {
					data.startObjectPictureAttach = []
				}
				data.finishPhoto = []
				if (data.finishAddressPictureAttach) {
					data.finishPhoto = data.finishPhoto.concat(data.finishAddressPictureAttach)
				} else {
					data.finishAddressPictureAttach = []
				}
				if (data.finishObjectPictureAttach) {
					data.finishPhoto = data.finishPhoto.concat(data.finishObjectPictureAttach)
				} else {
					data.finishObjectPictureAttach = []
				}
				data.cancelPictureAttach = data.cancelPictureAttach || []
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		padding: 12px;
		color: $u-main-color;
		font-size: 16px;
		font-weight: bold;
	}

	.status {
		padding: 2px 8px 3px;
		background: #f7bc18;
		border-radius: 4px;
		color: #ffffff;

		&-7 {
			background: $uni-color-success;
		}

		&-8 {
			background: $uni-color-error;
		}

		&-9 {
			background: #e0dedc;
		}

		&-10 {
			background: #e0dedc;
		}
	}

	.mobilephone {
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical !important;
	}

	.phone {
		width: 32px;
		height: 32px;
		background: #fff9f0;
		border-radius: 8px;
	}

	.address {
		width: calc(100% - 120px);
	}

	.detail-page {
		padding-bottom: 10px;
	}

	.address-tip {
		background: #f7bc18;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #fff;
		padding: 2px 5px;
		margin-right: 5px;
	}

	.status-title {
		font-weight: bolder;
		color: #333231;
	}

	/deep/ .u-form-item__body__right__content__slot {
		color: #666462;
	}

	.pic-button {
		margin-left: 10px;
		background: #ffffff;
		border: 1px solid #ff9500;
		border-radius: 8px;
		font-size: 14px;
		padding: 2px 8px;
		color: #ff9500;
		flex-shrink: 0;
	}

	.time-tip {
		font-size: 14px;
		font-weight: 600;
		color: #333231;
	}

	.recording {
		background: #fff9f0;
		border-radius: 10px;
		padding: 2px 8px;
		color: #FF9500;
	}

	.error-preview {
		margin: 12px 16px;
	}

	.del-icon {
		font-size: 20px;
	}
</style>