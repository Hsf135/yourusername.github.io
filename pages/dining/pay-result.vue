<template>
	<view class="pay-result">
		<u-navbar title="支付结果" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<view class="result-box">
			<image src="../../static/imgs/common/success.png" class="success-img"></image>
			<text class="u-main-color">支付成功</text>
		</view>
		<view class="ope-box">
			<navigator :url="`/pages/dining/detail?id=${orderId}`" class="ope-btn u-m-b-12">订单详情</navigator>
			<navigator url="/pages/dining/search-old-man" class="ope-btn">重新点餐</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad ({ id }) {
			this.orderId = id
		},
		data () {
			return {
				orderId: ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.result-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 60px;
	}
	
	.success-img {
		width: 136px;
		height: 98px;
		margin-bottom: 20px;
	}
	
	.ope-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 60px;
	}
	
	.ope-btn {
		width: 240px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
		border: 1px solid $u-primary;
		color: $u-primary;
		border-radius: 8px;
	}
</style>