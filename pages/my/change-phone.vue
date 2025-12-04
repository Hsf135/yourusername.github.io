<template>
	<view>
		<u-navbar title="修改联系方式" placeholder bgColor="transparent">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
			<view slot="right" class="u-flex">
				<u-button type="text" class="btn-save" @click="handleSave" :loading="loading" :disabled="disabledFlag">保存</u-button>
			</view>
		</u-navbar>

		<view>
			<u--form labelWidth="120" :model="form" ref="form" :rules="rules">
				<view class="base-box">
					<u-form-item prop="mobile" label="联系电话" borderBottom>
						<u-input v-model="form.mobile" clearable maxlength="16" border="none" placeholder="请输入联系电话">
						</u-input>
					</u-form-item>
				</view>
			</u--form>
		</view>
	</view>
</template>

<script>
	import { changeMobileUrl } from '@/api'
	import { phoneEncrypted } from '@/utils'

	export default {
		data() {
			return {
				loading: false,
				form: { mobile: '' },
				rules: {
					mobile: [{
							required: true,
							message: '请输入联系电话',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value) => {
								return uni.$u.test.mobile(value)
							},
							message: '联系电话不正确',
							trigger: ['change', 'blur'],
						}
					]
				},
			}
		},
		computed: {
			disabledFlag() {
				return !this.form.mobile
			}
		},
		onLoad() {
			if (this.vuex_user.mobile) {
				this.form.mobile = this.vuex_user.mobile
			}
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			},
			handleSave() {
				if (this.form.mobile.includes('*')) {
					uni.navigateBack()
					return
				}
				this.$refs.form.validate().then(() => {
					this.submit()
				})
			},
			async submit() {
				this.loading = true
				try {
					this.form.id = this.vuex_user.id
					const { msg } = await uni.$u.http.post(changeMobileUrl, this
						.form, { header: { 'Content-Type': 'application/x-www-form-urlencoded' } })
					uni.$u.toast(msg)
					uni.navigateBack()
				} finally {
					this.loading = false
				}
			}
		}
	}
</script>

<style lang="scss">
	.btn-save {
		color: $u-primary !important;
	}


	/deep/ .u-form-item__body__left__content__label {
		font-size: 14px
	}

	/deep/ .u-form-item__body__right__message {
		margin: 0 !important;
	}
</style>