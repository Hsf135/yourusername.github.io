<template>
	<view>
		<u-navbar title="无感应结果" placeholder bgColor="#faf9f7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<view class="img-box">
			<image src="../../static/imgs/visiting/no-response.png" class="img"></image>
		</view>
		<view class="u-main-color u-text-center">NFC感应成功，但未查找到该卡信息</view>
		<view class="info-box">
			<view class="info">
				<view>可能原因:</view>
				<view>1、未在后台系统中录入该卡信息；</view>
				<view>2、该卡暂未绑定老人；</view>
				<view>3、该卡不属于当前项目地区。</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
			}
		}
	}
</script>

<style lang="scss" scoped>
	.img-box {
		padding: 64px 0 24px 0;
		display: flex;
		justify-content: center;
	}
	
	.img {
		width: 148px;
		height: 88px;
	}
	
	.info-box {
		display: flex;
		justify-content: center;
		margin-top: 40px;
	}
	
	.info {
		line-height: 1.8;
		font-size: 12px;
		color: $u-tips-color;
	}
</style>
