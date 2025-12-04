<template>
	<u-popup :show="show" mode="right">
		<div class="content">
			<u-navbar title="录制语音评价" placeholder bgColor="#FAF9F7">
				<view slot="left" class="u-tips-color" @click="close">返回</view>
				<view slot="right" class="u-primary" @click="handleSave">保存</view>
			</u-navbar>
			<view class="content-box">
				<view class="top">
					<view>录音功能说明：</view>
					<view>1、仅支持连续录音，最长不超过5分钟;</view>
					<view>2、“确认上传”后无法删除或修改，请在上传之前确认</view>
				</view>
				<r-record v-model="form.voice" @success="handleSuccess" ref="recordRef" />
			</view>
		</div>
	</u-popup>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				form: {
					id: '',
					path: ''
				}
			}
		},
		methods: {
			open () {
				this.form.id = ''
				this.form.path = ''
				this.show = true
			},
			close () {
				if (this.$refs.recordRef.isRecording) return // 正在录音中
				this.show = false
			},
			// data: { id: '', path: '', originalName: '' }
			handleSuccess(data) {
				this.form.id = data.id
				this.form.path = this.getFullImg(data.path)
			},
			handleSave() {
				if (!this.form.id) {
					uni.showToast({
						title: '请录音并完成上传后再保存',
						icon: 'none',
						duration: 3000
					})
					return
				}
				this.$emit('updateVoice', this.form)
				this.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		padding: 20px 0;
		line-height: 20px;
		color: $u-primary;
	}

	/deep/ .record-box {
		min-height: 40vh;
		height: 40vh;
	}

	.content {
		width: 100vw;
		background-color: #faf9f7;
		padding: 0 16px;
		box-sizing: border-box;
	}
</style>