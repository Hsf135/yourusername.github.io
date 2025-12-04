import App from './App'
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import store from '@/store'
import { globalMixin } from '@/mixins'

const vuexStore = require('@/store/$u.mixin.js')

Vue.config.productionTip = false
App.mpType = 'app'

// 引入全局uView
Vue.use(uView)
Vue.mixin(vuexStore)
Vue.mixin(globalMixin)

// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)
// #endif

const app = new Vue({ ...App, store })
// 引入请求方式
require('@/utils/request.config.js')(app)

app.$mount()