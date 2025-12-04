<template>
	<view class="dining-detail">
		<u-navbar title="就餐订单详情" placeholder bgColor="#faf9f7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<view class="u-p-16">
			<view class="card u-flex u-flex-between">
				<view class="u-bold u-main-color">订单编号: {{detail.id}}</view>
				<view class="copy-btn" @click="handleCopy">复制</view>
			</view>
			<view class="box">
				<view class="item">
					<view class="label">就餐站点</view>
					<view class="text">{{detail.stationName}}</view>
				</view>
				<view class="item">
					<view class="label">就餐菜单</view>
					<view class="text">{{detail.serveName}}</view>
				</view>
			</view>
			<view class="box">
				<view class="item">
					<view class="label">就餐卡号</view>
					<view class="text">{{detail.subsidyCard || '-'}}</view>
				</view>
				<view class="item">
					<view class="label">就餐人</view>
					<view class="text">
						<text>{{detail.customerName}}</text>
						<text class="u-m-l-6" v-if="detail.sex">| {{detail.sex}}</text>
						<text class="u-m-l-6" v-if="detail.age">| {{detail.age}}岁</text>
					</view>
				</view>
				<view class="item">
					<view class="label">就餐方式</view>
					<view class="text">{{radioDict(detail.eatModel, 'eat_model')}}</view>
				</view>
				<view class="item">
					<view class="label">就餐金额</view>
					<view class="text">￥{{detail.totalMoney}}</view>
				</view>
				<view class="item" v-if="detail.subsidyInfoName">
					<view class="label">使用补贴</view>
					<view class="text">{{detail.subsidyInfoName}}</view>
				</view>
				<view class="item" v-if="detail.subsidyInfoName">
					<view class="label">补贴金额</view>
					<view class="text">￥{{detail.subsidyMoney}}</view>
				</view>
				<view class="item">
					<view class="label">自费方式</view>
					<view class="text">{{radioDict(detail.expenseModel, 'expense_model')}}</view>
				</view>
				<view class="item">
					<view class="label">自费金额</view>
					<view class="u-error">￥{{detail.expenseMoney}}</view>
				</view>
			</view>
			<view class="box">
				<view class="item">
					<view class="label">操作人</view>
					<view class="text">{{detail.operatorName}}</view>
				</view>
				<view class="item">
					<view class="label">操作时间</view>
					<view class="text">{{detail.createTime}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { diningDetailUrl } from '@/api/dining.js'
	
	export default {
		onLoad ({ id }) {
			this.loadData(id)
		},
		data () {
			return {
				detail: {
					createTime: '',
					customerName: '',
					diningPhoto: '',
					diningPhotoAttachList: [],
					eatModel: '',
					expenseModel: '',
					expenseMoney: 0,
					id: '',
					operatorName: '',
					orderNumber: '',
					serveName: '',
					stationName: '',
					status: '',
					subsidyInfoName: '',
					subsidyMoney: 0,
					totalMoney: 0
				}
			}
		},
		methods: {
			async loadData (id) {
				uni.showLoading({
					title: ''
				})
				const { data } = await uni.$u.http.post(`${diningDetailUrl}?id=${id}`)
				data.sex = data.sex === '1' ? '男' : data.sex === '2' ? '女' : ''
				Object.assign(this.detail, data)
				uni.hideLoading()
			},
			handleCopy () {
				uni.setClipboardData({
					data: String(this.detail.id),
					success: function () {
						uni.showToast({
							title: '复制成功',
							icon: 'success',
							duration: 2000
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		padding: 12px;
		border-radius: 8px;
		background-color: #fff;
		margin-bottom: 8px;
	}
	
	.box {
		padding: 0 12px 12px 12px;
		border-radius: 8px;
		background-color: #fff;
		margin-bottom: 12px;
	}
	
	.copy-btn {
		line-height: 22px;
		border-radius: 8px;
		border: 1px solid $u-primary;
		color: $u-primary;
		padding: 0 8px;
		font-size: 12px;
	}
	
	.item {
		display: flex;
		padding: 12px 0;
		border-bottom: 1px solid #f5f3f0;
	}
	
	.label {
		width: 70px;
		flex-shrink: 0;
		white-space: nowrap;
		color: $u-main-color;
	}
	
	.text {
		color: $u-content-color;
	}
</style>
