<template>
	<view>
		<u-navbar title="录入健康数据" placeholder bgColor="#FAF9F7">
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
				<u-form-item label="测量时间" prop="measureTime" borderBottom @click="openTime">
					<text v-if="info.measureTime">{{info.measureTime}}</text>
					<text v-else class="u-place-color">请选择</text>
					<u-icon slot="right" :name="aIcon('bianji')" width="24" height="24"></u-icon>
				</u-form-item>
				<u-form-item label="高压(mmHg)" prop="highBlood" borderBottom>
					<u-input v-model="info.highBlood" clearable type="number" border="none" placeholder="(80-230)">
					</u-input>
				</u-form-item>
				<u-form-item label="低压(mmHg)" prop="lowBlood" borderBottom>
					<u-input v-model="info.lowBlood" clearable type="number" maxlength="32" border="none" placeholder="(20-150)">
					</u-input>
				</u-form-item>
				<u-form-item label="心率(次/分钟)" prop="heartRate" borderBottom>
					<u-input v-model="info.heartRate" clearable type="number" maxlength="32" border="none" placeholder="(30-200)">
					</u-input>
				</u-form-item>
			</view>
		</u--form>

		<u-datetime-picker @cancel="showBirthday = false" @confirm="changeBirthday" :show="showBirthday"
			:formatter="formatter" v-model="time" :maxDate="maxDate" closeOnClickOverlay @close="showBirthday = false"
			mode="datetime">
		</u-datetime-picker>


		<r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false"
			@confirm="dialogConfirm">
			<view slot="content" class="u-flex">
				<text>当前页面已做出修改，是否不保存就退出</text>
			</view>
		</r-dialog>
	</view>
</template>

<script>
	import { addBpDataUrl } from '@/api'
	export default {
		data() {
			return {
				info: { measureTime: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss') },
				customerId: undefined,
				disableLevelStr: '',
				unsave: false,
				show: false,
				showBirthday: false,
				time: Number(new Date()),
				maxDate: new Date().getTime()
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
				if (this.info.measureTime && this.info.highBlood && this.info.lowBlood && this.info.heartRate) {
					return true
				} else {
					return false
				}
			}
		},
		onLoad(option) {
			this.customerId = option.id
		},
		methods: {
			disableLevel() {
				const newArr = this.disableLevel_type.map(level => {
					return this.info.disableInfo[level.value] ?
						level.name +
						this.aDict('disableLevel_mince').find(item => item.value === this.info.disableInfo[level.value]).label :
						''
				})
				this.disableLevelStr = newArr.filter(item => item !== '').join('，')
			},
			toPage(url) {
				uni.navigateTo({ url })
			},
			handleBack() {
				uni.navigateBack()
			},
			async add() {
				if (Number(this.info.lowBlood) > Number(this.info.highBlood)) {
					uni.$u.toast('“低压值”不可大于“高压值”')
					return
				}
				try {
					const res = await uni.$u.http.post(addBpDataUrl, { ...this.info, customerId: this.customerId })
					if (res.code === 200) {
						uni.$u.toast('录入成功')
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
				this.info.measureTime = timeFormat(e.value, 'yyyy-mm-dd hh:MM:ss')
				// this.time = timeFormat(e.value, 'yyyy-mm-dd hh:MM')
				this.showBirthday = false
			},
			openTime() {
				this.showBirthday = true
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