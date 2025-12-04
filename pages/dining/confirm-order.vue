<template>
	<view class="confirm-order">
		<u-navbar title="点餐步骤3:确认菜单" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<u--form labelWidth="110px" :model="form" ref="formRef" style="padding: 0 12px;">
			<view class="form-card">
				<u-form-item label="就餐菜单" prop="serveName" borderBottom>
					<view>{{form.serveName}}</view>
				</u-form-item>
				<u-form-item label="就餐方式" prop="eatModel" borderBottom>
					<r-select v-model="form.eatModel" placeholder="请选择就餐方式" :list="aDict('eat_model')"></r-select>
				</u-form-item>
				<u-form-item label="就餐人" prop="customerName" borderBottom>
					<view>
						<text>{{form.customerName}}</text>
						<text class="u-m-l-6" v-if="form.sex">| {{form.sex}}</text>
						<text class="u-m-l-6" v-if="form.age">| {{form.age}}岁</text>
					</view>
				</u-form-item>
				<u-form-item label="就餐金额" prop="totalMoney" borderBottom>
					<view>￥{{form.totalMoney}}</view>
				</u-form-item>
			</view>
			<view class="form-card" style="padding-bottom: 0;">
				<u-form-item label="就餐卡号" prop="activityPhotos">
					<view>{{form.subsidyCard || '-'}}</view>
				</u-form-item>
				<u-form-item label="使用就餐补贴" prop="activityPhotos" v-if="form.subsidyList.length">
					<r-select v-model="form.useSubsidy" placeholder="请选择是否使用就餐补贴" :list="[{ label: '是', value: '1' }, { label: '否', value: '0' }]"></r-select>
				</u-form-item>
				<u-form-item label="就餐补贴" prop="subsidyInfoName" v-if="form.useSubsidy === '1'">
					<view class="u-flex u-flex-1" @click="showPopup = true">
						<view class="u-flex-1" v-if="form.subsidyInfoName">{{form.subsidyInfoName}}</view>
						<view v-else class="u-place-color u-flex-1">请选择就餐补贴</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="补贴金额" prop="subsidyMoney" v-if="form.useSubsidy === '1'">
					<view>{{form.subsidyMoney}}</view>
				</u-form-item>
				<u-form-item label="自费方式" prop="expenseModel">
					<r-select v-model="form.expenseModel" placeholder="请选择自费方式" :list="aDict('expense_model')"></r-select>
				</u-form-item>
				<u-form-item label="自费金额" prop="expenseMoney">
					<view class="u-error">￥{{form.expenseMoney}}</view>
				</u-form-item>
			</view>
		</u--form>
		<view class="fixed-footer u-flex">
			<u-button class="cancel-btn" @click="handleBack">取消</u-button>
			<u-button type="primary" class="pay-btn" @click="handlePay">去支付</u-button>
		</view>
		<u-popup :show="showPopup" mode="center">
			<view class="dialog">
				<view class="title">选择使用补贴</view>
				<view class="u-content-color u-p-20" v-if="!usableList.length">暂无可用补贴</view>
				<view class="content" v-if="usableList.length">
					<view class="radio" @click="handleChooseSubsidy({ subsidyInfoId: '', name: '不使用' })">
						<view>不使用</view>
						<u-icon :name="aIcon('gouxuan-xuanzhong')" width="24" height="24" v-if="form.subsidyInfoId === ''"></u-icon>
						<u-icon :name="aIcon('gouxuan-weixuanzhong')" width="24" height="24" v-else></u-icon>
					</view>
					<view class="radio" v-for="item in usableList" :key="item.subsidyInfoId" @click="handleChooseSubsidy(item)">
						<view>{{item.name}}</view>
						<view class="u-flex u-m-l-10">
							<text class="u-error u-m-r-8 no-wrap">余￥{{item.balance}}</text>
							<u-icon :name="aIcon('gouxuan-xuanzhong')" width="24" height="24" v-if="form.subsidyInfoId === item.subsidyInfoId"></u-icon>
							<u-icon :name="aIcon('gouxuan-weixuanzhong')" width="24" height="24" v-else></u-icon>
						</view>
					</view>
				</view>
				<view class="no-use-box" v-if="unusableList.length">
					<view class="u-content-color u-m-b-12">不可用补贴:</view>
					<view>
						<view v-for="item in unusableList" :key="item.subsidyInfoId" class="no-use-item">
							<view class="u-flex u-flex-between u-tips-color">
								<view>{{item.name}}</view>
								<view class="no-wrap">余￥{{item.balance}}</view>
							</view>
							<view class="u-font-12 u-error u-m-t-4" v-if="item.balance > Number(form.totalMoney)">(补贴金额高于就餐金额，自费金额不可小于0)</view>
							<view class="u-font-12 u-error u-m-t-4" v-if="item.balance <= 0">(余额不足)</view>
						</view>
					</view>
				</view>
			</view>
			<view class="close" @click="showPopup = false">
				<u-icon :name="aIcon('guanbi-xian')" width="24" height="24" />
			</view>
		</u-popup>
		<r-dialog
			v-model="showPayConfirm"
			title="支付确认"
			cancelText="返回修改"
			confirmText="确认支付"
			@cancel="showPayConfirm = false"
			@confirm="handleConfirm">
			<view slot="content">
				<view class="u-m-b-12">
					<text class="u-content-color u-m-r-10">本次订单总金额:</text>
					<text class="u-main-color">￥{{form.totalMoney}}</text>
				</view>
				<view class="u-m-b-12" v-if="form.useSubsidy === '1' && form.subsidyInfoName">
					<text class="u-content-color u-m-r-10">补贴金额:</text>
					<text class="u-error">￥{{form.subsidyMoney}}</text>
				</view>
				<view class="u-m-b-12">
					<text class="u-content-color u-m-r-10">自费金额:</text>
					<text class="u-error">￥{{form.expenseMoney}}</text>
				</view>
				<view class="u-error u-font-12">提示：支付成功后，订单不支持取消或修改，请确保在收到“自费金额”的情况下，再“确认支付”。</view>
			</view>
		</r-dialog>
	</view>
