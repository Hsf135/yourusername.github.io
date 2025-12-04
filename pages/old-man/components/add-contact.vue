<template>
	<view>
		<u-navbar :title="isEdit?'编辑联系人':'新建联系人'" placeholder bgColor="#FAF9F7">
			<view slot="left" class="u-flex">
				<text class="u-primary" @click="backEdit">取消</text>
			</view>
			<view slot="right" class="u-flex">
				<text v-if="isAdd" class="u-primary" @click="submit">完成</text>
				<text v-else class="u-info">完成</text>
			</view>
		</u-navbar>

		<u--form labelWidth="110px" :model="info" :rules="rules" ref="info">
			<view class="base-box">
				<u-form-item label="联系人" prop="ownerName" borderBottom>
					<u-input v-model="info.ownerName" clearable border="none" placeholder="输入联系人姓名">
					</u-input>
				</u-form-item>
				<u-form-item label="联系人角色" prop="contactRole" borderBottom>
					<r-select v-model="info.contactRole" :list="aDict('contact_role')" />
				</u-form-item>
				<u-form-item label="联系人电话" prop="phoneNumber" borderBottom>
					<u-input v-model="info.phoneNumber" clearable type="number" maxlength="12" border="none"
						placeholder="请输入联系人电话">
					</u-input>
				</u-form-item>
			</view>
		</u--form>
		
		<view v-if="isEdit" class="u-p-15">
			<u-button type="error" plain text="删除联系人" class="btn-loginOut" @click="showDel = true"></u-button>
		</view>
		
		<r-dialog v-model="showDel" title="温馨提示" cancelText="取消" confirmText="确认" content="确认删除联系人?" @cancel="showDel = false" @confirm="handleDel">
		</r-dialog>

		<r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false"
			@confirm="dialogConfirm">
			<view slot="content" class="u-flex">
				<text>当前页面已做出修改，是否不保存就退出</text>
			</view>
		</r-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: { ownerName: '', contactRole: '', phoneNumber: undefined },
				customerId: undefined,
				unsave: false,
				show: false,
				isEdit: false,
				index: undefined,
				showDel: false,
				rules: {
					ownerName: [{
						required: true,
						message: '联系人姓名不可为空',
						trigger: ['blur', 'change']
					}],
					contactRole: [{
						required: true,
						message: '联系人角色不可为空',
						trigger: ['blur']
					}],
					phoneNumber: [{
						required: true,
						pattern: /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/,
						message: '请输入正确的手机号码',
						trigger: ['blur']
					}]
				}
			}
		},
		watch: {
			info: {
				handler: function() {
					this.unsave = true
				},
				deep: true
			}
		},
		onLoad(option) {
			if (option.index) {
				this.isEdit = true
				this.index = option.index
				this.info = this.vuex_contactInfoList[Number(option.index)]
				setTimeout(() => {
					this.unsave = false
				}, 10)
			}
		},
		computed: {
			isAdd() {
				if (this.info.ownerName && this.info.contactRole && this.info.phoneNumber) {
					return true
				} else {
					return false
				}
			}
		},
		methods: {
			toPage(url) {
				uni.navigateTo({ url })
			},
			handleBack() {
				uni.navigateBack()
			},
			submit() {
				this.$refs.info.validate().then(res => {
					if (this.isEdit) {
						this.edit()
						return
					}
					this.add()
				}).catch(err => {
					console.log(err)
					uni.$u.toast('请完善必填项')
				})
			},
			add() {
				let newList = [...this.vuex_contactInfoList]
				newList.push(this.info)
				this.$u.vuex('vuex_contactInfoList', newList)
				uni.$u.toast('添加成功')
				uni.navigateBack()
			},
			edit() {
				let newList = [...this.vuex_contactInfoList]
				newList[this.index] = this.info
				this.$u.vuex('vuex_contactInfoList', newList)
				uni.$u.toast('修改成功')
				uni.navigateBack()
			},
			backEdit() {
				if (this.unsave) {
					this.show = true
					return
				}
				uni.navigateBack()
			},
			dialogConfirm() {
				uni.navigateBack()
			},
			handleDel() {
				let newList = [...this.vuex_contactInfoList]
				newList.splice(this.index, 1)
				this.$u.vuex('vuex_contactInfoList', newList)
				uni.$u.toast('删除成功')
				uni.navigateBack()
			}
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

	/deep/ .u-form-item__body__left {
		line-height: 22px;
	}

	/deep/ .u-cell__body {
		padding: 10px 0;
		min-height: 44px;
		align-items: flex-start;
	}

	/deep/ .u-cell__body__content {
		width: 110px;
		flex: inherit;
	}

	/deep/ .u-cell__value {
		text-align: left;
	}

	.add-item {
		display: flex;
		align-items: center;
		color: #FF9500;
		margin-top: 12px;

		text {
			padding-left: 5px;
		}
	}
</style>