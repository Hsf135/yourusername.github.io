<template>
	<view>
		<z-paging ref="paging" v-model="list" @query="loadData" :refresher-enabled="false" watch-touch-direction-change @scrollTopChange="scroll"
			@touchDirectionChange="touchDirectionChange" empty-view-img="/static/imgs/common/data-empty.png" :auto="false" emptyViewText="暂无相关订单记录~">
			<view slot="top">
				<view class="top">
					<u-navbar title="订单搜索" placeholder>
						<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
					</u-navbar>
					<view class="search-box" :style="{height: !scrollTop && !hideSearchDom ? '220px' : 0 }">
						<u-form label-width="66px">
							<view class="form-box">
								<u-form-item label="服务时间" borderBottom>
									<view class="u-flex-1 u-flex">
										<view class="u-flex-1" @click="handleOpenTime('serveBeginTime')">
											<text v-if="params.serveBeginTime">{{params.serveBeginTime}}</text>
											<text class="input-color" v-else>开始时间</text>
										</view>
										<view class="line">-</view>
										<view class="u-flex-1" @click="handleOpenTime('serveEndTime')">
											<text v-if="params.serveEndTime">{{params.serveEndTime}}</text>
											<text class="input-color" v-else>结束时间</text>
										</view>
										<text class="iconfont icon-a-mingchengriqi u-primary"></text>
									</view>
								</u-form-item>
								<u-form-item label="订单状态" borderBottom>
									<r-select v-model="params.operatorStatus" placeholder="请选择订单状态" :list="operatorStatusList" />
								</u-form-item>
								<u-form-item label="关键字" borderBottom>
									<u-input v-model="params.keyword" border="none" placeholder="姓名,地址,电话,工单号,服务等" />
								</u-form-item>
							</view>
						</u-form>
						<view class="btns u-flex">
							<u-button type="primary" plain text="清除" class="u-m-r-12" @click="handleClear"></u-button>
							<u-button type="primary" text="确认" @click="reload"></u-button>
						</view>
					</view>
				</view>
				<view v-if="hasSearch" class="total">
					<view>
						<text>- 共搜索出 </text>
						<text class="u-primary num">{{total}}</text>
						<text>条记录 - </text>
					</view>
				</view>
			</view>
			<view v-if="list.length" class="list">
				<r-order-zj v-for="l in list" :key="l.id" :item="l" />
			</view>
		</z-paging>

		<u-datetime-picker :show="showTime" v-model="time" mode="date" closeOnClickOverlay @close="timeCancel" @confirm="timeConfirm" @cancel="timeCancel"></u-datetime-picker>
	</view>
</template>

<script>
	import { staffInfoPageUrl } from '@/api'
	import dayjs from '@/utils/dayjs.min.js'

	export default {
		data() {
			return {
				list: [],
				total: 0,
				params: { page: 1, keyword: '', operatorStatus: '', serveBeginTime: '', serveEndTime: '' },
				time: Date.now(),
				showTime: false,
				timeKey: '',
				hasSearch: false,
				scrollTop: 0,
				hideSearchDom: false,
				dayList: []
			}
		},
		computed: {
			operatorStatusList() {
				// 服务商才有5的待审核tab
				const end = this.fwryappFuwushang ? 5 : 4
				const list = this.aDict('staff_operator_status').slice(0, end)
				return [{ value: '', label: '全部' }, ...list]
			}
		},
		onLoad() {
			this.params.serveBeginTime = dayjs().startOf('month').format('YYYY-MM-DD')
			this.params.serveEndTime = dayjs().endOf('month').format('YYYY-MM-DD')
		},
		methods: {
			async loadData(current) {
				this.params.page = current
				const { data } = await uni.$u.http.post(staffInfoPageUrl, this.params)
				// 构建是否同一天数据逻辑处理
				data.list.forEach(d => {
					const day = d.serveTime.split(' ')[0]
					if (this.dayList.find(d => d === day)) {
						d.showDay = false
					} else {
						d.showDay = true
						this.dayList.push(day)
					}
				})
				this.$refs.paging.complete(data.list)
				this.total = data.total
				this.hasSearch = true
				this.hideSearchDom = true
			},
			reload() {
				this.$refs.paging.reload()
			},
			handleClear() {
				const serveBeginTime = dayjs().startOf('month').format('YYYY-MM-DD')
				const serveEndTime = dayjs().endOf('month').format('YYYY-MM-DD')
				this.params = { page: 1, keyword: '', operatorStatus: '', serveBeginTime, serveEndTime }
				// this.reload()
			},
			handleOpenTime(key) {
				this.timeKey = key
				this.showTime = true
			},
			timeConfirm({ value }) {
				this.params[this.timeKey] = uni.$u.date(value, 'yyyy-mm-dd')
				this.showTime = false
			},
			timeCancel() {
				this.showTime = false
			},
			toPage(url) {
				uni.navigateTo({ url })
			},
			handleBack() {
				uni.navigateBack()
			},
			scroll(scrollTop) {
				this.hideSearchDom = false
				this.scrollTop = scrollTop
			},
			touchDirectionChange(direction) {
				// 下拉出现搜素框
				if (!this.scrollTop && direction === 'top') {
					this.hideSearchDom = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		background: #fff;
	}

	.list {
		padding: 0 16px;
	}

	.total {
		padding: 12px;
		text-align: center;
		border-radius: 8px 8px 0 0;
	}

	.num {
		margin: 0 5px;
		font-weight: bold;
	}

	.form-box {
		background-color: #fff;
		padding: 0 12px 12px 12px;
		border-radius: 8px;

		.iconfont {
			font-size: 20px;
		}
	}

	.line {
		margin: 0 6px;
		color: #c0c4cc;
	}

	.input-color {
		color: #c0c4cc;
	}

	.btns {
		padding: 10px 10px 20px;
	}

	.search-box {
		overflow: hidden;
		transition: height 0.5s ease 0s;
	}
</style>