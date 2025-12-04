<template>
	<view>
		<u-icon :name="aIcon('xiangji-xian')" width="24" height="24" @click="handlePermission"></u-icon>

		<view class="camera-canvas">
			<canvas :style="`width:${canvasW}px; height:${canvasH}px`" canvas-id="cameraCanvas"></canvas>
		</view>

		<r-dialog v-model="show" :title="dialogMsg.title" cancelText="不开启" confirmText="去开启" @cancel="cancel" @confirm="confirm">
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
	import { getNowDataUrl } from '@/api'
	import {
		checkPermission,
		checkSystemEnableLocation,
		gotoSystemLocatonSetting,
		gotoAppPermissionSetting
	} from '@/utils/permission'

	export default {
		name: 'r-camera',
		data() {
			return {
				canvasW: 1440,
				canvasH: 1440,
				address: '未获取到信息',
				nowTime: '未获取到信息',
				show: false,
				dialogType: 'camera',
				dialog: {
					camera: {
						title: '需开启相机权限',
						subtitle: '相机权限',
						desc: '拍照需要使用相机，请开启“相机权限”!',
						icon: 'xiangji-mian'
					},
					photoLibrary: {
						title: '需开启存储权限',
						subtitle: '存储权限',
						desc: '拍照需要存储空间，请开启“存储权限”!',
						icon: 'xiangmu-mian-1'
					},
					location: {
						title: '需开启定位权限',
						subtitle: '定位权限',
						desc: '拍照需要水印，请开启“位置服务”!',
						icon: 'weizhi-mian'
					},
					appLocation: {
						title: '需开启定位权限',
						subtitle: '定位权限',
						desc: '拍照需要水印，请开启“位置服务”!',
						icon: 'weizhi-mian'
					},
				}
			}
		},
		computed: {
			dialogMsg() {
				return this.dialog[this.dialogType]
			}
		},
		methods: {
			async handlePermission() {
				// #ifdef APP-PLUS
				if (plus.os.name === 'iOS' && this.vuex_first === '1') {
					this.$u.vuex('vuex_first', '0')
					this.handlePhoto()
					this.getTime()
					this.getAddress()
					return
				}
				if (!await checkPermission('camera')) {
					this.dialogType = 'camera'
					this.show = true
					return
				}
				// 特殊机型处理，如果是三星手机则不作判断
				if (uni.getSystemInfoSync().brand !== 'Samsung') {
					if (!await checkPermission('photoLibrary')) {
						if (plus.os.name === 'iOS') {
							this.handlePhoto()
						}
						this.dialogType = 'photoLibrary'
						this.show = true
						return
					}
				}
				if (!checkSystemEnableLocation()) {
					this.dialogType = 'location'
					this.show = true
					return
				}
				if (!await checkPermission('location')) {
					this.dialogType = 'appLocation'
					this.show = true
					return
				}
				// #endif
				this.handlePhoto()
				this.getTime()
				this.getAddress()
			},
			handlePhoto() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['camera'],
					success: res => {
						this.drawPhoto(res.tempFilePaths[0])
					}
				})
			},
			async getTime() {
				const { data } = await uni.$u.http.post(getNowDataUrl)
				this.nowTime = data
			},
			getAddress() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: ({ address = {} }) => {
						const { country = '', province, city, district, street, streetNum, poiName } = address
						if (province) {
							this.address = country + province + city + district + street + streetNum + poiName
						} else {
							this.address = '未获取到信息'
						}
					},
					fail: async e => {
						console.log(e)
						if (!checkSystemEnableLocation()) {
							this.dialogType = 'location'
							this.show = true
							return
						}
						if (!await checkPermission('location')) {
							this.dialogType = 'appLocation'
							this.show = true
						}
					}
				})
			},
			drawPhoto(path) {
				uni.getImageInfo({
					src: path,
					success: res => {
						const ctx = uni.createCanvasContext('cameraCanvas')
						//设置画布宽高
						this.canvasW = res.width
						this.canvasH = res.height
						ctx.drawImage(path, 0, 0, res.width, res.height)

						ctx.setFillStyle('#ffffff')
						ctx.fillRect(30, res.height - 190, 10, 160)

						const fontFamily = uni.getSystemInfoSync().platform === 'ios' ? 'Sthginkra' : 'DingTalkJinBuTi'
						ctx.font = `normal 30px  ${fontFamily}`

						ctx.setFontSize(30) // 设置字体大小
						ctx.setFillStyle('#ffffff') // 设置颜色为白色
						ctx.fillText(`服务人员：${this.vuex_user.username}`, 60, res.height - 150)

						ctx.setFontSize(30) // 设置字体大小
						ctx.setFillStyle('#ffffff') // 设置颜色为白色
						ctx.fillText(`服务地点：${this.address}`, 60, res.height - 100)

						ctx.setFontSize(30) // 设置字体大小
						ctx.setFillStyle('#ffffff') // 设置颜色为白色
						ctx.fillText(`服务时间：${this.nowTime}`, 60, res.height - 50)

						ctx.draw(false, () => {
							uni.canvasToTempFilePath({
								canvasId: 'cameraCanvas',
								destWidth: this.canvasW * 2, // 展示图片尺寸=画布尺寸1*像素比2
								destHeight: this.canvasH * 2,
								success: ({ tempFilePath }) => {
									this.savePhoto(tempFilePath)
								},
								fail: e => {
									console.log(e)
								}
							})
						})
					}
				})
			},
			savePhoto(filePath) {
				uni.saveImageToPhotosAlbum({
					filePath,
					success: () => {
						uni.showToast({ title: '照片已保存到相册', icon: 'none', })
					},
					fail: e => {
						console.log(e)
					}
				})
			},
			cancel() {
				uni.showToast({ title: `${this.dialogMsg.subtitle}未开启，无法使用该功能`, icon: 'none' })
			},
			confirm() {
				if (this.dialogType === 'location') {
					gotoSystemLocatonSetting()
					return
				}
				gotoAppPermissionSetting()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.camera-canvas {
		position: absolute;
		top: -999999rpx;
		width: 100%;
	}

	.icon {
		width: 40px;
		height: 40px;
		background: #FFF9F0;
		border-radius: 50%;
	}

	.subtitle {
		color: $u-main-color;
	}

	.desc {
		font-size: 12px;
		color: $u-tips-color;
	}
</style>