<template>
	<view>
		<u-navbar title="忘记密码" placeholder bgColor="transparent">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>

		<view v-if="currentStep =='checkPhone'">
			<view class="tips">
				<u--text text="为了保证您的账号安全，需先进行您的身份，验证成功后可进行重置密码操作。" color="#E96848"></u--text>
			</view>

			<view class="base-box">
				<u--form labelWidth="80" :model="phoneForm" ref="phoneForm" :rules="phoneRules">
					<u-form-item prop="phone" label="联系电话">
						<u-input v-model="phoneForm.phone" clearable maxlength="32" border="none" placeholder="请输入联系电话"
							@input="inexistence = false">
						</u-input>
					</u-form-item>
					<text v-if="inexistence" class="phone-tips">该手机号不存在，请先注册~</text>
					<u-form-item prop="code" label="验证码">
						<u-input v-model="phoneForm.code" clearable maxlength="4" border="none" placeholder="请输入获取的验证码">
							<template slot="suffix">
								<u-code :seconds="60" ref="uCode" @start="disabled = true" @end="disabled = false"
									@change="codeChange"></u-code>
								<text @tap="getCode" :text="codeTips" class="btn-get-code" :disabled="disabled">{{codeTips}}</text>
							</template>
						</u-input>
					</u-form-item>
				</u--form>
			</view>
			<view class="footer fixed-footer u-flex">
				<u-button type="primary" text="下一步" class="btn-submit" @click="handleNext"></u-button>
			</view>
		</view>

		<view v-if="currentStep =='resetPassword'">
			<view class="tips">
				<u--text text="身份验证成功，请输入新密码进行重置" color="#FF9E4D"></u--text>
			</view>

			<view class="base-box">
				<u--form labelWidth="120" :model="passwordForm" ref="passwordForm" :rules="passwordRules">
					<u-form-item prop="newPassword" label="新密码" borderBottom>
						<u-input v-model="passwordForm.newPassword" password clearable maxlength="16" border="none"
							placeholder="8-16位数字字母组合">
						</u-input>
					</u-form-item>
					<u-form-item prop="newPassword2" label="再次输入新密码" borderBottom>
						<u-input v-model="passwordForm.newPassword2" password clearable maxlength="16" border="none"
							placeholder="请再次输入新密码">
						</u-input>
					</u-form-item>
				</u--form>
			</view>
			<view class="footer fixed-footer u-flex">
				<u-button type="primary" text="确认重置" class="btn-submit" @click="handleReset"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		sendCodeUrl,
		validatePhoneCodeUrl,
		resetPasswordUrl
	} from '@/api'

	export default {
		data() {
			return {
				currentStep: 'checkPhone',
				codeTips: '',
				disabled: false,
				inexistence: false,
				phoneForm: {
					phone: '',
					code: ''
				},
				passwordForm: {
					phone: '',
					newPassword: '',
					newPassword2: ''
				},
				phoneRules: {
					phone: [{
							required: true,
							message: '请输入联系电话',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value)
							},
							message: '联系电话不正确',
							trigger: ['blur'],
						}
					],
					code: {
						type: 'string',
						required: true,
						message: '请填写验证码',
						trigger: ['blur']
					},
				},
				passwordRules: {
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
						validator: (rule, value, callback) => {
							return this.passwordForm.newPassword == value
						},
						message: '两次密码输入不一致，请重新输入~',
						trigger: ['change', 'blur'],
					},
				},
			}
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			},
			handleNext() {
				this.$refs.phoneForm.validate().then(async () => {
					const {
						code,
						msg
					} = await uni.$u.http.post(validatePhoneCodeUrl, this
						.phoneForm, { header: { 'Content-Type': 'application/x-www-form-urlencoded' } })
					if (code === 200) {
						this.currentStep = 'resetPassword'
						this.$refs.passwordForm.setRules(this.passwordRules)
					} else {
						uni.$u.toast(msg)
					}
				})
			},
			handleReset() {
				this.passwordForm.phone = this.phoneForm.phone
				this.$refs.passwordForm.validate().then(async () => {
					const { msg } = await uni.$u.http.post(resetPasswordUrl, this
						.passwordForm, { header: { 'Content-Type': 'application/x-www-form-urlencoded' } })
					uni.$u.toast(msg)
				})
			},
			getCode() {
				this.$refs.phoneForm.validateField('phone', errorsRes => {
					if (errorsRes.length == 0) {
						this.sendCode()
					}
				})
			},
			async sendCode() {
				if (!this.$refs.uCode.canGetCode) {
					uni.$u.toast('倒计时结束后再发送')
					return
				}
				uni.showLoading({ title: '正在获取验证码' })
				try {
					const { data } = await uni.$u.http.post(sendCodeUrl, this
						.phoneForm, { header: { 'Content-Type': 'application/x-www-form-urlencoded' } })
					uni.$u.toast(data)
					this.$refs.uCode.start()
				} catch (err) {
					if (err.msg === '该手机号不存在，请先注册') {
						this.inexistence = true
					}
				} finally {
					uni.hideLoading()
				}
			},
			codeChange(text) {
				this.codeTips = text
			},
		},
		onReady() {
			this.$refs.phoneForm.setRules(this.phoneRules)
			// this.$refs.passwordForm.setRules(this.passwordRules)
		},
	}
</script>

<style lang="scss" scoped>
	.tips {
		margin: 12px 16px;
		font-size: 14px;
		font-weight: 400;
	}

	.btn-get-code {
		color: $u-primary;
		border: 0 !important;
	}

	.footer {
		background: none;
		padding: 10px 70px;
		box-shadow: none !important;
	}

	.btn-submit {
		height: 40px;
		border-radius: 8px;
	}

	.phone-tips {
		display: block;
		font-size: 12px;
		color: #e96848;
		
	}

	/deep/ .u-form-item__body__left__content__label {
		font-size: 14px
	}

	/deep/ .u-form-item__body__right__message {
		margin: 0 !important;
		margin-top: 3px !important;
	}
	/deep/ .u-form-item__body {
		border-bottom: 1px solid #f5f3f0;
	}
</style>