<template>
	<u-popup :show="show" mode="right" :custom-style="{ backgroundColor: '#faf9f7' }">
		<u-navbar title="选择社区(可多选)" placeholder bgColor="#faf9f7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleReturn"></u-icon>
			<view slot="right" class="u-primary" @click="handleConfirm">保存</view>
		</u-navbar>
		<scroll-view scroll-y="true" class="community-scroll-view" :style="{ height: `calc(100vh - 44px - ${barHeight}px)` }">
			<view v-for="item in treeData" :key="item.id" class="street-box">
				<view class="street-item" @click="item.show = !item.show">
					<view class="u-flex">
						<u-icon name="arrow-right" :size="14" color="#999"></u-icon>
						<view class="u-font-16 u-m-l-4">{{item.name}}</view>
					</view>
					<view @click.stop="handleAllCheck(item)">
						<u-icon :name="item.checked ? aIcon('duoxuan-mian') : aIcon('duoxuan-xian')" :size="20"></u-icon>
					</view>
				</view>
				<view v-show="item.show">
					<view class="community-item" v-for="child in item.childrens" :key="child.id">
						<view>{{child.name}}</view>
						<view @click="handleCheck(item, child)">
							<u-icon :name="child.checked ? aIcon('duoxuan-mian') : aIcon('duoxuan-xian')" :size="20"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</u-popup>
</template>

<script>
	import { getStreetTreeUrl } from '@/api/activity.js'
	
	export default {
		data () {
			return {
				show: false,
				treeData: [],
				names: []
			}
		},
		mounted () {
			this.loadTreeData()
		},
		methods: {
			open (name) {
				if (name) {
					this.names = name.split(',')
					this.treeData.forEach(item => {
						let count = 0
						if (item.childrens && item.childrens.length) {
							item.childrens.forEach(i => {
								if (this.names.includes(i.name)) {
									i.checked = true
									count++
								} else {
									i.checked = false
								}
							})
							item.checked = count === item.childrens.length
						}
					})
				}
				this.show = true
			},
			async loadTreeData () {
				uni.showLoading({
					title: '加载中，请稍候...',
					mask: true
				})
				try {
					const { data } = await uni.$u.http.post(getStreetTreeUrl)
					data.map(item => {
						item.checked = false
						item.show = false
						if (item.childrens && item.childrens.length) {
							item.childrens.forEach(item => {
								item.checked = false
							})
						}
					})
					this.treeData = data
				} finally {
					uni.hideLoading()
				}
			},
			handleAllCheck (item) {
				item.checked = !item.checked
				if (item.childrens && item.childrens.length) {
					item.childrens.forEach(i => {
						i.checked = item.checked
					})
				}
			},
			handleCheck (item, child) {
				child.checked = !child.checked
				if (item.childrens && item.childrens.length) {
					let count = 0
					item.childrens.forEach(i => {
						if (i.checked) {
							count++
						}
					})
					item.checked = count === item.childrens.length
				}
			},
			handleConfirm () {
				const names = []
				this.treeData.forEach(item => {
					if (item.childrens && item.childrens.length) {
						item.childrens.forEach(i => {
							if (i.checked) {
								names.push(i.name)
							}
						})
					}
				})
				this.$emit('updateCommunity', names.join(','))
				this.handleReturn()
			},
			handleReturn () {
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.community-scroll-view {
		width: 100vw;
		box-sizing: border-box;
	}
	.street-box {
		padding: 0 18px;
	}
	.street-item {
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #e0e0e0;
	}
	.community-item {
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #e0e0e0;
		padding-left: 40px;
	}
</style>
