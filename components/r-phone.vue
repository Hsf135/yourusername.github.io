<template>
	<view>
		<r-dialog v-model="show" title="拨打电话" :cancelBtn="false" confirmText="确认拨打电话" @confirm="confirm">
			<view slot="content" class="content">
				<view class="u-m-b-8">{{name}}</view>
				<view v-if="phone.includes(',')" class="">
					<u-radio-group v-model="curPhone" labelColor="#000" activeColor="#FF9500" placement="column" iconPlacement="right">
						<u-radio v-for="p in phone.split(',')" :key="p" :label="p" :name="p" :customStyle="{padding: '10px 0'}">{{phoneEncrypted(p)}}</u-radio>
					</u-radio-group>
				</view>
				<view v-else class="u-main-color">{{phoneEncrypted(phone)}}</view>
			</view>
		</r-dialog>
	</view>
</template>

<script>
	import { phoneEncrypted } from '@/utils'

	export default {
		name: 'r-phone',
		props: {
			value: { type: Boolean, default: false },
			name: { type: String, default: '' },
			phone: { type: [String, Number], default: '' }
		},
		data() {
			return {
				phoneEncrypted,
				curPhone: ''
			}
		},
		computed: {
			show: {
				get() {
					return this.value
				},
				set(val) {
					this.$emit('input', val)
				}
			},
		},
		mounted() {
			if (this.phone.includes(',')) {
				this.curPhone = this.phone.split(',')[0]
			}
		},
		methods: {
			confirm() {
				if (!this.curPhone) {
					this.curPhone = this.phone.split(',')[0]
				}
				const phoneNumber = this.phone.includes(',') ? this.curPhone : this.phone
				uni.makePhoneCall({ phoneNumber })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		text-align: center;
		font-size: 14px;
	}
</style>