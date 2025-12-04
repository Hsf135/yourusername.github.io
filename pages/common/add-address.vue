<template>
	<view class="add-page">
		<u-navbar title="选择地址" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="back"></u-icon>
			<view slot="right" class="u-flex">
				<text class="u-primary" @click="submit">完成</text>
			</view>
		</u-navbar>
		<u--form labelWidth="110px" :model="form" ref="form" :rules="rules">
			<view class="add-card">
				<u-form-item label="省" prop="province" borderBottom>
					<r-select
						v-model="form.province"
						title="请选择省"
						valueKey="code"
						labelKey="name"
						:list="provinceList"
						@change="provinceChange"
						@getLabel="getLabel('provinceName', $event)"
					/>
				</u-form-item>
				<u-form-item label="市/地区" prop="city" borderBottom>
					<r-select
						v-model="form.city"
						title="请选择市/地区"
						limitTips="请先选择省"
						valueKey="code"
						labelKey="name"
						:list="cityList"
						@change="cityChange"
						@getLabel="getLabel('cityName', $event)"
					/>
				</u-form-item>
				<u-form-item label="区/县" prop="county" borderBottom>
					<r-select
						v-model="form.county"
						title="请选择区/县"
						limitTips="请先选择市/地区"
						valueKey="code"
						labelKey="name"
						:list="countyList"
						@change="countyChange"
						@getLabel="getLabel('countyName', $event)"
					/>
				</u-form-item>
				<u-form-item label="街道" prop="street" borderBottom>
					<r-select
						v-model="form.street"
						title="请选择街道"
						limitTips="请先选择区/县"
						valueKey="code"
						labelKey="name"
						:list="streetList"
						@change="streetChange"
						@getLabel="getLabel('streetName', $event)"
					/>
				</u-form-item>
				<u-form-item label="社区" prop="community" borderBottom>
					<r-select
						v-model="form.community"
						title="请选择社区"
						limitTips="请先选择街道"
						valueKey="code"
						labelKey="name"
						:list="communityList"
						@change="communityChange"
						@getLabel="getLabel('communityName', $event)"
					/>
				</u-form-item>
				<u-form-item labelWidth="0" label="" prop="village" borderBottom v-if="vuex_commonAddress.village !== undefined">
					<u-input v-model="form.village" clearable maxlength="32" border="none" placeholder="小区"></u-input>
				</u-form-item>
				<u-form-item labelWidth="0" label="" prop="detailAddress" borderBottom v-if="vuex_commonAddress.detailAddress !== undefined">
					<u-input v-model="form.detailAddress" clearable maxlength="32" border="none" placeholder="详细地址"></u-input>
				</u-form-item>
			</view>
		</u--form>
		<r-dialog
			v-model="show"
			title="监测到未保存信息"
			cancelText="否"
			confirmText="是"
			@cancel="show = false"
			@confirm="dialogConfirm"
		>
			<view slot="content" class="u-flex">
				<text>当前页面已做出修改，是否不保存就退出</text>
			</view>
		</r-dialog>
	</view>
</template>

