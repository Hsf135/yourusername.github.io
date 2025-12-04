<template>
	<view class="ranking-list">
		<u-navbar title="" placeholder bgColor="rgba(0,0,0,0)">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
			<u-icon slot="right" :name="aIcon('question')" size="24" @click="showDialog = true"></u-icon>
		</u-navbar>
		<view class="top-box">
			<view class="top-container">
				<view class="text-img">
					<text class="now-time">截止: {{result.nowTime}}</text>
				</view>
			</view>
		</view>
		<view class="content-box">
			<view class="u-flex">
				<view class="tab-item tab-item1  u-flex" :class="{ active: params.type === 0 }" @click="switchTabType(0)">今日排行</view>
				<view class="tab-item tab-item2  u-flex" :class="{ active: params.type === 1 }" @click="switchTabType(1)">总排行</view>
			</view>
			<scroll-view scroll-y="true" class="rank-scroll-view">
				<view v-if="result.rankingList.length">
					<view class="mine-box">
						<view class="mine u-flex">
							<view class="rank-num-box u-flex">
								<image src="../../static/imgs/visiting/no-1.svg" class="num-img" v-if="result.ranking === 1"></image>
								<image src="../../static/imgs/visiting/no-2.svg" class="num-img" v-else-if="result.ranking === 2"></image>
								<image src="../../static/imgs/visiting/no-3.svg" class="num-img" v-else-if="result.ranking === 3"></image>
								<view class="rank-num" v-else>{{rankingNum}}</view>
							</view>
							<view class="info-box u-flex u-flex-1">
								<image src="../../static/imgs/logo.png" class="avatar-img"></image>
								<view>
									<view class="u-m-b-2 u-flex">
										<text class="u-main-color">{{vuex_user.nickname}}</text>
										<view class="self">自己</view>
									</view>
									<view class="u-font-12 u-tips-color">{{vuex_user.dept.name}}</view>
								</view>
							</view>
							<view class="visit-count">{{result.visitCnt}}</view>
						</view>
					</view>
					<view class="u-p-lr-16">
						<view class="u-flex u-tips-color u-m-b-12 u-p-lr-12">
							<view style="width: 50px;">名次</view>
							<view class="u-flex-1">用户名称</view>
							<view>拜访数</view>
						</view>
						<view class="table-tr u-flex" v-for="item in result.rankingList" :key="item.userId">
							<view class="rank-num-box u-flex">
								<image src="../../static/imgs/visiting/no-1.svg" class="num-img" v-if="item.ranking === 1"></image>
								<image src="../../static/imgs/visiting/no-2.svg" class="num-img" v-else-if="item.ranking === 2"></image>
								<image src="../../static/imgs/visiting/no-3.svg" class="num-img" v-else-if="item.ranking === 3"></image>
								<view class="rank-num" v-else>{{getRankingNum(item)}}</view>
							</view>
							<view class="info-box u-flex u-flex-1">
								<image src="../../static/imgs/logo.png" class="avatar-img"></image>
								<view>
									<view class="u-main-color u-m-b-2">{{item.userName}}</view>
									<view class="u-font-12 u-tips-color">{{item.deptName}}</view>
								</view>
							</view>
							<view class="visit-count">{{item.visitCnt}}</view>
						</view>
					</view>
					<view class="u-font-12 u-tips-color u-text-center u-p-tb-20" v-if="params.type === 0">'今日排名仅显示前20名'</view>
					<view class="u-font-12 u-tips-color u-text-center u-p-tb-20" v-if="params.type === 1 && totalNumber >=50">'总排名仅显示前50名'</view>
				</view>
				<view v-else class="empty-data">
					<image src="../../static/imgs/common/date-empty.png" class="empty-img"></image>
					<text class="u-tips-color">暂无排行数据</text>
				</view>
			</scroll-view>
		</view>
		<r-dialog v-model="showDialog" title="提示" :btnsShow="false">
			<view slot="content">
				<view class="u-m-b-12">1、每个地区的老人总数和助老员数存在较大差异，本排名仅供参考;</view>
				<view class="u-p-b-12">2、“今日排名”统计的是当天的入户拜访记录，补录的拜访记录不纳入排名统计。</view>
			</view>
		</r-dialog>
	</view>
</template>

