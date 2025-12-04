<template>
	<view>
		<view class="record-box">
			<r-voice v-if="recordContent" :src="recordContent" showText />
			<view v-else class="u-flex-y u-flex-center u-flex-items-center">
				<view class="timer">
					<view v-show="voiceTime" class="u-flex">
						<u-icon name="/static/imgs/record/playing.gif" width="80" height="20"></u-icon>
						<view class="u-m-l-10 u-m-r-10">{{voiceTime}}</view>
						<u-icon name="/static/imgs/record/playing.gif" width="80" height="20"></u-icon>
					</view>
				</view>
				<view class="u-flex-y u-flex-center u-flex-items-center">
					<u-icon v-if="isRecording" name="/static/imgs/record/recording.gif" width="144" height="144" @click="handleStop"></u-icon>
					<u-icon v-else key="start" name="/static/imgs/record/start.png" width="144" height="144" @click="handleStart"></u-icon>
					<text class="">{{isRecording ? '点击结束录音' : '点击开始录音'}}</text>
				</view>
			</view>
		</view>
		<view v-if="recordContent" class="u-m-t-32 u-flex u-flex-between">
			<view class="u-flex-1 u-m-r-10">
				<u-button type="primary" plain text="重新录制" @click="show = true"></u-button>
			</view>
			<view class="u-flex-2">
				<u-button type="primary" text="上传录音" @click="handleUpload"></u-button>
			</view>
		</view>

		<r-dialog v-model="show" title="温馨提示" cancelText="取消" confirmText="确认" content="是否确定重新录制？" @cancel="show = false" @confirm="handleReset">
		</r-dialog>

		<r-dialog v-model="dialogShow" :title="dialogMsg.title" cancelText="不开启" confirmText="去开启" @cancel="cancel" @confirm="dialogConfirm">
			<view slot="content" class="u-flex">
				<view class="icon u-flex u-flex-xy-center">
					<u-icon :name="aIcon(dialogMsg.icon)" width="20" height="20"></u-icon>
				</view>
				<view class="u-m-l-8">
					<view class="subtitle">{{dialogMsg.subtitle}}</view>
					<view class="desc">{{dialogMsg.desc}}</view>
				</view>
			</view>
		</r-dialog>
	</view>
</template>

<script>
	import { uploadUrl } from '@/api'
	import { checkPermission, gotoAppPermissionSetting } from '@/utils/permission'

	export default {
		name: 'r-record',
		props: {
			value: { type: [String, Number], default: '' },
			maxVoiceLength: { type: Number, default: 5 * 60 * 1000 },
			customClass: { type: String, default: '' }
		},
		data() {
			return {
				show: false,
				recordContent: null,
				recorderManager: null,
				isRecording: false,
				timer: null,
				count: 0,
				dialogShow: false,
				dialogType: 'record',
				dialog: {
					record: {
						title: '需开启麦克风权限',
						subtitle: '麦克风权限',
						desc: '录音需要使用麦克风，请开启“麦克风权限”!',
						icon: 'record'
					}
				}
			}
		},
		computed: {
			voiceTime() {
				if (!this.count) {
					return 0
				}
				return uni.$u.timeFormat(this.count * 1000, 'MM:ss')
			},
			dialogMsg() {
				return this.dialog[this.dialogType]
			}
		},
		mounted() {
			this.initRecorder()
		},
		beforeDestroy() {
			this.recorderManager = null
		},
		methods: {
			initRecorder() {
				this.recorderManager = uni.getRecorderManager()
				this.recorderManager.onStart(() => {
					this.isRecording = true
					this.timer = setInterval(() => {
						this.count++
					}, 1000)
				})
				this.recorderManager.onStop(res => {
					if (this.isRecording) { // 录音中被强制停止
						this.isRecording = false
						return
					}
					const { tempFilePath } = res
					this.recordContent = tempFilePath
					clearInterval(this.timer)
					this.count = 0
				})
				this.recorderManager.onError(err => {
					console.error('录音错误：', err)
					this.isRecording = false
				})
			},
			handleUpload() {
				uni.showLoading({ title: '录音上传中' })
				uni.uploadFile({
					url: uploadUrl,
					filePath: this.recordContent,
					name: 'file',
					header: { 'Authorization': this.vuex_token },
					success: res => {
						uni.hideLoading()
						if (res.statusCode === 200) {
							const data = JSON.parse(res.data)
							this.$emit('input', data.data.id)
							this.$emit('success', data.data)
						}
					},
					fail: err => {
						uni.hideLoading()
						console.log(err)
						uni.$u.toast(err)
					}
				})
			},
			async handleStart() {
				if (!await checkPermission('record')) {
					this.dialogShow = true
					return
				}
				this.recorderManager.start({
					duration: this.maxVoiceLength, // 录音的最大时长，单位 ms
					format: 'mp3'
				})
			},
			handleStop() {
				this.recorderManager.stop() // 停止录音
				this.isRecording = false
			},
			handleReset() {
				this.show = false
				this.recordContent = null
				this.recorderManager.stop()
				this.handleStart()
			},
			cancel() {
				uni.showToast({ title: `${this.dialogMsg.subtitle}未开启，无法使用该功能`, icon: 'none' })
			},
			dialogConfirm() {
				gotoAppPermissionSetting()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.record-box {
		padding: 75px 12px 0;
		min-height: 50vh;
		background: #fff;
		border-radius: 8px;
	}

	.timer {
		height: 20px;
	}
</style>