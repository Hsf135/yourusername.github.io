<template>
	<view class="filter-box">
		<u-navbar title="老人数据筛选" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>

		<view class="base-box">
			<text class="title">基础筛选</text>
			<u--form labelPosition="left" :model="form" ref="uForm" labelWidth="110">
				<u-form-item label="是否人户一致" prop="entryFamilyFlag" borderBottom>
					<r-select v-model="form.entryFamilyFlag" :list="[{label: '是', value: 1}, {label: '否', value: 0}]" />
				</u-form-item>
				<u-form-item label="是否为服务对象" prop="disableObject" borderBottom>
					<r-select v-model="form.isServiceObj" :list="[{label: '是', value: 1}, {label: '否', value: 0}]" />
				</u-form-item>
				<u-form-item label="年龄范围" prop="ageEnd" borderBottom @click="ageShow = true">
					<text v-if="form.ageEnd !== ''">{{form.ageBegin}}-{{form.ageEnd}}</text>
					<text v-else class="u-place-color">请选择(可选)</text>
					<u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
				</u-form-item>
				<u-form-item label="生日月份" prop="birthMonth" borderBottom>
					<r-select v-model="form.birthMonth" :list="monthList" />
				</u-form-item>
				<u-form-item label="户籍地址" prop="domicileAllAddress" borderBottom @click="handleSelectAddress('domicile')">
					<text v-if="form.domicileAllAddress">{{form.domicileAllAddress}}</text>
					<text v-else class="u-place-color">请选择(可选)</text>
					<u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
				</u-form-item>
				<u-form-item label="居住地址" prop="currentAddress" borderBottom @click="handleSelectAddress('current')">
					<text v-if="form.currentAllAddress">{{form.currentAllAddress}}</text>
					<text v-else class="u-place-color">请选择(可选)</text>
					<u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
				</u-form-item>
			</u--form>
		</view>

		<u-collapse :border="false" :value="['1','2']">
			<u-collapse-item title="老人分类" name="1" class="collapse-box">
				<view class="u-collapse-content u-flex u-flex-wrap">
					<u-tag v-for="(item,index) in elderList" :key="item.value" :text="item.label" :plain="item.checked"
						:name="item.value" class="tag-item" @click="checkElder(index,item.value)"></u-tag>
				</view>
			</u-collapse-item>
			<u-collapse-item title="慢性病" name="2" class="collapse-box">
				<view class="u-collapse-content u-flex u-flex-wrap">
					<u-tag v-for="(item,index) in chronicDiseaseList" :key="item.value" :text="item.label" :plain="item.checked"
						:name="item.value" class="tag-item" @click="checkChronic(index,item.value)"></u-tag>
				</view>
			</u-collapse-item>
			<u-collapse-item title="自理情况" name="2" class="collapse-box">
				<view class="u-collapse-content u-flex u-flex-wrap">
					<u-tag v-for="(item,index) in selfCareList" :key="item.value" :text="item.label" :plain="item.checked"
						:name="item.value" class="tag-item" @click="checkSelfCare(index,item.value)"></u-tag>
				</view>
			</u-collapse-item>
		</u-collapse>

		<view class="btn fixed-footer u-flex">
			<u-button text="清除筛选" class="u-m-r-12" @click="handleClear"></u-button>
			<u-button type="primary" text="确认筛选" class="confirm" @click="handleConfirm"></u-button>
		</view>

		<u-picker :show="ageShow" ref="uPicker" :columns="ageColumns" closeOnClickOverlay :defaultIndex="[60, 0, 80]" @confirm="ageConfirm"
			@cancel="ageShow = false" @close="ageShow = false"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				from: '', // 来自于哪个页面
				form: {
					entryFamilyFlag: '',
					isServiceObj: '',
					ageBegin: '',
					ageEnd: '',
					birthMonth: '',
					domicileAddress: '',
					currentAddress: '',
					elderClassifyOld: [],
					chronicDisease: [],
					selfCareSelfRating: [],
					currentAllAddress: '',
					domicileAllAddress: ''
				},
				elderList: [],
				chronicDiseaseList: [],
				selfCareList: [],
				monthList: [],
				ageShow: false,
				ageColumns: [
					[],
					['至'],
					[]
				]
			}
		},
		onLoad({ from }) {
			if (from) {
				this.from = from === 'visiting' ? 'visiting-data-filter' : from
			}
			this.elderList = this.dictList('elder_classify')
			this.chronicDiseaseList = this.dictList('chronic_disease')
			this.selfCareList = this.dictList('self_care_self_rating')
			for (let i = 1; i <= 12; i++) {
				this.monthList.push({ label: `${i}月`, value: i })
			}

			for (let i = 0; i <= 130; i++) {
				this.ageColumns[0].push(i)
				this.ageColumns[2].push(i)
			}
		},
		onShow() {
			this.addressCallback()
		},
		onUnload() {
			this.$u.vuex('vuex_addressInfo', {})
		},
		methods: {
			handleConfirm() {
				this.$u.vuex('vuex_tempObj', this.form)
				uni.navigateTo({ url: this.from ? `/pages/old-man/search-result?type=filter&from=${this.from}` : '/pages/old-man/search-result?type=filter' })
			},
			handleClear() {
				this.form = {
					entryFamilyFlag: '',
					disableObject: '',
					ageBegin: '',
					ageEnd: '',
					birthMonth: '',
					domicileAddress: '',
					currentAddress: '',
					elderClassifyOld: [],
					chronicDisease: [],
					selfCareSelfRating: [],
					currentAllAddress: '',
					domicileAllAddress: ''
				}
				this.elderList = this.dictList('elder_classify')
				this.chronicDiseaseList = this.dictList('chronic_disease')
				this.selfCareList = this.dictList('self_care_self_rating')
			},
			dictList(key) {
				return this.aDict(key).map(item => {
					return { ...item, checked: false }
				})
			},
			checkElder(index, item) {
				this.elderList[index].checked = !this.elderList[index].checked
				this.checkArray(this.form.elderClassifyOld, item)
			},
			checkChronic(index, item) {
				this.chronicDiseaseList[index].checked = !this.chronicDiseaseList[index].checked
				this.checkArray(this.form.chronicDisease, item)
			},
			checkSelfCare(index, item) {
				this.selfCareList[index].checked = !this.selfCareList[index].checked
				this.checkArray(this.form.selfCareSelfRating, item)
			},
			ageConfirm({ value }) {
				if (value[0] > value[2]) {
					this.$u.toast('开始年龄不能大于结束年龄')
					return
				}
				this.form.ageBegin = value[0]
				this.form.ageEnd = value[2]
				this.ageShow = false
			},
			addressCallback() {
				// 读取所有地址相关字段，包括户籍地址和居住地址
				const addressFields = {}
				for (let key in this.vuex_addressInfo) {
					// 包含 domicile（户籍）或 current（居住）的字段，以及 addrType
					if (key.includes('domicile') || key.includes('current') || key === 'addrType') {
						addressFields[key] = this.vuex_addressInfo[key]
					}
				}
				// 合并到 form 中，保留其他字段
				Object.assign(this.form, addressFields)
			},
			handleSelectAddress(type) {
				// 先获取现有的地址信息，保留其他类型的地址数据
				const existingAddressInfo = this.vuex_addressInfo || {}
				const addrObj = { 
					...existingAddressInfo, // 保留已有的其他类型地址信息
					addrType: type 
				}
				// 更新当前类型的地址字段
				for (let key in this.form) {
					if (key.includes(type)) {
						addrObj[key] = this.form[key]
					}
				}
				this.$u.vuex('vuex_addressInfo', addrObj)
				this.toPage(`/pages/old-man/components/add-address?type=${type}&mode=select`)
			},

		}
	}
