<template>
	<view class="add-page">
		<!-- 新增标题 -->
		<u-navbar title="编辑服务地址" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="back"></u-icon>
			<view slot="right" class="u-flex">
				<text class="u-primary" @click="submit">保存</text>
			</view>
		</u-navbar>

		<u--form labelWidth="110px" :model="form" ref="form" :rules="rules">
			<view class="add-card">
				<view class="title">服务地址</view>
				<u-form-item label="省" prop="province" borderBottom>
					<r-select v-model="form.province" title="请选择省" valueKey="code" labelKey="name" :list="provinceList" @change="provinceChange" />
				</u-form-item>
				<u-form-item label="市/地区" prop="city" borderBottom>
					<r-select v-model="form.city" title="请选择市/地区" limitTips="请先选择省" valueKey="code" labelKey="name" :list="cityList" @change="cityChange" />
				</u-form-item>
				<u-form-item label="区/县" prop="county" borderBottom>
					<r-select v-model="form.county" title="请选择区/县" limitTips="请先选择市/地区" valueKey="code" labelKey="name" :list="countyList" @change="countyChange" />
				</u-form-item>
				<u-form-item label="街道" prop="street" borderBottom>
					<r-select v-model="form.street" title="请选择街道" limitTips="请先选择区/县" valueKey="code" labelKey="name" :list="streetList" @change="streetChange" />
				</u-form-item>
				<u-form-item label="社区" prop="community" borderBottom>
					<r-select v-model="form.community" title="请选择社区" limitTips="请先选择街道" valueKey="code" labelKey="name" :list="communityList" @change="communityChange" />
				</u-form-item>
				<u-form-item label="小区" prop="village" borderBottom>
					<u-input v-model="form.village" clearable maxlength="32" border="none" placeholder="小区">
					</u-input>
				</u-form-item>
				<u-form-item label="详细地址" prop="detail" borderBottom>
					<u-input v-model="form.detail" clearable maxlength="32" border="none" placeholder="详细地址">
					</u-input>
				</u-form-item>
			</view>
		</u--form>

		<view class="card" @click="chooseAddress('old')">
			<view class="u-flex u-m-b-10">
				<u-icon :name="aIcon('gouxuan-xuanzhong')" width="20" height="20" v-if="oldChecked"></u-icon>
				<u-icon :name="aIcon('gouxuan-weixuanzhong')" width="20" height="20" v-else></u-icon>
				<view class="u-primary u-m-l-4">选择老人现居地址作为服务地址</view>
			</view>
			<view class="u-tips-color u-font-12">{{oldManAllAddress}}</view>
		</view>
		<view class="card" @click="chooseAddress('my')">
			<view class="u-flex u-m-b-10">
				<u-icon :name="aIcon('gouxuan-xuanzhong')" width="20" height="20" v-if="myChecked"></u-icon>
				<u-icon :name="aIcon('gouxuan-weixuanzhong')" width="20" height="20" v-else></u-icon>
				<view class="u-primary u-m-l-4">选择自己所属区域作为服务地址</view>
			</view>
			<view class="u-tips-color u-font-12">{{myAddress}}</view>
		</view>

		<r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false" @confirm="toBack">
			<view slot="content" class="u-flex">
				<text>当前页面已做出修改，是否不保存就退出</text>
			</view>
		</r-dialog>
	</view>
</template>

