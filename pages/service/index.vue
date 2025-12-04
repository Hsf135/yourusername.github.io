<template>
	<view>
		<u-navbar title="应用" placeholder>
			<view slot="left"></view>
			<r-camera slot="right" />
		</u-navbar>

		<template v-for="m in vuex_router">
			<view class="base-box" v-if="m.children" :key="m.name">
				<view class="title">{{m.meta.title}}</view>
				<u-grid col="4" v-if="m.children">
					<u-grid-item v-for="i in m.children" :key="i.name" @click="handleItem(i)">
						<view class="item u-flex u-flex-xy-center" :class="[findlist(i).ground]">
							<u-icon :name="aIcon(findlist(i).icon)" width="24" height="24"></u-icon>
							<u-badge v-if="i.count" max="99" :value="i.count" absolute :offset="[-5, -5]"></u-badge>
						</view>
						<text class="grid-text u-font-14">{{findlist(i).name}}</text>
					</u-grid-item>
				</u-grid>
			</view>
		</template>

		<r-dialog v-model="show" title="温馨提醒" content="是否拨打热线电话954989" @confirm="handlePhone"></r-dialog>
	</view>
</template>

<script>
	import { orderPageUrl } from '@/api'
	import { getRegionByAccountUrl } from '@/api/dining.js'

	export default {
		data() {
			return {
				show: false,
				stationInfo: {}, // 人员助餐站点信息
				list: [{
						name: '新建老人',
						url: '/pages/old-man/add',
						icon: 'xinjianlaoren',
						ground: 'add'
					},
					{
						name: '老人',
						url: '/pages/old-man/list',
						icon: 'laoren',
						ground: 'list'
					},
					{
						name: '拜访记录',
						url: '/pages/visiting/list',
						icon: 'weiwancheng',
						ground: 'list'
					},
					{
						name: '入户排行',
						url: '/pages/visiting/ranking-list',
						icon: 'jiangbei',
						ground: 'add'
					},
					{
						name: '活动',
						url: '/pages/activity/list',
						icon: 'liwu',
						ground: 'add'
					},
					{
						name: '接单',
						url: '/pages/plat-order/take-order',
						icon: 'jiedan',
						ground: 'add'
					},
					{
						name: '未完成',
						url: '/pages/plat-order/order-list?finish=0',
						icon: 'weiwancheng',
						ground: 'list'
					},
					{
						name: '已完成',
						url: '/pages/plat-order/order-list?finish=1',
						icon: 'yiwancheng',
						ground: 'list'
					},
					{
						name: '新建订单',
						url: '/pages/order/add-order',
						icon: 'addorder',
						ground: 'add'
					},
					{
						name: '服务对象',
						url: '/pages/order/service-object',
						icon: 'baifangjilu',
						ground: 'add'
					},
					{
						name: '订单记录',
						url: '/pages/order/order-list',
						icon: 'dingdan',
						ground: 'list'
					},
					{
						name: '刷卡点餐',
						url: '/pages/dining/nfc',
						icon: 'shuaka',
						ground: 'list'
					},
					{
						name: '人工点餐',
						url: '/pages/dining/search-old-man',
						icon: 'diancan',
						ground: 'add'
					},
					{
						name: '就餐记录',
						url: '/pages/dining/list',
						icon: 'jiucanjilu',
						ground: 'list'
					},
					{
						name: '拨打954989',
						url: '',
						icon: 'phone-1',
						ground: 'list'
					},
					{
						name: '欢孝商城',
						url: '',
						icon: 'shop-1',
						ground: 'add'
					}
				]
			}
		},
		onShow() {
			this.loadOrderCount()
			this.loadStationInfo()
		},
		methods: {
			async loadOrderCount() {
				this.vuex_router.forEach(async r => {
					if (r.children && r.children.length) {
						const item = r.children.find(item => item.meta.title === '接单')
						if (item) {
							const { data } = await uni.$u.http.post(orderPageUrl, { isReceive: 0 })
							this.$set(item, 'count', data.total)
						}
					}
				})
			},
			async loadStationInfo () {
				const { data } = await uni.$u.http.post(getRegionByAccountUrl)
				this.stationInfo = data || {}
			},
			handleItem(i) {
				if (i.meta.title === '拨打954989') {
					this.show = true
					return
				}
				if (i.meta.title === '欢孝商城') {
					this.handleShop()
					return
				}
				if (['新建订单', '新建老人'].includes(i.meta.title) && !this.isSingleProject) {
					uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
					return
				}
				if (i.meta.title === '人工点餐' && !this.stationInfo.stationName) {
					uni.showToast({ title: '您的账号未配置助餐站点，请联系管理员进行配置', icon: 'none' })
					return
				}
				this.toPage(this.findlist(i).url)
			},
			handlePhone() {
				uni.makePhoneCall({ phoneNumber: '954989' })
			},
			handleShop() {
				// #ifdef APP-PLUS
				plus.share.getServices(res => {
					const sweixin = res.find(i => i.id === 'weixin')
					if (sweixin) {
						sweixin.launchMiniProgram({
							id: 'gh_efc89ae4c120',
							path: 'pages/index/index',
							type: 0
						}, res => {
							console.log('res', JSON.stringify(res))
						}, err => {
							console.log('err', JSON.stringify(err))
						})
					} else {
						// 没有获取到微信分享服务 
						uni.showToast({ icon: 'none', title: '未安装微信,无法打开对应小程序' })
					}
				}, err => {
					console.error(err, 'err')
					// 获取分享服务列表失败  
				})
				// #endif
			},
			toPage(url) {
				uni.navigateTo({ url })
			},
			findlist(data) {
				return this.list.find(item => item.name === data.meta.title) || {}
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

	.item {
		position: relative;
		margin-bottom: 4px;
		width: 40px;
		height: 40px;
		border-radius: 16px;

		&.list {
			background: #eff7ff;
		}

		&.add {
			background: #fff9f0;
		}
	}
</style>