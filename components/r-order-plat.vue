<template>
	<view>
		<text v-if="item.showDay" class="formar-day">{{ fomatDay }}</text>
		<view class="item" @click="handleDetail">
			<text :class="['status', `status-${item.statusCode}`]">{{ radioDict(item.statusCode,'order_status') }}</text>
			<view class="u-flex u-m-b-8">
				<u-icon :name="aIcon('xiangmu-mian')" width="20" height="20"></u-icon>
				<text class="u-m-l-8 u-m-r-8">项目归属：</text>
				<text class="u-main-color">{{item.categoryName}}</text>
			</view>
			<view class="u-flex u-m-b-8">
				<u-icon :name="aIcon('shijian-mian')" width="20" height="20"></u-icon>
				<text class="u-m-l-8 u-m-r-8">时间：</text>
				<text class="u-main-color">{{item.serveTime}}</text>
			</view>
			<view class="u-flex u-m-b-8">
				<u-icon :name="aIcon('shenfenzheng-mian')" width="20" height="20"></u-icon>
				<text class="u-m-l-8 u-m-r-8">信息：</text>
				<text class="u-main-color">
					<text>{{item.memberName}} | {{ radioDict(item.sex,'vols_sex') }} {{ item.age? ' | ' + item.age + '岁' : '' }} </text>
				</text>
			</view>
			<view class="u-flex items-top u-m-b-8">
				<u-icon :name="aIcon('weizhi-mian')" width="20" height="20"></u-icon>
				<text class="u-m-l-8 u-m-r-8">地址：</text>
				<view class="u-main-color address u-line-2">{{item.address}}</view>
			</view>
			<view class="u-flex items-top u-m-b-8">
				<text class="iconfont "></text>
				<u-icon :name="aIcon('weizhi-mian')" width="20" height="20"></u-icon>
				<text class="u-m-l-8 u-m-r-8">服务项目：</text>
				<view class="u-main-color u-line-1">{{item.serveName || '未添加服务项目'}}</view>
			</view>
			<view v-if="isBtn" class="u-border-top u-p-t-14 u-flex u-flex-around">
				<view @click="handleDetail">
					<u-text text="查看详情" color="#FF9500" size="14" :prefixIcon="aIcon('biaodan-xiangqingchakan')"></u-text>
				</view>
				<view v-if="!['7', '11', '12'].includes(item.statusCode)" @click.stop="handlePhone(item)">
					<u-text text="拨打电话" color="#FF9500" size="14" :prefixIcon="aIcon('dianhua')"></u-text>
				</view>
			</view>
		</view>

		<r-phone v-if="phoneShow" v-model="phoneShow" :name="info.memberName" :phone="info.mobilephone" />
	</view>
</template>

<script>
	export default {
		props: {
			item: { type: Object, required: true },
			isBtn: { type: Boolean, default: false }
		},
		data() {
			return {
				phoneShow: false,
				info: {}
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
			handlePhone(info) {
				this.info = info
				this.phoneShow = true
			},
			getWeek(day) {
				const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
				const week = new Date(day).getDay()
				return weeks[week]
			},
			handleDetail() {
				uni.navigateTo({ url: `/pages/plat-order/order-detail?id=${this.item.id}` })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		position: relative;
		margin: 0px 0 8px;
		padding: 12px;
		background: #ffffff;
		border-radius: 8px;
	}

	.formar-day {
		display: block;
		text-align: center;
		font-size: 14px;
		color: #999693;
		margin: 12px 0 8px;
	}

	.address {
		width: calc(100% - 100px);
	}

	.items-top {
		align-items: flex-start;
	}

	.status {
		position: absolute;
		top: 0px;
		right: 0px;
		padding: 2px 8px 3px;
		color: #fff;
		background: #f7bc18;
		border-radius: 0 8px 0 8px;

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