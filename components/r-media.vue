<template>
	<view class="r-media">
		<view class="list-box" :style="`grid-template-columns: repeat(auto-fill, ${size});`">
			<view class="media-item" :style="{ height: size }" v-for="(item, index) in value" :key="item.id">
				<image :src="getFullImg(item.path)" class="img" v-if="isImage(item)" @click="handlePreview(item, index)"></image>
				<video :src="getFullImg(item.path)" class="img" style="border-radius: 8px;" :controls="false" v-else @click="handlePreview(item, index)"></video>
				<view class="remove-btn" @click.stop="handleRemove(index)"><u-icon name="close" color="#fff" :size="14"></u-icon></view>
			</view>
			<view class="media-item add-btn" :style="{ height: size }" @click="handleUploadClick">
				<u-icon name="plus" color="#ff9500" size="24"></u-icon>
				<text class="u-m-t-8">传照片/视频</text>
			</view>
			<view class="media-item limit-box">{{value.length}}/{{limit}}</view>
		</view>
		<r-dialog v-model="show" title="温馨提示" cancelText="取消" confirmText="确认" @cancel="show = false" @confirm="confirmDel">
			<view slot="content" class="u-flex u-flex-center">
				<text>是否确认移除该图片？</text>
			</view>
		</r-dialog>
		<!-- <u-popup :show="showPreview" mode="center">
			<view class="color-fff" :style="{ paddingTop: `calc(${barHeight + 10}px)` }">{{previewIndex}}/{{value.length}}</view>
			<swiper class="swiper" :style="{ height: `calc(100vh - ${barHeight + 10}px)` }">
				<swiper-item v-for="item in value" :key="item.id" class="swiper-item">
					<image :src="getFullImg(item.path)" class="preview-image" v-if="isImage(item)"></image>
					<video :src="getFullImg(item.path)" class="preview-image" v-else></video>
				</swiper-item>
			</swiper>
		</u-popup> -->
	</view>
</template>

<script>
	import { uploadUrl } from '@/api'
	
	export default {
		props: {
			size: { type: String, default: '64px' },
			value: { type: Array, required: true },
			limit: { type: Number, default: 10 },
			showLimit: { type: Boolean, default: true }
		},
		data () {
			return {
				previewIndex: 0,
				show: false,
				imgIndex: 0,
				showPreview: false
			}
		},
		methods: {
			// 上传图片删除方法
			handleRemove(index) {
				this.imgIndex = index
				this.show = true
			},
			confirmDel() {
				const list = [...this.value]
				list.splice(this.imgIndex, 1)
				this.$emit('input', list)
			},
			handlePreview (item, index) {
				// this.previewIndex = index + 1
				// this.showPreview = true
				uni.previewMedia({
					urls: this.value.map(i => this.getFullImg(i.path)),
					current: index,
					indicator: 'number'
				})
			},
			overTips () {
				uni.showToast({
					title: `仅限上传${this.limit}份照片/视频`,
					icon: 'none',
					duration: 3000
				})
			},
			isImage (item) {
				const arr = item.path.split('.')
				const suffix = arr[arr.length - 1].toLowerCase()
				return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp'].includes(suffix)
			},
			handleUploadClick () {
				if (this.value.length >= 10) {
					this.overTips()
					return
				}
				uni.showActionSheet({
					title: '提示',
					itemList: ['拍摄视频', '拍摄照片', '从相册选择视频', '从相册选择照片'],
					success: e => {
						if (e.tapIndex === 0) {
							this.chooseVideo()
						} else if (e.tapIndex === 1) {
							this.chooseImage()
						} else if (e.tapIndex === 2) {
							this.chooseVideoByAlbum()
						} else {
							this.chooseImageByAlnum()
						}
					}
				})
			},
			chooseVideo () {
				uni.chooseVideo({
					sourceType: ['camera'],
					maxDuration: 60,
					success: async e => {
						const data = await this.upload(e.tempFilePath)
						const list = [...this.value]
						list.push(data)
						this.$emit('input', list)
					}
				})
			},
			chooseImage () {
				uni.chooseImage({
					sourceType: ['camera'],
					sizeType: ['compressed'],
					success: async e => {
						const data = await this.upload(e.tempFilePaths[0])
						const list = [...this.value]
						list.push(data)
						this.$emit('input', list)
					}
				})
			},
			chooseVideoByAlbum () {
				uni.chooseVideo({
					sourceType: ['album'],
					success: async e => {
						const data = await this.upload(e.tempFilePath)
						const list = [...this.value]
						list.push(data)
						this.$emit('input', list)
					}
				})
			},
			chooseImageByAlnum () {
				uni.chooseImage({
					count: 9,
					sourceType: ['album'],
					sizeType: ['compressed'],
					success: async e => {
						if (e.tempFilePaths.length + this.value.length > this.limit) {
							this.overTips()
							return
						}
						const arr = []
						e.tempFilePaths.forEach(file => {
							arr.push(this.upload(file))
						})
						const datas = await Promise.all(arr)
						const list = [...this.value]
						datas.forEach(i => {
							list.push(i)
						})
						this.$emit('input', list) 
					}
				})
			},
			upload (filePath) {
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '上传中...'
					})
					uni.uploadFile({
						url: uploadUrl,
						filePath,
						name: 'file',
						header: { 'Authorization': this.vuex_token },
						success: ({ data }) => {
							data = JSON.parse(data)
							resolve(data.data)
						},
						fail: err => {
							reject(err)
						},
						complete: () => {
							uni.hideLoading()
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.r-media {
		.list-box {
			display: grid;
			gap: 8px;
		}
		.media-item {
			border-radius: 8px;
			position: relative;
		}
		.limit-box {
			display: flex;
			align-items: flex-end;
			color: #999;
		}
		.img {
			width: 100%;
			height: 100%;
			border-radius: 8px;
			display: block;
		}
		video {
			border-radius: 8px;
		}
		.add-btn {
			background-color: #f4f5f7;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 10px;
		}
		.remove-btn {
			position: absolute;
			top: 0;
			right: 0;
			width: 20px;
			height: 20px;
			border-bottom-left-radius: 100px;
			border-top-right-radius: 8px;
			background-color: #373737;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 20;
		}
	}
	.swiper {
		width: 100vw;
	}
	.swiper-item {
		width: 100%;
		height: 100%;
	}
	.preview-image {
		width: 100%;
	}
</style>
