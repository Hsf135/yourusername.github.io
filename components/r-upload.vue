<template>
  <view class="r-upload">
    <u-upload accept="image" :fileList="fileList" multiple :deletable="!disabled" :disabled="disabled"
      uploadIconColor="#f5f5f5" uploadIcon="plus" :width="width" :height="width" :maxCount="maxCount"
      :class="{ disabled: disabled }" @afterRead="afterRead" @delete="deletePic"
      :uploadText="showLimit ? `${fileList.length}/${maxCount}` : ''"></u-upload>
    <r-dialog v-model="showModal" title="温馨提示" cancelText="取消" confirmText="确认" @cancel="showModal = false"
      @confirm="confirmDel">
      <view slot="content" class="u-flex u-flex-center">
        <text>是否确认移除该图片？</text>
      </view>
    </r-dialog>

    <r-dialog v-model="show" :title="dialogMsg.title" cancelText="不开启" confirmText="去开启" @cancel="cancel"
      @confirm="confirm">
      <view slot="content" class="u-flex">
        <view class="icon u-flex u-flex-xy-center">
          <u-icon :name="aIcon(dialogMsg.icon)" width="20" height="20"></u-icon>
        </view>
        <view class="u-m-l-8">
          <view class="subtitle">{{ dialogMsg.subtitle }}</view>
          <view class="desc">{{ dialogMsg.desc }}</view>
        </view>
      </view>
    </r-dialog>

    <view class="water-canvas">
      <canvas :style="`width:${canvasW}px; height:${canvasH}px`" :canvas-id="waterCanvas"></canvas>
    </view>
  </view>
</template>

<script>
import { uploadUrl, getNowDataUrl } from '@/api'
import {
  checkPermission,
  checkSystemEnableLocation,
  gotoSystemLocatonSetting,
  gotoAppPermissionSetting
} from '@/utils/permission'

