<template>
	<view>
		<z-paging
			bg-color="#faf9f7"
			ref="paging"
			v-model="list"
			@query="loadData"
		>
			<view slot="top">
				<u-navbar title="拜访记录" placeholder bgColor="#faf9f7">
					<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
					<view slot="right" class="u-flex">
						<u-icon :name="aIcon('shuju-xian')" width="24" height="24" class="u-m-r-10" @click="handleStat"></u-icon>
						<u-icon :name="aIcon('sousuo')" width="24" height="24" class="u-m-r-10" @click="handleFilter"></u-icon>
						<u-icon :name="aIcon('add')" width="24" height="24" @click="handleAdd"></u-icon>
					</view>
				</u-navbar>
			</view>
			<view class="list-box">
				<view v-for="item in list" :key="item.id" :class="[item.editStatus === 0 ? 'draft-item' : 'list-item']" @click="toPage(item)">
					<view class="u-flex u-flex-between">
						<view
							:class="['u-flex', 'u-line-1', 'name', `name${item.visitMode}`]"
							:type="item.visitMode === '1' ? '入户' : item.visitMode === '2' ? '电话' : '活动'"
						>{{item.creatorName}}</view>
						<view class="time u-flex">
							<text v-if="item.visitTime">{{item.visitTime.slice(5, 16)}}</text>
							<text class="u-error u-m-l-10" v-if="item.editStatus === 0">草稿</text>
							<u-icon name="arrow-right" color="#999693"></u-icon>
						</view>
					</view>
					<view class="u-flex u-m-t-4">
						<view class="u-m-r-8">
							<text class="iconfont icon-a-mingchenggeren-mian"></text>
							<text class="u-font-12 u-tips-color">{{item.visitCustomerName}}</text>
						</view>
						<view class="u-flex-1 u-line-1" v-if="item.visitMode === '1' && item.visitLocationCode">
							<text class="iconfont icon-a-mingchengweizhi-mian"></text>
							<text class="u-font-12 u-tips-color">{{item.visitLocationCode}}</text>
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
					<view>暂无拜访记录</view>
				</view>
				<view class="add-btn" @click="handleAdd">新增拜访记录</view>
			</view>
		</z-paging>
		<r-dialog v-model="showDialog" title="请选择拜访类型">
			<view slot="content" class="shadow-box">
				<view class="type-btn" @click="handleToEdit('1')">入户拜访</view>
				<view class="type-btn" @click="handleToEdit('2')">电话拜访</view>
			</view>
			<view slot="btns"></view>
		</r-dialog>
		<ListSearch :showSearch="showSearch" @close="showSearch = false"></ListSearch>
	</view>
</template>

<script>
	import { visitPageUrl } from '@/api/visiting.js'
	import ListSearch from './components/list-search.vue'
	export default {
		components: { ListSearch },
		onLoad () {
			this.params.visitOperatorId = this.vuex_user.id
		},
		data() {
			return {
				list: [],
				params: {
					pageNum: 1,
					visitOperatorId: ''
				},
				showDialog: false,
				showSearch: false
			}
		},
		onBackPress () {
			if (this.showSearch) {
				this.showSearch = false
				return true
			}
		},
		methods: {
			async loadData (current) {
				if (typeof current === 'number') {
					this.params.pageNum = current
				}
				const { data } = await uni.$u.http.post(visitPageUrl, this.params)
				this.$refs.paging.complete(data.list)
			},
			toPage (item) {
				if (item.editStatus === 0 && !this.isSingleProject) {
					uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
					return
				}
				uni.navigateTo({ url: item.editStatus === 0 ? `/pages/visiting/edit?id=${item.id}&visitMode=${item.visitMode}` : `/pages/visiting/detail?id=${item.id}` })
			},
			handleStat () {
				uni.navigateTo({ url: '/pages/visiting/statistics' })
			},
			handleToEdit (visitMode) {
				this.showDialog = false
				uni.navigateTo({ url: `/pages/visiting/edit?visitMode=${visitMode}` })
			},
			handleFilter() {
				this.showSearch = true
			},
			handlePreview (item, index) {
				uni.previewImage({
					urls: item.visitPhotoList.map(item => item.url),
					current: index,
					indicator: 'number'
				})
			},
			handleAdd() {
				if (!this.isSingleProject) {
					uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行新增', icon: 'none' })
					return
				}
				this.showDialog = true
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
	
	.add-btn {
		width: 240px;
		height: 40px;
		background-color: $u-primary;
		color: #fff;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 60px;
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
	
	.shadow-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
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