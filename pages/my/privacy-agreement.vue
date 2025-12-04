<template>
	<view class="privacy">
		<u-navbar title="隐私协议" placeholder bgColor="#faf9f7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<scroll-view scroll-y="true" class="container" :style="{ height: `calc(100vh - 94px - ${barHeight}px)` }">
			<view class="content" v-html="detail.content" v-if="detail.content"></view>
			<view class="empty-box" v-if="!loading && !detail.content">
				<image src="../../static/imgs/common/data-empty.png" class="empty-img"></image>
				<text class="u-tips-color">获取隐私协议失败</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { getPrivacyAgreementUrl } from '@/api/index.js'
	
	export default {
		onLoad () {
			this.loadData()
		},
		data () {
			return {
				detail: {
					content: ''
				},
				loading: false
			}
		},
		methods: {
			async loadData () {
				try {
					this.loading = true
					const { data } = await uni.$u.http.post(getPrivacyAgreementUrl)
					if (data && data.length) {
						this.detail = data[0]
					}
				} finally {
					this.loading = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.privacy {
		padding: 0 16px;
	}
	
	.empty-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 0;
	}
	
	.empty-img {
		width: 146px;
		height: 120px;
		margin-bottom: 20px;
	}
	
	.container {
		box-sizing: border-box;
		background-color: #fff;
		padding: 12px;
		border-radius: 8px;
	}
	
	.content {
		white-space: pre-wrap;
		color: $u-main-color;
		line-height: 1.6;
	}
</style>