</template>

<script>
	import Decimal from 'decimal.js'
	import { diningSaveUrl } from '@/api/dining.js'
	
	export default {
		onLoad () {
			this.loadData()
		},
		data () {
			return {
				form: {
					// 展示所需字段
					age: '',
					sex: '',
					useSubsidy: '', // 自定义字段，是否使用就餐补贴 0=否 1=是
					subsidyList: [],
					// 提交所需字段
					customerName: '',
					customerPhone: '',
					eatModel: '',
					expenseModel: '',
					expenseMoney: '', // 自费金额
					id: '',
					memberId: '',
					month: '',
					serveId: '',
					serveName: '',
					serveOptionId: '',
					source: '',
					stationId: '',
					stationName: '',
					subsidyCard: '',
					subsidyCardId: '',
					subsidyInfoId: '',
					subsidyInfoName: '',
					subsidyMoney: '',
					totalMoney: '' // 就餐金额
				},
				showPopup: false,
				showPayConfirm: false // 支付确认
			}
		},
		computed: {
			// 可用补贴列表
			usableList () {
				return this.form.subsidyList.filter(item => {
					if (item.subsidyAmount) { // 存在补贴上限
						return item.balance > 0 && item.subsidyAmount < Number(this.form.totalMoney) // 补贴上限必须小于订单金额
					}
					return item.balance > 0
				})
			},
			// 不可用补贴列表
			unusableList () {
				return this.form.subsidyList.filter(item => {
					if (item.balance <= 0) return true
					// 补贴上限大于就餐金额，就不可用；比如补贴上限120元，就餐金额100元，这种情况不可用
					return Boolean(item.subsidyAmount && item.subsidyAmount > Number(this.form.totalMoney))
				})
			}
		},
		watch: {
			'form.useSubsidy' (val) {
				if (val === '0') {
					this.form.expenseMoney = this.form.totalMoney
				}
			}
		},
		methods: {
			loadData () {
				Object.assign(this.form, this.vuex_zhucanInfo)
				this.form.expenseMoney = this.form.totalMoney
				this.form.useSubsidy = this.usableList.length ? '1' : '0'
			},
			handleChooseSubsidy (item) {
				if (item.subsidyInfoId === '') {
					this.form.subsidyInfoId = ''
					this.form.subsidyInfoName = ''
					this.form.subsidyMoney = ''
					this.form.expenseMoney = this.form.totalMoney
					this.form.useSubsidy = '0'
				} else {
					this.form.subsidyInfoId = item.subsidyInfoId
					this.form.subsidyInfoName = item.name
					if (item.subsidyAmount) { // 存在补贴上限
						this.form.subsidyMoney = item.subsidyAmount // 补贴金额=补贴上限
					} else { // 没设置补贴上限
						this.form.subsidyMoney = item.balance > Number(this.form.totalMoney) ? this.form.totalMoney : item.balance
					}
					const num1 = new Decimal(Number(this.form.totalMoney))
					const num2 = new Decimal(Number(this.form.subsidyMoney))
					this.form.expenseMoney = num1.minus(num2).toString()
				}
				this.showPopup = false
			},
			handlePay () {
				if (!this.form.eatModel) return uni.$u.toast('请选择就餐方式')
				if (!this.form.expenseModel) return uni.$u.toast('请选择自费方式')
				this.showPayConfirm = true
			},
			async handleConfirm () {
				try {
					uni.showLoading({
						title: '请求中，请稍候...',
						mask: true
					})
					const { data } = await uni.$u.http.post(diningSaveUrl, {
						customerName: this.form.customerName,
						customerPhone: this.form.customerPhone,
						eatModel: this.form.eatModel,
						expenseModel: this.form.expenseModel,
						expenseMoney: this.form.expenseMoney,
						memberId: this.form.memberId,
						month: this.form.month,
						serveId: this.form.serveId,
						serveName: this.form.serveName,
						serveOptionId: this.form.serveOptionId,
						source: '1', // 数据字典station_source，1=APP
						stationId: this.form.stationId,
						stationName: this.form.stationName,
						subsidyCard: this.form.subsidyCard,
						subsidyCardId: this.form.subsidyCardId,
						subsidyInfoId: this.form.subsidyInfoId,
						subsidyInfoName: this.form.subsidyInfoName,
						subsidyMoney: this.form.subsidyMoney || 0,
						totalMoney: this.form.totalMoney
					})
					uni.navigateTo({
						url: `/pages/dining/pay-result?id=${data}`
					})
				} finally {
					uni.hideLoading()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-card {
		background-color: #fff;
		border-radius: 8px;
		padding: 0 12px 12px 12px;
		margin: 12px 0;
	}
	
	.cancel-btn {
		width: 35%;
		flex-shrink: 0;
	}
	
	.pay-btn {
		margin-left: 12px;
	}
	
	.dialog {
		width: 80vw;
		min-height: 200px;
		max-height: 60vh;
		overflow-y: auto;
		padding: 24px;
		box-sizing: border-box;
		background: #fff url('../../static/imgs/common/dialog-bg.png') top center/100% 160px no-repeat;
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
	
	.content {
		color: $u-main-color;
		font-size: 14px;
	}
	
	.radio {
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.no-use-box {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid #f5f3f0;
	}
	
	.no-use-item {
		margin-bottom: 12px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.no-wrap {
		flex-shrink: 0;
		white-space: nowrap;
	}
</style>
