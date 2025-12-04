<template>
	<view>
		<u-popup :show="show" mode="center">
			<view class="create-old-dialog">
				<view class="title">快速新建老人</view>
				<u-form :model="form" ref="formRef" :rules="rules" label-position="top" label-width="120px">
					<u-form-item label="姓名" prop="name" required>
						<u-input v-model="form.name" placeholder="请输入老人姓名，可以是汉字、字母" maxlength="10" :disabled="loading"></u-input>
					</u-form-item>
					<u-form-item label="性别" prop="sex" required>
						<u-radio-group v-model="form.sex" :disabled="loading">
							<u-radio v-for="item in aDict('vols_sex')" :key="item.value" :label="item.label" :name="item.value"></u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="联系电话" prop="mobilephone">
						<u-input v-model="form.mobilephone" placeholder="电话与证件号码必填其一" maxlength="13" :disabled="loading"></u-input>
					</u-form-item>
					<u-form-item label="证件号码" prop="idcard">
						<u-input v-model="form.idcard" placeholder="电话与证件号码必填其一" maxlength="20" :disabled="loading"></u-input>
					</u-form-item>
					<u-form-item label="老人备注" prop="remark">
						<textarea
							v-model="form.remark"
							placeholder="输入备注内容(30字以内)"
							:class="['textarea', loading ? 'disabled' : '']"
							placeholder-style="color: #c0c4cc;"
							maxlength="30"
							:disabled="loading"
						></textarea>
					</u-form-item>
				</u-form>
			</view>
			<view class="finish-btn-box">
				<u-button type="primary" :loading="loading" @click="handleSave">完成</u-button>
			</view>
			<view class="close" @click="handleClose">
				<u-icon :name="aIcon('guanbi-xian')" width="24" height="24" />
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { addCustomerFastUrl } from '@/api'
	export default {
		props: {
			from: { type: String, default: 'old-man-list' } // 来源于哪个页面old-man-list=老人列表 dining=人工点餐，搜索老人页面
		},
		data () {
			return {
				show: false,
				loading: false,
				form: {
					name: '',
					remark: '',
					sex: '',
					mobilephone: '',
					idcard: ''
				}
			}
		},
		computed: {
			rules () {
				const customerValidate = (rule, value, callback) => {
				  if (!this.form.idcard && !this.form.mobilephone) return callback(new Error('证件号码和手机号必须填一个'))
					if (rule.field === 'idcard' && this.form.idcard) {
					  let reg = /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/
					  // 34052419800101001X 513701930509101
					  if (!reg.test(this.form.idcard)) return callback(new Error('请输入正确的证件号码'))
					}
					if (rule.field === 'mobilephone' && this.form.mobilephone) {
					  let reg = /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/ // 匹配手机号码或固定电话
					  if (!reg.test(this.form.mobilephone)) return callback(new Error('请输入正确的手机号码或固定电话'))
					}
					this.$refs.formRef.clearValidate(['idcard', 'mobilephone'])
					callback()
				}
				return {
					name: [{ required: true, pattern: /^[\u4e00-\u9fa5a-zA-Z]{1,15}$/, message: '请输入正确姓名', trigger: 'blur' }],
					sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
					idcard: [{ required: true, validator: customerValidate, trigger: 'blur' }],
					mobilephone: [{ required: true, validator: customerValidate, trigger: 'blur' }],
					remark: [{ max: 50, message: '备注最多只能50个字', trigger: 'blur' }]
				}
			}
		},
		methods: {
			open () {
				this.show = true
			},
			handleSave () {
				if (this.loading) return
				this.$refs.formRef.validate().then(async () => {
					this.loading = true
					const { msg, data } = await uni.$u.http.post(addCustomerFastUrl, this.form)
					this.loading = false
					if (msg === '客户已存在') {
						if (this.from === 'dining') { // 如果来自于人工点餐-搜索老人页面，则直接输入姓名进行搜索
							let keyword = this.form.mobilephone || this.form.idcard
							this.handleClose()
							uni.showToast({ title: '输入的客户信息已存在，请勿重复创建', icon: 'none', duration: 1000 })
							setTimeout(() => {
								this.$emit('search', keyword)
							}, 1000)
						} else {
							uni.showToast({ title: '输入的客户信息已存在，请勿重复创建', icon: 'none', duration: 4000 })
						}
						return
					}
					if (this.from === 'dining') {
						this.handleClose()
						this.$emit('toPage', { memberId: data })
					} else {
						uni.$u.vuex('vuex_oldMan', {
							id: data,
							idcard: this.form.idcard,
							mobilephone: this.form.mobilephone,
							name: this.form.name
						})
						this.handleClose()
						uni.navigateBack()
					}
				}).catch(() => {
					this.loading = false
				})
			},
			handleClose () {
				this.show = false
				this.form.name = ''
				this.form.remark = ''
				this.form.sex = ''
				this.form.mobilephone = ''
				this.form.idcard = ''
				this.$refs.formRef.clearValidate()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.create-old-dialog {
		width: 80vw;
		min-height: 170px;
		max-height: 60vh;
		overflow-y: auto;
		padding: 0 24px;
		box-sizing: border-box;
		border-radius: 8px;
	}
	
	.finish-btn-box {
		padding: 20px 24px;
	}
	
	/deep/ .u-popup__content {
		border-radius: 8px;
		padding-top: 24px;
		background: #fff url('/static/imgs/common/dialog-bg.png') top center/100% 160px no-repeat;
	}
	
	.close {
		position: absolute;
		left: 50%;
		bottom: -40px;
		z-index: 99999;
		transform: translateX(-50%);
	}
	
	.title {
		margin-bottom: 16px;
		color: $u-main-color;
		font-size: 16px;
		font-weight: bold;
		text-align: center;
	}
	/deep/ .u-input {
		background-color: #fff;
	}
	/deep/ .u-radio {
		margin-right: 24px;
	}
	/deep/ .u-form-item__body__left {
		margin-bottom: 8px !important;
	}
	.textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 6px 9px;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
		background-color: #fff;
		font-size: 14px;
		height: 70px;
		&.disabled {
			background-color: rgb(245, 247, 250);
		}
	}
</style>