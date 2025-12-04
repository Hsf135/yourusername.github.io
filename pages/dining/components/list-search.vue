<template>
	<u-popup :show="show" mode="right" :custom-style="{ backgroundColor: '#faf9f7' }">
		<view class="header">
			<u-icon :name="aIcon('zuojiantou')" width="24" height="24" @click="handleReturn"></u-icon>
			<view class="header-title">拜访记录搜索</view>
		</view>
		<view class="u-m-t-12 u-p-lr-12">
			<u-search placeholder="请输入关键词" bgColor="#fff" v-model="params.keyword" :showAction="false" shape="square"></u-search>
			<u-form label-width="66px">
				<view class="form-box">
					<u-form-item label="拜访时间" borderBottom>
						<view class="time-input-box u-flex">
							<view class="time-input" @click="handleOpenTime('beginTime')">
								<text v-if="params.beginTime">{{params.beginTime}}</text>
								<text class="input-color" v-else>开始时间</text>
							</view>
							<view style="margin: 0 6px; color: #c0c4cc;">-</view>
							<view class="time-input" @click="handleOpenTime('endTime')">
								<text v-if="params.endTime">{{params.endTime}}</text>
								<text class="input-color" v-else>结束时间</text>
							</view>
							<text class="iconfont icon-a-mingchengriqi u-primary"></text>
						</view>
					</u-form-item>
					<u-form-item label="拜访方式" borderBottom>
						<r-select v-model="params.visitMode" placeholder="请选择拜访方式" :list="aDict('visit_mode')"></r-select>
					</u-form-item>
				</view>
			</u-form>
		</view>
		<view class="btn-box u-flex u-flex-center">
			<view class="clear-btn u-flex u-flex-center" @click="handleClear">清除</view>
			<view class="confirm-btn u-flex u-flex-center" @click="handleConfirm">确认搜索</view>
		</view>
		<u-datetime-picker :show="showTime" v-model="time" mode="date" closeOnClickOverlay @close="timeCancel" @confirm="timeConfirm" @cancel="timeCancel"></u-datetime-picker>
	</u-popup>
</template>

<script>
	export default {
		data () {
			return {
				params: {
					keyword: '',
					visitMode: '',
					beginTime: '',
					endTime: '',
				},
				show: false,
				time: Date.now(),
				showTime: false,
				timeKey: ''
			}
		},
		methods: {
			open () {
				this.show = true
			},
			handleOpenTime (key) {
				this.timeKey = key
				this.showTime = true
			},
			timeConfirm ({ value }) {
				this.params[this.timeKey] = uni.$u.date(value, 'yyyy-mm-dd')
				this.showTime = false
			},
			timeCancel () {
				this.showTime = false
			},
			handleConfirm () {
				if (this.params.beginTime && this.params.endTime) {
					if (new Date(this.params.beginTime) > new Date(this.params.endTime)) return uni.showToast({ title: '开始时间不得大于结束时间' })
				}
				this.$emit('updateParams', this.params)
				this.show = false
			},
			handleClear () {
				this.params.keyword = ''
				this.params.beginTime = ''
				this.params.endTime = ''
				this.params.visitMode = ''
			},
			handleReturn () {
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		box-sizing: border-box;
		width: 100vw;
		height: 44px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		padding: 0 14px;
		position: relative;
	}
	
	.header-title {
		color: $u-main-color;
		font-size: 16px;
		font-weight: bold;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	
	.form-box {
		background-color: #fff;
		padding: 0 12px 12px 12px;
		margin-top: 12px;
		border-radius: 8px;
		.iconfont {
			font-size: 20px;
		}
	}
	
	.btn-box {
		position: absolute;
		bottom: 60px;
		left: 0;
		width: 100%;
	}
	
	.clear-btn {
		width: 100px;
		height: 40px;
		background: #ffffff;
		border: 1px solid $u-primary;
		border-radius: 8px;
		color: $u-primary;
		margin-right: 12px;
	}
	
	.confirm-btn {
		width: 200px;
		height: 40px;
		background: $u-primary;
		border-radius: 8px;
		color: #fff;
	}
	
	.time-input-box {
		width: 100%;
	}
	
	.time-input {
		flex: 1;
	}
	
	.input-color {
		color: #c0c4cc;
	}
</style>