<script>
	import { getRegionUrl } from '@/api'
	
	export default {
		data() {
			return {
				show: false,
				unsave: false,
				form: {
					province: '',
					provinceName: '',
					city: '',
					cityName: '',
					county: '',
					countyName: '',
					street: '',
					streetName: '',
					community: '',
					communityName: '',
					village: '',
					detailAddress: ''
				},
				provinceList: [],
				cityList: [],
				countyList: [],
				streetList: [],
				communityList: [],
				rules: {
					province: { required: true, message: '请选择省', trigger: ['blur', 'change'] },
					city: { required: true, message: '请选择市/地区', trigger: ['blur', 'change'] },
					county: { required: true, message: '请选择区/县', trigger: ['blur', 'change'] },
					street: { required: true, message: '请选择街道', trigger: ['blur', 'change'] },
					community: { required: true, message: '请选择社区', trigger: ['blur', 'change'] },
					village: { required: true, message: '请输入小区名称', trigger: ['blur'] },
					detailAddress: { required: true, message: '请输入详细地址', trigger: ['blur'] }
				},
				finish: false // 如果是点击“完成”按钮，则标记finish为true，用于onBackPress的处理
			}
		},
		watch: {
			form: {
				handler: function() {
					this.unsave = true
				},
				deep: true
			}
		},
		onLoad() {
			this.loadProvince()
			this.init()
		},
		onBackPress () {
			if (this.unsave && !this.finish) {
				this.show = true
				return true
			}
		},
		methods: {
			async loadProvince() {
				const { list } = await uni.$u.http.get(getRegionUrl)
				this.provinceList = list
			},
			async loadCity() {
				const params = { params: { parentCode: this.form.province } }
				const { list } = await uni.$u.http.get(getRegionUrl, params)
				this.cityList = list
			},
			async loadCounty() {
				const params = { params: { parentCode: this.form.city } }
				const { list } = await uni.$u.http.get(getRegionUrl, params)
				this.countyList = list
			},
			async loadStreet() {
				const params = { params: { parentCode: this.form.county } }
				const { list } = await uni.$u.http.get(getRegionUrl, params)
				this.streetList = list
			},
			async loadCommunity() {
				const params = { params: { parentCode: this.form.street } }
				const { list } = await uni.$u.http.get(getRegionUrl, params)
				this.communityList = list
			},
			async provinceChange(value, label) {
				this.form.provinceName = label
				this.cityList = []
				this.countyList = []
				this.streetList = []
				this.communityList = []
				this.form.city = ''
				this.form.county = ''
				this.form.street = ''
				this.form.community = ''
				this.loadCity()
			},
			async cityChange(value, label) {
				this.form.cityName = label
				this.countyList = []
				this.streetList = []
				this.communityList = []
				this.form.county = ''
				this.form.street = ''
				this.form.community = ''
				this.loadCounty()
			},
			async countyChange(value, label) {
				this.form.countyName = label
				this.streetList = []
				this.communityList = []
				this.form.street = ''
				this.form.community = ''
				this.loadStreet()
			},
			async streetChange(value, label) {
				this.form.streetName = label
				this.communityList = []
				this.form.community = ''
				this.loadCommunity()
			},
			async communityChange(value, label) {
				this.form.communityName = label
			},
			init() {
				if (this.vuex_commonAddress.province === undefined) {
					const data = { ...this.form }
					delete data.village
					delete data.detailAddress
					this.$u.vuex('vuex_commonAddress', data)
				} else {
					Object.assign(this.form, this.vuex_commonAddress)
					if (this.form.province) {
						Promise.all([
							this.loadCity(),
							this.loadCounty(),
							this.loadStreet(),
							this.loadCommunity()
						]).then(() => {
							this.resetUnSave()
						})
					}
				}
			},
			back() {
				if (this.unsave) {
					this.show = true
				} else {
					uni.navigateBack()
				}
			},
			submit() {
				this.$refs.form.validate().then(() => {
					this.confirm()
				}).catch(() => {
					uni.$u.toast('请完善必填项')
				})
			},
			confirm() {
				this.finish = true
				this.$u.vuex('vuex_commonAddress', { ...this.form })
				uni.navigateBack()
			},
			dialogConfirm() {
				this.unsave = false
				uni.navigateBack()
			},
			getLabel (key, val) {
				this.form[key] = val
				const data = { ...this.form }
				if (this.vuex_commonAddress.village === undefined) {
					delete data.village
					delete data.detailAddress
				}
				this.$u.vuex('vuex_commonAddress', data)
			},
			resetUnSave () {
				const timeId = setTimeout(() => {
					this.unsave = false
					clearTimeout(timeId)
				}, 100)
			}
		}
	}
</script>

<style scoped lang="scss">
	.add-page {
		box-sizing: border-box;
		background-color: #FAF9F7;
		position: relative;
		min-height: 100vh;
		padding: 12px 16px 24px;
	}

	.add-card {
		background: #ffffff;
		border-radius: 8px;
		padding: 0 12px 12px 12px;
	}
</style>
