<template>
	<view>
		<z-paging bg-color="#faf9f7" ref="paging" v-model="list" @query="loadData" :auto="false">
			<view slot="top">
				<u-navbar title="搜索结果" placeholder bgColor="#faf9f7">
					<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
				</u-navbar>
				<view class="u-p-tb-12 u-text-center" v-if="total">
					<text>- 共有 </text>
					<text class="u-primary num">{{total}}</text>
					<text>个搜索结果 - </text>
				</view>
			</view>
			<view class="list-box">
				<view v-for="item in list" :key="item.id" :class="[item.taskStatus === '0' ? 'draft-item' : 'list-item']" @click="toPage(item)">
					<view class="time">
						<view>{{item.createTime.slice(5, 10)}}</view>
						<view>{{item.createTime.slice(11, 16)}}</view>
					</view>
					<view class="u-flex-1">
						<view class="u-flex">
							<view class="u-flex-1 u-line-1 u-main-color u-m-r-10 u-bold">{{item.title}}</view>
							<view class="u-flex" v-if="item.taskStatus === '0'">
								<text class="u-error">草稿</text>
								<u-icon name="arrow-right"></u-icon>
							</view>
							<u-icon name="arrow-right" v-else></u-icon>
						</view>
						<view class="u-flex u-m-t-4" v-if="item.activityCommunity">
							<text class="iconfont icon-a-mingchengzuzhi1 u-tips-color"></text>
							<text class="u-font-12 u-tips-color">{{item.activityCommunity}}</text>
						</view>
					</view>
				</view>
			</view>
			<view slot="empty">
				<u-icon name="/static/imgs/common/activity-empty.png" width="146" height="120"></u-icon>
				<view class="zp-main-title">
					<view>暂无查询结果</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { activityPageUrl } from '@/api/activity.js'
	
	export default {
		onLoad (params) {
			for (const key in params) {
				if (params[key]) {
					this.params[key] = params[key]
				}
			}
			this.loadData(1)
		},
		data() {
			return {
				list: [],
				params: {
					pageNum: 1,
					keyword: '',
					activitySort: '',
					assort: '',
					type: '',
					beginTime: '',
					endTime: ''
				},
				total: 0
			}
		},
		methods: {
			async loadData (current) {
				if (typeof current === 'number') {
					this.params.pageNum = current
				}
				const { data } = await uni.$u.http.post(activityPageUrl, this.params)
				this.total = data.total
				this.$refs.paging.complete(data.list)
			},
			toPage (item) {
				uni.navigateTo({
					url: item.taskStatus === '0' ? `/pages/activity/edit?id=${item.id}` : `/pages/activity/detail?id=${item.id}`
				})
			},
		},
		onShow() {
			this.$refs.paging && this.$refs.paging.reload()
		}
	}
</script>

<style lang="scss" scoped>
	.draft-item {
		padding: 12px;
		border: 1px solid rgba($u-primary, 0.8);
		border-radius: 8px;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		background-color: rgba($u-primary, 0.05);
		.iconfont {
			font-size: 12px;
		}
	}
	
	.time {
		color: $u-tips-color;
		padding-right: 12px;
		border-right: 1px solid #e0e0e0;
		margin-right: 12px;
		font-size: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.list-box {
		margin: 12px;
	}
	
	.list-item {
		padding: 12px;
		background-color: #fff;
		border-radius: 8px;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		&:last-child {
			margin-bottom: 0;
		}
		.iconfont {
			font-size: 12px;
		}
	}
</style>