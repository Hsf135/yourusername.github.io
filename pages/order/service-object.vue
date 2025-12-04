<template>
	<view class="full-height">
		<z-paging-swiper bg-color="#fff">
			<view slot="top">
				<view class="top">
					<u-navbar title="服务对象" placeholder bgColor="transparent">
						<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
						<view slot="right" class="u-flex">
							<u-icon :name="aIcon('shaixuan')" width="24" height="24" class="u-m-r-5" @click="handleFilter"></u-icon>
							<u-icon :name="aIcon('sousuo')" width="24" height="24" @click="handleSearch"></u-icon>
						</view>
					</u-navbar>
					<u-tabs ref="tabs" :list="tabs" :current="current" :scrollable="false" :activeStyle="activeStyle" lineColor="#FF9500" @change="change">
					</u-tabs>
					<view class="box">

						<view class="header u-p-l-5 u-flex">
							<view class="u-flex-1 cell">基础信息</view>
							<view class="u-flex-1 cell">服务信息</view>
							<view class="u-flex-1 cell">联系信息</view>
						</view>
					</view>
				</view>
			</view>
			<swiper class="full-height" :current="swiperCurrent" @animationfinish="animationfinish">
				<swiper-item>
					<Collect ref="collect" :tabIndex="0" :currentIndex="swiperCurrent" :isSelect="isSelect" />
				</swiper-item>
				<swiper-item>
					<All :tabIndex="1" :currentIndex="swiperCurrent" :isSelect="isSelect" />
				</swiper-item>
			</swiper>
		</z-paging-swiper>
	</view>
</template>

<script>
	import Collect from './components/Collect'
	import All from './components/All'

	export default {
		components: { Collect, All },
		data() {
			return {
				isSelect: '0',
				current: 0,
				swiperCurrent: 0,
				tabs: [{ name: '已收藏' }, { name: '所有' }],
				activeStyle: { color: '#FF9500', fontWeight: 'bold', transform: 'scale(1.1)' },
			}
		},
		onLoad({ isSelect = '0' }) {
			this.isSelect = isSelect
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
				uni.navigateTo({ url: '/pages/order/data-filter' })
			},
			handleSearch() {
				uni.navigateTo({ url: '/pages/order/search-result' })
			}
		},
		onShow() {
			!this.current && this.$refs.collect && this.$refs.collect.reload()
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