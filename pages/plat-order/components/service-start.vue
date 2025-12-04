<template>
	<view class="add-page">
		<u-navbar title="开始服务确认" placeholder bgColor="#FAF9F7">
			<view slot="left" class="u-flex">
				<text class="u-tips-color" @click="handleBack">取消</text>
			</view>
			<view slot="right" class="u-flex">
				<text class="u-primary" @click="handleConfirm">确认</text>
			</view>
		</u-navbar>

		<view class="add-card u-flex">
			<text>服务工单号： </text>
			<u-input v-model="serveNo" placeholder="20字以内数字或字母" :maxlength="20" border="none" :formatter="handleServeNo"></u-input>
		</view>

		<view class="add-card">
			<r-textarea v-model="form.startServeRemark" count :maxlength="300" placeholder="请输入内容(非必填)" class="min-textarea"></r-textarea>
		</view>

		<view class="add-card">
			<r-upload v-model="form.startServePhotos" :imgList="startServePhotosAttach" :maxCount="3" :width="56" />
		</view>

		<r-dialog v-model="startShow" title="确认开始服务？" cancelText="取消" confirmText="确定" @cancel="startShow = false" @confirm="dialogConfirm">
			<view slot="content" class="u-flex">
				<text class="u-text-center" v-if="form.startServePhotos">提交后不可修改状态，请确保已到达服务时间和地址。是否确认开始服务?</text>
				<text class="u-text-center" v-else>是否确认不上传图片?</text>
			</view>
		</r-dialog>

		<r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false" @confirm="toBack">
			<view slot="content">
				<text class="u-text-center">当前页面已做出修改，是否不保存就退出</text>
			</view>
		</r-dialog>
		
		<r-location ref="rLocation" />
	</view>
</template>

<script>
	import { getOrderDetailUrl, statusOperateUrl, updateServeNoUrl } from '@/api'

	export default {
		data() {
			return {
				unsave: false,
				startShow: false,
				show: false,
				loading: false,
				serveNo: '',
				isFirst: true,
				form: { startServePhotos: '', startServeRemark: '', statusCode: '6', startOrderAddress: '河北省秦皇岛市昌黎县靖安镇靖安南村' },
				startServePhotosAttach: []
			}
		},
		watch: {
			form: {
				handler: function() {
					this.unsave = true
				},
				deep: true
			}
		},
		onLoad({ id }) {
			this.form.serveorderId = id
			this.loadData()
		},
		methods: {
			async loadData() {
				const { data } = await uni.$u.http.post(`${getOrderDetailUrl}?id=${this.form.serveorderId}`)
				this.serveNo = data.serveNo || ''
				this.isFirst = !data.startOrderTime
				if (!this.isFirst) {
					this.startServePhotosAttach = data.startServePhotosAttach || []
					this.form.startServeRemark = data.startServeRemark
				}
			},
			handleBack() {
				if (this.unsave) {
					this.show = true
					return
				}
				uni.navigateBack()
			},
			toBack() {
				uni.navigateBack()
			},
			async handleConfirm() {
				if (this.isFirst) {
					const { longitude, latitude, address } = await this.$refs.rLocation.getAddress()
					this.form.startLongitude = longitude
					this.form.startLatitude = latitude
					this.form.startOrderAddress = address
					this.startShow = true
					return
				}	
				this.dialogConfirm()
			},
			async dialogConfirm() {
				if (!this.serveNo) {
					uni.$u.toast('工单号不能为空')
					return
				}
				await uni.$u.http.post(`${updateServeNoUrl}?id=${this.form.serveorderId}&serveNo=${this.serveNo}`)
				await uni.$u.http.post(statusOperateUrl, this.form)
				uni.$u.toast('操作成功')
				uni.navigateBack()
			},
			handleServeNo(value) {
				return value.replace(/[^a-zA-Z0-9]/g, '')
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

	/deep/ .u-textarea {
		padding: 0;
	}
</style>