<template>
	<view class="detail-page">
		<u-navbar title="老人信息" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
			<view slot="right" class="u-flex">
				<r-popover v-model="enterType" :list="enterTypeList" :arrowStyle="arrowStyle" :popoverStyle="popoverStyle"
					@change="enterTypeChange">
					<u-icon :name="aIcon('luru-xian')" width="24" height="24" class="u-m-r-12"></u-icon>
				</r-popover>
				<u-icon :name="aIcon(info.isCollection === '1' ? 'shoucangxing-mian' : 'shoucangxing-xian')" width="24"
					height="24" @click="handleCllect"></u-icon>
			</view>
		</u-navbar>

		<view class="base-box" @click="toPage(`/pages/old-man/portfolio?id=${info.id}`)">
			<view class="title u-border-bottom u-flex u-flex-between">
				<view class="u-flex">
					<text>{{info.name}}</text>
					<text v-if="info.sex" class="ig-label u-m-l-10">{{info.sex == 1 ? '男' : '女'}}</text>
					<text v-if="info.age" class="ig-label u-m-l-10 warning">{{info.age}}岁</text>
				</view>
				<view>
					<u--text suffixIcon="arrow-right" color="#FF9500" text="查看更多" :iconStyle="{color: '#FF9500'}"></u--text>
				</view>
			</view>
			<view class="u-flex u-flex-between u-m-t-18 u-m-b-8">
				<view class="u-line-1 u-m-r-20">
					<text class="u-m-l-8 u-m-r-8">联系电话：</text>
					<text class="u-main-color mobilephone">{{info.mobilephone}}</text>
				</view>
				<view class="phone u-flex u-flex-xy-center" @click.stop="phoneShow = true">
					<u-icon :name="aIcon('dianhua-1')" width="24" height="24"></u-icon>
				</view>
			</view>
			<view class="u-flex items-top u-m-b-8">
				<text class="u-m-l-8 u-m-r-8">户籍地址：</text>
				<view class="u-main-color address u-line-2">{{info.domicileAllAddress}}</view>
			</view>
			<view class="u-flex items-top">
				<text class="u-m-l-8 u-m-r-8">现居地址：</text>
				<view class="u-main-color address u-line-2">{{info.currentAllAddress}}</view>
			</view>
		</view>

		<view class="base-box" @click="toPage(`/pages/old-man/health-record?id=${customerId}`)">
			<view class="title u-border-bottom u-flex u-flex-between">
				<view>健康记录({{helthInfo.total}})</view>
				<view>
					<u--text suffixIcon="arrow-right" color="#FF9500" text="查看更多" :iconStyle="{color: '#FF9500'}"></u--text>
				</view>
			</view>
			<view v-if="helthInfo.total" class="u-flex u-flex-between">
				<text>血压</text>
				<text>{{helthInfo.time}}</text>
				<view>
					<u--text size="12" :color="helthInfo.bloodPressure === '2' ? '#666462' : '#e96848'"
						:text="radioDict(helthInfo.bloodPressure, 'blood_pressure_situation')"></u--text>
				</view>
			</view>
		</view>

		<r-phone v-if="phoneShow" v-model="phoneShow" :name="info.name" :phone="info.mobilephone" />
		<r-dialog v-model="showDialog" title="请选择拜访类型">
			<view slot="content" class="shadow-box">
				<view class="type-btn" @click="toVisitingPage('1')">入户拜访</view>
				<view class="type-btn" @click="toVisitingPage('2')">电话拜访</view>
			</view>
			<view slot="btns"></view>
		</r-dialog>
		<!-- <view class="base-box">
			<view class="title u-border-bottom u-flex u-flex-between">
				<view>拜访记录(3)</view>
				<view>
					<u--text suffixIcon="arrow-right" color="#FF9500" text="查看更多" :iconStyle="{color: '#FF9500'}"></u--text>
				</view>
			</view>
			<view class="u-flex u-flex-between u-m-b-8">
				<view>
					<view class="u-flex u-m-b-4">
						<text class="ig-label u-m-r-4">电话</text>
						<text class="u-main-color">李宝琴</text>
					</view>
					<view class="u-font-12 u-tips-color">2024-03-11 14:54</view>
				</view>
				<view>
					<u--text suffixIcon="arrow-right" color="#999693" text="详情" :iconStyle="{color: '#999693'}"></u--text>
				</view>
			</view>
			<view>早晨起来照镜子，安慰自己说没事，还有比我更丑的。</view>
		</view>

		<view class="base-box">
			<view class="title u-border-bottom u-flex u-flex-between">
				<view>服务记录(3)</view>
				<view>
					<u--text suffixIcon="arrow-right" color="#FF9500" text="查看更多" :iconStyle="{color: '#FF9500'}"></u--text>
				</view>
			</view>
			<view class="u-flex u-flex-between u-m-b-8">
				<view>
					<view class="u-flex u-m-b-4">
						<text class="ig-label u-m-r-4">自建订单</text>
						<text class="u-main-color">张国宝</text>
					</view>
					<view class="u-font-12 u-tips-color">2024-03-11 14:54</view>
				</view>
				<view>
					<u--text suffixIcon="arrow-right" color="#999693" text="详情" :iconStyle="{color: '#999693'}"></u--text>
				</view>
			</view>
			<view class="u-flex items-top u-m-b-8">
				<text class="u-m-l-8 u-m-r-8">服务项目：</text>
				<view class="u-main-color address u-line-1">测量血压-测量血压，居家整理</view>
			</view>
			<view class="u-flex items-top u-m-b-8">
				<text class="u-m-l-8 u-m-r-8">服务状态：</text>
				<view class="u-main-color address u-line-1">已通过</view>
			</view>
		</view> -->

	</view>
