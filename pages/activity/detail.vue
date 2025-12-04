<template>
	<view class="visit-detail">
		<u-navbar title="活动详情" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<view class="content">
			<view class="u-font-16 u-main-color u-m-b-8 u-bold">{{detail.title}}</view>
			<view class="item">
				<view class="label">时间</view>
				<view>{{time}}</view>
			</view>
			<view class="item">
				<view class="label">活动</view>
				<view class="u-flex-1">
					<text>{{radioDict(detail.assort, 'assort')}}</text>
					<text class="u-m-lr-8">|</text>
					<text>{{radioDict(detail.type, 'comactivty_type')}}</text>
					<text class="u-m-lr-8">|</text>
					<text>{{radioDict(detail.activitySort, 'activity_sort')}}</text>
				</view>
			</view>
			<view class="item">
				<view class="label">地址</view>
				<view>{{detail.activityAddress}}</view>
			</view>
		</view>
		<view class="content">
			<view class="u-main-color u-m-b-8">活动内容</view>
			<view class="pre-wrap u-content-color" v-html="detail.content"></view>
		</view>
		<view class="content">
			<view class="u-main-color u-m-b-8">活动照片</view>
			<view class="img-box">
				<image v-for="(item, index) in detail.activityPhotoList" :key="item.id" :src="item.url" class="img" @click="previewImg(item.url, index)"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { activityDetailUrl } from '@/api/activity.js'
	export default {
		onLoad ({ id }) {
			this.loadData(id)
		},
		data () {
			return {
				detail: {
					activityAddress: '',
					activityCommunity: '',
					activityFileList: [],
					activityFiles: '',
					activityPhotoList: [],
					activityPhotos: '',
					activitySort: '',
					assort: '',
					city: '',
					comNameAndOrg: '',
					community: '',
					content: '',
					county: '',
					createTime: '',
					creatorName: '',
					customerInfoVOList: [],
					detailAddress: '',
					endTime: '',
					id: '',
					idNameComString: '',
					operatorIds: '',
					personalStatus: '',
					platform: '',
					province: '',
					publishName: '',
					regionCode: '',
					remark: '',
					startTime: '',
					street: '',
					taskStatus: '',
					title: '',
					type: '',
					updateTime: '',
					updaterName: '',
					verificationCode: '',
					village: ''
				}
			}
		},
		computed: {
			imgs () {
				return this.detail.activityPhotoList.map(item => item.url)
			},
			time () {
				if (!(this.detail.startTime && this.detail.endTime)) return ''
				const startDate = this.detail.startTime.slice(0, 10)
				const start = this.detail.startTime.slice(11, 16)
				const endDate = this.detail.endTime.slice(0, 10)
				const end = this.detail.endTime.slice(11, 16)
				if (startDate === endDate) return `${startDate} ${start}-${end}`
				return `${startDate} ${start} - ${endDate} ${end}`
			}
		},
		methods: {
			async loadData (id) {
				const params = { params: { id } }
				const { data } = await uni.$u.http.get(activityDetailUrl, params)
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
	margin-top: 12px;
	display: flex;
	color: $u-main-color;
	.label {
		width: 38px;
		flex-shrink: 0;
		color: $u-content-color;
	}
}
.img {
	width: 56px;
	height: 56px;
	margin: 0 8px 8px 0;
	border-radius: 8px;
}
</style>
