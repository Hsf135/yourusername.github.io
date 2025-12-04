<template>
	<view class="add-system-user">
		<u-navbar :title="pageTitle" placeholder bgColor="#faf9f7">
			<text slot="left" class="u-tips-color" @click="handleCancel">返回</text>
			<text slot="right" class="u-primary" @click="handleSave">保存</text>
		</u-navbar>
		<view class="u-p-16">
			<view class="top-box u-flex">
				<scroll-view scroll-x="true" :scroll-into-view="scrollId" scroll-with-animation class="selected-box u-flex">
					<view
						class="avatar"
						:style="{ backgroundColor: getAvatarColor(item.userName.charAt(0)) }"
						v-for="item in selectedList"
						:key="item.userId"
						:id="`id${item.userId}`"
						@click="handleRemove(item)"
					>
						{{item.userName.slice(item.userName.length - 2, item.userName.length)}}
					</view>
				</scroll-view>
				<view class="u-flex-1 input-box" @click="showPopup = true">搜索姓名</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="user-scroll-view" :style="{ height: `calc(100vh - 136px - ${barHeight}px)` }">
			<view v-if="currentDept.children && currentDept.children.length">
				<view v-for="item in currentDept.children" :key="item.id">
					<view class="user-item u-flex" v-if="item.userId" @click="handleUserClick(item)">
						<u-icon :name="aIcon('duoxuan-mian')" width="24" height="24" v-if="ids.includes(item.userId)"></u-icon>
						<u-icon :name="aIcon('duoxuan-xian')" width="24" height="24" v-else></u-icon>
						<view class="avatar u-m-l-12" :style="{ backgroundColor: getAvatarColor(item.userName.charAt(0)) }">
							{{item.userName.slice(item.userName.length - 2, item.userName.length)}}
						</view>
						<view class="u-flex-1">
							<view>{{item.userName}}</view>
							<view class="u-line-1 u-font-12 u-tips-color u-m-t-4" style="height: 16px;">{{item.roleName}}</view>
						</view>
					</view>
					<view class="dept-item u-flex" v-else @click="handleDeptClick(item)">
						<view class="u-flex-1">{{item.deptName}}</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
			<view class="empty-box" v-else>
				<image src="../../static/imgs/common/data-empty.png" class="empty-img"></image>
				<text class="u-tips-color">该部门暂无人员</text>
			</view>
		</scroll-view>
		<u-popup :show="showPopup" mode="right">
			<u-navbar title="搜索人员" placeholder bgColor="#faf9f7">
				<text slot="left" class="u-tips-color" @click="showPopup = false">返回</text>
				<text slot="right" class="u-primary" @click="showPopup = false">保存</text>
			</u-navbar>
			<view class="popup-input-box">
				<u-icon name="search" color="#ff9500" class="search-icon" :size="24"></u-icon>
				<input type="text" v-model="params.keyword" placeholder="搜索用户姓名" placeholder-style="color: #E0DEDC" class="input">
			</view>
			<scroll-view scroll-y="true" class="search-scroll-view" :style="{ height: `calc(100vh - 110px - ${barHeight}px)` }">
				<view v-if="resultList.length">
					<view v-for="item in resultList" :key="item.id" class="user-item u-flex" @click="handleUserClick(item)">
						<u-icon :name="aIcon('duoxuan-mian')" width="24" height="24" v-if="ids.includes(item.userId)"></u-icon>
						<u-icon :name="aIcon('duoxuan-xian')" width="24" height="24" v-else></u-icon>
						<view class="avatar u-m-l-12" :style="{ backgroundColor: getAvatarColor(item.userName.charAt(0)) }">
							{{item.userName.slice(item.userName.length - 2, item.userName.length)}}
						</view>
						<view class="u-flex-1">
							<view>{{item.userName}}</view>
							<view class="u-line-1 u-font-12 u-tips-color u-m-t-4" style="height: 16px;">{{item.roleName}}</view>
						</view>
					</view>
				</view>
				<view class="empty-box" v-else>
					<image src="../../static/imgs/common/data-empty.png" class="empty-img"></image>
					<text class="u-tips-color">{{params.keyword ? '暂无人员数据' : '请输入关键字搜索'}}</text>
				</view>
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	import { getCommonUsersUrl } from '@/api/index.js'
	import { getIndexLetter } from '@/utils/pinyin.js'
	
	export default {
		onLoad (options) {
			Object.assign(this.params, options)
			this.type = this.vuex_systemUser.type || ''
			this.pageTitle = this.vuex_systemUser.title || '选择人员'
			if (this.vuex_systemUser.list && this.vuex_systemUser.list.length) {
				this.selectedList = uni.$u.deepClone(this.vuex_systemUser.list)
			}
			this.loadData()
		},
		data () {
			return {
				params: {
					deptId: '',
					keyword: ''
				},
				type: '', // 某些业务可能需要做类型区分
				pageTitle: '', // 页面标题
				treeData: [], // 树形数据（所有部门+人员）
				currentDept: {}, // 当前预览的部门
				deptList: [], // 一级一级向下预览时，往这里存储部门，点击返回时，再从这里返回
				selectedList: [], // 已选用户列表
				scrollId: '', // scroll-view的滚动id
				returnType: '', // 区分返回方式，标记是否是通过点击“保存”返回的
				showPopup: false,
				timeId: null,
				allUserList: [] // 存储全部用户列表，用于搜索功能
			}
		},
		computed: {
			ids () {
				return this.selectedList.map(item => item.userId)
			},
			resultList () {
				if (this.params.keyword.trim() === '') return []
				return this.allUserList.filter(item => item.userName.toLowerCase().includes(this.params.keyword))
			}
		},
		onBackPress () {
			if (this.showPopup) {
				this.showPopup = false
				return true
			}
			// this.returnType !== 'save' ==> 不是通过“保存”按钮触发的返回
			if (this.returnType !== 'save' && this.deptList.length > 1) {
				this.currentDept = this.deptList[this.deptList.length - 2]
				this.deptList.splice(this.deptList.length - 1, 1)
				return true
			}
		},
		methods: {
			async loadData () {
				const { data } = await uni.$u.http.post(getCommonUsersUrl, this.params)
				this.treeData = data
				this.currentDept = { children: data }
				this.deptList = [this.currentDept]
				this.setAllUserList(data)
			},
			// 存储全部用户列表
			setAllUserList (list) {
				list.forEach(item => {
					if (item.userId) {
						this.allUserList.push(item)
					}
					if (item.children && item.children.length) {
						this.setAllUserList(item.children)
					}
				})
			},
			handleDeptClick (item) {
				this.currentDept = item
				this.deptList.push(item)
			},
			handleUserClick (item) {
				const index = this.selectedList.findIndex(i => i.userId === item.userId)
				if (index === -1) {
					this.selectedList.push(item)
					this.$nextTick(() => {
						this.scrollId = `id${item.userId}`
					})
				} else {
					this.selectedList.splice(index, 1)
				}
			},
			handleRemove (item) {
				const index = this.selectedList.findIndex(i => i.userId === item.userId)
				if (index !== -1) {
					this.selectedList.splice(index, 1)
				}
			},
			handleSave () {
				this.$u.vuex('vuex_systemUser', {
					title: this.pageTitle,
					type: this.type,
					list: uni.$u.deepClone(this.selectedList)
				})
				this.returnType = 'save'
				uni.navigateBack()
			},
			handleCancel () {
				if (this.deptList.length > 1) {
					this.currentDept = this.deptList[this.deptList.length - 2]
					this.deptList.splice(this.deptList.length - 1, 1)
				} else {
					uni.navigateBack()
				}
			},
			handleInput () {
				clearTimeout(this.timeId)
				this.timeId = setTimeout(() => {}, 600)
			},
			// 根据用户名首字母获取头像颜色
			getAvatarColor (word) {
				const letter = getIndexLetter(word)
				if (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(letter)) return '#FF9E4D'
				if (['H', 'I', 'J', 'K', 'L', 'M', 'N'].includes(letter)) return '#5CD7A8'
				if (['O', 'P', 'Q', 'R', 'S', 'T'].includes(letter)) return '#9370CA'
				return '#5B8FFC'
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}
	
	.add-system-user {
		height: 100%;
	}
	
	.top-box {
		padding: 8px 12px;
		border-radius: 8px;
		border: 1px solid #ebe9e6;
		background-color: #fff;
	}
	
	.input-box {
		line-height: 40px;
		color: $u-tips-color;
	}
	
	.selected-box {
		width: auto;
		max-width: 180px;
		margin-right: 8px;
		/deep/ .uni-scroll-view-content {
			width: auto;
			display: flex;
			align-items: center;
		}
	}
	
	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		flex-shrink: 0;
		margin-right: 8px;
		&:last-child {
			margin-right: 0;
		}
	}
	
	.user-scroll-view {
		background-color: #fff;
		border-radius: 16px 16px 0 0;
		padding: 12px 16px;
		box-sizing: border-box;
	}
	
	.user-item {
		padding: 12px 0;
		position: relative;
		&::after {
			position: absolute;
			content: '';
			right: 0;
			bottom: 0;
			width: calc(100% - 84px);
			height: 1px;
			background-color: #f5f3f0;
		}
	}
	
	.dept-item {
		height: 48px;
		border-bottom: 1px solid #f5f3f0;
	}
	
	.empty-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 0;
	}
	
	.empty-img {
		width: 146px;
		height: 120px;
		margin-bottom: 20px;
	}
	
	/deep/ .u-popup__content {
		background-color: #faf9f7;
	}
	
	.popup-input-box {
		padding: 12px 16px;
		position: relative;
	}
	
	.input {
		height: 40px;
		border-radius: 8px;
		border: 1px solid #EBE9E6;
		padding: 0 12px;
		background-color: #fff;
	}
	
	.search-icon {
		position: absolute;
		right: 28px;
		top: 50%;
		transform: translateY(-50%);
	}
	
	.search-scroll-view {
		width: 100vw;
		border-radius: 16px 16px 0 0;
		background-color: #fff;
		padding: 12px 16px;
		box-sizing: border-box;
	}
</style>