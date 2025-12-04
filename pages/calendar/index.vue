<template>
	<view>
		<z-paging ref="paging" v-model="list" :load-more-enabled="false" @query="loadData" empty-view-img="/static/imgs/common/data-empty.png"
			emptyViewText="今日没有相关记录~">
			<view slot="top">
				<view class="top">
					<u-navbar title="日历" placeholder bgColor="transparent">
						<view slot="left">
							<u-icon :name="aIcon('xiaoxi-xian')" width="24" height="24"></u-icon>
						</view>
						<view slot="right" class="u-flex">
							<u-icon :name="aIcon('sousuo')" width="24" height="24" class="u-m-r-12" @click="toPage('/pages/calendar/search')"></u-icon>
							<r-camera />
						</view>
					</u-navbar>
					<r-calendar v-model="params.date" select_bg="#FF9500" collapsible @dateChange="reload" />
				</view>
			</view>
			<view class="title" v-if="platList.length">平台派单</view>
			<view class="list">
				<r-order-plat v-for="l in platList" :key="l.id" :item="l" isBtn />
			</view>

			<view class="title" v-if="zjList.length">自建订单</view>
			<view class="list">
				<r-order-zj v-for="l in zjList" :key="l.id" :item="l" isBtn />
			</view>

			<view class="title" v-if="visitList.length">拜访记录</view>
			<view class="list">
				<r-visiting v-for="l in visitList" :key="l.id" :item="l" />
			</view>

			<view slot="bottom">
				<view class="btn">
					<u-button type="primary" text="创建服务订单" :icon="aIcon('tianjia-xian')" @click="handleCreate"></u-button>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { orderPageUrl, staffInfoPageUrl } from '@/api'
	import { visitPageUrl } from '@/api/visiting'

	export default {
		data() {
			return {
				list: [],
				platList: [],
				zjList: [],
				visitList: [],
				params: { pageNum: 1, pageSize: 50, date: '' },

			}
		},
		onShow() {
			this.$refs.paging && this.$refs.paging.refresh()
		},
		methods: {
			async loadData(current) {
				this.params.page = current
				this.params.serveBeginTime = this.params.date
				this.params.serveEndTime = this.params.date
				const { data } = await uni.$u.http.post(staffInfoPageUrl, this.params)
				const platRes = await uni.$u.http.post(orderPageUrl, this.params)
				this.platList = platRes.data.list
				this.zjList = data.list
				const visitParams = { ...this.params }
				visitParams.beginTime = this.params.date
				visitParams.endTime = this.params.date
				const visitRes = await uni.$u.http.post(visitPageUrl, visitParams)
				this.visitList = visitRes.data.list
				this.$refs.paging.complete([...data.list, ...platRes.data.list, ...visitRes.data.list])
			},
			reload() {
				this.$refs.paging.reload()
			},
			handlePhone(info) {
				this.info = info
				this.phoneShow = true
			},
			toPage(url) {
				uni.navigateTo({ url })
			},
			handleCreate() {
				if (!this.isSingleProject) {
					uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
					return
				}
				this.toPage('/pages/order/add-order')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		background: #ffe1b8;
		border-radius: 0 0 16px 16px;
	}

	.title {
		margin: 16px;
		color: $u-main-color;
		font-weight: bold;
		font-size: 16px
	}

	.list {
		padding: 0 16px;
	}

	.btn {
		padding: 24px 52px;
	}
</style>