<script>
	import { getRegionUrl, memberAddressListUrl, memberAddressSaveUrl, memberAddressUpdateUrl } from '@/api'

	export default {
		data() {
			return {
				loading: false,
				isEdit: false,
				show: false,
				unsave: false,
				radiovalue1: '',
				form: { province: '', city: '', county: '', street: '', community: '' },
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
					detail: { required: true, message: '请填写详细地址', trigger: ['blur', 'change'] }
				}
			}
		},
		computed: {
			myAddress() {
				const data = this.vuex_user.dept
				if (!(data.province && data.city && data.county && data.street && data.community)) return ''
				return `${data.provinceName}${data.cityName}${data.countyName}${data.streetName}${data.communityName}`
			},
			// 老人的现居地址
			oldManAllAddress() {
				const data = this.vuex_orderMemberInfo.currentAllAddress
				if (!data) return ''
				return data
			},
			// 是否选择老人现居地址作为拜访地址
			oldChecked() {
				const data = this.vuex_orderMemberInfo
				if (!data) return false
				return data.currentProvince === this.form.province &&
					data.currentCity === this.form.city &&
					data.currentCounty === this.form.county &&
					data.currentStreet === this.form.street &&
					data.currentCommunity === this.form.community
			},
			// 是否选择我的所属区域作为拜访地址
			myChecked() {
				const data = this.vuex_user.dept
				return data.province === this.form.province &&
					data.city === this.form.city &&
					data.county === this.form.county &&
					data.street === this.form.street &&
					data.community === this.form.community
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
			this.loadAddress()
			this.loadProvince()
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			back() {
				if (this.unsave) {
					this.show = true
				} else {
					uni.navigateBack()
				}
			},
			toBack() {
				uni.navigateBack()
			},
			submit() {
				this.$refs.form.validate().then(async () => {
					const url = this.form.id ? memberAddressUpdateUrl : memberAddressSaveUrl
					if (!this.form.id) {
						this.form.acquiescent = true
						this.form.memberid = this.vuex_orderMemberInfo.id
						this.form.contactman = this.vuex_orderMemberInfo.name
						this.form.mobilePhone = this.vuex_orderMemberInfo.mobilephone
					}
					this.form.addressList = [this.form.province, this.form.city, this.form.county, this.form.street, this.form.county]
					await uni.$u.http.post(url, this.form)
					uni.navigateBack()
				})
			},
			async loadAddress() {
				const { data } = await uni.$u.http.post(memberAddressListUrl, { memberid: this.vuex_orderMemberInfo.id })
				const item = data.find(d => d.acquiescent)
				if (item) {
					this.form = item
					this.loadCity()
					this.loadCounty()
					this.loadStreet()
					this.loadCommunity()
				}
			},
			async loadProvince() {
				const { list } = await uni.$u.http.get(getRegionUrl)
				this.provinceList = list
			},
			async loadCity() {
				if (!this.form.province) {
					this.cityList = []
					return
				}
				const params = { params: { parentCode: this.form.province } }
				const { list } = await uni.$u.http.get(getRegionUrl, params)
				this.cityList = list
			},
			async loadCounty() {
				if (!this.form.city) {
					this.countyList = []
					return
				}
				const params = { params: { parentCode: this.form.city } }
				const { list } = await uni.$u.http.get(getRegionUrl, params)
				this.countyList = list
			},
			async loadStreet() {
				if (!this.form.county) {
					this.streetList = []
					return
				}
				const params = { params: { parentCode: this.form.county } }
				const { list } = await uni.$u.http.get(getRegionUrl, params)
				this.streetList = list
			},
			async loadCommunity() {
				if (!this.form.street) {
					this.communityList = []
					return
				}
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
			chooseAddress(type) {
				if (type === 'old') {
					this.form.province = this.vuex_orderMemberInfo.currentProvince
					this.form.city = this.vuex_orderMemberInfo.currentCity
					this.form.county = this.vuex_orderMemberInfo.currentCounty
					this.form.street = this.vuex_orderMemberInfo.currentStreet
					this.form.community = this.vuex_orderMemberInfo.currentCommunity
					this.form.village = this.vuex_orderMemberInfo.currentVillage
				} else {
					this.form.province = this.vuex_user.dept.province
					this.form.city = this.vuex_user.dept.city
					this.form.county = this.vuex_user.dept.county
					this.form.street = this.vuex_user.dept.street
					this.form.community = this.vuex_user.dept.community
				}
				this.loadCity()
				this.loadCounty()
				this.loadStreet()
				this.loadCommunity()
			},
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
		padding: 12px;
		margin-bottom: 12px;
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