export default {
  name: 'r-upload',
  props: {
    width: { type: [Number, String], default: 98 },
    value: { type: [String, Array], default: '' },
    maxCount: { type: Number, default: 9 },
    imgList: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    watermark: { type: Boolean, default: true },
    // firstLine； secondLine；thirdLine
    waterInfo: {
      type: Object, default: () => {
        return {
          firstLine: '',
          secondLine: '',
          thirdLine: ''
        }
      }
    },
    showLimit: { type: Boolean, default: false }
  },
  computed: {
    imgs: {
      get() {
        if (Array.isArray(this.value)) {
          return this.value
        }
        return this.value ? this.value.split(',') : []
      },
      set(val) {
        this.setValue(val)
      }
    },
    // 合并动态值和 waterInfo，优先使用动态值
    finalWaterInfo() {
      return {
        firstLine: this.vuex_user.username || this.waterInfo.firstLine || '未获取到信息',
        secondLine: this.address || this.waterInfo.secondLine || '未获取到信息',
        thirdLine: this.nowTime || this.waterInfo.thirdLine || '未获取到信息'
      }
    },
    dialogMsg() {
      return this.dialog[this.dialogType] || this.dialog.location
    }
  },
  watch: {
    imgList() {
      this.fileList = uni.$u.deepClone(this.imgList)
    }
  },
  data() {
    return {
      fileList: [],
      canvasW: 1440,
      canvasH: 1440,
      showModal: false,
      imgIndex: 0,
      waterCanvas: 'waterCanvas',
      address: '未获取到信息',
      nowTime: '未获取到信息',
      show: false,
      dialogType: 'location',
      dialog: {
        location: {
          title: '需开启定位权限',
          subtitle: '定位权限',
          desc: '拍照需要水印，请开启"位置服务"!',
          icon: 'weizhi-mian'
        },
        appLocation: {
          title: '需开启定位权限',
          subtitle: '定位权限',
          desc: '拍照需要水印，请开启"位置服务"!',
          icon: 'weizhi-mian'
        },
      }
    }
  },
  mounted() {
    this.fileList = uni.$u.deepClone(this.imgList)
    this.waterCanvas = 'waterCanvas' + uni.$u.guid(12)
  },
  methods: {
    // 上传图片删除方法
    deletePic({ index }) {
      this.imgIndex = index
      this.showModal = true
    },
    confirmDel() {
      this.fileList.splice(this.imgIndex, 1)
      this.imgs.splice(this.imgIndex, 1)
      this.setValue(this.imgs)
    },
    async getTime() {
      try {
        const { data } = await uni.$u.http.post(getNowDataUrl)
        this.nowTime = data
      } catch (e) {
        console.log(e)
        this.nowTime = '未获取到信息'
      }
    },
    getAddress() {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: 'gcj02',
          geocode: true,
          success: ({ address = {} }) => {
            const { country = '', province, city, district, street, streetNum, poiName } = address
            if (province) {
              this.address = country + province + city + district + street + streetNum + poiName
            } else {
              this.address = '未获取到信息'
            }
            resolve(this.address)
          },
          fail: async e => {
            console.log(e)
            if (!checkSystemEnableLocation()) {
              this.dialogType = 'location'
              this.show = true
              reject(e)
              return
            }
            if (!await checkPermission('location')) {
              this.dialogType = 'appLocation'
              this.show = true
              reject(e)
              return
            }
            this.address = '未获取到信息'
            resolve(this.address)
          }
        })
      })
    },
    async checkLocationPermission() {
      // #ifdef APP-PLUS
      if (!checkSystemEnableLocation()) {
        this.dialogType = 'location'
        this.show = true
        return false
      }
      if (!await checkPermission('location')) {
        this.dialogType = 'appLocation'
        this.show = true
        return false
      }
      // #endif
      return true
    },
    cancel() {
      uni.showToast({ title: `${this.dialogMsg.subtitle}未开启，无法使用该功能`, icon: 'none' })
      this.show = false
    },
    confirm() {
      this.show = false
      if (this.dialogType === 'location') {
        gotoSystemLocatonSetting()
        return
      }
      gotoAppPermissionSetting()
    },
    // 新增图片
    async afterRead(event) {
      uni.showLoading({ mask: true, title: '照片上传中，请稍等' })

      // 如果开启了水印，先获取定位和时间信息
      if (this.watermark) {
        // 检查定位权限
        const hasPermission = await this.checkLocationPermission()
        if (!hasPermission) {
          uni.hideLoading()
          return
        }
        // 获取时间和地址
        await Promise.all([this.getTime(), this.getAddress()])
      }

      // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file)
      let fileListLen = this.fileList.length
      lists.map(item => {
        this.fileList.push({
          ...item,
          status: 'uploading',
          message: '上传中'
        })
      })
      try {
        for (let i = 0; i < lists.length; i++) {
          if (this.watermark) {
            lists[i].url = await this.drawPhoto(lists[i].url)
          }
          const { id, url } = await this.uploadFilePromise(lists[i].url)
          let item = this.fileList[fileListLen]
          this.fileList.splice(
            fileListLen,
            1,
            Object.assign(item, {
              status: 'success',
              message: '',
              url,
              id
            })
          )
          this.imgs.push(id)
          this.setValue(this.imgs)
          fileListLen++
        }
        uni.hideLoading()
      } catch (e) {
        console.log(e)
        uni.hideLoading()
      }
    },
    uploadFilePromise(filePath) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: uploadUrl,
          filePath,
          name: 'file',
          header: { Authorization: this.vuex_token },
          success: res => {
            if (res.statusCode === 200) {
              const data = JSON.parse(res.data)
              if (data.code === 200) {
                resolve({
                  url: this.getFullImg(data.data.path),
                  id: data.data.id,
                  status: 'success'
                })
                return
              }
              if (data.code === 401) {
                uni.showToast({
                  title: data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
              reject({
                url: filePath,
                status: 'failed'
              })
            } else {
              reject({
                url: filePath,
                status: 'failed'
              })
            }
            uni.hideLoading()
          },
          fail: err => {
            reject(err)
            uni.hideLoading()
          }
        })
      })
    },
    // 参照 r-upload-demo 中在 iOS 上表现正常的实现，简化为稳定版本
    drawPhoto(path) {
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src: path,
          success: res => {
            const ctx = uni.createCanvasContext(this.waterCanvas)
            this.canvasW = res.width
            this.canvasH = res.height
            ctx.drawImage(path, 0, 0, res.width, res.height)

            ctx.setFillStyle('#ffffff')
            ctx.fillRect(30, res.height - 190, 10, 160)

            const fontFamily = uni.getSystemInfoSync().platform === 'ios' ? 'Sthginkra' : 'DingTalkJinBuTi'
            ctx.font = `normal 30px ${fontFamily}`

            ctx.setFontSize(30)
            ctx.setFillStyle('#ffffff')
            ctx.fillText(this.finalWaterInfo.firstLine, 60, res.height - 150)
            ctx.fillText(this.finalWaterInfo.secondLine, 60, res.height - 100)
            ctx.fillText(this.finalWaterInfo.thirdLine, 60, res.height - 50)

            ctx.draw(false, () => {
              uni.canvasToTempFilePath({
                canvasId: this.waterCanvas,
                success: ({ tempFilePath }) => {
                  resolve(tempFilePath)
                },
                fail: e => {
                  console.log('canvas转图片失败', e)
                  reject(e)
                }
              })
            })
          },
          fail: e => {
            console.log('获取图片信息失败', e)
            reject(e)
          }
        })
      })
    },
    setValue(val) {
      let imgs = val
      if (!Array.isArray(this.value)) {
        imgs = this.imgs.join(',')
      }
      this.$emit('input', imgs)
    }
  }
}
</script>

<style lang="scss" scoped>
.water-canvas {
  overflow: hidden;
  position: absolute;
  top: -999999rpx;
  width: 100%;
}

/deep/ .u-upload__button {
  position: relative;
  margin-right: 46px;
}

/deep/ .u-upload__button__text {
  position: absolute;
  left: calc(100% + 10px);
  bottom: 0;
  font-size: 14px;
  color: $u-tips-color;
}

/deep/ .u-upload__wrap__preview__image {
  border-radius: 8px;
}

/deep/ .u-upload__button {
  border-radius: 8px;
}

/deep/ .uicon-plus {
  font-size: 24px;
  color: $u-primary !important;
}

.disabled {
  /deep/ .u-upload__button--disabled {
    display: none;
  }
}

.icon {
  width: 40px;
  height: 40px;
  background: #FFF9F0;
  border-radius: 50%;
}

.subtitle {
  color: $u-main-color;
}

.desc {
  font-size: 12px;
  color: $u-tips-color;
}

/deep/ .u-upload__deletable {
  width: 20px;
  height: 20px;

  .u-upload__deletable__icon {
    top: 4px;
  }

  .uicon-close {
    font-size: 16px !important;
  }
}
</style>
