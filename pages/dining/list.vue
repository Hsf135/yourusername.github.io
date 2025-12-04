<template>
	<view class="full-height">
		<z-paging
			bg-color="#faf9f7"
			ref="paging"
			v-model="list"
			@query="loadData"
		>
			<view slot="top">
				<u-navbar title="点餐记录" placeholder bgColor="#faf9f7">
					<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
				</u-navbar>
			</view>
			<view class="list-box">
				<view v-for="item in list" :key="item.id" class="list-item-box" @click="toPage(item)">
					<view class="date-title" v-if="dateObj[item.date] === item.id">{{item.dateStr}}</view>
					<view class="list-item">
						<view class="time-box">{{item.time}}</view>
						<view class="right-box">
							<view class="u-flex u-flex-between">
								<view class="u-main-color u-bold">{{item.customerName}}</view>
								<view class="u-error no-wrap u-bold">￥{{item.totalMoney}}</view>
							</view>
							<view class="u-flex u-flex-between u-m-t-4">
								<view class="u-flex-1 u-line-1 u-tips-color u-font-12">{{item.serveName}}</view>
								<view class="u-font-12 u-error no-wrap">(自费￥{{item.expenseMoney}})</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view slot="empty">
				<u-icon name="/static/imgs/common/record-empty.png" width="146" height="120"></u-icon>
				<view class="zp-main-title">
					<view>暂无点餐记录</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { diningPageUrl } from '@/api/dining.js'
	export default {
		data() {
			return {
				list: [],
				params: {
					pageNum: 1
				},
				dateObj: {} // 存储日期，数据格式{ 'yyyy-mm-dd': id }
			}
		},
		methods: {
			async loadData (current) {
				if (typeof current === 'number') {
					this.params.pageNum = current
				}
				const { data } = await uni.$u.http.post(diningPageUrl, this.params)
				data.list.forEach(item => {
					item.date = item.payTime.slice(0, 10) // 年月日
					item.day = this.getWeekDay(item.payTime) // 周几
					item.time = item.payTime.slice(11, 16) // 时分
					item.dateStr = `${item.date} ${item.day}`
					if (!this.dateObj[item.date]) {
						this.dateObj[item.date] = item.id
					}
				})
				this.$refs.paging.complete(data.list)
			},
			toPage (item) {
				uni.navigateTo({
					url: `/pages/dining/detail?id=${item.id}`
				})
			},
			// 是否显示订单日期
			showDate (item) {
				return !this.list.some(i => i.date === item.date)
			},
			// 获取是周几
			getWeekDay (time) {
				const day = new Date(time).getDay()
				switch (day) {
					case 0: return '周日'
					case 1: return '周一'
					case 2: return '周二'
					case 3: return '周三'
					case 4: return '周四'
					case 5: return '周五'
					case 6: return '周六'
					default: return ''
				}
			}
		},
		onShow() {
			this.$refs.paging && this.$refs.paging.reload()
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}
	
	.list-box {
		padding: 0 16px;
	}
	
	.date-title {
		text-align: center;
		margin-bottom: 8px;
		color: $u-tips-color;
		margin-top: 20px;
	}
	
	.list-item-box {
		&:first-child {
			.date-title {
				margin-top: 0;
			}
		}
	}
	
	.list-item {
		padding: 12px 0;
		border-radius: 8px;
		background-color: #fff;
		margin-bottom: 12px;
		display: flex;
	}
	
	.no-wrap {
		flex-shrink: 0;
		white-space: nowrap;
		margin-left: 10px;
	}
	
	.time-box {
		padding: 0 12px;
		border-right: 1px solid #f5f3f0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		color: $u-tips-color;
	}
	
	.right-box {
		padding: 0 12px;
		flex: 1;
	}
</style>