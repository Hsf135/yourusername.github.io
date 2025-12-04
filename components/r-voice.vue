<template>
	<view>
		<view class="u-flex-y u-flex-center u-flex-items-center">
			<view class="timer">
				<view v-show="voiceTime" class="u-flex">
					<u-icon v-if="playing" name="/static/imgs/record/playing.gif" width="80" height="20"></u-icon>
					<view class="u-m-l-10 u-m-r-10">{{voiceTime}}</view>
					<u-icon v-if="playing" name="/static/imgs/record/playing.gif" width="80" height="20"></u-icon>
				</view>
			</view>
			<view class="u-flex-y u-flex-center u-flex-items-center">
				<view v-if="playing" class="progress u-flex-xy-center" @click="handleStop">
					<r-circle-progress active-color="#FF9500" :percent="percent" />
					<u-icon name="/static/imgs/record/stop.png" width="48" height="48" class="stop"></u-icon>
				</view>
				<u-icon v-else name="/static/imgs/record/voice-play.png" width="144" height="144" @click="handlePlay"></u-icon>
				<text v-if="showText">{{playing ? '点击停止播放' : '点击播放录音'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'r-voice',
		props: { src: { type: String, default: '' }, showText: { type: Boolean, default: false } },
		data() {
			return {
				playing: false,
				audioManger: uni.createInnerAudioContext(),
				count: 0,
				percent: 0,
				lastTime: 0
			}
		},
		computed: {
			voiceTime() {
				if (!this.count) {
					return 0
				}
				return uni.$u.timeFormat(this.count * 1000, 'MM:ss')
			}
		},
		mounted() {
			this.initAudio()
		},
		beforeDestroy() {
			this.audioManger.stop()
			this.audioManger.destroy()
			this.audioManger = null
		},
		methods: {
			initAudio() {
				this.audioManger.src = this.src
				this.audioManger.onPlay(() => {
					this.playing = true
				})
				this.audioManger.onCanplay(() => {
					this.count = Math.floor(this.audioManger.duration)
					this.$emit('ready', this.voiceTime)
				})
				this.audioManger.onTimeUpdate(() => {
					const { duration, currentTime } = this.audioManger
					if (duration !== currentTime && currentTime - this.lastTime < 0.3) {
						return
					}
					this.lastTime = currentTime
					this.count = Math.floor(duration) - Math.floor(currentTime)
					this.percent = currentTime / duration * 100
				})
				this.audioManger.onEnded(() => {
					this.percent = 0
					this.lastTime = 0
					this.playing = false
					this.count = Math.floor(this.audioManger.duration)
				})
				this.audioManger.onError(res => {
					console.log(res)
				})
			},
			handlePlay() {
				if (this.count > 0) {
					this.count--
				}
				this.audioManger.play()
			},
			handleStop() {
				this.audioManger.stop()
				this.playing = false
				this.count = Math.floor(this.audioManger.duration)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.progress {
		position: relative;
		width: 144px;
		height: 144px;
	}

	.stop {
		position: absolute;
		top: calc(50% - 24px);
		left: calc(50% - 24px);
		z-index: 9;
	}
</style>