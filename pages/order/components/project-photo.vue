<template>
	<view class="add-page">
		<u-navbar :title="title" placeholder bgColor="#FAF9F7">
			<view slot="left" class="u-flex">
				<text class="u-info" @click="toBack">取消</text>
			</view>
			<view slot="right" class="u-flex">
				<text class="u-primary" @click="handleConfirm">确认</text>
			</view>
		</u-navbar>
		<view class="add-card">
			<view class="u-m-b-8">
				服务照片 <text class="u-error">(“提交审核”时必填，至少2张，最多5张)</text>
			</view>
			<r-upload v-model="form.beforePicture" :imgList="form.beforePictureAttach" :maxCount="5" />
		</view>
		<view class="u-content-color u-font-12 u-m-t-8">如果当前网络不好，可先用APP内的相机拍摄照片，保存至手机 相册，等到网络好的地方再从相册选择照片。</view>
	</view>
</template>

<script>
	import { uploadServeItemPhotoUrl } from '@/api'

	export default {
		data() {
			return { form: {} }
		},
		computed: {
			title() {
				return '图片编辑：项目' + this.vuex_projectEdit.index
			}
		},
		onUnload() {
			this.$u.vuex('vuex_projectEdit', {})
		},
		onLoad() {
			const { id, beforePicture, beforePictureAttach } = this.vuex_projectEdit
			this.form = { id, beforePicture, beforePictureAttach }
		},
		methods: {
			async handleConfirm() {
				await uni.$u.http.post(uploadServeItemPhotoUrl, this.form)
				uni.navigateBack()
			},
			toBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
	.add-page {
		background-color: #FAF9F7;
		position: relative;
		min-height: 100vh;
		padding: 12px 16px 24px;
	}

	.add-card {
		padding: 12px;
		background: #ffffff;
		border-radius: 8px;
	}
</style>