</template>

<script>
	import {
		getCustomerBaseDetailUrl,
		getCustomerBpDataUrl,
		saveCollectionUrl
	} from '@/api'

	export default {
		data() {
			return {
				enterType: '',
				customerId: undefined,
				info: {},
				helthInfo: {},
				phoneShow: false,
				enterTypeList: [
					{ value: '/pages/old-man/health-add', name: '录入健康数据', icon: 'jiankangshuju' },
					{ value: '/pages/visiting/edit', name: '添加拜访记录', icon: 'tianjia2' }
				],
				popoverStyle: { width: '110px', left: '-80px' },
				arrowStyle: { left: '65%' },
				showDialog: false
			}
		},
		onLoad(option) {
			this.customerId = option.id
			this.loadData()
		},
		onShow() {
			this.loadData()
		},
		methods: {
			async loadData() {
				const baseInfoRes = await uni.$u.http.post(`${getCustomerBaseDetailUrl}?id=${this.customerId}`)
				this.info = baseInfoRes.data
				const healthInfoRes = await uni.$u.http.post(getCustomerBpDataUrl, {
					customerId: this.customerId,
					pageNum: 1,
					pageSize: 1
				})
				this.helthInfo = healthInfoRes.data
				if (healthInfoRes.data.list.length) {
					this.helthInfo.bloodPressure = healthInfoRes.data.list[0].bloodPressure
					this.helthInfo.time = healthInfoRes.data.list[0].measureTime.slice(5, 16)
				}
			},
			async handleCllect() {
				const isCollection = this.info.isCollection === '1' ? '0' : '1'
				await uni.$u.http.post(saveCollectionUrl, { customerId: this.customerId, isCollection })
				this.info.isCollection = isCollection
			},
			toPage(url) {
				uni.navigateTo({ url })
			},
			enterTypeChange(e) {
				if (e.name === '添加拜访记录') {
					this.showDialog = true
					return
				}
				this.toPage(`${e.value}?id=${this.customerId}`)
			},
			// 跳转编辑拜访记录页面
			toVisitingPage (visitMode) {
				this.showDialog = false
				this.toPage(`/pages/visiting/edit?customerId=${this.customerId}&visitMode=${visitMode}&visiting_edit_name=${false}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		margin-bottom: 8px;
		padding-bottom: 12px;
		color: $u-main-color;
		font-size: 16px;
		font-weight: bold;
	}

	.mobilephone {
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical !important;
	}

	.phone {
		width: 32px;
		height: 32px;
		background: #fff9f0;
		border-radius: 8px;
	}

	.address {
		width: calc(100% - 120px);
	}

	.detail-page {
		padding-bottom: 10px;
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