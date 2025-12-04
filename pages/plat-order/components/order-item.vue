<template>
	<view class="card-box">
		<text v-if="item.showDay">{{ fomatDay }}</text>
		<view class="card">
			<view class="card-top u-flex u-flex-between">
				<!-- <text :class="['status', `status-${item.status}`]">{{ radioDict(item.status,'staff_status') }}</text> -->
				<text class="title">{{ item.serveName }}</text>
				<text class="u-font-14">数量：{{item.serveCount}}</text>
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
					<text class="main-title">备注：</text>
					<text>{{item.remark || '暂未备注'}}</text>
				</view>
			</view>
			<view class="u-flex u-flex-between">
				<view class="button" @click="refuse">
					<u-icon :name="aIcon('biaodan-quxiao')" width="21" height="21"></u-icon>
					<text>拒绝</text>
				</view>
				<view class="button" @click="takeOrder">
					<u-icon :name="aIcon('biaodan-queding')" width="21" height="21"></u-icon>
					<text>接单</text>
				</view>
			</view>
		</view>

		<r-dialog v-model="refuseShow" title="温馨提示" :content="dialogContent" @confirm="submit">
		</r-dialog>
	</view>
</template>

<script>
	import { saveSearchUrl, serveOrderStatusUrl } from '@/api'
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
				ifLongtap: true,
				dialogContent: '',
				refuseShow: false,
				params: {}
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
			}
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
			refuse() {
				if (!this.isSingleProject) {
					uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
					return
				}
				this.refuseShow = true
				this.dialogContent = '确认拒绝该订单？'
			},
			takeOrder() {
				if (!this.isSingleProject) {
					uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
					return
				}
				this.refuseShow = true
				this.dialogContent = '确认是否接单？'
			},
			async submit() {
				if (this.dialogContent === '确认拒绝该订单？') {
					this.params.statusCode = '4'
				} else {
					this.params.statusCode = '5'
				}
				this.params.serveorderId = this.item.id
				await uni.$u.http.post(serveOrderStatusUrl, this.params)
				uni.$u.toast('操作成功')
				this.$emit('reload')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-box {
		margin-bottom: 8px;

		>text {
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

			>text {
				color: #999693;
			}
		}

		.card-main {
			padding-bottom: 12px;
			border-bottom: 1px solid #f5f3f0;

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

	.button {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: $u-primary;
		font-size: 14px;
		padding-top: 14px;
	}
</style>