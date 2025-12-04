<template>
	<view>
		<u-navbar title="组织信息" placeholder bgColor="transparent">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>

		<view class="base-box">
			<view class="title">组织信息</view>
			<u-cell-group :border="false">
				<u-cell title="岗位" :value="this.vuex_post_name.join('、')"></u-cell>
				<u-cell title="部门(组织)" :value="this.vuex_user.dept.name"></u-cell>
				<u-cell title="角色" :value="this.vuex_roles_name.join('、')"></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		padding-bottom: 12px;
		color: $u-main-color;
		font-size: 16px;
		font-weight: bold;
	}

	/deep/ .u-cell__body {
		padding: 10px 0;
		align-items: flex-start;
	}

	/deep/ .u-cell__body__content {
		width: 100px;
		flex: inherit;
	}

	/deep/ .u-cell__value {
		text-align: left;
	}
</style>