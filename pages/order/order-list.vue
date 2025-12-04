<template>
	<view class="full-height">
		<z-paging-swiper bg-color="#faf9f7">
			<view slot="top">
				<view class="top">
					<u-navbar title="订单记录" placeholder bgColor="transparent">
						<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
						<view slot="right" class="u-flex">
							<u-icon :name="aIcon('sousuo')" width="24" height="24" @click="toPage('/pages/order/order-search')"></u-icon>
						</view>
					</u-navbar>
					<view class="u-p-l-8 u-p-r-8">
						<u-tabs ref="tabs" :list="tabs" :current="current" :scrollable="fwryappFuwushang" :activeStyle="activeStyle" lineColor="#FF9500" @change="change">
						</u-tabs>
					</view>
				</view>
			</view>
			<swiper class="full-height u-p-t-10" :current="swiperCurrent" @animationfinish="animationfinish">
				<swiper-item>
					<List ref="0" :tabIndex="0" :currentIndex="swiperCurrent" operatorStatus="1" />
				</swiper-item>
				<swiper-item>
					<List ref="1" :tabIndex="1" :currentIndex="swiperCurrent" operatorStatus="2" />
				</swiper-item>
				<swiper-item>
					<List ref="2" :tabIndex="2" :currentIndex="swiperCurrent" operatorStatus="3" />
				</swiper-item>
				<swiper-item>
					<List ref="3" :tabIndex="3" :currentIndex="swiperCurrent" operatorStatus="4" />
				</swiper-item>
				<!-- 服务商才出现待审核tab -->
				<swiper-item v-if="fwryappFuwushang">
					<List ref="4" :tabIndex="4" :currentIndex="swiperCurrent" operatorStatus="5" />
				</swiper-item>
			</swiper>
		</z-paging-swiper>
	</view>
</template>

<script>
	import { getOperatorStatusStatlUrl } from '@/api'
	import List from './components/List'

	export default {
		components: { List },
		data() {
			return {
				current: 0,
				swiperCurrent: 0,
				tabs: [],
				activeStyle: { color: '#FF9500', fontWeight: 'bold', transform: 'scale(1.1)' },
			}
		},
		methods: {
			change({ index }) {
				this.swiperCurrent = index
			},
			animationfinish({ detail: { current } }) {
				this.swiperCurrent = current
				this.current = current
			},
			handleFilter() {
				uni.navigateTo({ url: '/pages/old-man/data-filter' })
			},
			async getStatusData() {
				const res = await uni.$u.http.post(getOperatorStatusStatlUrl)
				// 服务商才有5的待审核tab
				const end = this.fwryappFuwushang ? 5 : 4
				this.tabs = res.data.slice(0, end).map(item => {
					return { name: `${this.radioDict(item.status,'staff_operator_status')}(${item.num})` }
				})
			}
		},
		onShow() {
			this.getStatusData()
			this.$refs[this.current] && this.$refs[this.current].refresh()
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		background: #fff9f0;
	}

	.box {
		margin-top: 8px;
		padding: 12px 16px 0;
		background: #fff;
	}

	.search {
		margin-bottom: 12px;
		padding: 0 12px;
		background: #FAF9F7;
		border-radius: 8px;
	}

	.header {
		color: $u-main-color;
		font-size: 14px;
		background: #fff9f0;
		border-radius: 8px 8px 0 0;
		border: 1px solid #f5f3f0;
		border-bottom: 0;
	}

	.cell {
		padding: 10px 5px;
	}
	
	/deep/ .u-tabs__wrapper__nav__item {
		padding: 0 5px;
	}
</style>