<template>
	<view>
		<z-paging
			bg-color="#faf9f7"
			ref="paging"
			v-model="list"
			@query="loadData"
			:auto="false"
		>
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
				<view v-for="item in list" :key="item.id" :class="[item.editStatus === 0 ? 'draft-item' : 'list-item']" @click="toPage(item)">
					<view class="u-flex u-flex-between">
						<view
							:class="['u-flex', 'u-line-1', 'name', `name${item.visitMode}`]"
							:type="item.visitMode === '1' ? '入户' : item.visitMode === '2' ? '电话' : '活动'"
						>{{item.creatorName}}</view>
						<view class="time u-flex">
							<text>{{item.visitTime.slice(5, 16)}}</text>
							<text class="u-error u-m-l-10" v-if="item.editStatus === 0">草稿</text>
							<u-icon name="arrow-right" color="#999693"></u-icon>
						</view>
					</view>
					<view class="u-flex u-m-t-4">
						<view class="u-m-r-8">
							<text class="iconfont icon-a-mingchenggeren-mian"></text>
							<text class="u-font-12 u-tips-color">{{item.visitCustomerName}}</text>
						</view>
						<view class="u-flex-1 u-line-1" v-if="item.visitMode === '1' && item.visitAppendAddress">
							<text class="iconfont icon-a-mingchengweizhi-mian"></text>
							<text class="u-font-12 u-tips-color">{{item.visitAppendAddress}}</text>
						</view>
					</view>
					<view class="content" v-if="item.editStatus === 1">
						<view class="u-font-12 u-line-3 u-tips-color">{{item.visitContent}}</view>
						<view class="u-m-t-12" v-if="item.visitPhotoList && item.visitPhotoList.length">
							<image :src="i.url" class="img" v-for="(i, index) in item.visitPhotoList" :key="i.id" @click.stop="handlePreview(item, index)"></image>
						</view>
					</view>
				</view>
			</view>
			<view slot="empty">
				<u-icon name="/static/imgs/common/record-empty.png" width="146" height="120"></u-icon>
				<view class="zp-main-title">
					<view>暂无查询结果</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { visitPageUrl } from '@/api/visiting.js'
	
	export default {
		onLoad (params) {
			this.params.visitOperatorId = this.vuex_user.id
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
					keywordForApp: '',
					visitMode: '',
					beginTime: '',
					endTime: '',
					visitOperatorId: ''
				},
				total: 0
			}
		},
		methods: {
			async loadData (current) {
				if (typeof current === 'number') {
					this.params.pageNum = current
				}
				const { data } = await uni.$u.http.post(visitPageUrl, this.params)
				this.total = data.total
				this.$refs.paging.complete(data.list)
			},
			toPage (item) {
				uni.navigateTo({
					url: item.editStatus === 0 ? `/pages/visiting/edit?id=${item.id}&visitMode=${item.visitMode}` : `/pages/visiting/detail?id=${item.id}`
				})
			},
			handlePreview (item, index) {
				uni.previewImage({
					urls: item.visitPhotoList.map(item => item.url),
					current: index,
					indicator: 'number'
				})
			}
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
		background-color: rgba($u-primary, 0.05);
		border-radius: 8px;
		margin-bottom: 12px;
		.iconfont {
			font-size: 12px;
			color: $uni-text-color-grey;
		}
	}
	
	.name {
		font-weight: bold;
		line-height: 20px;
		color: $uni-text-color;
		&::before {
			font-weight: normal;
			content: attr(type);
			line-height: 20px;
			border-radius: 4px;
			padding: 0 8px;
			font-size: 12px;
			color: #fff;
			margin-right: 4px;
		}
		&1::before {
			background-color: $u-primary;
		}
		&2::before {
			background-color: #5b8ffc;
		}
		&3::before {
			background-color: $u-success;
		}
	}
	
	.time {
		color: $uni-text-color-grey;
		flex-shrink: 0;
	}
	
	.list-box {
		margin: 12px;
	}
	
	.list-item {
		padding: 12px;
		background-color: #fff;
		border-radius: 8px;
		margin-bottom: 12px;
		&:last-child {
			margin-bottom: 0;
		}
		.iconfont {
			font-size: 12px;
			color: $uni-text-color-grey;
		}
	}
	
	.content {
		padding-top: 12px;
		border-top: 1px solid #EBE9E6;
		margin-top: 12px;
	}
	
	.img {
		width: 56px;
		height: 56px;
		margin-right: 8px;
		border-radius: 8px;
	}
	
	.type-btn {
		width: 160px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		border-radius: 8px;
		margin-bottom: 8px;
		background-color: $u-primary;
		color: #fff;
	}
</style>