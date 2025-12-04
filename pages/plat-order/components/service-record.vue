<template>
	<view class="add-page">
		<u-navbar title="录制语音评价平台" placeholder bgColor="#FAF9F7">
			<view slot="left"></view>
			<view slot="right" class="u-flex">
				<text class="u-primary" @click="backShow = true">暂不评价</text>
			</view>
		</u-navbar>
		<view class="top">
			<view>录音功能说明：</view>
			<view>1、仅支持连续录音，最长不超过5分钟;</view>
			<view>2、“确认上传”后无法删除或修改，请在上传之前确认</view>
		</view>

		<r-record v-model="form.voice" @success="handleConfirm" />

		<r-dialog v-model="backShow" title="温馨提示" cancelText="取消" confirmText="确认" content="确定暂不评价?" @cancel="backShow = false" @confirm="handleBack">
		</r-dialog>
	</view>
</template>

<script>
	import { updateVoiceByIdUrl } from '@/api'

	export default {
		data() {
			return { form: { voice: '' }, backShow: false, }
		},

		onLoad({ id }) {
			this.form.id = id
		},
		methods: {
			async handleConfirm() {
				await uni.$u.http.post(`${updateVoiceByIdUrl}?id=${this.form.id}&voice=${this.form.voice}`)
				uni.$u.toast('评价成功')
				uni.navigateBack()
			},
			handleBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
	.add-page {
		position: relative;
		background-color: #FAF9F7;
		padding: 12px 16px 24px;
	}

	.top {
		margin-bottom: 20px;
		line-height: 20px;
		color: $u-primary;
	}
</style>