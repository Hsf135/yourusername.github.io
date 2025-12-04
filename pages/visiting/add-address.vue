<template>
	<view class="add-page">
		<u-navbar title="选择拜访地址" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="back"></u-icon>
			<view slot="right" class="u-flex">
				<text class="u-primary" @click="submit">完成</text>
			</view>
		</u-navbar>
		<u--form labelWidth="110px" :model="form" ref="form" :rules="rules">
			<view class="add-card">
				<u-form-item label="省" prop="province" borderBottom class="require-item">
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
				<u-form-item label="市/地区" prop="city" borderBottom class="require-item">
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
				<u-form-item label="区/县" prop="county" borderBottom class="require-item">
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
				<u-form-item label="街道" prop="street" borderBottom class="require-item">
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
				<u-form-item label="社区" prop="community" borderBottom class="require-item">
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
				<u-form-item label="小区" prop="village" borderBottom class="require-item">
					<u-input v-model="form.village" clearable maxlength="32" border="none" placeholder="小区"></u-input>
				</u-form-item>
				<u-form-item label="详细地址" prop="detailAddress" borderBottom class="require-item">
					<u-input v-model="form.detailAddress" clearable maxlength="32" border="none" placeholder="详细地址"></u-input>
				</u-form-item>
			</view>
		</u--form>
		<view class="card" @click="chooseAddress('old')">
			<view class="u-flex u-m-b-10">
				<u-icon :name="aIcon('gouxuan-xuanzhong')" width="20" height="20" v-if="oldChecked"></u-icon>
				<u-icon :name="aIcon('gouxuan-weixuanzhong')" width="20" height="20" v-else></u-icon>
				<view class="u-m-l-4" :class="oldManAllAddress ? 'u-primary' : 'u-tips-color'">选择老人现居地址作为拜访地址</view>
			</view>
			<view class="u-tips-color u-font-12">{{oldManAllAddress || '该老人暂无现居地址'}}</view>
		</view>
		<view class="card" @click="chooseAddress('my')">
			<view class="u-flex u-m-b-10">
				<u-icon :name="aIcon('gouxuan-xuanzhong')" width="20" height="20" v-if="myChecked"></u-icon>
				<u-icon :name="aIcon('gouxuan-weixuanzhong')" width="20" height="20" v-else></u-icon>
				<view class="u-primary u-m-l-4">选择自己所属区域作为拜访地址</view>
			</view>
			<view class="u-tips-color u-font-12">{{myAddress}}</view>
		</view>
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
		computed: {
			myAddress () {
				const data = this.vuex_user.dept
				return `${data.provinceName || ''}${data.cityName || ''}${data.countyName || ''}${data.streetName || ''}${data.communityName || ''}`
			},
			// 老人的现居地址
			oldManAllAddress () {
				const data = this.vuex_visitAddress.oldManAddress
				if (!data) return ''
				return data.allAddress
			},
			// 是否选择老人现居地址作为拜访地址
			oldChecked () {
				const data = this.vuex_visitAddress.oldManAddress
				if (!data) return false
				return data.province === this.form.province &&
				data.city === this.form.city &&
				data.county === this.form.county &&
				data.street === this.form.street &&
				data.community === this.form.community
			},
			// 是否选择我的所属区域作为拜访地址
			myChecked () {
				const data = this.vuex_user.dept
				return data.province === this.form.province &&
				data.city === this.form.city &&
				data.county === this.form.county &&
				data.street === this.form.street &&
				data.community === this.form.community
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
				if (this.vuex_visitAddress.province === undefined) {
					this.$u.vuex('vuex_visitAddress', { ...this.form })
				} else {
					Object.assign(this.form, this.vuex_visitAddress)
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
			chooseAddress (type) {
				if (type === 'old') {
					if (!this.oldManAllAddress) {
						uni.showToast({ title: '该老人暂无现居地址', icon: 'none', duration: 3000 })
						return
					}
					this.form.province = this.vuex_visitAddress.oldManAddress.province
					this.form.city = this.vuex_visitAddress.oldManAddress.city
					this.form.county = this.vuex_visitAddress.oldManAddress.county
					this.form.street = this.vuex_visitAddress.oldManAddress.street
					this.form.community = this.vuex_visitAddress.oldManAddress.community
					this.form.village = this.vuex_visitAddress.oldManAddress.village
					this.form.detailAddress = this.vuex_visitAddress.oldManAddress.detailAddress
				} else {
					this.form.province = this.vuex_user.dept.province
					this.form.city = this.vuex_user.dept.city
					this.form.county = this.vuex_user.dept.county
					this.form.street = this.vuex_user.dept.street
					this.form.community = this.vuex_user.dept.community
					this.form.village = ''
					this.form.detailAddress = ''
				}
				this.loadCity()
				this.loadCounty()
				this.loadStreet()
				this.loadCommunity()
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
				this.$u.vuex('vuex_visitAddress', { ...this.form })
				uni.navigateBack()
			},
			dialogConfirm() {
				this.unsave = false
				uni.navigateBack()
			},
			getLabel (key, val) {
				this.form[key] = val
				this.$u.vuex('vuex_visitAddress', { ...this.form })
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
	
	.card {
		background: #ffffff;
		border-radius: 8px;
		padding: 12px;
		margin-top: 12px;
	}
	
	.require-item {
		/deep/ .u-form-item__body__left__content__label {
			&::after {
				content: '*';
				color: $u-error;
			}
		}
	}
</style>
