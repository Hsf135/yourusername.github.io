<template>
	<view>
		<u-navbar title="设置" placeholder bgColor="transparent">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>

		<view class="logo">LOGO</view>
		<view class="app-version">当前版本：{{currentVersion}}</view>

		<view class="cell-box">
			<u-cell-group :border="false">
				<u-cell :icon="aIcon('xiugai')" title="修改密码" :border="false" isLink :rightIcon="aIcon('xiala-zuo')"
					@click="toPage('/pages/my/change-password')"></u-cell>
				<u-cell :icon="aIcon('shengji')" title="升级" :border="false">
					<view slot="value">
						<text class="u-tips-color" v-if="isNewest">已是最新版</text>
						<view class="u-flex" v-else  @click="downloadToast(apkUrl, true)">
							<text class="u-primary">需要升级 {{newestVersion}}</text>
							<u-icon :name="aIcon('xiala-zuo')"></u-icon>
						</view>
					</view>
				</u-cell>
				<u-cell :icon="aIcon('yinsixieyi')" title="隐私协议" :border="false" isLink :rightIcon="aIcon('xiala-zuo')"
					@click="toPage('/pages/my/privacy-agreement')"></u-cell>
				<!--
				<u-cell :icon="aIcon('yonghuxieyi')" title="用户协议" :border="false" isLink
					:rightIcon="aIcon('xiala-zuo')"></u-cell>
				<u-cell :icon="aIcon('zhuxiao')" title="注销账户" :border="false" isLink :rightIcon="aIcon('xiala-zuo')"></u-cell> -->
			</u-cell-group>
		</view>
		<view class="footer fixed-footer u-flex">
			<u-button type="primary" text="退出登录" class="btn-loginOut" @click="handleLoginOut"></u-button>
		</view>
		<r-dialog :value="visibleLoginOut" :title="'是否退出账号'" :content="'退出登录后我们还会继续保留您的账户数据的，记得常回来看看哦！'"
			@cancel="handleLoginOutCancle" @input="handleLoginOutCancle">
			<template slot="confirm">
				<u-button type="primary" text="退出" class="btn-confirm" @click="handleConfirm"></u-button>
			</template>
		</r-dialog>
	</view>
</template>

<script>
	import { upgradeMixin } from '@/mixins'
	export default {
		mixins: [upgradeMixin],
		data() {
			return { visibleLoginOut: false }
		},
		onLoad () {
			this.updateVersion()
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			},
			toPage(url) {
				uni.navigateTo({ url })
			},
			async handleLoginOut() {
				this.visibleLoginOut = true
			},
			handleLoginOutCancle() {
				this.visibleLoginOut = false
			},
			async handleConfirm() {
				this.$u.vuex('vuex_token', '')
				this.$u.vuex('vuex_user', {})
				uni.reLaunch({ url: '/pages/login/login' })
			}
		}
	}
</script>

<style lang="scss">
	.logo {
		width: 80px;
		height: 80px;
		background: #fff9f0;
		border: 1px solid #ff9500;
		border-radius: 24px;
		margin: 70px auto 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		font-weight: 500;
		color: #ff9500;
	}

	.app-version {
		text-align: center;
		margin: 12px 0 24px;
		font-size: 14px;
		font-weight: 400;
		color: #666462;
	}

	.cell-box {
		margin: 0 15px;
		padding: 10px 0;
		background: #fff;
		border-radius: 8px;
	}

	ss .footer {
		background: none;
		padding: 10px 70px 20pxssss;
		box-shadow: none !important;
	}

	.btn-loginOut {
		height: 40px;
		border-radius: 8px;
		background: #ffffff !important;
		border: 1px solid #e96848 !important;
		font-size: 14px;
		font-weight: 400;
		color: #e96848 !important;
	}

	.btn-confirm {
		background-color: #e96848 !important;
	}
</style>