<template>
	<view>
		<view class="item u-p-l-5 u-flex u-border-bottom" @click="handleDetail(item)" @longpress="handlePhone"
			@touchend="touchEnd" @touchmove="touchMove">
			<view v-if="item.deathFlag === '0'" class="death">
				<u-icon name="/static/imgs/common/death.png" width="28" height="28"></u-icon>
			</view>
			<view class="u-flex-1 cell">
				<u--text v-if="item.sex" bold :text="item.name" size="12" :suffixIcon="aIcon(item.sex == 1 ? 'nan' : 'nv')"></u--text>
				<view class="u-m-t-2 u-font-12 u-tips-color u-line-1">
					{{item.age?item.age+'岁':'-'}} {{item.generalInfoCount?`(${item.generalInfoCount}%)`:''}}
				</view>
			</view>
			<view class="u-flex-1 cell">
				<view class="u-line-1">{{item.mobilephone || '-'}}</view>
				<view class="u-m-t-2 u-font-12 u-tips-color  u-line-1">{{item.idcard || '-'}}</view>
			</view>
			<view class="u-flex-1 cell">
				<view class="u-line-1">{{item.currentAllAddress || '-'}}</view>
				<view class="u-m-t-2 u-font-12 u-tips-color  u-line-1">{{item.remark || '-'}}</view>
			</view>
		</view>

		<r-phone v-if="phoneShow" v-model="phoneShow" :name="item.name" :phone="item.mobilephone" />
	</view>
</template>

<script>
	import { saveSearchUrl } from '@/api'

	export default {
		props: {
			item: { type: Object, required: true },
			isCall: { type: Boolean, default: false },
			isSearch: { type: Boolean, default: false },
			from: { type: String, default: '' }
		},
		data() {
			return {
				phoneShow: false,
				ifLongtap: true
			}
		},
		methods: {
			async handleDetail(item) {
				if (this.from === 'visiting') {
					uni.$u.vuex('vuex_oldMan', item)
					uni.navigateBack()
				} else if (this.from === 'visiting-search-result') {
					uni.$u.vuex('vuex_oldMan', item)
					uni.navigateBack({ delta: 2 })
				} else if (this.from === 'visiting-data-filter') {
					uni.$u.vuex('vuex_oldMan', item)
					uni.navigateBack({ delta: 3 })
				} else {
					uni.navigateTo({ url: `/pages/old-man/detail?id=${item.id}` })
					if (this.isSearch) {
						const params = { customerId: this.item.id, isSearch: 1, searchType: 0 }
						await uni.$u.http.post(saveSearchUrl, params)
					}
				}
				
			},
			handlePhone() {
				if (this.ifLongtap && this.isCall && this.item.mobilephone) {
					this.phoneShow = true
				}
			},
			touchEnd() {
				this.ifLongtap = true
			},
			touchMove() {
				// 手指触摸后的移动事件
				this.ifLongtap = false
			},
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		position: relative;
	}

	.cell {
		padding: 12px 5px;
	}

	.death {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>