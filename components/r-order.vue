<template>
	<view class="card-box" @click="toPage(`/pages/order/components/status?id=${item.id}`)">
		<text v-if="item.showDay" class="formar-day">{{ fomatDay }}</text>
		<view class="card">
			<view class="card-top">
				<text :class="['status', `status-${item.status}`]">{{ getStatus(item) }}</text>
				<text class="title">{{ radioDict(item.belongProject,'belong_project') }}</text>
			</view>
			<view class="card-main">
				<view>
					<text class="main-title">服务时间：</text>
					<text>{{ serveTime }}</text>
				</view>
				<view>
					<text class="main-title">服务地址：</text>
					<text>{{ item.address }}</text>
					<!-- <u-icon :name="aIcon('dingwei')" width="20" height="20"></u-icon> -->
				</view>
				<view>
					<text class="main-title">服务对象：</text>
					<text>{{item.memberName}} | {{ radioDict(item.sex,'vols_sex') }} {{ item.age? ' | ' + item.age + '岁' : '' }} </text>
				</view>
				<view>
					<text class="main-title">联系电话：</text>
					<text>{{ phoneEncrypted(item.mobilePhone )}}</text>
				</view>
				<view>
					<text class="main-title">服务项目：</text>
					<text>{{item.serveName || '未添加服务项目'}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { saveSearchUrl } from '@/api'
	import { phoneEncrypted } from '@/utils'

	export default {
		props: {
			item: { type: Object, required: true },
			isCall: { type: Boolean, default: false },
			isSearch: { type: Boolean, default: false }
		},
		data() {
			return {
				phoneEncrypted,
				phoneShow: false,
				ifLongtap: true
			}
		},
		computed: {
			fomatDay() {
				const day = this.item.serveTime.split(' ')[0]
				const week = this.getWeek(day)
				return `${day} ${week}`
			},
			serveTime() {
				const serveTime = this.item.finishOrderTime || this.item.serveTime
				const [day, time] = serveTime.split(' ')
				const week = this.getWeek(day)
				return `${day} ${week} ${time}`
			},
			
		},
		methods: {
			async handleDetail(id) {
				uni.navigateTo({ url: `/pages/old-man/detail?id=${id}` })
				if (this.isSearch) {
					const params = { customerId: this.item.id, isSearch: 1 }
					await uni.$u.http.post(saveSearchUrl, params)
				}
			},
			handlePhone() {
				if (this.ifLongtap && this.isCall && this.item.mobilephone) {
					this.phoneShow = true
				}
			},
			touchEnd() {
				this.ifLongtap = true
			},
			touchMove() {
				// 手指触摸后的移动事件
				this.ifLongtap = false
			},
			getWeek(day) {
				const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
				const week = new Date(day).getDay()
				return weeks[week]
			},
			toPage(url) {
				uni.navigateTo({ url })
			},
			getStatus(item) {
				if (item.finishOrderTime && item.status === '4') {
					return '完成服务-待提交'
				}
				return this.radioDict(item.status,'staff_status')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-box {
		margin-bottom: 8px;

		.formar-day {
			display: block;
			text-align: center;
			font-size: 14px;
			color: #999693;
			margin: 12px 0 8px;
		}
	}

	.card {
		// height: 236px;
		background: #ffffff;
		border-radius: 8px;
		padding: 12px;

		.card-top {
			padding-bottom: 12px;
			border-bottom: 1px solid #f5f3f0;

			.title {
				font-size: 14px;
				color: #333231;
				font-weight: 600;
				padding-left: 8px;
			}
		}

		.card-main {
			>view {
				display: flex;
				padding-top: 12px;
				color: #333231;
				font-size: 14px;
				font-weight: 400;
			}

			.main-title {
				flex-shrink: 0;
				font-size: 14px;
				color: #666462;
			}
		}
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
</style>