<template>
	<view>
		<u-navbar title="点餐步骤1:选择老人" placeholder bgColor="#faf9f7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<view class="u-p-24 u-main-color u-text-center">请将养老卡靠近手机背部NFC感应区域</view>
		<view class="u-flex u-flex-center u-m-b-10">
			<image src="../../static/imgs/common/nfc.gif" class="nfc-img"></image>
		</view>
		<view class="tips">
			<view>说明:</view>
			<view>1、将卡片<text style="color: #E96848;">紧贴手机背面</text>将自动感应刷卡;</view>
			<view>2、若数据传输失败，可返回上一页，并检查手机网络是否正常手机NFC功能是否正常、手机NFC功能是否正常开启，确认后重新进入本页面尝试刷卡支付;</view>
			<view>3、若需帮助请与集团工作人员联系。</view>
		</view>
	</view>
</template>

<script>
	import { oldManListUrl } from '@/api/dining.js'
	// #ifdef APP-PLUS
	import nfc from '@/utils/nfc-tool.js'
	// #endif

	export default {
		onShow() {
			this.initNfc()
		},
		methods: {
			async loadDetail(code) {
				const { data } = await uni.$u.http.post(oldManListUrl, { internalCode: code })
				if (data && data.length) {
					uni.navigateTo({ url: `/pages/dining/confirm?id=${data[0].memberId}` })
				} else {
					uni.navigateTo({ url: '/pages/dining/nfc-no-response' })
				}
			},
			initNfc() {
				// #ifdef APP-PLUS
				if (uni.$u.os() === 'android') {
					nfc.nfcGetId({
						success: data => {
							this.loadDetail(data)
						},
						fail: title => {
							uni.$u.toast(title)
						}
					})
				} else {
					uni.$u.toast('苹果设备暂不支持该CPU卡读取')
				}
				// #endif
			}
		},
		onHide() {
			// #ifdef APP-PLUS
			plus.globalEvent.removeEventListener('newintent')
			plus.globalEvent.removeEventListener('pause')
			plus.globalEvent.removeEventListener('resume')
			// #endif
		},
		// 销毁监听事件 避免重新进入页面重复读卡
		beforeDestroy() {
			// #ifdef APP-PLUS 
			plus.globalEvent.removeEventListener('newintent')
			plus.globalEvent.removeEventListener('pause')
			plus.globalEvent.removeEventListener('resume')
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	.nfc-img {
		width: 200px;
		height: 430px;
	}

	.tips {
		font-size: 12px;
		color: $u-content-color;
		padding: 0 16px 40px 16px;
		line-height: 1.8;
	}
</style>