<template>
	<view class="detail-page">
		<u-navbar title="服务对象信息" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
			<view slot="right" class="u-flex">
				<u-icon :name="aIcon(info.isCollection === '1' ? 'shoucangxing-mian' : 'shoucangxing-xian')" width="24" height="24" @click="handleCllect"></u-icon>
			</view>
		</u-navbar>


		<view class="base-box">
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">姓名：</text>
				<text class="u-main-color">{{info.name}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">性别：</text>
				<text class="u-main-color">{{radioDict(info.sex,'vols_sex')}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">年龄：</text>
				<text class="u-main-color">{{info.age}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">历史被服务次数：</text>
				<text class="u-main-color">3</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">电话：</text>
				<text class="u-main-color mobilephone">{{phoneEncrypted(info.mobilephone)}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">现居地址：</text>
				<text class="u-main-color">{{info.currentAllAddress}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">户籍地址：</text>
				<text class="u-main-color">{{info.domicileAllAddress}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">身份证号：</text>
				<text class="u-main-color">{{idCardEncrypted(info.idcard)}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">二级服务标签：</text>
				<text class="u-main-color">{{checkDict(info.secondServiceLabel, 'second_service_label')}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">服务对象来源：</text>
				<text class="u-main-color">{{checkDict(info.serviceObjSource, 'service_obj_source')}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">政府服务标准：</text>
				<text class="u-main-color">{{checkDict(info.serviceStandards, 'service_standards')}}</text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">养老卡：</text>
				<text class="u-main-color">{{info.isCard === '1' ? '绑定' :'未绑定'}} </text>
			</view>
			<view class="u-content-color u-m-b-14 u-font-14 u-flex-start">
				<text class="u-shirk">无卡补贴：</text>
				<text class="u-main-color">无</text>
			</view>
			<view class="u-content-color u-font-14 u-flex-start">
				<text class="u-shirk">工时补贴：</text>
				<text class="u-main-color">无</text>
			</view>
		</view>

	</view>
</template>

<script>
	import { saveCollectionUrl, getCustomerBaseDetailUrl } from '@/api'
	import { phoneEncrypted, idCardEncrypted } from '@/utils'
	import { oldManDetailUrl } from '@/api/dining.js'

	export default {
		data() {
			return {
				phoneEncrypted,
				idCardEncrypted,
				enterType: '',
				customerId: undefined,
				info: { time: '', name: '', memberLevel: '1', domicileAllAddress: '', currentAllAddress: '' },
				helthInfo: {},
				phoneShow: false,
				enterTypeList: [
					{ value: '/pages/old-man/health-add', name: '录入健康数据', icon: 'jiankangshuju' },
				],
				popoverStyle: { width: '110px', left: '-80px' },
				arrowStyle: { left: '65%' },
				rules: {
					name: [{
						required: true,
						message: '姓名不可为空',
						trigger: ['blur', 'change']
					}],
					sex: [{
						required: true,
						message: '性别不可为空',
						trigger: ['blur', 'change']
					}]
				}
			}
		},
		onLoad({ id }) {
			this.customerId = id
			this.loadData()
		},
		onShow() {
			this.loadData()
		},
		methods: {
			async loadData() {
				const { data } = await uni.$u.http.post(`${getCustomerBaseDetailUrl}?id=${this.customerId}`)
				const subsidy = await uni.$u.http.post(`${oldManDetailUrl}?id=${this.customerId}`)
				this.info = data
				this.info.subsidyCard = subsidy.data.subsidyCard
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
				this.toPage(`${e.value}?id=${this.customerId}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		padding: 12px;
		color: $u-main-color;
		font-size: 16px;
		font-weight: bold;
	}

	.mobilephone {
		word-break: break-all;
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

	.address-tip {
		background: #f7bc18;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #fff;
		padding: 2px 5px;
		margin-right: 5px;
	}

	.status-title {
		font-weight: bolder;
		color: #333231;
	}

	/deep/ .u-form-item__body__right__content__slot {
		color: #666462;
	}

	.pic-button {
		background: #ffffff;
		border: 1px solid #ff9500;
		border-radius: 8px;
		font-size: 14px;
		padding: 0 6px;
		color: #ff9500;
		flex-shrink: 0;
	}

	.time-tip {
		font-size: 14px;
		font-weight: 600;
		color: #333231;
	}

	.recording {
		background: #fff9f0;
		border-radius: 10px;
		padding: 2px 8px;
		color: #FF9500;
	}

	.order-buttons {
		box-sizing: border-box;
		height: 64px;
		width: 100vw;
		position: fixed;
		background-color: #fff;
		bottom: 0;
		padding: 12px 32px;
	}

	.cus-style {
		margin-right: 10px;
	}
</style>