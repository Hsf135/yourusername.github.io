<script>
	export default {
		data() {
			return {}
		},
		onLaunch() {
			// #ifdef APP-PLUS
			// this.initMsg()
			// this.clearBadge()
			// #endif
			this.updateVersion()
			if (!this.vuex_token) {
				uni.reLaunch({ url: '/pages/login/login' })
			}
		},
		methods: {
			initMsg() {
				let timer = null
				plus.push.addEventListener('click', msg => {
					this.clearBadge()
					clearTimeout(timer)
					timer = setTimeout(() => {
						if (msg.payload) {
							const query = JSON.parse(msg.payload)
							this.toPage(query)
						}
					}, 500)
				}, false)
				plus.push.addEventListener('receive', msg => {
					if (this.lastMsg.title === msg.title && this.lastMsg.content === msg.content) {
						return
					}
					this.lastMsg = msg
					const options = { cover: false, title: msg.title }
					// const payload = uni.$u.os() === 'ios' ? JSON.stringify(msg.payload) : msg.payload
					plus.push.createMessage(msg.content, JSON.stringify(msg.payload), options)
				}, false)
			},
			updateVersion() {
				// 各种小程序检查更新
				// #ifdef MP
				this.updateMp()
				// #endif
			},
			toPage(query) {
				let url = '/pages/login/login'
				if (query.action === 'detail') {
					url = `/pages/home/home?id=${query.content}`
				}
				if (!this.vuex_token) {
					this.$u.vuex('vuex_page', url)
					uni.reLaunch({ url: '/pages/login/login' })
					return
				}
				uni.navigateTo({ url })
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
								confirmColor: '#FF0000',
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
			},
			clearBadge() {
				if (uni.$u.os() === 'ios') {
					//设置应用图标的数量
					plus.runtime.setBadgeNumber(0)
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "@/styles/index.scss";
	@import "@/styles/iconfont.scss";
</style>