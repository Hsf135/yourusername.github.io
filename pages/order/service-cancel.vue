<template>
	<view class="add-page">
		<!-- 新增标题 -->
		<u-navbar title="取消订单" placeholder bgColor="#FAF9F7">
			<view slot="left" class="u-flex">
				<text class="u-tips-color" @click="handleBack">取消</text>
			</view>
			<view slot="right" class="u-flex">
				<text class="u-primary" @click="handleConfirm">确认</text>
			</view>
		</u-navbar>

		<view class="add-card">
			<view class="u-m-b-8">
				<text>取消原因</text>
				<text class="u-error u-m-l-2">*</text>
			</view>
			<r-textarea v-model="form.cancelReason"  count :maxlength="300" placeholder="请输入取消原因" class="min-textarea"></r-textarea>
		</view>

		<view class="add-card">
			<view class="u-m-b-8 u-flex">
				请上传图片辅助说明
			</view>
			<r-upload v-model="form.cancelPicture" width="56" />
		</view>
	</view>
</template>

<script>
	import { staffInfoCancelUrl } from '@/api'

	export default {
		data() {
			return {
				loading: false,
				form: { cancelReason: '', cancelPicture: '' },
			}
		},
		onLoad({ id }) {
			this.form.id = id
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			},
			async handleConfirm() {
				if (!this.form.cancelReason) {
					uni.$u.toast('请输入取消原因')
					return
				}
				await uni.$u.http.post(staffInfoCancelUrl, this.form)
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
	.add-page {
		box-sizing: border-box;
		background-color: #FAF9F7;
		position: relative;
		min-height: 100vh;
		padding: 12px 16px 24px;
	}

	.add-card {
		background: #ffffff;
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 12px;
	}
	
	/deep/ .uni-textarea-compute {
		min-height: 60px;
	}

	.address-text {
		font-size: 14px;
		font-weight: 400;
		color: #333231;
		margin-bottom: 14px;
	}

	.address-tip {
		background: #fff9f0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #ff9500;
		padding: 2px 5px;
		margin-right: 5px;
	}

	/deep/ .u-textarea--no-radius {
		border: none;
	}
</style>