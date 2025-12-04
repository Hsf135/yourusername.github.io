<template>
	<view class="choose-menu">
		<u-navbar title="点餐步骤2:选择菜单" placeholder bgColor="#fff9f0">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<view class="station-view">
			<view
				v-for="item in menuTree"
				:key="item.stationId"
				class="station"
				:class="{ active: stationId === item.stationId }"
				@click="handleStationClick(item)"
			>{{item.stationName}}</view>
		</view>
		<view class="empty-box" v-if="!menuTree.length">
			<image src="../../static/imgs/common/activity-empty.png" class="empty-img"></image>
			<text class="u-tips-color">您的账号暂未配置站点</text>
			<text class="u-tips-color">请联系管理员配置~</text>
		</view>
		<view class="empty-box" v-if="menuTree.length && !leftList.length">
			<image src="../../static/imgs/common/menu-empty.png" class="empty-img"></image>
			<text class="u-tips-color">该站点下没有配置菜单或服务</text>
			<text class="u-tips-color">请联系管理员配置~</text>
		</view>
		<view class="body" :style="{ height: `calc(100vh - 88px - ${barHeight}px)` }" v-if="leftList.length">
			<scroll-view scroll-y="true" class="left">
				<view
					v-for="item in leftList"
					:key="item.id"
					class="serve-item u-line-1"
					:class="{ active: item.id === leftId }"
					@click="handleLeftClick(item)"
				>{{item.name}}</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="right" :scroll-into-view="scrollId">
				<view>
					<view v-for="item in rightList" :key="item.id" class="dining-item" :id="`id${item.id}`">
						<view class="u-main-color u-font-16 u-m-b-10">{{item.name}}</view>
						<view class="u-flex u-flex-between">
							<view class="u-error price">{{item.price}}</view>
							<view class="btn" @click="handleChoose(item)">选择</view>
						</view>
					</view>
				</view>
				<view class="empty-box" v-if="!rightList.length">
					<image src="../../static/imgs/common/menu-empty.png" class="empty-img"></image>
					<text class="u-tips-color">该服务项目下没有配置菜单</text>
					<text class="u-tips-color">请联系管理员配置~</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { menuTreeUrl } from '@/api/dining.js'
	export default {
		onLoad () {
			this.loadData()
		},
		data () {
			return {
				menuTree: [],
				stationId: '',
				leftId: '',
				leftList: [],
				rightList: [],
				scrollId: '' // scroll-view的滚动id
			}
		},
		methods: {
			async loadData () {
				const { data } = await uni.$u.http.post(menuTreeUrl)
				if (data && data.length) {
					this.menuTree = data
					this.stationId = data[0].stationId
					if (data[0].children && data[0].children.length) {
						this.leftList = data[0].children
						this.leftId = data[0].children[0].id
						if (this.leftList.length) {
							this.rightList = this.leftList[0].children
						}
					}
				}
			},
			handleStationClick (item) {
				this.stationId = item.stationId
				if (item.children && item.children.length) {
					this.leftList = item.children
					this.leftId = item.children[0].id
					if (this.leftList.length) {
						this.rightList = this.leftList[0].children
					}
				}
			},
			handleLeftClick (item) {
				this.leftId = item.id
				this.rightList = item.children
				if (this.rightList.length) {
					this.scrollId = `id${this.rightList[0].id}`
				}
			},
			handleChoose (item) {
				const data = this.vuex_zhucanInfo
				const station = this.menuTree.find(i => i.stationId === this.stationId)
				data.stationId = this.stationId
				data.stationName = station.stationName
				data.serveId = item.parentId
				data.serveName = item.name
				data.serveOptionId = item.id
				data.totalMoney = item.price
				this.$u.vuex('vuex_zhucanInfo', data)
				uni.navigateTo({
					url: '/pages/dining/confirm-order'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff9f0;
		height: 100%;
	}
	
	.empty-box {
		padding: 40px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.empty-img {
		width: 146px;
		height: 120px;
		margin-bottom: 20px;
	}
	
	.choose-menu {
		height: 100%;
	}
	
	.station-view {
		display: flex;
		overflow-x: auto;
		height: 44px;
	}
	
	.station {
		font-size: 16px;
		color: $u-main-color;
		padding: 0 16px;
		line-height: 44px;
		font-weight: 400;
		transition: color 0.2s, font-weight 0.2s;
		flex-shrink: 0;
		&.active {
			color: $u-primary;
			font-weight: 700;
			position: relative;
			&::after {
				content: '';
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 6px;
				width: 20px;
				height: 2px;
				border-radius: 1px;
				background-color: $u-primary;
			}
		}
	}
	
	.body {
		display: flex;
	}
	
	.left {
		width: 120px;
		height: 100%;
		background-color: #f5f5f5;
	}
	
	.serve-item {
		line-height: 56px;
		padding: 0 16px;
		color: $u-main-color;
		font-weight: 400;
		transition: color 0.2s, font-weight 0.2s, background-color 0.2s;
		&.active {
			font-weight: 700;
			color: $u-primary;
			background-color: #fff;
			position: relative;
			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 2px;
				height: 100%;
				background-color: $u-primary;
			}
		}
	}
	
	.right {
		width: calc(100% - 120px);
		height: 100%;
		background-color: #fff;
		padding: 0 16px;
	}
	
	.dining-item {
		padding: 16px 0;
		border-bottom: 1px solid #f5f3f0;
	}
	
	.price {
		font-size: 16px;
		&::before {
			content: '￥';
		}
	}
	
	.btn {
		line-height: 26px;
		border-radius: 8px;
		border: 1px solid $u-primary;
		color: $u-primary;
		padding: 0 12px;
	}
</style>