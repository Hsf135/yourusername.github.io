<template>
	<view class="bg">
		<u-navbar placeholder bgColor="transparent">
			<view slot="left">
				<u-icon :name="aIcon('xiaoxi-xian')" width="24" height="24"></u-icon>
			</view>
			<u-icon slot="right" :name="aIcon('shezhi')" width="24" height="24" @click="toPage('/pages/my/setting')"></u-icon>
		</u-navbar>

		<view class="u-flex-column u-flex-middle u-p-20">
			<u-avatar src="https://cdn.uviewui.com/uview/album/1.jpg" size="72"></u-avatar>
			<view class="u-m-t-8">
				<u--text :text="vuex_user.nickname" bold size="20" suffixIcon="/static/icon/a-mingchengnan.png"
					:iconStyle="iconStyle"></u--text>
			</view>
			<view class="u-m-t-4 u-flex u-flex-center">
				<view class="u-m-r-4">
					<u--text :text="vuex_user.mobile" size="14" color="#666462" :block="false"></u--text>
				</view>
				<u-icon :name="aIcon('bianji1')" width="16" height="16" @click="toPage('/pages/my/change-phone')"></u-icon>
			</view>
		</view>

		<view class="cell-box">
			<u-cell-group :border="false">
				<!-- <u-cell :icon="aIcon('wodezijin')" title="我的资金" :border="false" isLink :rightIcon="aIcon('xiala-zuo')"></u-cell>
				<u-cell :icon="aIcon('gouwu-xian')" title="欢孝商城" :border="false" isLink
					:rightIcon="aIcon('xiala-zuo')"></u-cell>
				<u-cell :icon="aIcon('shenfenxinxi')" title="身份信息" :border="false" isLink :rightIcon="aIcon('xiala-zuo')">
					<view slot="value">
						<u--text text="审核通过" size="14" color="#5CD7A8"></u--text>
					</view>
				</u-cell>
				<u-cell :icon="aIcon('zhengshu')" title="证书信息" :border="false" isLink :rightIcon="aIcon('xiala-zuo')">
					<view slot="value">
						<u--text text="去完善" size="14" color="#999693"></u--text>
					</view>
				</u-cell>
				<u-cell :icon="aIcon('fuwu-xian')" title="服务信息" :border="false" isLink :rightIcon="aIcon('xiala-zuo')">
					<view slot="value">
						<u--text text="去修改" size="14" color="#999693"></u--text>
					</view>
				</u-cell> -->
				<u-cell :icon="aIcon('zuzhixinxi')" title="组织信息" :border="false" isLink :rightIcon="aIcon('xiala-zuo')"
					@click="toPage('/pages/my/organization-info')">
					<view slot="value">
						<u--text v-if="vuex_user.dept" :text="vuex_user.dept.name" size="14" color="#999693"></u--text>
					</view>
				</u-cell>
				<u-cell :icon="aIcon('jiaose')" title="角色" :border="false" :value="vuex_roles_name.join('、')">
					<view slot="value">
						<u--text :text="vuex_roles_name.join('、')" size="14" color="#999693" lines="1"></u--text>
					</view>
				</u-cell>
				<u-cell :icon="aIcon('zhanghao')" title="当前账号" :border="false" :value="vuex_user.username"></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import { getInfoUrl } from '@/api'

	export default {
		data() {
			return { iconStyle: { width: '18px', height: '18px', marginLeft: '5px' } }
		},
		onShow() {
			this.loadData()
		},
		methods: {
			async loadData() {
				const { user } = await uni.$u.http.get(getInfoUrl)
				this.$u.vuex('vuex_user', user)
			},
			toPage(url) {
				uni.navigateTo({ url })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		overflow: hidden;
		height: 100vh;
		background: url('/static/imgs/my/bg.png') no-repeat;
		background-size: 100% 400px;
	}

	.cell-box {
		margin: 0 15px;
		padding: 10px 0;
		background: #fff;
		border-radius: 8px;
	}
	
	/deep/ .u-cell__title {
		min-width: 60px;
	}
</style>