</script>

<style lang="scss" scoped>
	.base-box {
		margin: 6px 16px;
	}

	.collapse-box {
		margin: 6px 16px;
		background: #fff;
		border-radius: 8px;
		border-top: 0;
	}

	/deep/ .u-icon__icon--info {
		color: $u-primary !important;
	}

	.tag-item {
		margin: 0 12px 12px 0;
	}

	/deep/ .u-tag--square {
		border-radius: 8px;
	}

	/deep/ .u-tag--primary {
		background-color: #faf9f7 !important;
		border-color: #faf9f7 !important;
	}

	/deep/ .u-tag__text--primary {
		color: #666462 !important;
	}

	/deep/ .u-tag--primary--plain {
		background: #fff9f0;
		border: 1px solid #ff9500;
		position: relative;
	}

	/deep/ .u-tag--primary--plain::after {
		content: ' ';
		position: absolute;
		bottom: -1px;
		right: -1px;
		width: 14px;
		height: 14px;
		background: url('/static/icon/a-tag-check.png') no-repeat;
		background-size: 100% 100%;
	}

	/deep/ .u-tag__text--primary--plain {
		color: #ff9500 !important;
	}

	.btn {
		background: #ffffff;
		border-top: 1px solid #eeeeee;
		padding: 12px 32px;
	}

	.filter-box {
		padding-bottom: 70px;
	}

	.title {
		font-size: 15px;
		font-weight: bold;
		color: #1a1a1a;
		line-height: 20px;
	}

	/deep/ .u-cell__title-text {
		font-weight: bold;
		font-size: 15px !important;
	}
</style>