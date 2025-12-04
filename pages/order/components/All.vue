<template>
	<view class="full-page">
		<z-paging ref="paging" v-model="list" @query="loadData" :fixed="true" :auto="false" bg-color="#fff" empty-view-img="/static/imgs/common/empty.png"
			emptyViewText="暂无对象信息~">
			<view v-if="list.length" class="list">
				<r-service v-for="l in list" :key="l.id" :item="l" :isSelect="isSelect" />
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { getCustomerPageUrl } from '@/api'

	export default {
		props: {
			tabIndex: { type: Number, default: 0 },
			currentIndex: { type: Number, default: 0 },
			isSelect: { type: String, default: '0' }
		},
		data() {
			return {
				current: 0,
				firstLoaded: false,
				list: [],
				params: { pageNum: 1, appType: 2 },
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
				this.params.pageNum = current
				const { data } = await uni.$u.http.post(getCustomerPageUrl, this.params)
				this.$refs.paging.complete(data.list)
				this.firstLoaded = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		margin: 0 16px 12px;
		overflow: hidden;
		color: $u-main-color;
		font-size: 12px;
		border-radius: 0 0 8px 8px;
		border: 1px solid #f5f3f0;
		border-top: 0;
	}
</style>