<template>
	<view>
		<u-navbar title="修改密码" placeholder bgColor="transparent">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
			<view slot="right" class="u-flex">
				<u-button type="text" class="btn-save" @click="handleSave" :loading="loading"
					:disabled="disabledFlag">保存</u-button>
			</view>
		</u-navbar>

		<view class="tips">
			<u--text text="说明：该密码是用于助老员APP、服务人员APP、养老信息化平台(三者通用)" color="#E96848"></u--text>
		</view>

		<view>
			<u--form labelWidth="120" :model="form" ref="form" :rules="rules">
				<view class="base-box">
					<u-form-item prop="oldPassword" label="原密码" borderBottom>
						<u-input v-if="inputType === 'password'" type="password" v-model="form.oldPassword" clearable maxlength="16"
							border="none" placeholder="请输入原密码">
							<template slot="suffix" v-if="eyeShowFlag">
								<u-icon :name="aIcon('yincang-xian')" width="24" height="24" @click="handleInputTypeChange"></u-icon>
							</template>
						</u-input>

						<u-input v-else v-model="form.oldPassword" clearable key="12" maxlength="16" border="none"
							placeholder="请输入原密码">
							<template slot="suffix" v-if="eyeShowFlag">
								<u-icon :name="aIcon('xianshi-xian')" width="24" height="24" @click="handleInputTypeChange"></u-icon>
							</template>
						</u-input>
					</u-form-item>
				</view>
				<view class="base-box">
					<u-form-item prop="newPassword" label="新密码" borderBottom>
						<u-input v-model="form.newPassword" password clearable maxlength="16" border="none"
							placeholder="8-16位数字字母组合">
						</u-input>
					</u-form-item>
					<u-form-item prop="newPassword2" label="再次输入新密码" borderBottom>
						<u-input v-model="form.newPassword2" password clearable maxlength="16" border="none" placeholder="请再次输入新密码">
						</u-input>
					</u-form-item>
				</view>
			</u--form>
		</view>
	</view>
</template>

<script>
	import { savePasswordUrl } from '@/api'
	export default {
		data() {
			return {
				loading: false,
				inputType: 'password',
				eyeType: 'yincang-xian',
				form: {
					oldPassword: '',
					newPassword: '',
					newPassword2: ''
				},
				rules: {
					oldPassword: {
						type: 'string',
						required: true,
						message: '请输入原密码',
						trigger: ['change', 'blur']
					},
					newPassword: [{
						type: 'string',
						required: true,
						message: '请输入新密码',
						trigger: ['change', 'blur'],
					}, {
						pattern: /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}/g,
						transform(value) {
							return String(value)
						},
						message: '请输入8-16位包含数字与字母的密码~',
						trigger: ['change', 'blur'],
					}],
					newPassword2: {
						validator: (rule, value) => {
							return this.form.newPassword === value
						},
						message: '两次密码输入不一致，请重新输入~',
						trigger: ['change', 'blur'],
					},
				},
			}
		},
		computed: {
			disabledFlag() {
				const {
					oldPassword,
					newPassword,
					newPassword2
				} = this.form
				return !oldPassword || !newPassword || !newPassword2
			},
			eyeShowFlag() {
				const { oldPassword } = this.form
				return oldPassword
			}
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			},
			handleSave() {
				this.$refs.form.validate().then(() => {
					this.submit()
				})
			},
			handleInputTypeChange() {
				// TODO uview password 的切换好像有点 bug，后续看看
				this.inputType = this.inputType === 'password' ? 'text' : 'password'
				this.eyeType = this.eyeType === 'yincang-xian' ? 'xianshi-xian' : 'yincang-xian'
			},
			async submit() {
				this.loading = true
				try {
					const { msg } = await uni.$u.http.post(savePasswordUrl, this
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

	.tips {
		margin: 12px 16px;
		font-size: 14px;
		font-weight: 400;
	}

	.base-box {
		padding-top: 0;
	}

	/deep/ .u-form-item__body__left__content__label {
		font-size: 14px
	}

	/deep/ .u-form-item__body__right__message {
		margin: 0 !important;
	}
</style>