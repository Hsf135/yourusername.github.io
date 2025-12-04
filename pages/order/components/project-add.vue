<template>
	<view class="full-height">
		<z-paging-swiper bg-color="#faf9f7">
			<view slot="top">
				<view class="top">
					<u-navbar title="添加服务项目" placeholder bgColor="transparent">
						<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
						<view slot="right" class="u-flex">
							<text class="u-primary" @click="handleCustom">自定义</text>
						</view>
					</u-navbar>
					<view class="u-p-l-8 u-p-r-8">
						<u-tabs ref="tabs" :list="tabs" :current="current" :activeStyle="activeStyle" lineColor="#FF9500" @change="change">
						</u-tabs>
					</view>
				</view>
			</view>
			<view class="u-flex">
				<view class="type-box">
					<view v-for="t in typeTabs" :key="t.name" :class="['type u-flex u-flex-center', {'active':type.id === t.id }]" @click="handleType(t)">
						{{t.name}}
					</view>
				</view>
				<view class="item-box">

					<!-- 如果有子项目显示子项目 -->
					<view v-if="priceList.length">
						<view class="item u-flex u-flex-between" v-for="p in priceList" :key="p.id">
							<view>
								<view class="u-m-b-4 u-bold">{{p.name}}</view>
								<view class="u-error">￥{{p.price}}</view>
							</view>
							<text class="pic-button" @click="handleSelect(p)">选择</text>
						</view>
					</view>
					<!-- 没有子项目显示该服务项目 -->
					<view v-else class="item u-flex u-flex-between">
						<view>
							<view class="u-m-b-4 u-bold">{{type.name}}</view>
							<view class="u-error">￥{{type.price}}</view>
						</view>
						<text class="pic-button" @click="handleTypeSelect">选择</text>
					</view>
				</view>
			</view>
		</z-paging-swiper>
	</view>
</template>

<script>
	import { getOptionTreeUrl, saveServeItemUrl } from '@/api'

	export default {
		data() {
			return {
				id: '',
				current: 0,
				tabs: [],
				type: {},
				typeTabs: [],
				priceList: [],
				activeStyle: { color: '#FF9500', fontWeight: 'bold', transform: 'scale(1.1)' },
			}
		},
		onLoad({ id }) {
			this.id = id
			this.loadData()
		},
		methods: {
			async loadData() {
				const { data } = await uni.$u.http.post(getOptionTreeUrl)
				this.tabs = data || []
				if (data && data.length) {
					this.change({ index: 0 })
				}
			},
			change({ index }) {
				this.current = index
				this.typeTabs = this.tabs[this.current].children || []
				if (this.typeTabs.length) {
					this.handleType(this.typeTabs[0])
				} else {
					this.priceList = []
				}
			},
			handleType(t) {
				console.log(t)
				this.type = t
				this.priceList = t.children || []
			},
			// 选择服务项目
			async handleTypeSelect() {
				const params = {
					staffOrderId: this.id,
					count: 1,
					money: this.type.price,
					serveCategoryId: this.tabs[this.current].id, // 一级
					serveId: this.type.id, // 二级
					serveOptionId: '', // 三级
					serveName: this.type.name
				}
				await uni.$u.http.post(saveServeItemUrl, params)
				uni.navigateBack()
			},
			// 选择服务子项目
			async handleSelect({ id, name, price }) {
				const params = {
					staffOrderId: this.id,
					count: 1,
					money: price,
					serveCategoryId: this.tabs[this.current].id, // 一级
					serveId: this.type.id, // 二级
					serveOptionId: id, // 三级
					serveName: `${this.type.name}-${name}`
				}
				await uni.$u.http.post(saveServeItemUrl, params)
				uni.navigateBack()
			},
			handleCustom() {
				uni.navigateTo({ url: `/pages/order/components/project-custom?id=${this.id}` })
			}
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

	/deep/ .u-tabs__wrapper__nav__item__text {
		white-space: nowrap;
	}

	.type-box {
		overflow-y: auto;
		height: calc(100vh - 88px);
		background-color: #f5f5f5;
		width: 116px;

		.type {
			width: 100%;
			height: 56px;
			position: relative;
		}

		.active {
			background-color: #fff;
			color: #ff9500;
			font-weight: bold;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 2px;
				height: 56px;
				background: #ff9500;
			}
		}
	}

	.item-box {
		box-sizing: border-box;
		width: calc(100vw - 116px);
		height: calc(100vh - 88px);
		overflow-y: auto;
		background-color: #fff;
		padding: 4px 16px;

		.item {
			box-sizing: border-box;
			padding: 12px 0;
			width: 100%;
			height: 68px;
			border-bottom: 1px solid #f5f3f0;
		}
	}

	.pic-button {
		background: #ffffff;
		border: 1px solid #ff9500;
		border-radius: 8px;
		font-size: 14px;
		padding: 4px 12px;
		color: #ff9500;
		flex-shrink: 0;
		cursor: pointer;
	}
</style>