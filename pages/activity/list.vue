<template>
	<view class="full-height">
		<z-paging bg-color="#faf9f7" ref="paging" v-model="list" @query="loadData">
			<view slot="top">
				<u-navbar title="活动记录" placeholder bgColor="#faf9f7">
					<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
					<view slot="right" class="u-flex">
						<u-icon :name="aIcon('sousuo')" width="24" height="24" class="u-m-r-10" @click="handleFilter"></u-icon>
						<u-icon :name="aIcon('add')" width="24" height="24" @click="handleAdd"></u-icon>
					</view>
				</u-navbar>
			</view>
			<view class="list-box">
				<view v-for="item in list" :key="item.id" :class="[item.taskStatus === '0' ? 'draft-item' : 'list-item']" @click="toPage(item)">
					<view class="u-flex">
						<view class="u-flex-1 u-line-1 u-main-color u-m-r-10 u-bold">{{item.title}}</view>
						<view class="u-flex" v-if="item.taskStatus === '0'">
							<text class="u-error">草稿</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
						<u-icon name="arrow-right" v-else></u-icon>
					</view>
					<view class="u-flex u-m-t-4">
						<text class="iconfont icon-a-mingchengshijian-mian1 u-tips-color u-m-r-2"></text>
						<text class="u-font-12 u-tips-color" v-if="item.taskStatus === '0'">{{item.createTime ? item.createTime.slice(5, 16) : ''}}</text>
						<text class="u-font-12 u-tips-color" v-else>{{getActivityTime(item)}}</text>
					</view>
					<view class="u-flex u-m-t-4" v-if="item.activitySort">
						<text class="iconfont icon-a-mingchengzuzhi1 u-tips-color u-m-r-2"></text>
						<text class="u-font-12 u-tips-color">{{radioDict(item.activitySort,'activity_sort')}}</text>
					</view>
				</view>
			</view>
			<view slot="empty">
				<u-icon name="/static/imgs/common/activity-empty.png" width="146" height="120"></u-icon>
				<view class="zp-main-title">
					<view>暂无活动记录</view>
				</view>
				<view class="add-btn" @click="handleAdd">新增活动记录</view>
			</view>
		</z-paging>
		<ListSearch :showSearch="showSearch" @close="showSearch = false"></ListSearch>
	</view>
</template>

<script>
	import { activityPageUrl } from '@/api/activity.js'
	import ListSearch from './components/list-search.vue'
	
	export default {
		components: { ListSearch },
		data() {
			return {
				list: [],
				params: { pageNum: 1 },
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
				const { data } = await uni.$u.http.post(activityPageUrl, this.params)
				this.$refs.paging.complete(data.list)
			},
			getActivityTime (item) {
				if (!(item.startTime && item.endTime)) return ''
				const startDate = item.startTime.slice(5, 10)
				const startTime = item.startTime.slice(10, 16)
				const endDate = item.endTime.slice(5, 10)
				const endTime = item.endTime.slice(10, 16)
				if (startDate === endDate) return `${startDate} ${startTime}~${endTime}`
				return `${startDate} ${startTime} ~ ${endDate} ${endTime}`
			},
			handleAdd () {
				if(!this.isCanEdit()){
					return
				}
				uni.navigateTo({ url: '/pages/activity/edit' })
			},
			toPage (item) {
				if (item.taskStatus === '0' && !this.isCanEdit()) {
					return
				}
				uni.navigateTo({ url: item.taskStatus === '0' ? `/pages/activity/edit?id=${item.id}` : `/pages/activity/detail?id=${item.id}` })
			},
			isCanEdit() {
				const dept = this.vuex_user.dept
				if (!dept.province) {
					uni.showToast({
						title: '您的账号所属区域为空，请联系管理员进行配置',
						icon: 'none',
						duration: 5000
					})
					return false
				}
				if (!this.isSingleProject) {
					uni.showToast({
						title: '您的账号包含多个项目，不支持编辑。可进入后台选择单一项目后进行编辑',
						icon: 'none',
						duration: 5000
					})
					return false
				}
				if (this.isXiaMen && !this.vuex_user.dept.communityName) { // 厦门市的，必须要有社区
					uni.showToast({
						title: '您的账号所属社区为空，请联系管理员进行配置',
						icon: 'none',
						duration: 5000
					})
					return false
				}
				return true
			},
			handleFilter() {
				this.showSearch = true
			}
		},
		onShow() {
			this.$refs.paging && this.$refs.paging.reload()
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}
	
	.draft-item {
		padding: 12px;
		border: 1px solid rgba($u-primary, 0.8);
		border-radius: 8px;
		margin-bottom: 12px;
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
		}
	}
</style>