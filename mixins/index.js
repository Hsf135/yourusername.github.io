import { preImgUrl } from '@/config'
import { appUpdateListUrl } from '@/api'
import { compareVersion, copy } from '@/utils'
const deviceInfo = uni.getSystemInfoSync()

// 状态栏高度
export const globalMixin = {
  computed: {
    barHeight() {
      return deviceInfo.statusBarHeight
    },
    // 底部安全高度
    bottomSafeHeight() {
      return deviceInfo.screenHeight - deviceInfo.safeArea.bottom
    },
    fwryappFuwushang() {
      return this.vuex_roles.includes('fwryapp_fuwushang')
    },
    isXiaMen() {
      if (this.vuex_user.dept && this.vuex_user.dept.city) {
        return this.vuex_user.dept.city == '350200000000'
      }
      return false
    },
		isSingleProject() {
			// 0代表多项目 1代表单个非项目节点  2代表项目节点
			// 多多项目 不可添加拜访/订单/活动等操作
			return this.singleProject == '1'
		}
  },
  methods: {
    getFullImg(path) {
      return preImgUrl + path
    },
    aIcon(name) {
      return `/static/icon/a-mingcheng${name}.png`
    },
    // 查询字典
    aDict(name) {
      return this.vuex_dict.find(item => item.type == name).list
    },
    // 多选字典回显
    checkDict(key, dict) {
      if (!key) {
        return
      }
      return this.aDict(dict)
        .filter(item => key.includes(item.value))
        .map(item => item.label)
        .join('，')
    },
    // 单选字典回显
    radioDict(key, dict) {
      // if (!key) {
      //   return
      // }
      return this.aDict(dict)
        .filter(item => item.value == key)
        .map(item => item.label)
        .join('，')
    },
    // 字典排序处理
    matchLabels(numbers, dict) {
      const labelArray = numbers
        ? numbers.map((num, index) => {
            const matchingItem = this.aDict(dict).find(item => item.value === num.toString())
            return matchingItem ? index + 1 + '.' + matchingItem.label : null
          })
        : []

      return labelArray.join('，')
    },
    checkArray(array, element) {
      const index = array.indexOf(element)
      if (index !== -1) {
        array.splice(index, 1) // 如果存在，从数组中移除
      } else {
        array.push(element) // 如果不存在，添加到数组中
      }
    },
    toPage(url) {
      uni.navigateTo({ url })
    },
    handleBack() {
      uni.navigateBack()
    }
  }
}

export const upgradeMixin = {
  data() {
    return {
      description: '', // 更新说明
      apkUrl: '',
      currentVersion: '', // 当前版本号
      newestVersion: '', // 最新版本的版本号
      isNewest: false // 是否是最新版本
    }
  },
  methods: {
    // app检查更新
    loadNewVersion() {
      plus.runtime.getProperty(plus.runtime.appid, async info => {
        this.currentVersion = info.version
        const res = await uni.$u.http.post(appUpdateListUrl, {
          osType: this.$u.os(),
          versionCode: info.version
        })
        const data = res.data[0] || {}
        this.description = data.instruction || ''
        this.newestVersion = data.versionCode || '1.0.0' // 最新版本
        this.apkUrl = data.url
        const result = compareVersion(this.newestVersion, info.version)
        this.isNewest = result < 1 // 标记是否是最新版本
        // 判断是否强制更新
        if (data.isUpdate === '1' && result > 0) {
          this.downloadToast(data.url, false)
        }
      })
    },
    downloadApp(url) {
      if (this.$u.os() !== 'android') {
        // ios需要到浏览器下载更新
        copy('https://www.pgyer.com/Hq1xE6')
        return
      }
      uni.showLoading({ title: '更新中……' })
      uni.downloadFile({
        url,
        success: downloadResult => {
          uni.hideLoading()
          if (downloadResult.statusCode === 200) {
            uni.hideLoading()
            plus.runtime.install(
              downloadResult.tempFilePath,
              { force: false },
              () => {
                plus.runtime.restart()
              },
              e => {
                uni.hideLoading()
                console.log(e)
                uni.showToast({ title: e.message, icon: 'none' })
              }
            )
          }
        }
      })
    },
    // 弹出更新提示
    downloadToast(url, showCancel) {
      const androidContent = `发现新的应用安装包（V${this.newestVersion}），点击确定立即更新！`
      const iosContent = `发现新的应用安装包（V${this.newestVersion}），点击确定复制链接到浏览器打开，并按提示下载更新！`
      const content = this.$u.os() === 'android' ? androidContent : iosContent
      uni.showModal({
        title: '更新提示',
        content: this.description || content,
        showCancel,
        success: e => {
          if (e.confirm) {
            this.downloadApp(url)
          }
        }
      })
    },
    updateVersion() {
      // 各种小程序检查更新
      // #ifdef MP
      this.updateMp()
      // #endif
      // #ifdef APP-PLUS
      this.loadNewVersion()
      // #endif
    },
    updateMp() {
      const updateManager = uni.getUpdateManager()
      updateManager.onCheckForUpdate(checkInfo => {
        // 请求完新版本信息的回调
        if (checkInfo.hasUpdate) {
          updateManager.onUpdateReady(() => {
            uni.showModal({
              title: '更新提示',
              content: '发现新版本，是否重启应用?',
              cancelColor: '#eeeeee',
              confirmColor: '#7848ef',
              success(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        uni.showModal({
          title: '提示',
          content: '检查到有新版本，但下载失败，请检查网络设置',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
    }
  }
}