<script>
	import { visitRankUrl } from '@/api/visiting.js'
	export default {
		onLoad () {
			this.params.userId = this.vuex_user.id
			this.result.nowTime = uni.$u.timeFormat(Date.now(), 'yyyy-mm-dd hh:MM')
			this.loadData()
		},
		data () {
			return {
				showDialog: false,
				params: {
					pageNum: 1,
					pageSize: 20,
					type: 0, // 0=今日 1=总排行
					userId: ''
				},
				result: {
					nowTime: '',
					ranking: null, // 排行名次
					rankingList: [],
					visitCnt: null // 拜访次数
				},
				loading: false,
				totalNumber:null
			}
		},
		computed: {
			rankingNum () {
				if (!this.result.ranking) return '-'
				if (this.result.ranking < 10) return this.result.ranking.toString().padStart(2, 0)
				if (this.params.type === 0) { // 今日排行
					return this.result.ranking <= 20 ? this.result.ranking : '20+'
				} else { // 总排行
					return this.result.ranking <= 50 ? this.result.ranking : '50+'
				}
			}
		},
		methods: {
			switchTabType (type) {
				if (this.loading) return
				this.params.pageSize = type === 0 ? 20 : 50
				this.params.type = type
				Object.assign(this.result, {
					ranking: null, // 排行名次
					rankingList: [],
					visitCnt: null // 拜访次数
				
				})
				this.loadData()
			},
			async loadData () {
				try {
					this.loading = true
					const { data } = await uni.$u.http.post(visitRankUrl, this.params)
					this.totalNumber = data.rankingList.length
					console.log(this.totalNumber, '123132132132s')	
					Object.assign(this.result, data)
				} finally {
					this.loading = false
				}
			},
			getRankingNum (item) {
				if (!item.ranking) return '-'
				if (item.ranking > 99) return '99+'
				return item.ranking.toString().padStart(2, 0)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ranking-list {
		height: 100vh;
		overflow: hidden;
		background: #fff8e6 url('../../static/imgs/visiting/ranking-list-bg.png') top center/100% no-repeat;
	}
	
	.top-box {
		position: fixed;
		width: 100%;
		height: 210px;
		left: 0;
		top: 0;
		z-index: 1;
		display: flex;
		align-items: flex-end;
	}
	
	.top-container {
		width: 100%;
		height: 142px;
		padding-left: 16px;
		display: flex;
		align-items: center;
		background: url('/static/imgs/visiting/trophy.png') right bottom/156px 142px no-repeat;
	}
	
	.text-img {
		width: 196px;
		height: 26px;
		background: url('/static/imgs/visiting/paihangbang.png') center/100% 100%;
		position: relative;
	}
	
	.now-time {
		position: absolute;
		left: 0;
		top: calc(100% + 10px);
		line-height: 1;
		color: #998568;
		font-size: 14px;
	}
	
	.content-box {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: calc(100vh - 210px);
		border-radius: 16px 16px 0 0;
		background-color: #fff;
		z-index: 1;
	}
	
	.tab-item {
		width: 50%;
		height: 52px;
		font-size: 16px;
		color: $u-content-color;
		transition: color 0.2s;
		justify-content: center;
		&1 {
			background: url('../../static/imgs/visiting/rank-left.png') center/100% 52px no-repeat;
		}
		&2 {
			background: url('../../static/imgs/visiting/rank-right.png') center/100% 52px no-repeat;
		}
		&.active {
			background: #fff;
			font-weight: bold;
			color: $u-main-color;
			position: relative;
			&::after {
				content: '';
				position: absolute;
				width: 24px;
				height: 4px;
				border-radius: 2px;
				background-color: $u-primary;
				left: 50%;
				transform: translateX(-50%);
				bottom: 8px;
			}
		}
		&1.active {
			border-radius: 16px 0 0 0;
		}
		&2.active {
			border-radius: 0 16px 0 0;
		}
	}
	
	.mine-box {
		padding: 16px;
	}
	
	.mine {
		background-color: #faf9f7;
		border-radius: 8px;
		padding: 12px;
	}
	
	.rank-num-box {
		width: 50px;
		height: 40px;
	}
	
	.rank-num {
		font-size: 16px;
		font-weight: bold;
		color: $u-tips-color;
		font-style: italic;
	}
	
	.avatar-img {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		margin-right: 12px;
	}
	
	.self {
		display: flex;
		align-items: center;
		line-height: 1;
		height: 16px;
		font-size: 12px;
		background-color: #e0dedc;
		color: #fff;
		padding: 0 2px;
		border-radius: 4px;
		margin-left: 2px;
	}
	
	.visit-count {
		font-weight: bold;
		color: $u-error;
		font-size: 16px;
		font-style: italic;
	}
	
	.rank-scroll-view {
		height: calc(100% - 52px);
	}
	
	.table-tr {
		padding: 12px;
		position: relative;
		&::after {
			content: '';
			position: absolute;
			right: 12px;
			bottom: 0;
			width: calc(100% - 74px);
			height: 1px;
			background-color: #f5f3f0;
		}
		&:last-of-type::after {
			content: none;
		}
	}
	
	.num-img {
		width: 24px;
		height: 28px;
	}
	
	.empty-data {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 0;
	}
	
	.empty-img {
		width: 146px;
		height: 120px;
		margin-bottom: 20px;
	}
</style>
