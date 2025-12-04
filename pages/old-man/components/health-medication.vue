<template>
	<view>
		<u-navbar :title="`${isEdit?'编辑':'添加'}用药信息`" placeholder bgColor="#FAF9F7">
			<view slot="left" class="u-flex">
				<text class="u-primary" @click="backEdit">取消</text>
			</view>
			<view slot="right" class="u-flex">
				<text v-if="isAdd" class="u-primary" @click="add">完成</text>
				<text v-else class="u-info">完成</text>
			</view>
		</u-navbar>

		<u--form labelWidth="110px" :model="info" ref="info">
			<view class="base-box">
				<u-form-item label="用药名称或类型" prop="medicationName" borderBottom>
					<u-input v-model="info.medicationName" clearable border="none" placeholder="请输入用药名称或类型">
					</u-input>
				</u-form-item>
				<u-form-item label="每日用量" prop="dosageDay" borderBottom>
					<u-input v-model="info.dosageDay" clearable type="number" border="none" placeholder="请输入每日用量,1~10">
					</u-input>
				</u-form-item>
				<u-form-item label="用药时间" prop="medicationTime" borderBottom>
					<r-select v-model="info.medicationTime" multiple :list="aDict('medication_time')" />
				</u-form-item>
				<u-form-item label="服药依从性" prop="medicationCompliance" borderBottom>
					<r-select v-model="info.medicationCompliance" :list="aDict('medication_compliance')" />
				</u-form-item>
			</view>
		</u--form>

		<view class="add-button" v-if="id">
			<u-button :customStyle="loginStyle" text="删除用药信息" @click="showDel = true"></u-button>
		</view>

		<r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false"
			@confirm="dialogConfirm">
			<view slot="content" class="u-flex">
				<text>当前页面已做出修改，是否不保存就退出</text>
			</view>
		</r-dialog>

		<r-dialog v-model="showDel" title="温馨提示" cancelText="否" confirmText="是" @cancel="showDel = false" @confirm="del">
			<view slot="content" class="u-flex">
				<text>是否确认删除</text>
			</view>
		</r-dialog>
	</view>
</template>

<script>
	import { addMedicationUrl, delMedicationDetailUrl, getMedicationDetailUrl } from '@/api'
	export default {
		data() {
			return {
				info: {},
				loginStyle: { borderRadius: '8px', color: '#e96848', width: '239px', border: '1px solid #e96848' },
				customerId: undefined,
				id: '',
				disableLevelStr: '',
				unsave: false,
				isEdit: false,
				show: false,
				showDel: false,
				showBirthday: false,
				time: Number(new Date())
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
		computed: {
			isAdd() {
				if (this.info.medicationName) {
					return true
				} else {
					return false
				}
			}
		},
		onLoad(option) {
			this.customerId = option.id
			if (option.detail) {
				this.id = option.detail
				this.isEdit = true
				this.loadData()
			}
		},
		methods: {
			async loadData() {
				const { data } = await uni.$u.http.post(`${getMedicationDetailUrl}?id=${this.id}`)
				this.info = data
				setTimeout(() => {
					this.unsave = false
				}, 10)
			},
			toPage(url) {
				uni.navigateTo({ url })
			},
			handleBack() {
				uni.navigateBack()
			},
			async add() {
				try {
					const res = await uni.$u.http.post(addMedicationUrl, { ...this.info, customerId: this.customerId })
					if (res.code === 200) {
						uni.$u.toast(res.msg)
						uni.navigateBack()
					}
				} catch (e) {
					uni.$u.toast(e.msg)
				}
			},
			async del() {
				try {
					const res = await uni.$u.http.post(`${delMedicationDetailUrl}?ids=${this.id}`)
					if (res.code === 200) {
						uni.$u.toast(res.msg)
						uni.navigateBack()
					}
				} catch (e) {
					uni.$u.toast(e.msg)
				}
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
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				if (type === 'day') {
					return `${value}日`
				}
				return value
			},
			changeBirthday(e) {
				const timeFormat = uni.$u.timeFormat
				this.info.hospitalDate = timeFormat(e.value, 'yyyy-mm-dd')
				this.showBirthday = false
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
		color: #e96848;
		margin-top: 12px;

		text {
			padding-left: 5px;
		}
	}

	.add-button {
		background-color: #FAF9F7;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20px 0;
		margin: auto;
	}
</style>