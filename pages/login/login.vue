 <template>
 	<view class="login-page">
 		<view class="logo-box">
 			<image class="logo" src="../../static/imgs/login/login-logo.png" mode="aspectFit"></image>
 			<text class="logo-title">欢迎来到欢孝</text>
 			<text class="logo-text">全心服务长者~</text>
 		</view>
 		<view v-if="!phoneLogin">
 			<u--form labelWidth="0" :model="form" :rules="rules" ref="uForm">
 				<u-form-item prop="username">
 					<u-input v-model="form.username" maxlength="32" border="none" :customStyle="inputStyle" placeholder="请输入您的账号" @input="inexistence = false"
 						@focus="usernameClear = true" @blur="usernameClear = false">
 						<u-icon slot="prefix" name="/static/icon/a-mingchengfuwushangguanli-xian.png" width="24" height="24" class="u-m-l-12 u-m-r-12 login-icon"></u-icon>
 					</u-input>
 					<view class="clear-btn" v-show="usernameClear && form.username" @touchend.prevent="handleClear('username')"></view>
 				</u-form-item>
 				<text v-if="inexistence" class="tips">该账号不存在，请先注册~</text>
 				<u-form-item prop="password">
 					<u-input v-model="form.password" maxlength="32" border="none" :password="password" :customStyle="inputStyle" placeholder="请输入密码"
 						@focus="pwdClear = true" @blur="pwdClear = false">
 						<u-icon slot="prefix" name="/static/icon/a-mingchengmima-xian.png" width="24" height="24" class="u-m-l-12 u-m-r-12 login-icon"></u-icon>
 					</u-input>
 					<view class="clear-btn" v-show="pwdClear && form.password" @touchend.prevent="handleClear('password')"></view>
 				</u-form-item>
 			</u--form>
 		</view>

 		<view v-if="phoneLogin">
 			<u--form labelWidth="0" :model="form" :rules="phoneRules" ref="phoneForm">
 				<u-form-item prop="userMobile">
 					<u-input v-model="form.userMobile" maxlength="32" border="none" :customStyle="inputStyle" placeholder="请输入您的手机号码" @input="inexistence = false"
 						@focus="phoneClear = true" @blur="phoneClear = false">
 						<u-icon slot="prefix" name="/static/icon/a-mingchengshouji-xian.png" width="24" height="24" class="u-m-l-12 u-m-r-12 login-icon"></u-icon>
 					</u-input>
 					<view class="clear-btn" v-show="phoneClear && form.userMobile" @touchend.prevent="handleClear('userMobile')"></view>
 				</u-form-item>
 				<text v-if="inexistence" class="tips">该手机号不存在，请先注册~</text>
 				<u-form-item prop="code">
 					<u-input v-model="form.code" maxlength="4" border="none" :customStyle="inputStyle" placeholder="请输入验证码" @focus="codeClear = true"
 						@blur="codeClear = false">
 						<u-icon slot="prefix" name="/static/icon/code.png" width="24" height="24" class="u-m-l-12 u-m-r-12 login-icon"></u-icon>
 						<template slot="suffix">
 							<u-code :seconds="60" type="success" ref="uCode" @start="disabled = true" @end="disabled = false" @change="codeChange"></u-code>
 							<u-button class="codeButton" @tap="getCode" type="text" :disabled="disabled">{{tips}}</u-button>
 							<view class="clear-btn" v-show="codeClear && form.code" @touchend.prevent="handleClear('code')"></view>
 						</template>
 					</u-input>
 				</u-form-item>
 			</u--form>
 		</view>

 		<view class="u-m-t-6 login-regit">
 			<!-- <text style="color: #FF9500;">新用户注册</text> -->
 			<text></text>
 			<text class="forgot-button" v-if="!phoneLogin" @click="handleResetPassword">忘记密码？</text>
 		</view>
 		<view class="u-m-t-24">
 			<u-button :customStyle="loginStyle" type="primary" text="登录" size="large" :loading="loading" @click="submit"></u-button>
 		</view>
 		<view class="u-m-t-24 u-flex u-flex-center">
 			<text class="u-font-14" style="color: #FF9500;" @click="changeLogin">
 				{{ phoneLogin ? '账号密码登录' : '短信验证码登录' }}
 			</text>
 		</view>
 		<u-toast ref="uToast" />
 	</view>
 </template>

 <script>
 	import { loginUrl, phoneLoginUrl, getInfoUrl, getDictUrl, sendCodeUrl, getRouters } from '@/api'

 	export default {
 		data() {
 			return {
 				inputStyle: {
 					height: '48px',
 					background: '#fff',
 					borderRadius: '8px',
 					paddingRight: '10px'
 				},
 				loginStyle: { borderRadius: '8px' },
 				form: { username: '', password: '', userMobile: '', code: '' },
 				password: true,
 				loading: false,
 				rules: {
 					username: [{
 						required: true,
 						message: '账号不可为空',
 						trigger: ['blur', 'change']
 					}],
 					password: [{
 						required: true,
 						message: '密码不可为空',
 						trigger: ['blur', 'change']
 					}]
 				},
 				phoneRules: {
 					userMobile: [{
 							required: true,
 							message: '手机号码不可为空',
 							trigger: ['blur', 'change']
 						},
 						{
 							// 自定义验证函数，见上说明
 							validator: (rule, value, callback) => {
 								// 上面有说，返回true表示校验通过，返回false表示不通过
 								// uni.$u.test.mobile()就是返回true或者false的
 								return uni.$u.test.mobile(value)
 							},
 							message: '手机号码不正确',
 							// 触发器可以同时用blur和change
 							trigger: ['blur', 'change'],
 						}
 					],
 					code: [{
 						required: true,
 						message: '验证码不可为空',
 						trigger: ['blur', 'change']
 					}]
 				},
 				inexistence: false,
 				phoneLogin: false,
 				tips: '',
 				disabled: false,
 				usernameClear: false, // 是否显示清除按钮
 				pwdClear: false, // 是否显示清除按钮
 				phoneClear: false, // 是否显示清除按钮
 				codeClear: false // 是否显示清除按钮
 			}
 		},
 		onLoad() {
 			if (process.env.NODE_ENV === 'development') {
 				this.form = { username: 'liu1', password: '123456' }
 			}
 		},
 		onReady() {
 			this.$refs.uForm.setRules(this.rules)
 		},
 		methods: {
 			submit() {
 				if (this.loading) {
 					return
 				}
 				if (this.phoneLogin) {
 					this.$refs.phoneForm.validate().then(() => {
 						this.handleLogin()
 					})
 					return
 				}
 				this.$refs.uForm.validate().then(() => {
 					this.handleLogin()
 				})
 			},
 			handleClear(key) {
 				this.form[key] = ''
 			},
 			async handleLogin() {
 				try {
 					this.loading = true
 					const url = this.phoneLogin ? phoneLoginUrl : loginUrl
 					const { token } = await uni.$u.http.post(url, this.form)
 					if (token) {
 						this.$u.vuex('vuex_token', token)
 						const { postName, roles, rolesName, user, areaCode, areaProjectCode, singleProject } = await uni.$u.http.get(getInfoUrl)
 						const { data } = await uni.$u.http.post(getDictUrl)
 						const router = await uni.$u.http.get(getRouters)
 						this.$u.vuex('vuex_dict', data)
 						this.$u.vuex('vuex_user', user)
 						this.$u.vuex('vuex_post_name', postName)
 						this.$u.vuex('vuex_roles', roles)
 						this.$u.vuex('vuex_roles_name', rolesName)
 						this.$u.vuex('areaCode', areaCode)
 						this.$u.vuex('areaProjectCode', areaProjectCode)
						// 0代表多项目 1代表单个非项目节点  2代表项目节点
						this.$u.vuex('singleProject', singleProject)
 						if (router.data.find(item => item.name === 'APPMenu')) {
 							this.$u.vuex('vuex_router', router.data.find(item => item.name === 'APPMenu').children)
 						}
 						this.loading = false
 						uni.reLaunch({ url: '/pages/calendar/index' })
 					}
 				} catch (e) {
 					if (e.code === 400 && e.msg.includes('登录用户：')) {
 						this.inexistence = true
 					}
 					this.loading = false
 				}
 			},
 			changeLogin() {
 				this.phoneLogin = !this.phoneLogin
 				this.form = { username: '', password: '', phone: '', code: '' }
 				setTimeout(() => {
 					this.$refs.uForm && this.$refs.uForm.clearValidate()
 					this.$refs.phoneForm && this.$refs.phoneForm.clearValidate()
 					this.disabled = false
 				}, 50)
 			},
 			getCode() {
 				this.$refs.phoneForm.validateField('userMobile', errorsRes => {
 					if (errorsRes.length === 0) {
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
 					const params = { phone: this.form.userMobile }
 					const { data } = await uni.$u.http.post(sendCodeUrl,
 						params, { header: { 'Content-Type': 'application/x-www-form-urlencoded' } })
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
 				this.tips = text
 			},
 			handleResetPassword() {
 				uni.navigateTo({ url: '/pages/login/reset-password' })
 			}
 		}
 	}
 </script>

 <style lang="scss" scoped>
 	.login-page {
 		position: relative;
 		overflow: hidden;
 		box-sizing: border-box;
 		height: 100vh;
 		padding: 124px 44px 34px;
 		background: url('/static/imgs/login/login-bg.png') no-repeat top left;
 		background-size: 100%;
 	}

 	/deep/ .u-form-item__body__right__content__slot {
 		position: relative;
 	}

 	/deep/ .u-input__content__subfix-icon {
 		position: relative;

 		.clear-btn {
 			left: -16px;
 		}
 	}

 	.clear-btn {
 		width: 16px;
 		height: 16px;
 		border-radius: 50%;
 		background: url('/static/icon/a-mingchengguanbi-mian.png') center/100% 100%;
 		position: absolute;
 		right: 10px;
 		top: 50%;
 		transform: translateY(-50%);
 		z-index: 5;
 	}

 	.logo-box {
 		.logo {
 			display: block;
 			width: 64px;
 			height: 64px;
 			margin-bottom: 16px;
 		}

 		text {
 			display: block;
 		}

 		.logo-title {
 			font-size: 24px;
 			font-weight: bold;
 			color: #333231;
 		}

 		.logo-text {
 			font-size: 16px;
 			font-weight: 400;
 			color: #666462;
 			margin: 4px 0 58px;
 		}
 	}

 	.login-icon {
 		position: relative;

 		&::after {
 			content: '';
 			position: absolute;
 			right: -6px;
 			width: 1px;
 			height: 16px;
 			background: #ebe9e6;
 			border-radius: 1px;
 		}
 	}

 	.login-regit {
 		display: flex;
 		justify-content: space-between;
 		font-size: 16px;
 	}

 	.forgot-button {
 		font-size: 14px;
 		font-weight: 400;
 		color: #666462;
 	}

 	.tips {
 		display: block;
 		font-size: 12px;
 		color: #e96848;
 		margin-top: -3px;
 	}

 	.codeButton {
 		color: #FF9500;
 	}

 	/deep/ .u-form-item__body {
 		padding: 6px 0;
 	}
 </style>