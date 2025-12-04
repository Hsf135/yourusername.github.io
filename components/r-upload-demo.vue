<template>
    <view class="r-upload">
        <!-- 拍摄视频 demo -->
      <u-upload accept="image" :fileList="fileList" multiple :deletable="!disabled" :disabled="disabled"
        uploadIconColor="#f5f5f5" uploadIcon="plus" :width="width" :height="width" :maxCount="maxCount"
        :class="{ disabled: disabled }" @afterRead="afterRead" @delete="deletePic" @click-preview="handlePreview"
        :uploadText="showLimit ? `${fileList.length}/${maxCount}` : ''">
        <!-- 自定义预览插槽 -->
        <template #file="{ file, index }">
          <view class="upload-item" @click.stop="handlePreview(file, index)">
            <image v-if="!file.isVideo" :src="file.url" mode="aspectFill" class="preview-image"></image>
            <view v-else class="video-preview">
              <image :src="file.thumb || file.url" mode="aspectFill" class="preview-image"></image>
              <view class="play-icon">
                <u-icon name="play-circle-fill" :size="32" color="rgba(255, 255, 255, 0.9)"></u-icon>
              </view>
              <view class="video-duration" v-if="file.duration">
                {{ formatDuration(file.duration) }}
              </view>
            </view>
          </view>
        </template>
      </u-upload>
  
      <!-- 删除确认弹窗 -->
      <r-dialog v-model="showModal" title="温馨提示" cancelText="取消" confirmText="确认" @cancel="showModal = false"
        @confirm="confirmDel">
        <view slot="content" class="u-flex u-flex-center">
          <text>是否确认移除该{{ currentDelType === 'video' ? '视频' : '图片' }}？</text>
        </view>
      </r-dialog>
  
      <!-- 自定义初始选择弹窗 -->
      <view v-if="showChoiceModal" class="custom-modal-mask" @click.stop="closeModal">
        <view class="custom-modal" @click.stop>
          <view class="modal-header">提示</view>
          <view class="modal-content">
            <view class="modal-item" @click="handleChoiceVideo">
              <text class="modal-item-text">拍摄视频</text>
            </view>
            <view class="modal-item" @click="handleChoicePhoto">
              <text class="modal-item-text">拍摄照片</text>
            </view>
          </view>
          <view class="modal-footer" @click="closeModal">
            <text class="modal-cancel-text">取消</text>
          </view>
        </view>
      </view>
  
      <view class="water-canvas">
        <canvas :style="`width:${canvasW}px; height:${canvasH}px`" :canvas-id="waterCanvas"></canvas>
      </view>
    </view>
  </template>
  
  <script>
  import { uploadUrl } from '@/api'
  
  export default {
    name: 'r-upload',
    props: {
      width: { type: [Number, String], default: 98 },
      value: { type: [String, Array], default: '' },
      maxCount: { type: Number, default: 9 },
      imgList: { type: Array, default: () => [] },
      disabled: { type: Boolean, default: false },
      watermark: { type: Boolean, default: false },
      waterInfo: { type: Object, default: () => { } },
      showLimit: { type: Boolean, default: false },
      enableVideo: { type: Boolean, default: true },
      maxVideoSize: { type: Number, default: 50 * 1024 * 1024 },
      maxVideoDuration: { type: Number, default: 60 },
      showInitChoice: { type: Boolean, default: true } // 是否显示初始选择弹窗
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
        showChoiceModal: false, // 初始选择弹窗
        imgIndex: 0,
        waterCanvas: 'waterCanvas',
        currentDelType: 'image'
      }
    },
    mounted() {
      this.fileList = uni.$u.deepClone(this.imgList)
      this.waterCanvas = 'waterCanvas' + uni.$u.guid(12)
      
      // 如果启用了初始选择且文件列表为空，则显示选择弹窗
      if (this.showInitChoice && this.fileList.length === 0) {
        this.$nextTick(() => {
          this.showChoiceModal = true
        })
      }
    },
    methods: {
      // 选择拍照
      handleChoicePhoto() {
        this.showChoiceModal = false
        this.$nextTick(() => {
          uni.chooseImage({
            count: this.maxCount - this.fileList.length,
            sizeType: ['compressed'],
            sourceType: ['camera', 'album'], // 相机和相册都可以选择
            success: (res) => {
              this.afterRead({ file: res.tempFilePaths.map(path => ({ url: path })) })
            },
            fail: (err) => {
              console.log('拍照失败:', err)
            }
          })
        })
      },
  
      // 选择拍视频
      handleChoiceVideo() {
        this.showChoiceModal = false
        this.$nextTick(() => {
          this.chooseVideo()
        })
      },
  
      // 从相册选择
      handleChoiceFromAlbum() {
        this.$nextTick(() => {
          uni.chooseImage({
            count: this.maxCount - this.fileList.length,
            sizeType: ['compressed'],
            sourceType: ['album'], // 从相册选择
            success: (res) => {
              this.afterRead({ file: res.tempFilePaths.map(path => ({ url: path })) })
            },
            fail: (err) => {
              console.log('选择照片失败:', err)
            }
          })
        })
      },
  
      // 关闭弹窗
      closeModal() {
        this.showChoiceModal = false
      },
  
      // 格式化视频时长
      formatDuration(duration) {
        const minutes = Math.floor(duration / 60)
        const seconds = Math.floor(duration % 60)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      },
  
      // 处理预览
      handlePreview(file, index) {
        console.log('点击预览1111', file, index)
  
        if (file.isVideo) { 
          // 预览视频
          uni.previewMedia({
            sources: [{
              url: file.url,
              type: 'video',
              poster: file.thumb
            }],
            current: 0,
            fail: (err) => {
              console.log('视频预览失败:', err)
              uni.showToast({
                title: '视频预览失败',
                icon: 'none'
              })
            }
          })
        } else {
          // 预览图片
          const images = this.fileList.filter(item => !item.isVideo).map(item => item.url)
          const current = images.indexOf(file.url)
          uni.previewImage({
            urls: images,
            current: current >= 0 ? current : 0
          })
        }
      },
  
      // 选择视频
      chooseVideo() {
        console.log('选择视频')
        uni.chooseVideo({
          sourceType: ['camera', 'album'],
          maxDuration: this.maxVideoDuration,
          camera: 'back',
          compressed: true, // 压缩视频
          success: (res) => {
            console.log('视频信息:', res)
  
            if (res.size > this.maxVideoSize) {
              uni.showToast({
                title: `视频大小不能超过${Math.floor(this.maxVideoSize / 1024 / 1024)}MB`,
                icon: 'none',
                duration: 2000
              })
              return
            }
  
            if (this.fileList.length >= this.maxCount) {
              uni.showToast({
                title: `最多只能上传${this.maxCount}个文件`,
                icon: 'none',
                duration: 2000
              })
              return
            }
  
            this.uploadVideo(res)
          },
          fail: (err) => {
            console.log('选择视频失败:', err)
          }
        })
      },
  
      // 上传视频
      async uploadVideo(videoInfo) {
        uni.showLoading({ mask: true, title: '视频上传中，请稍等' })
  
        const videoItem = {
          url: videoInfo.tempFilePath,
          thumb: videoInfo.thumbTempFilePath,
          status: 'uploading',
          message: '上传中',
          isVideo: true,
          duration: videoInfo.duration,
          size: videoInfo.size,
          width: videoInfo.width,
          height: videoInfo.height
        }
  
        this.fileList.push(videoItem)
        const fileListLen = this.fileList.length - 1
  
        try {
          const { id, url } = await this.uploadFilePromise(videoInfo.tempFilePath, 'video')
  
          this.fileList.splice(
            fileListLen,
            1,
            Object.assign(videoItem, {
              status: 'success',
              message: '',
              url,
              id
            })
          )
  
          this.imgs.push(id)
          this.setValue(this.imgs)
  
          uni.hideLoading()
          uni.showToast({
            title: '视频上传成功',
            icon: 'success',
            duration: 2000
          })
        } catch (e) {
          console.log('视频上传失败:', e)
          this.fileList.splice(fileListLen, 1)
          uni.hideLoading()
          uni.showToast({
            title: '视频上传失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
  
      deletePic({ index }) {
        this.imgIndex = index
        this.currentDelType = this.fileList[index].isVideo ? 'video' : 'image'
        this.showModal = true
      },
  
      confirmDel() {
        this.fileList.splice(this.imgIndex, 1)
        this.imgs.splice(this.imgIndex, 1)
        this.setValue(this.imgs)
      },
  
      async afterRead(event) {
        console.log('afterRead', event)
        uni.showLoading({ mask: true, title: '照片上传中，请稍等' })
        let lists = [].concat(event.file)
        let fileListLen = this.fileList.length
  
        lists.map(item => {
          this.fileList.push({
            ...item,
            status: 'uploading',
            message: '上传中',
            isVideo: false
          })
        })
  
        try {
          for (let i = 0; i < lists.length; i++) {
            if (this.watermark) {
              lists[i].url = await this.drawPhoto(lists[i].url)
            }
            const { id, url } = await this.uploadFilePromise(lists[i].url, 'image')
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
  
      uploadFilePromise(filePath, fileType = 'image') {
        return new Promise((resolve, reject) => {
          uni.uploadFile({
            url: uploadUrl,
            filePath,
            name: 'file',
            header: { Authorization: this.vuex_token },
            formData: {
              type: fileType
            },
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
              ctx.font = `normal 30px  ${fontFamily}`
  
              if (this.waterInfo.firstLine) {
                ctx.setFontSize(30)
                ctx.setFillStyle('#ffffff')
                ctx.fillText(`${this.waterInfo.firstLine}`, 60, res.height - 150)
              }
  
              if (this.waterInfo.secondLine) {
                ctx.setFontSize(30)
                ctx.setFillStyle('#ffffff')
                ctx.fillText(`${this.waterInfo.secondLine}`, 60, res.height - 100)
              }
  
              if (this.waterInfo.thirdLine) {
                ctx.setFontSize(30)
                ctx.setFillStyle('#ffffff')
                ctx.fillText(`${this.waterInfo.thirdLine}`, 60, res.height - 50)
              }
  
              ctx.draw(false, () => {
                uni.canvasToTempFilePath({
                  canvasId: this.waterCanvas,
                  destWidth: this.canvasW * 2,
                  destHeight: this.canvasH * 2,
                  success: ({ tempFilePath }) => {
                    resolve(tempFilePath)
                  },
                  fail: e => {
                    console.log(e)
                    reject(e)
                  }
                })
              })
            },
            fail: e => {
              console.log(e)
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
  
  .upload-item {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .preview-image {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .video-preview {
    position: relative;
    width: 100%;
    height: 100%;
  
    .play-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
  
    .video-duration {
      position: absolute;
      bottom: 4px;
      right: 4px;
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      z-index: 2;
    }
  }
  
  .video-btn {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 98px;
    height: 98px;
    border: 1px solid #d0d0d0;
    border-radius: 8px;
    margin-right: 20px;
    margin-bottom: 20px;
    background-color: #f8f8f8;
  
    .video-text {
      font-size: 12px;
      color: #606266;
      margin-top: 4px;
    }
  
    &:active {
      background-color: #ebebeb;
    }
  }
  
  .album-btn {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 98px;
    height: 98px;
    border: 1px solid #d0d0d0;
    border-radius: 8px;
    margin-right: 20px;
    margin-bottom: 20px;
    background-color: #f8f8f8;
  
    .album-text {
      font-size: 12px;
      color: #606266;
      margin-top: 4px;
    }
  
    &:active {
      background-color: #ebebeb;
    }
  }
  
  .choice-modal {
    display: flex;
    justify-content: space-around;
    padding: 20px 0;
  
    .choice-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 30px;
      border-radius: 8px;
      background-color: #f8f8f8;
      cursor: pointer;
  
      &:active {
        background-color: #e6e6e6;
      }
  
      .choice-text {
        font-size: 14px;
        color: #303133;
        margin-top: 8px;
      }
    }
  }
  
  // 自定义弹窗样式
  .custom-modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  
  .custom-modal {
    width: 100%;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  .modal-header {
    text-align: center;
    font-size: 14px;
    color: #999;
    padding: 20px 0 10px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .modal-content {
    padding: 0;
  
    .modal-item {
      text-align: center;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:active {
        background-color: #f5f5f5;
      }
  
      .modal-item-text {
        font-size: 16px;
        color: #007aff;
      }
    }
  }
  
  .modal-footer {
    padding: 16px 0;
    text-align: center;
    border-top: 8px solid #f0f0f0;
  
    &:active {
      background-color: #f5f5f5;
    }
  
    .modal-cancel-text {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
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