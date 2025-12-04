<template>
	<view class="full-page">
		<z-paging ref="paging" v-model="list" @query="loadData" :auto="false" bg-color="#fff" empty-view-img="/static/imgs/common/empty.png"
			:emptyViewText="type === 'search' ? '试试关键字搜索服务对象~' :'暂无服务对象~'">
			<view slot="top" class="box">
				<u-navbar :title="title" placeholder bgColor="transparent">
					<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
				</u-navbar>
				<view v-if="type==='search'" class="search u-flex">
					<r-popover :list="searchTypeList" @change="searchTypeChange">
						<view class="search-type u-flex u-p-r-8 u-m-r-8 u-border-right">
							<text class="u-m-r-4">{{searchTypeName}}</text>
							<u-icon :name="aIcon('mingcheng67')" width="12" height="12"></u-icon>
						</view>
					</r-popover>
					<u-input v-model="search" focus placeholder="搜索关键字" border="none" confirmType="search" @confirm="reload">
						<u-icon slot="suffix" :name="aIcon('search')" width="24" height="24" @click="reload"></u-icon>
					</u-input>
				</view>
				<view class="total">
					<view v-if="params.isSearch">- 已查询过的服务对象 - </view>
					<view v-else>
						<text>- 共有 </text>
						<text class="u-primary num">{{total}}</text>
						<text>个搜索结果 - </text>
					</view>
				</view>

				<view class="header-box">
					<view class="header u-p-l-5 u-flex">
						<view class="u-flex-1 cell">基础信息</view>
						<view class="u-flex-1 cell">服务信息</view>
						<view class="u-flex-1 cell">联系信息</view>
					</view>
				</view>
			</view>

			<view v-if="list.length" class="list">
				<r-service v-for="l in list" :key="l.id" :item="l" :isSelect="isSelect" :isSearch="type === 'search'" />
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { getCustomerPageUrl } from '@/api'

	export default {
		data() {
			return {
				title: '',
				type: 'search',
				isSelect: '0',
				list: [],
				params: { pageNum: 1, pageSize: 15, appType: 2 },
				search: '',
				total: 0,
				searchType: 'name',
				searchTypeName: '姓名',
				searchTypeList: [
					{ value: 'name', name: '姓名' },
					{ value: 'mobilephone', name: '联系电话' },
					{ value: 'currentCommunity', name: '社区' },
					{ value: 'currentAddress', name: '地址' },
					{ value: 'remark', name: '备注' },
					{ value: 'idcard', name: '身份证' },
				]
			}
		},
		methods: {
			async loadData(current = 1) {
				this.params.pageNum = current
				this.params[this.searchType] = this.search
				const { data } = await uni.$u.http.post(getCustomerPageUrl, this.params)
				this.$refs.paging.complete(data.list)
				this.total = data.total
			},
			reload() {
				if (!this.search) {
					uni.showToast({ title: '搜索内容不能为空', icon: 'none' })
					return
				}
				// 搜素后关闭查看页面
				this.params.isSearch = ''
				this.params.searchType = ''
				this.params[this.searchType] = this.search
				this.$refs.paging.reload()
			},
			searchTypeChange({ value, name }) {
				this.searchTypeList.forEach(s => {
					this.params[s.value] = ''
				})
				this.searchType = value
				this.searchTypeName = name
			}
		},
		onLoad({ type = 'search', isSelect = '0' }) {
			this.isSelect = isSelect
			this.type = type
			this.title = type === 'search' ? '搜索' : '筛选结果'
			if (this.type !== 'search') {
				Object.assign(this.params, { ...this.vuex_tempObj })
				this.loadData()
				return
			}
			// 搜索页面进来先显示查看记录页面
			this.params.isSearch = 1
			this.params.searchType = 1
			this.loadData()
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		background: #FAF9F7;
	}

	.search {
		margin: 4px 12px;
		padding: 12px 10px;
		background: #fff;
		border-radius: 8px;
	}

	.total {
		margin-top: 12px;
		padding: 12px;
		text-align: center;
		background: #fff;
		border-radius: 8px 8px 0 0;
	}

	.is-search {
		padding: 10px 0;
		color: #333;
		background: #FAF9F7;
	}

	.num {
		margin: 0 5px;
		font-weight: bold;
	}

	.header-box {
		background: #fff;
	}

	.header {
		margin: 0 16px;
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

	.list {
		margin: 0 16px 12px;
		overflow: hidden;
		color: $u-main-color;
		font-size: 12px;
		border-radius: 0 0 8px 8px;
		border: 1px solid #f5f3f0;
		border-top: 0;
	}
</style>