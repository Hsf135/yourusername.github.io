<template>
	<view class="full-height">
		<u-navbar title="入户拜访统计" placeholder bgColor="#faf9f7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<u-tabs
			ref="tabs"
			:list="tabs"
			:current="current"
			:scrollable="false"
			:activeStyle="activeStyle"
			lineColor="#FF9500"
			@change="change"
		></u-tabs>
		<swiper class="swiper" :current="swiperCurrent" @animationfinish="animationfinish">
			<swiper-item>
				<view class="content-box">
					<view class="u-bold u-main-color u-m-b-12">拜访数据({{statTotal.firstDate}} - 至今)</view>
					<view class="grid-box">
						<view class="grid-item">
							<view class="icon-box">
								<text class="iconfont icon-a-mingchengshuju-xian"></text>
							</view>
							<view class="text">累计入户拜访数</view>
							<view class="num">{{statTotal.totalCount || 0}}</view>
						</view>
						<view class="grid-item">
							<view class="icon-box">
								<text class="iconfont icon-a-mingchengshuju-xian"></text>
							</view>
							<view class="text">日均拜访数</view>
							<view class="num">{{statTotal.dailyAvgCount || 0}}</view>
						</view>
						<view class="grid-item">
							<view class="icon-box">
								<text class="iconfont icon-a-mingchengshuju-xian"></text>
							</view>
							<view class="text">拜访过的老人数</view>
							<view class="num">{{statTotal.visitCount || 0}}</view>
						</view>
					</view>
					<view class="flower-box">
						<image src="../../static/imgs/visiting/flower.png" class="flower"></image>
						<view>感谢您为长者们辛勤的付出~</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<PeriodStat :list="week" />
			</swiper-item>
			<swiper-item>
				<PeriodStat :list="month" />
			</swiper-item>
			<swiper-item>
				<PeriodStat :list="year" />
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import { visitStatTotalUrl, visitStatByTimeUrl } from '@/api/visiting.js'
	import PeriodStat from './components/period-stat.vue'
	export default {
		onLoad () {
			this.loadStatTotal()
			this.loadStat(1)
			this.loadStat(2)
			this.loadStat(3)
		},
		components: {
			PeriodStat
		},
		data () {
			return {
				current: 0,
				swiperCurrent: 0,
				tabs: [{ name: '总计' }, { name: '周' }, { name: '月' }, { name: '年' }],
				activeStyle: { color: '#FF9500', fontWeight: 'bold', transform: 'scale(1.1)' },
				statTotal: {},
				year: [],
				month: [],
				week: []
			}
		},
		methods: {
			// 获取总计
			async loadStatTotal () {
				const { data } = await uni.$u.http.post(visitStatTotalUrl)
				this.statTotal = data
			},
			// 获取统计-按周期
			async loadStat (period) {
				const { data } = await uni.$u.http.post(visitStatByTimeUrl, { period }, { header: { 'Content-Type': 'application/x-www-form-urlencoded' } })
				if (period === 1) {
					this.week = data
				} else if (period === 2) {
					this.month = data
				} else {
					this.year = data
				}
			},
			change({ index }) {
				this.swiperCurrent = index
			},
			animationfinish({ detail: { current } }) {
				this.swiperCurrent = current
				this.current = current
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}
	
	.content-box {
		padding: 12px 16px;
		border-radius: 16px 16px 0 0;
		background-color: #fff;
		height: 100%;
	}
	
	.swiper {
		margin-top: 10px;
		height: calc(100vh - 144px);
	}
	
	.grid-box {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0 8px;
	}
	
	.grid-item {
		border-radius: 8px;
		padding: 16px 0 16px 12px;
		&:nth-of-type(1) {
			background-color: #fff5f2;
			.icon-box {
				background-color: #E96848;
			}
		}
		&:nth-of-type(2) {
			background-color: #FFFBF0;
			.icon-box {
				background-color: #f7bc18;
			}
		}
		&:nth-of-type(3) {
			background-color: #f0f5ff;
			.icon-box {
				background-color: #5b8ffc;
			}
		}
	}
	
	.icon-box {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 12px;
		.iconfont {
			color: #fff;
			font-size: 20px;
		}
	}
	
	.text {
		color: #7a6b67;
		font-size: 12px;
		margin-bottom: 4px;
	}
	
	.num {
		font-weight: bold;
	}
	
	.flower-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 64px;
		color: #999693;
	}
	
	.flower {
		width: 80px;
		height: 80px;
		margin-bottom: 12px;
	}
</style>
