import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let lifeData = {}

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData')
} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['vuex_user', 'vuex_token', 'vuex_router', 'vuex_dict', 'vuex_roles', 'vuex_roles_name', 'vuex_first', 'areaCode', 'areaProjectCode', 'singleProject']

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) !== -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData')
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {}
		tmp[key] = value
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp)
	}
}
const store = new Vuex.Store({
	// 下面这些值仅为示例，使用过程中请删除
	state: {
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_user: lifeData.vuex_user ? lifeData.vuex_user : {},
		vuex_token: lifeData.vuex_token ? lifeData.vuex_token : '',
		vuex_dict: lifeData.vuex_dict ? lifeData.vuex_dict : [],
		vuex_first: lifeData.vuex_first ? lifeData.vuex_first : '1',
		vuex_post_name: lifeData.vuex_post_name ? lifeData.vuex_post_name : [],
		vuex_roles: lifeData.vuex_roles ? lifeData.vuex_roles : [],
		vuex_roles_name: lifeData.vuex_roles_name ? lifeData.vuex_roles_name : [],
		vuex_router: lifeData.vuex_router ? lifeData.vuex_router : [],
		areaCode: lifeData.areaCode ? lifeData.areaCode : '',
		areaProjectCode: lifeData.areaProjectCode ? lifeData.areaProjectCode : '',
		// 0代表多项目 1代表单个非项目节点  2代表项目节点
		singleProject: lifeData.singleProject ? lifeData.singleProject : '0',
		vuex_tempObj: {}, // 存储跨页面临时数据
		vuex_disableInfo: {}, // 延伸残联服务数据存，储跨页面临时数据
		vuex_contactInfoList: [], // 基础联系人数据，存储跨页面临时数据
		vuex_addressInfo: {},
		vuex_addressInfoCopy: {},
		vuex_orderMemberInfo: {},
		vuex_projectEdit: {},
		vuex_oldMan: {}, // 编辑拜访信息-选择的老人
		vuex_external: [], // 编辑拜访信息-共同拜访人员(外部)
		vuex_visitAddress: {}, // 编辑拜访信息-拜访地址
		vuex_systemUser: { // 系统共用的，选择系统内部人员
			title: '', // 页面标题
			type: '', // 有些时候需要的类型区分
			list: []
		},
		vuex_commonAddress: { // 系统共用的，添加地址省市区，
			province: '',
			provinceName: '',
			city: '',
			cityName: '',
			county: '',
			countyName: '',
			street: '',
			streetName: '',
			community: '',
			communityName: ''
			// village: '',
			// detailAddress: ''
			// 如若需要小区和详细地址，则this.$u.vuex('vuex_commonAddress', {})的时候,需要添加village和detailAddress字段
		},
		vuex_zhucanInfo: {} // 助餐信息
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.')
			let saveKey = ''
			let len = nameArr.length
			if (nameArr.length >= 2) {
				let obj = state[nameArr[0]]
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]]
				}
				obj[nameArr[len - 1]] = payload.value
				saveKey = nameArr[0]
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value
				saveKey = payload.name
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		}
	}
})

export default store