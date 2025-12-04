<template>
	<view class="full-height">
		<z-paging-swiper bg-color="#faf9f7">
			<view slot="top">
				<view class="top">
					<u-navbar title="订单记录" placeholder bgColor="transparent">
						<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
						<!-- <view slot="right" class="u-flex">
							<u-icon :name="aIcon('sousuo')" width="24" height="24" @click="toPage('/pages/old-man/add')"></u-icon>
						</view> -->
					</u-navbar>
					<view class="u-p-l-8 u-p-r-8">
						<u-tabs ref="tabs" :list="tabs" :current="current" :scrollable="false" :activeStyle="activeStyle"
							lineColor="#FF9500" @change="change">
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
			</swiper>
		</z-paging-swiper>
	</view>
</template>

<script>
	import { orderStatusCountUrl } from '@/api'
	import List from './components/lists.vue'

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
				const res = await uni.$u.http.post(orderStatusCountUrl)
				this.tabs = [
					{ name: `未完成(${res.data[1].isReceiveSum})` },
					{ name: `已完结(${res.data[2].isReceiveSum})` }
				]
			}
		},
		onLoad({ finish }) {
			this.current = Number(finish)
			this.swiperCurrent = Number(finish)
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
</style>