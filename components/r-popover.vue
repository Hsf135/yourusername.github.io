<template>
	<view class="popver">
		<view @click="show = true">
			<slot></slot>
		</view>
		<u-transition :show="show">
			<view class="mask" @click="show=false"></view>
			<view class="popver-content" :style="popoverStyle">
				<view class="arrow" :style="arrowStyle"></view>
				<view v-for="l in list" :key="l.value" class="u-flex popver-item u-border-bottom" @click="handleItem(l)">
					<u-icon v-if="l.icon" :name="aIcon(l.icon)" width="20" height="20" class="u-m-r-4"></u-icon>
					<text>{{l.name}}</text>
				</view>
			</view>
		</u-transition>
	</view>
</template>

<script>
	export default {
		name: 'r-popover',
		props: {
			value: { type: [String, Number], default: '' },
			// value, name, icon
			list: { type: Array, default: () => [] },
			popoverStyle: { type: Object, default: () => {} },
			arrowStyle: { type: Object, default: () => {} },
		},
		data() {
			return { show: false }
		},
		methods: {
			handleItem(l) {
				this.show = false
				this.$emit('change', l)
				this.$emit('input', l.value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popver {
		position: relative;
		z-index: 99;
	}

	.popver-content {
		position: absolute;
		top: 40px;
		left: -10px;
		z-index: 99;
		width: 60px;
		padding: 0 16PX;
		background: #fff;
		border-radius: 8px;
	}

	.arrow {
		position: absolute;
		top: -8px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 12px solid transparent;
		border-right: 12px solid transparent;
		border-bottom: 8px solid #fff;
	}

	.popver-item {
		padding: 10px 0;
		color: $u-main-color;
	}

	.mask {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 1;
		background: rgba(0, 0, 0, 0.3);
	}
</style>