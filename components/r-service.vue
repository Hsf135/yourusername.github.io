<template>
	<view class="u-border-bottom">
		<view class="item u-p-l-5 u-flex " @click="showButton = !showButton" @longpress="handlePhone">
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
				<view class="u-line-1">本月服务次数：{{item.monthServeCount || 0}}</view>
				<!-- <view v-if="item.bookCount" class="u-m-t-2 u-font-12 u-error u-line-1">预约次数：{{item.bookCount || 0}}</view>
				<view v-else class="u-m-t-2 u-font-12 u-success u-line-1">无预约</view> -->
			</view>
			<view class="u-flex-1 cell">
				<view class="u-line-1">{{phoneEncrypted(item.mobilephone)}}</view>
				<view class="u-m-t-2 u-font-12 u-tips-color  u-line-1">{{item.currentCommunityName || ''}}{{item.currentVillage || ''}}</view>
			</view>
		</view>
		<view v-if="showButton">
			<view class="divider"></view>
			<view class="u-flex">
				<u-button class="u-primary" type="link" text="查看详情" @click="handleDetail"></u-button>
				<!-- <u-button class="u-primary" type="link" :disabled="!item.bookCount" text="查看预约"></u-button> -->
				<u-button class="u-primary" type="link" :text="isSelect === '1' ? '选择对象': '创建订单'" @click="handleSelect"></u-button>
				<u-button class="u-primary" type="link" text="拨打电话" @click="phoneShow = true"></u-button>
			</view>

		</view>

		<r-phone v-if="phoneShow" v-model="phoneShow" :name="item.name" :phone="item.mobilephone" />
	</view>
</template>

<script>
	import { saveSearchUrl } from '@/api'
	import { phoneEncrypted } from '@/utils'

	export default {
		props: {
			item: { type: Object, required: true },
			isSelect: { type: String, default: '0' },
			isSearch: { type: Boolean, default: false }
		},
		data() {
			return {
				phoneEncrypted,
				phoneShow: false,
				showButton: false
			}
		},
		methods: {
			async handleDetail() {
				this.recoredSave()
				uni.navigateTo({ url: `/pages/order/components/object-detail?id=${this.item.id}` })
			},
			handleSelect() {
				this.recoredSave()
				this.$u.vuex('vuex_orderMemberInfo', this.item)
				if (this.isSelect === '1') {
					uni.navigateBack()
					return
				}
				if (!this.isSingleProject) {
					uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
					return
				}
				uni.navigateTo({ url: '/pages/order/add-order' })
			},
			async recoredSave() {
				if (this.isSearch) {
					const params = { customerId: this.item.id, isSearch: 1, searchType: 1 }
					await uni.$u.http.post(saveSearchUrl, params)
				}
			}
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

	.button-box {
		height: 48px;
	}

	.divider {
		border-bottom: 1px solid #f5f3f0;
		margin: 0 12px;
	}
</style>