<template>
	<view>
		<z-paging bg-color="#faf9f7" ref="paging" v-model="list" @query="loadData" :auto="false" :refresher-enabled="false">
			<view slot="top">
				<u-navbar title="搜索老人" placeholder bgColor="#faf9f7">
					<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
				</u-navbar>
				<view class="input-box">
					<u-input v-model="params.accurateSearchForDining" placeholder="搜索卡号/姓名/电话/身份证/备注" :customStyle="{ backgroundColor: '#fff' }" @confirm="handleSearch">
						<template slot="suffix">
							<text class="u-primary" @click="loadData">搜索</text>
						</template>
					</u-input>
				</view>
				<view class="u-p-lr-16 u-m-b-12">
					<u-button type="primary" plain v-if="isJiMei" @click="handleCreate">新客点餐</u-button>
				</view>
				<view class="u-p-b-12 u-text-center" v-show="total > 0">
					<view class="result">共有<text class="u-primary u-bold u-m-lr-2">{{ total }}</text>个搜索结果</view>
				</view>
			</view>
			<view class="list-box">
				<view v-for="item in list" :key="item.subsidyCardId" class="list-item" @click="toPage(item)">
					<view class="u-flex u-flex-between">
						<view>
							<text class="u-main-color u-m-r-4">{{ item.memberName }}</text>
							<text class="u-font-12 u-tips-color">{{ getInfo(item) }}</text>
						</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
					<view class="u-line-1 u-main-color u-m-t-8 u-font-12">
						卡号: {{ item.subsidyCard || '-' }} | 电话:{{ phoneEncrypted(item.mobilePhone) || '-' }}
					</view>
				</view>
			</view>
			<view slot="empty" class="empty-box" v-show="searched">
				<u-icon name="/static/imgs/common/record-empty.png" width="146" height="120"></u-icon>
				<view class="zp-main-title">
					<view>没有相关搜索结果，或该老人没有参与补贴</view>
				</view>
			</view>
		</z-paging>
		<CreateOldMan ref="createOldManRef" from="dining" @search="search" @toPage="toPage" />
	</view>
</template>

<script>
	import { oldManPageUrl, getRegionByAccountUrl } from '@/api/dining.js'
	import { phoneEncrypted } from '@/utils'
	import CreateOldMan from '../old-man/components/Create.vue'

	export default {
		components: {
			CreateOldMan
		},
		onLoad () {
			this.loadStationInfo()
		},
		data() {
			return {
				phoneEncrypted,
				list: [],
				stationInfo: {}, // 人员助餐站点信息
				params: {
					accurateSearchForDining: '',
					pageNum: 1,
					appType: 3
				},
				total: 0,
				searched: false, // 标记,是否经过了接口搜索，经过了搜索才显示empty插槽
				isJiMei: false // 该账号所属区域是否是集美区
			}
		},
		methods: {
			async loadStationInfo () {
				const { data } = await uni.$u.http.post(getRegionByAccountUrl)
				this.stationInfo = data || {}
				if (this.stationInfo.county) {
					this.isJiMei = this.stationInfo.county === '350211000000'
				}
			},
			async loadData(current) {
				if (this.params.accurateSearchForDining.trim() === '') {
					this.total = 0
					this.searched = false
					this.$refs.paging.complete([])
					uni.showToast({ title: '搜索内容不可为空', duration: 2000, icon: 'none' })
					return
				}
				try {
					uni.showLoading({
						title: '',
						mask: true
					})
					if (typeof current === 'number') {
						this.params.pageNum = current
					}
					const { data } = await uni.$u.http.post(oldManPageUrl, this.params)
					this.total = data.total
					this.$refs.paging.complete(data.list)
				} finally {
					this.searched = true
					uni.hideLoading()
				}
			},
			handleSearch() {
				this.$refs.paging.reload()
			},
			toPage(item) {
				uni.navigateTo({ url: `/pages/dining/confirm?id=${item.memberId}` })
			},
			getInfo(item) {
				const sex = item.sex === '1' ? '男' : item.sex === '2' ? '女' : ''
				if (sex && item.age) return `(${sex}，${item.age}岁)`
				if (sex) return `(${sex})`
				if (item.age) return `(${item.age}岁)`
				return ''
			},
			handleCreate () {
				this.$refs.createOldManRef.open()
			},
			search (keyword) {
				this.params.accurateSearchForDining = keyword
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.empty-box {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.input-box {
		padding: 12px 16px;
	}

	.result {
		position: relative;
		color: $u-content-color;
		display: inline-flex;

		&::before {
			content: '';
			position: absolute;
			left: -16px;
			top: 50%;
			transform: translateY(-50%);
			width: 8px;
			height: 1px;
			background-color: $u-content-color;
		}

		&::after {
			content: '';
			position: absolute;
			right: -16px;
			top: 50%;
			transform: translateY(-50%);
			width: 8px;
			height: 1px;
			background-color: $u-content-color;
		}
	}

	.list-box {
		padding: 0 16px;
	}

	.list-item {
		padding: 12px;
		border-radius: 8px;
		background-color: #fff;
		margin-bottom: 12px;
	}
</style>