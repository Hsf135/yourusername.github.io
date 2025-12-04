<template>
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
</template>

<script>
	import {
		checkPermission,
		checkSystemEnableLocation,
		gotoSystemLocatonSetting,
		gotoAppPermissionSetting
	} from '@/utils/permission'

	export default {
		name: 'r-location',
		data() {
			return {
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
						desc: '获取服务地址，请开启“位置服务”!',
						icon: 'weizhi-mian'
					},
					appLocation: {
						title: '需开启定位权限',
						subtitle: '定位权限',
						desc: '获取服务地址，请开启“位置服务”!',
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
			getAddress() {
				return new Promise(async (resolve, reject) => {
					if (!checkSystemEnableLocation()) {
						this.dialogType = 'location'
						this.show = true
						return reject()
					}
					if (!await checkPermission('location')) {
						this.dialogType = 'appLocation'
						this.show = true
						return reject()
					}
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						isHighAccuracy: true,
						success: ({ longitude, latitude, address = {} }) => {
							let fullAddress = ''
							const { country = '', province, city, district, street, streetNum, poiName } = address
							if (province) {
								fullAddress = country + province + city + district + street + streetNum + poiName
							}
							resolve({ longitude, latitude, address: fullAddress })
						},
						fail: async e => {
							console.log(e)
							if (!checkSystemEnableLocation()) {
								this.dialogType = 'location'
								this.show = true
								return reject()
							}
							if (!await checkPermission('location')) {
								this.dialogType = 'appLocation'
								this.show = true
								reject()
							}
						}
					})
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

</style>