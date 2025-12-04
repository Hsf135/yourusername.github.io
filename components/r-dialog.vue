<template>
	<view>
		<u-popup :show="show" mode="center">
			<view class="dialog">
				<slot v-if="$slots['title']" name="title"></slot>
				<view v-else class="title">{{title}}</view>
				<view v-if="tips" class="tips" >{{ tips }}</view>
				<slot v-if="$slots['content']" name="content"></slot>
				<view v-else class="content">{{content}}</view>
		
				<slot v-if="$slots['btns']" name="btns"></slot>
				<view v-else-if="btnsShow" class="btns u-flex">
					<u-button v-if="cancelBtn" plain :text="cancelText" class="u-m-r-15" @click="handleCancel"></u-button>
					<slot v-if="$slots['confirm']" name="confirm"></slot>
					<u-button v-else type="primary" :text="confirmText" @click="confirm"></u-button>
				</view>
			</view>
			
			<view class="close" @click="handleClose">
				<u-icon :name="aIcon('guanbi-xian')" width="24" height="24" />
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: 'r-dialog',
		props: {
			value: { type: Boolean, default: false },
			title: { type: String, default: '' },
			content: { type: String, default: '' },
			confirmText: { type: String, default: '确定' },
			cancelBtn: { type: Boolean, default: true },
			cancelText: { type: String, default: '取消' },
			btnsShow: { type: Boolean, default: true },
			// 是否在点击“确定”后自动关闭弹窗，默认保持原有行为：自动关闭
			autoCloseOnConfirm: { type: Boolean, default: true },
			tips: { type: String, default: '' }, // 提示语
		},
		computed: {
			show: {
				get() {
					return this.value
				},
				set(val) {
					this.$emit('input', val)
				}
			}
		},
		data() {
			return {}
		},
		methods: {
			handleCancel() {
				this.$emit('cancel')
				this.handleClose()
			},
			confirm() {
				this.$emit('confirm')
				// 由外部决定是否关闭的场景，可以把 autoCloseOnConfirm 设为 false
				if (this.autoCloseOnConfirm) {
					this.handleClose()
				}
			},
			handleClose() {
				this.$emit('input', false)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dialog {
		width: 80vw;
		min-height: 170px;
		max-height: 70vh;
		overflow-y: auto;
		padding: 24px;
		box-sizing: border-box;
		background: #fff url('../static/imgs/common/dialog-bg.png') top center/100% 160px no-repeat;
		border-radius: 8px;
	}

	/deep/ .u-popup__content {
		border-radius: 8px;
	}

	.close {
		position: absolute;
		left: 50%;
		bottom: -40px;
		z-index: 99999;
		transform: translateX(-50%);
	}

	.title {
		margin-bottom: 16px;
		color: $u-main-color;
		font-size: 16px;
		font-weight: bold;
		text-align: center;
	}
	.tips{
		text-align: left;
		font-size:12px;
		color: red;
	}

	.content {
		line-height: 16px;
		color: $u-content-color;
		font-size: 14px;
		text-align: center;
	}

	.btns {
		margin-top: 24px;
	}
</style>