<template>
	<view class="u-flex-1">
		<textarea v-model="text" v-bind="$attrs" class="com-textarea" placeholder-class="com-placeholder"></textarea>
		<view v-if="count" class="count">还可以输入{{$attrs.maxlength - text.length}}字</view>
	</view>
</template>

<script>
	export default {
		name: 'r-textarea',
		props: { value: { type: String, default: '' }, count: { type: Boolean, default: false } },
		data() {
			return {}
		},
		computed: {
			text: {
				get() {
					return this.value
				},
				set(val) {
					this.$emit('input', val)
				}
			}
		}
	}
</script>

<style lang="scss">
.count {
	margin-top: 5px;
	text-align: right;
	font-size: 12px;
	color: #999;
}
</style>