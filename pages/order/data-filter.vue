<template>
	<view class="filter-box">
		<u-navbar title="服务对象数据筛选" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>

		<u-collapse :border="false" :value="['1','2', '3', '4', '5']">
			<u-collapse-item title="所有对象筛选" name="1" class="collapse-box">
				<view class="u-collapse-content u-flex u-flex-wrap">
					<u-tag text="不显示本月已服务过的对象" :plain="form.isShowService === '1'" name="1" class="tag-item"
						@click="form.isShowService = form.isShowService === '1' ? '0' : '1' "></u-tag>
					<u-tag text="不显示未绑定养老卡的对象" :plain="form.isShowSubsidyCard === '1'" name="1" class="tag-item"
						@click="form.isShowSubsidyCard = form.isShowSubsidyCard === '1' ? '0' : '1' "></u-tag>
				</view>
			</u-collapse-item>
			<u-collapse-item title="二级服务标签" name="1" class="collapse-box">
				<view class="u-collapse-content u-flex u-flex-wrap">
					<u-tag v-for="(item,index) in secondServiceLabelList" :key="item.value" :text="item.label" :plain="item.checked" :name="item.value" class="tag-item"
						@click="checkSecondServiceLabel(index,item.value)"></u-tag>
				</view>
			</u-collapse-item>
			<u-collapse-item title="服务对象来源" name="2" class="collapse-box">
				<view class="u-collapse-content u-flex u-flex-wrap">
					<u-tag v-for="(item,index) in secondServiceSourceList" :key="item.value" :text="item.label" :plain="item.checked" :name="item.value" class="tag-item"
						@click="checkSecondServiceSource(index,item.value)"></u-tag>
				</view>
			</u-collapse-item>

			<u-collapse-item title="残疾类别" name="3" class="collapse-box">
				<view class="u-collapse-content u-flex u-flex-wrap">
					<u-tag v-for="(item,index) in disableCategorysList" :key="item.value" :text="item.label" :plain="item.checked" :name="item.value" class="tag-item"
						@click="checkDisableCategorys(index,item.value)"></u-tag>
				</view>
			</u-collapse-item>
			<u-collapse-item title="残疾类型细分" name="4" class="collapse-box">
				<view class="u-collapse-content u-flex u-flex-wrap">
					<u-tag v-for="(item,index) in minceIntelligencesList" :key="`智力${item.value}`" :text="`智力${item.label}`" :plain="item.checked" :name="item.value"
						class="tag-item" @click="checkMinceIntelligences(index,item.value)"></u-tag>
					<u-tag v-for="(item,index) in minceHearingsList" :key="`听力${item.value}`" :text="`听力${item.label}`" :plain="item.checked" :name="item.value"
						class="tag-item" @click="checkMinceHearings(index,item.value)"></u-tag>
					<u-tag v-for="(item,index) in minceSpeechsList" :key="`语言${item.value}`" :text="`语言${item.label}`" :plain="item.checked" :name="item.value"
						class="tag-item" @click="checkMinceSpeechs(index,item.value)"></u-tag>
					<u-tag v-for="(item,index) in minceVisionsList" :key="`视力${item.value}`" :text="`视力${item.label}`" :plain="item.checked" :name="item.value"
						class="tag-item" @click="checkMinceVisions(index,item.value)"></u-tag>
					<u-tag v-for="(item,index) in minceLimbsList" :key="`肢体${item.value}`" :text="`肢体${item.label}`" :plain="item.checked" :name="item.value"
						class="tag-item" @click="checkMinceLimbs(index,item.value)"></u-tag>
				</view>
			</u-collapse-item>

			<u-collapse-item title="持证时间" name="5" class="collapse-box">
				<view class="u-collapse-content u-flex">
					<view class="time-input" @click="handleOpenTime('certificateBeginTime')">
						<text v-if="form.certificateBeginTime">{{form.certificateBeginTime}}</text>
						<text class="input-color" v-else>开始时间</text>
					</view>
					<view style="margin: 0 6px; color: #c0c4cc;">-</view>
					<view class="time-input" @click="handleOpenTime('certificateEndTime')">
						<text v-if="form.certificateEndTime">{{form.certificateEndTime}}</text>
						<text class="input-color" v-else>结束时间</text>
					</view>
					<text class="iconfont icon-a-mingchengriqi u-primary"></text>
				</view>
			</u-collapse-item>
		</u-collapse>

		<view class="btn fixed-footer u-flex">
			<u-button text="清除筛选" class="u-m-r-12" @click="handleClear"></u-button>
			<u-button type="primary" text="确认筛选" class="confirm" @click="handleConfirm"></u-button>
		</view>

		<u-datetime-picker :show="showTime" v-model="time" mode="date" closeOnClickOverlay @close="timeCancel" @confirm="timeConfirm" @cancel="timeCancel"></u-datetime-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					isShowService: '',
					isShowSubsidyCard: '',
					secondServiceLabel: [],
					serviceObjSource: [],
					disableCategorys: [],
					disablelevelMinceIntelligences: [],
					disablelevelMinceHearings: [],
					disablelevelMinceSpeechs: [],
					disablelevelMinceVisions: [],
					disablelevelMinceLimbs: []
				},
				secondServiceLabelList: [],
				secondServiceSourceList: [],
				disableCategorysList: [],
				minceIntelligencesList: [],
				minceHearingsList: [],
				minceSpeechsList: [],
				minceVisionsList: [],
				minceLimbsList: [],
				time: Date.now(),
				showTime: false,
				timeKey: '',
			}
		},
		onLoad() {
			this.secondServiceLabelList = this.dictList('second_service_label')
			this.secondServiceSourceList = this.dictList('service_obj_source')
			this.disableCategorysList = this.dictList('disability_category')
			this.minceIntelligencesList = this.dictList('disableLevel_mince').filter(d => d.value > 0)
			this.minceHearingsList = this.dictList('disableLevel_mince').filter(d => d.value > 0)
			this.minceSpeechsList = this.dictList('disableLevel_mince').filter(d => d.value > 0)
			this.minceVisionsList = this.dictList('disableLevel_mince').filter(d => d.value > 0)
			this.minceLimbsList = this.dictList('disableLevel_mince').filter(d => d.value > 0)
		},
		methods: {
			handleConfirm() {
				if (this.form.certificateBeginTime && this.form.certificateEndTime) {
					if (new Date(this.form.certificateBeginTime) > new Date(this.form.certificateEndTime)) {
						uni.showToast({ title: '开始时间不得大于结束时间' })
						return
					}
				}
				this.$u.vuex('vuex_tempObj', this.form)
				uni.navigateTo({ url: '/pages/order/search-result?type=filter' })
			},
			handleClear() {
				this.form = {
					certificateBeginTime: '',
					certificateEndTime: '',
					isShowService: '',
					isShowSubsidyCard: '',
					secondServiceLabel: [],
					serviceObjSource: [],
					disableCategorys: [],
					disablelevelMinceIntelligences: [],
					disablelevelMinceHearings: [],
					disablelevelMinceSpeechs: [],
					disablelevelMinceVisions: [],
					disablelevelMinceLimbs: []
				}
				this.secondServiceLabelList = this.dictList('second_service_label')
				this.secondServiceSourceList = this.dictList('service_obj_source')
				this.disableCategorysList = this.dictList('disability_category')
				this.minceIntelligencesList = this.dictList('disableLevel_mince').filter(d => d.value > 0)
				this.minceHearingsList = this.dictList('disableLevel_mince').filter(d => d.value > 0)
				this.minceSpeechsList = this.dictList('disableLevel_mince').filter(d => d.value > 0)
				this.minceVisionsList = this.dictList('disableLevel_mince').filter(d => d.value > 0)
				this.minceLimbsList = this.dictList('disableLevel_mince').filter(d => d.value > 0)
			},
			dictList(key) {
				return this.aDict(key).map(item => {
					return { ...item, checked: false }
				})
			},
			checkSecondServiceLabel(index, item) {
				this.secondServiceLabelList[index].checked = !this.secondServiceLabelList[index].checked
				this.checkArray(this.form.secondServiceLabel, item)
			},
			checkSecondServiceSource(index, item) {
				this.secondServiceSourceList[index].checked = !this.secondServiceSourceList[index].checked
				this.checkArray(this.form.serviceObjSource, item)
			},
			checkDisableCategorys(index, item) {
				this.disableCategorysList[index].checked = !this.disableCategorysList[index].checked
				this.checkArray(this.form.disableCategorys, item)
			},
			checkMinceIntelligences(index, item) {
				this.minceIntelligencesList[index].checked = !this.minceIntelligencesList[index].checked
				this.checkArray(this.form.disablelevelMinceIntelligences, item)
			},
			checkMinceHearings(index, item) {
				this.minceHearingsList[index].checked = !this.minceHearingsList[index].checked
				this.checkArray(this.form.disablelevelMinceHearings, item)
			},
			checkMinceSpeechs(index, item) {
				this.minceSpeechsList[index].checked = !this.minceSpeechsList[index].checked
				this.checkArray(this.form.disablelevelMinceSpeechs, item)
			},
			checkMinceVisions(index, item) {
				this.minceVisionsList[index].checked = !this.minceVisionsList[index].checked
				this.checkArray(this.form.disablelevelMinceVisions, item)
			},
			checkMinceLimbs(index, item) {
				this.minceLimbsList[index].checked = !this.minceLimbsList[index].checked
				this.checkArray(this.form.disablelevelMinceLimbs, item)
			},
			handleOpenTime(key) {
				this.timeKey = key
				this.showTime = true
			},
			timeConfirm({ value }) {
				this.form[this.timeKey] = uni.$u.date(value, 'yyyy-mm-dd')
				this.showTime = false
			},
			timeCancel() {
				this.showTime = false
			},
		}
	}
