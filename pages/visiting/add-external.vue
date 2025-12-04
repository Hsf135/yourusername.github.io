<template>
	<view class="add-external">
		<u-navbar title="添加共同拜访(外部)" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="back"></u-icon>
			<view slot="right" class="u-flex">
				<text class="u-primary" @click="submit">完成</text>
			</view>
		</u-navbar>
		<view class="box">
			<u-swipe-action>
				<u-swipe-action-item v-for="(item, index) in list" :key="item.id" :options="options" @click="handleRemoveClick(index)">
					<view class="swipe-action u-border-bottom">
						<view class="swipe-action__content">
							<view class="li">
								<u-icon name="minus-circle" color="#f56c6c" @click="handleRemoveClick(index)"></u-icon>
								<textarea
									rows="10"
									v-model="item.name"
									class="textarea u-flex-1"
									placeholder="请输入人员姓名(最多不超过10个字)"
									placeholder-style="color: #c0c4cc;"
									maxlength="10"
									focus
								></textarea>
								<u-icon name="close-circle-fill" color="#d4dce5" :size="16" v-show="item.name" @click="handleClearName(item)"></u-icon>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
			<view class="u-flex add-btn" @click="handleAdd">
				<u-icon name="plus-circle" color="#FF9500"></u-icon>
				<text class="u-m-l-4 u-primary">继续添加</text>
			</view>
		</view>
		<r-dialog v-model="showDialog" title="系统提示" cancelText="取消" confirmText="删除" @cancel="cancel" @confirm="confirm">
			<view slot="content" class="u-flex">
				<view>是否删除该拜访人员？</view>
			</view>
		</r-dialog>
	</view>
</template>

<script>
	export default {
		onLoad () {
			this.init()
		},
		data () {
			return {
				list: [],
				options: [{ text: '删除', style: { backgroundColor: '#f56c6c' } }],
				showDialog: false,
				index: 0
			}
		},
		methods: {
			init () {
				if (this.vuex_external && this.vuex_external.length) {
					this.list = [...this.vuex_external]
				} else {
					this.list = [{ id: Math.random().toString(), name: '' }]
				}
			},
			handleAdd () {
				this.list.push({ id: Math.random().toString(), name: '' })
			},
			handleRemoveClick (index) {
				this.index = index
				this.showDialog = true
			},
			handleClearName (item) {
				item.name = ''
			},
			confirm () {
				this.showDialog = false
				this.list.splice(this.index, 1)
			},
			cancel () {
				this.showDialog = false
			},
			back () {
				uni.navigateBack()
			},
			submit () {
				uni.$u.vuex('vuex_external', this.list.filter(item => item.name.trim() !== ''))
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		padding: 0 12px 12px 12px;
		border-radius: 8px;
		background-color: #fff;
		margin: 12px;
	}
	
	.li {
		padding: 12px 0;
		height: 46px;
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
	}
	
	.textarea {
		border: none;
		outline: none;
		appearance: none;
		font-size: 14px;
		margin-left: 4px;
		padding-top: 2px;
	}
	
	.add-btn {
		padding-top: 12px;
	}
</style>