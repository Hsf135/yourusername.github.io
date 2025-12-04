<template>
	<view class="full-page">
		<z-paging ref="paging" v-model="list" @query="loadData" :fixed="true" :auto="false" bg-color="#faf9f7">
			<view v-if="list.length" class="list">
				<ListItem v-for="l in list" :key="l.id" :item="l" isCall />
			</view>

			<view slot="empty">
				<u-icon name="/static/imgs/common/data-empty.png" width="142" height="120"></u-icon>
				<view class="zp-main-title">
					<view>休息一下吧，暂无可接的订单~</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { orderPageUrl } from '@/api'
	import ListItem from './list-item.vue'

	export default {
		components: { ListItem },
		props: {
			tabIndex: {
				type: Number,
				default: 0
			},
			currentIndex: {
				type: Number,
				default: 0
			},
			operatorStatus: {
				type: String,
				default: '1'
			}
		},
		data() {
			return {
				current: 0,
				firstLoaded: false,
				list: [],
				params: { pageNum: 1 },
				dayList: []
			}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if (newVal === this.tabIndex) {
						//懒加载，当滑动到当前的item时，才去加载
						if (!this.firstLoaded) {
							setTimeout(() => {
								this.$refs.paging.reload()
							}, 5)
						}
					}
				},
				immediate: true
			},
		},
		methods: {
			async loadData(current) {
				if (current === 1) {
					this.dayList = []
				}
				this.params.pageNum = current
				this.params.isReceive = this.$props.operatorStatus
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
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		margin: 0px 16px 12px;
		overflow: hidden;
		color: $u-main-color;
		font-size: 12px;
	}
	/deep/ .u-icon--right{
		justify-content: center;
	}
</style>