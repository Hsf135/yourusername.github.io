<template>
	<view class="u-m-b-12">
		<u-button type="primary" @click="handleTakePhoto">结束拜访并拍照</u-button>
		<view class="water-canvas">
			<canvas :style="`width:${canvasW}px; height:${canvasH}px`" :canvas-id="waterCanvas"></canvas>
		</view>
	</view>
</template>

<script>
	import { uploadUrl } from '@/api'
	export default {
		props: {
			waterInfo: { type: Object, default: () => ({}) }
		},
		mounted() {
			this.waterCanvas = 'waterCanvas' + uni.$u.guid(12)
		},
		data () {
			return {
				waterCanvas: 'waterCanvas',
				canvasW: 1440,
				canvasH: 1440
			}
		},
		methods: {
			handleTakePhoto () {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['camera'],
					success: async res => {
						try {
							uni.showLoading({ title: '上传中，请稍候', mask: true })
							const tempFilePath = await this.drawPhoto(res.tempFilePaths[0])
							const { id, url } = await this.uploadFilePromise(tempFilePath)
							this.$emit('setFinishPhoto', {
								id,
								url,
								time: Date.now()
							})
						} finally {
							uni.hideLoading()
						}
					}
				})
			},
			uploadFilePromise(filePath) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: uploadUrl,
						filePath,
						name: 'file',
						header: { 'Authorization': this.vuex_token },
						success: res => {
							if (res.statusCode === 200) {
								const data = JSON.parse(res.data)
								if (data.code === 200) {
									resolve({
										url: this.getFullImg(data.data.path),
										id: data.data.id,
										status: 'success'
									})
									return
								}
								if (data.code === 401) {
									uni.showToast({
										title: data.msg,
										icon: 'none',
										duration: 2000
									})
								}
								reject({
									url: filePath,
									status: 'failed'
								})
							} else {
								reject({
									url: filePath,
									status: 'failed'
								})
							}
						},
						fail: err => {
							reject(err)
						}
					})
				})
			},
			drawPhoto(path) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: path,
						success: res => {
							const ctx = uni.createCanvasContext(this.waterCanvas)
							//设置画布宽高
							this.canvasW = res.width
							this.canvasH = res.height
							ctx.drawImage(path, 0, 0, res.width, res.height)
			
							ctx.setFillStyle('#ffffff')
							ctx.fillRect(30, res.height - 190, 10, 160)
			
							const fontFamily = uni.getSystemInfoSync().platform === 'ios' ? 'Sthginkra' : 'DingTalkJinBuTi'
							ctx.font = `normal 30px  ${fontFamily}`
			
							if (this.waterInfo.firstLine) {
								ctx.setFontSize(30) // 设置字体大小
								ctx.setFillStyle('#ffffff') // 设置颜色为白色
								ctx.fillText(`${this.waterInfo.firstLine}`, 60, res.height - 150)
							}
			
							if (this.waterInfo.secondLine) {
								ctx.setFontSize(30) // 设置字体大小
								ctx.setFillStyle('#ffffff') // 设置颜色为白色
								ctx.fillText(`${this.waterInfo.secondLine}`, 60, res.height - 100)
							}
			
							if (this.waterInfo.thirdLine) {
								ctx.setFontSize(30) // 设置字体大小
								ctx.setFillStyle('#ffffff') // 设置颜色为白色
								ctx.fillText(`${this.waterInfo.thirdLine}`, 60, res.height - 50)
							}
			
							ctx.draw(false, () => {
								uni.canvasToTempFilePath({
									canvasId: this.waterCanvas,
									destWidth: this.canvasW * 2, // 展示图片尺寸=画布尺寸1*像素比2
									destHeight: this.canvasH * 2,
									success: ({ tempFilePath }) => {
										resolve(tempFilePath)
									},
									fail: e => {
										console.log(e)
										reject(e)
									}
								})
							})
						},
						fail: e => {
							console.log(e)
							reject(e)
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.water-canvas {
		overflow: hidden;
		position: absolute;
		top: -999999rpx;
		width: 100%;
	}
</style>