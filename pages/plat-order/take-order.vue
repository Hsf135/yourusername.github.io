<template>
	<z-paging ref="paging" v-model="list" @query="loadData" :fixed="true" :auto="false" bg-color="#faf9f7">
		<view slot="top">
			<u-navbar title="接单" placeholder bgColor="#FAF9F7">
				<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
			</u-navbar>
		</view>
		<view v-if="list.length" class="list">
			<ListItem @reload="loadData(1)" v-for="l in list" :key="l.id" :item="l" isCall />
		</view>
	
		<view slot="empty">
			<u-icon class="u-p-t-40" name="/static/imgs/common/data-empty.png" width="142" height="120"></u-icon>
			<view class="zp-main-title">
				<view>休息一下吧，暂无可接的订单~</view>
			</view>
		</view>
	</z-paging>
</template>

<script>
	import { orderPageUrl } from '@/api'
	import ListItem from './components/order-item.vue'

	export default {
		components: { ListItem },
		data() {
			return {
				current: 0,
				firstLoaded: false,
				list: [],
				params: { pageNum: 1, isReceive: '0' },
				dayList: []
			}
		},
		methods: {
			async loadData(current) {
				if (current === 1) {
					this.dayList = []
				}
				this.params.pageNum = current
				const { data } = await uni.$u.http.post(orderPageUrl, this.params)
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
				this.firstLoaded = true
			},
			reload() {
				this.$refs.paging.reload()
			},
			refresh() {
				this.$refs.paging.refresh()
			}
		},
		onShow() {
			this.loadData()
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		margin: 12px 16px 12px;
		overflow: hidden;
		color: $u-main-color;
		font-size: 12px;
	}
	/deep/ .u-icon--right {
		justify-content: center;
	}
</style>