</script>

<style lang="scss" scoped>
	.base-box {
		margin: 6px 16px;
	}

	.collapse-box {
		margin: 6px 16px;
		background: #fff;
		border-radius: 8px;
		border-top: 0;
	}

	/deep/ .u-icon__icon--info {
		color: $u-primary !important;
	}

	.tag-item {
		margin: 0 12px 12px 0;
	}

	/deep/ .u-tag--square {
		border-radius: 8px;
	}

	/deep/ .u-tag--primary {
		background-color: #faf9f7 !important;
		border-color: #faf9f7 !important;
	}

	/deep/ .u-tag__text--primary {
		color: #666462 !important;
	}

	/deep/ .u-tag--primary--plain {
		background: #fff9f0;
		border: 1px solid #ff9500;
		position: relative;
	}

	/deep/ .u-tag--primary--plain::after {
		content: ' ';
		position: absolute;
		bottom: -1px;
		right: -1px;
		width: 14px;
		height: 14px;
		background: url('/static/icon/a-tag-check.png') no-repeat;
		background-size: 100% 100%;
	}

	/deep/ .u-tag__text--primary--plain {
		color: #ff9500 !important;
	}

	.btn {
		background: #ffffff;
		border-top: 1px solid #eeeeee;
		padding: 12px 32px;
	}

	.filter-box {
		padding-bottom: 70px;
	}

	.title {
		font-size: 15px;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 20px;
	}

	/deep/ .u-cell__title-text {
		font-weight: bold;
		font-size: 15px !important;
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