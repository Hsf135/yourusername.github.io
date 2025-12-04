<template>
	<r-dialog v-model="show" :title="title">
		<view slot="content" class="content">
			<view class="u-error u-text-center u-m-b-16">请确保订单内容真实有效。提交审核后订单的内容将不可修改。</view>
			<view v-if="isInfo">
				<view class="u-m-b-10">
					<text class="u-content-color">服务工单：</text>
					<text class="u-main-color">{{info.workNumber}}</text>
				</view>
				<view class="u-m-b-10">
					<text class="u-content-color">服务金额：</text>
					<text class="u-main-color">{{info.money}}元</text>
				</view>
				<view class="u-m-b-10">
					<text class="u-content-color">服务数量：</text>
					<text class="u-main-color">{{info.serNumber}}</text>
				</view>
				<view class="u-m-b-10">
					<text class="u-content-color">服务时长：</text>
					<text class="u-main-color">{{info.serveDuration}}</text>
				</view>
				<view class="u-m-b-10">
					<text class="u-content-color">服务人员数：</text>
					<text class="u-main-color">{{info.serviceNumber}}人</text>
				</view>
			</view>
			<view v-else>
				<view class="tabs u-flex">
					<view v-for="t in tabs" :key="t.type" :class="['tab u-flex-1', {active: t.type === form.examineType}]" @click="handleType(t)">{{t.name}}</view>
				</view>
				<view v-show="form.examineType === 0">
					<u-radio-group v-if="userList.length" v-model="providerId" labelColor="#000" activeColor="#FF9500" placement="column" iconPlacement="right">
						<u-radio v-for="l in userList" :key="l.id" :label="l.name" :name="l.id" :customStyle="{padding: '10px 0'}"></u-radio>
					</u-radio-group>
					<text v-else class="u-tips-color">没有可选择的服务商，请选择中心审核</text>
				</view>

				<view v-show="form.examineType === 1">
					<u-radio-group v-model="user" labelColor="#000" activeColor="#FF9500" placement="column" iconPlacement="right">
						<u-radio v-for="l in mangerList" :key="l.id" :label="l.name" :name="l.id" :customStyle="{padding: '10px 0'}"></u-radio>
					</u-radio-group>
				</view>
			</view>
		</view>
		<view slot="btns" class="u-m-t-24 u-flex">
			<u-button plain :text="cancelText" class="u-m-r-15" @click="handleCancel"></u-button>
			<u-button type="primary" :text="confirmText" @click="confirm"></u-button>
		</view>
	</r-dialog>
</template>

<script>
	import { submitExamineUrl, getOrgUsersUrl } from '@/api'

	export default {
		props: {
			info: { type: Object, required: true },
			value: { type: Boolean, default: false },
		},
		data() {
			return {
				isInfo: true,
				form: { examineType: 0 },
				tabs: [{ type: 0, name: '选择机构自审' }, { type: 1, name: '选择中心审核' }],
				userList: [],
				mangerList: [{ id: 1, name: '养老服务平台' }],
				user: 1,
				providerId: ''
			}
		},
		computed: {
			show: {
				get() {
					return this.value
				},
				set(val) {
					this.$emit('input', val)
				}
			},
			title() {
				return this.isInfo ? '完成服务信息确认' : '请选择审核方式'
			},
			cancelText() {
				return this.isInfo ? '返回修改' : '暂不提交'
			},
			confirmText() {
				return this.isInfo ? '提交审核' : '确认提交'
			}
		},
		mounted() {
			this.loadUser()
		},
		methods: {
			async loadUser() {
				const { data } = await uni.$u.http.post(getOrgUsersUrl)
				this.userList = data
				if (data.length) {
					this.providerId = data[0].id
				}
			},
			handleCancel() {
				this.$emit('input', false)
			},
			async confirm() {
				// 第一步信息确认
				if (this.isInfo) {
					this.isInfo = false
					return
				}
				// 选择机构自审需选择服务商
				if (this.form.examineType === 0) {
					if (!this.providerId) {
						uni.$u.toast('没有可选择的服务商，请选择中心审核')
						return
					}
					this.form.providerId = this.providerId
				}
				const { id } = this.info
				Object.assign(this.form, { id })
				await uni.$u.http.post(submitExamineUrl, this.form)
				this.$emit('input', false)
				uni.navigateTo({ url: `/pages/order/components/service-record?id=${id}` })
			},
			handleType(t) {
				this.form.examineType = t.type
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabs {
		padding-bottom: 16px;
	}

	.tab {
		padding: 8px 0;
		color: $u-content-color;
		text-align: center;
		border-bottom: 1px solid #e0dedc;

		&.active {
			color: $u-primary;
			font-weight: bold;
			border-bottom: 2px solid $u-primary;
		}
	}
</style>