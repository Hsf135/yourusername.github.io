<template>
	<view class="visit-detail">
		<u-navbar :title="navTitle" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<view class="content">
			<view class="u-font-16 u-main-color u-m-b-8">拜访详情</view>
			<view class="item u-flex">
				<view class="label">拜访人</view>
				<view>{{detail.visitOperatorName}}</view>
			</view>
			<view class="pre-item" v-if="detail.visitMode === '1'">
				<view class="label">共同拜访(内部)</view>
				<view>{{detail.operatorNames.join(',') || '-'}}</view>
			</view>
			<view class="pre-item" v-if="detail.visitMode === '1'">
				<view class="label">共同拜访(外部)</view>
				<view>{{detail.externalNames}}</view>
			</view>
			<view class="pre-item" v-if="detail.visitMode === '1' && false">
				<view class="label">共同拜访(志愿者)</view>
				<view>{{detail.volunteerNames.join(',') || '-'}}</view>
			</view>
			<view class="item u-flex">
				<view class="label">拜访时间</view>
				<view>{{detail.visitTime}}</view>
			</view>
			<view class="item u-flex">
				<view class="label">拜访老人</view>
				<view class="u-flex u-flex-between u-flex-1">
					<view>{{detail.visitCustomerName}}</view>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="item u-flex">
				<view class="label">拜访方式</view>
				<view>{{visitMode}}</view>
			</view>
			<view class="item u-flex">
				<view class="label">归属项目</view>
				<view>{{radioDict(detail.belongProjectType, 'project_type')}}</view>
			</view>
			<!-- <view class="item u-flex" v-if="detail.visitMode === '1'">
				<view class="label">拜访时长</view>
				<view>{{detail.visitMinute}}分钟</view>
			</view> -->
			<view class="pre-item">
				<view class="label">所属区域</view>
				<view>{{detail.belongRegion}}</view>
			</view>
			<view class="pre-item" v-if="detail.visitMode === '1' && detail.visitLocationCode">
				<view class="label">定位地址</view>
				<view>{{detail.visitLocationCode}}</view>
			</view>
			<view class="pre-item" v-if="detail.visitMode === '1'">
				<view class="label">拜访地址</view>
				<view>{{visitRegion}}</view>
			</view>
			<view class="pre-item" v-if="detail.visitMode === '1'">
				<view class="label">详细地址</view>
				<view>{{detail.visitDetailAddress}}</view>
			</view>
			<view class="pre-item" v-if="['1', '2'].includes(detail.visitMode)">
				<view class="label">拜访标签</view>
				<view>{{detail.visitLabel.join(',')}}</view>
			</view>
			<view class="pre-item">
				<view class="label">拜访内容</view>
				<view>{{detail.visitContent}}</view>
			</view>
			<view class="pre-item" v-if="['1', '2'].includes(detail.visitMode)">
				<view class="label">信息反馈</view>
				<view>{{detail.infoFeedback}}</view>
			</view>
			<view class="pre-item" v-if="['1', '2'].includes(detail.visitMode)">
				<view class="label">结果跟踪</view>
				<view>{{detail.resultTracking}}</view>
			</view>
			<view class="pre-item photo-item" v-if="['1', '2'].includes(detail.visitMode)">
				<view class="label">拜访照片</view>
				<view class="img-box">
					<image v-for="(item, index) in detail.visitPhotoList" :key="item.id" :src="item.url" class="img" @click="previewImg(item.url, index)"></image>
				</view>
			</view>
			<view class="pre-item photo-item" v-if="detail.visitMode === '1' && detail.finishPhotoAttach && detail.finishPhotoAttach.url">
				<view class="label">拜访结束照片</view>
				<image :src="detail.finishPhotoAttach.url" class="img" @click="previewImg(detail.finishPhotoAttach.url, detail.visitPhotoList.length)"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { visitDetailUrl } from '@/api/visiting.js'
	export default {
		onLoad ({ id }) {
			this.loadData(id)
		},
		data () {
			return {
				detail: {
					belongProjectName: '',
					belongProjectType: '',
					belongRegion: '',
					companyName: '',
					createTime: '',
					creatorName: '',
					externalNames: '',
					finishPhotoAttach: { url: '' },
					id: '',
					infoFeedback: '',
					operatorNames: [],
					platform: '',
					resultTracking: '',
					updateTime: '',
					updaterName: '',
					visitCity: '',
					visitCommunity: '',
					visitContent: '',
					visitCounty: '',
					visitCustomerIdCard: '',
					visitCustomerMobilePhone: '',
					visitCustomerName: '',
					visitDetailAddress: '',
					visitLabel: [],
					visitLocationCode: '',
					visitMinute: 0,
					visitMode: '',
					visitOperatorName: '',
					visitPhotoList: [],
					visitProvince: '',
					visitStreet: '',
					visitTime: '',
					visitVillage: '',
					volunteerNames: []
				}
			}
		},
		computed: {
			navTitle () {
				if (this.detail.visitMode === '1') return '入户拜访详情'
				if (this.detail.visitMode === '2') return '电话拜访详情'
				if (this.detail.visitMode === '3') return '活动拜访详情'
				return '拜访详情'
			},
			imgs () {
				if (this.detail.finishPhotoAttach && this.detail.finishPhotoAttach.url) {
					return this.detail.visitPhotoList.map(item => item.url).concat(this.detail.finishPhotoAttach.url)
				}
				return this.detail.visitPhotoList.map(item => item.url)
			},
			visitMode () {
				if (this.detail.visitMode === '1') return '入户'
				if (this.detail.visitMode === '2') return '电话'
				if (this.detail.visitMode === '3') return '活动'
				return ''
			},
			visitRegion () {
				return `${this.detail.visitProvince || ''}${this.detail.visitCity || ''}${this.detail.visitCounty || ''}${this.detail.visitStreet || ''}${this.detail.visitCommunity || ''}${this.detail.visitVillage}`
			}
		},
		methods: {
			async loadData (id) {
				const params = { params: { id } }
				const { data } = await uni.$u.http.get(visitDetailUrl, params)
				Object.assign(this.detail, data)
			},
			previewImg (url, index) {
				uni.previewImage({
					urls: this.imgs,
					current: index,
					indicator: 'number'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.content {
	margin: 12px;
	background-color: #fff;
	border-radius: 8px;
	padding: 12px;
	color: #666462;
}
.item {
	padding: 12px 0;
	border-bottom: 1px solid #f5f3f0;
	.label {
		width: 76px;
		color: $u-main-color;
		white-space: nowrap;
	}
}
.pre-item {
	padding: 12px 0;
	border-bottom: 1px solid #f5f3f0;
	.label {
		margin-bottom: 8px;
		color: $u-main-color;
	}
}
.photo-item {
	padding: 12px 0 4px 0;
}
.img {
	width: 56px;
	height: 56px;
	margin: 0 8px 8px 0;
	border-radius: 8px;
}
</style>