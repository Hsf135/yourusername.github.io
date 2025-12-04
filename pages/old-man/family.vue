<template>
  <view class="u-p-b-64">
    <u-navbar title="家庭信息" placeholder bgColor="#FAF9F7">
      <u-icon v-if="!isDelete" slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
      <u-icon v-if="!isDelete && alive !== '0'" slot="right" :name="aIcon('shanchu-xian')" width="24" height="24" @click="handleDel"></u-icon>
      <view v-if="isDelete" slot="left" class="u-flex">
        <text class="u-primary" @click="isDelete = false">取消</text>
      </view>
      <view v-if="isDelete" slot="right" class="u-flex">
        <text class="u-error" @click="delShow = true">删除</text>
      </view>
    </u-navbar>
    <view class="unlive-info" v-if="alive === '0'"> 该老人已去世，个人信息不纳入饱和度统计。若需编辑信息，请进入"延伸信息"页面，将"是否健在"改为"是" </view>
    <view class="base-box" v-if="info.length && !isDelete" key="list">
      <view class="title">家庭成员</view>
      <u-cell-group :border="false">
        <u-cell @click="handleEdit(item)" v-for="(item, index) in info" :key="item.id" :title="'家庭成员' + (index + 1)" :value="radioDict(item.role, 'family_role') + ' ' + item.name" isLink center></u-cell>
      </u-cell-group>
    </view>
    <view class="base-box" v-else-if="info.length && isDelete">
      <view class="title">家庭成员</view>
      <u-checkbox-group v-model="ids" iconPlacement="right" placement="column" shape="circle" activeColor="#ff9500">
        <u-cell-group :border="false">
          <u-cell v-for="(item, index) in info" :key="item.id + 'del'" :title="'家庭成员' + (index + 1)" :isLink="false">
            <u-checkbox slot="value" :label="radioDict(item.role, 'family_role') + ' ' + item.name" :name="item.id" :customStyle="checkStyle"> </u-checkbox>
          </u-cell>
        </u-cell-group>
      </u-checkbox-group>
    </view>
    <view v-else class="empty-view">
      <u-icon name="/static/imgs/common/empty.png" width="142" height="120"></u-icon>
      <view class="zp-main-title">
        <view>暂无家庭信息</view>
      </view>
    </view>

    <view class="add-button" v-if="alive !== '0'">
      <u-button @click="handleAdd" :customStyle="loginStyle" type="primary" :disabled="isDelete" text="添加家庭信息"></u-button>
    </view>
		
		<r-dialog v-model="delShow" title="温馨提示" content="是否确认删除？" cancelText="否" confirmText="是" @cancel="delShow = false" @confirm="delFamily">
		</r-dialog>
  </view>
</template>

<script>
import { delFamilyUrl, getCustomerFamilyDetailUrl } from '../../api'
export default {
  data() {
    return {
      info: [],
      customerId: undefined,
      alive: undefined,
      loginStyle: { borderRadius: '8px', width: '239px' },
      checkStyle: { padding: '0', height: '24px', width: 'calc(100% - 90px)' },
      isDelete: false,
      ids: [],
			delShow: false
    }
  },
  onLoad(option) {
    this.customerId = option.id
    this.alive = option.alive || undefined
    this.loadData()
  },
  onShow() {
    this.loadData() // 刷新数据的方法
  },
  methods: {
    async loadData() {
      const { data } = await uni.$u.http.post(getCustomerFamilyDetailUrl, { customerId: this.customerId })
      this.info = data
    },
    async delFamily() {
			this.delShow = false
      if (!this.ids.length) {
        uni.$u.toast('请先选择要删除的数据')
        return
      }
      try {
        const res = await uni.$u.http.post(`${delFamilyUrl}?ids=${this.ids}`)
        uni.$u.toast(res.msg)
        this.ids = []
        this.loadData() // 刷新数据的方法
				this.$nextTick(() => {
					this.isDelete = false
				})
      } catch (e) {
        //TODO handle the exception
      }
    },
    toPage(url) {
      uni.navigateTo({ url })
    },
    handleBack() {
      uni.navigateBack()
    },
		handleAdd() {
			if (!this.isSingleProject) {
				uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
				return
			}
			this.toPage(`/pages/old-man/components/family-add?id=${this.customerId}`)
		},
		handleEdit(item) {
			if (!this.isSingleProject) {
				uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
				return
			}
			this.toPage(`/pages/old-man/components/family-add?id=${this.customerId}&memberId=${item.id}`)
		},
		handleDel() {
			if (!this.isSingleProject) {
				uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
				return
			}
			this.isDelete = true
		}
  }
}
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 12px;
  color: $u-main-color;
  font-size: 16px;
  font-weight: bold;
}

.add-button {
  background-color: #faf9f7;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 0;
  margin: auto;
}

.empty-view {
  padding: 108px 114px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/deep/ .u-cell__body {
  padding: 10px 0;
  align-items: center;
  justify-content: space-between;
}

/deep/ .u-cell__body__content {
  width: 90px;
  flex: inherit;
}

/deep/ .u-cell__value {
  text-align: left;
  width: 100%;
}

/deep/ uni-text {
  font-size: 14px !important;
}
</style>
