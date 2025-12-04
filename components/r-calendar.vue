<template>
  <view class="pj-calendar-container">
    <view class="header">
      <u-icon :name="aIcon('yousanjiao')" width="12" height="12" @click="pre"></u-icon>
      <view class="h-text">{{ `${date.year}年${date.month}月${date.selectDay}日` }}</view>
      <u-icon :name="aIcon('zuosanjiao')" width="14" height="14" @click="next"></u-icon>
    </view>

    <view class="main">
      <view class="week-box">
        <view v-for="item in weeks" :key="item">{{ item }}</view>
      </view>

      <swiper circular @change="onChangeSwiper" class="swiper-box" :style="{ height: swiperHeight }">
        <swiper-item class="month-box" v-for="sitem in 3" :key="sitem">
          <view v-for="(item, index) in monthDays" :key="index" :class="[getClass(item)]" :style="[getStyle(item)]" class="day" @click.stop="onClickDay(item)">
            {{ item.day }}
          </view>
        </swiper-item>
      </swiper>
      <view class="collapsible-btn" v-if="collapsible" @click="onToggleShrink">
        <view :class="{ open: shrink, close: !shrink }"></view>
      </view>
    </view>
  </view>
</template>
<script>
/**
 * @property select_date 选中日期格式 'yyyy-mm-dd'
 * @property select_color 选中日期颜色
 * @property select_bg 选中日期背景颜色
 * @property collapsible 是否可以收缩
 * @property default_collapse 默认是否折叠，仅开启了 collapsible 之后有效果
 */

import { calendarListUrl } from '../api'
import Util from '@/utils/rCalendar'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    select_date: {
      type: String,
      default: null
    },
    select_color: {
      type: String,
      default: '#FFFFFF'
    },
    select_bg: {
      type: String,
      default: '#409EFF'
    },
    collapsible: {
      type: Boolean,
      default: false
    },
    default_collapse: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    formatDate() {
      const month = this.date.month < 10 ? `0${this.date.month}` : this.date.month
      const day = this.date.selectDay < 10 ? `0${this.date.selectDay}` : this.date.selectDay
      return `${this.date.year}-${month}-${day}`
    }
  },

  data() {
    return {
      util: null,
      weeks: ['日', '一', '二', '三', '四', '五', '六'],
      monthDays: [],
      orderDays: ['2024-08-01', '2024-08-03'],
      current: 0,
      shrink: false,
      swiperHeight: null,
      // 日期
      date: {
        year: null,
        month: null,
        selectDay: null
      },
      today: {
        year: null,
        month: null,
        selectDay: null
      }
    }
  },

  watch: {
    select_day: {
      handler: function () {
        this.init()
      }
    },
    shrink: {
      immediate: true,
      handler: function () {
        this.swiperHeight = this.shrink ? '90rpx' : '400rpx'
      }
    },
    formatDate(val) {
      this.$emit('input', val)
      this.$emit('dateChange', val)
      this.getOrderDays(val)
    }
  },

  created() {
    this.init()
    this.shrink = this.default_collapse && this.collapsible
    this.util.pack_up = this.shrink
    this.onToggleShrink()
    const date = new Date()
    this.today = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      selectDay: date.getDate()
    }
  },

  methods: {
    async init() {
      const date = new Date(this.select_date || new Date().getTime())

      !this.util && (this.util = new Util())
      this.date = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        selectDay: date.getDate()
      }

      this.util.setBaseDate({
        year: this.date.year,
        month: this.date.month,
        select_day: this.date.selectDay
      })

      this.monthDays = this.util.getData()
    },

    async getOrderDays(date) {
      const { data } = await uni.$u.http.post(`${calendarListUrl}?serveTime=${date}&areaCode=${this.areaCode}&areaProjectCode=${this.areaProjectCode}`)
      this.orderDays = data
    },

    next() {
      this.monthDays = this.util.getData('next')
      this.date.year = this.util.cur_year
      this.date.month = this.util.cur_month
    },

    pre() {
      this.monthDays = this.util.getData('pre')
      this.date.year = this.util.cur_year
      this.date.month = this.util.cur_month
    },

    onClickDay(item) {
      const { day, month, year } = item
      this.date.selectDay = day
      this.util.setBaseDate({
        year,
        month,
        select_day: day
      })

      if (this.date.year !== year || this.date.month !== month) {
        this.date.month = month
        this.date.year = year
        this.monthDays = this.util.getData()
      }
      this.$emit('change', item)
    },

    onToggleShrink() {
      this.shrink = !this.shrink
      this.util.pack_up = this.shrink
      this.monthDays = this.util.getData()
      this.$emit('toggle', this.shrink)
    },

    onChangeSwiper(e) {
      const current_swiper = e.detail.current
      if (current_swiper - this.current === 1 || current_swiper - this.current === -2) {
        this.next()
      } else {
        this.pre()
      }
      this.current = current_swiper
    },

    getClass(item) {
      const isSelected = item.day === this.date.selectDay && item.month === this.date.month
      const isToday = item.day === this.today.selectDay && item.month === this.today.month
      const itemStr = this.format(item)
      // 状态 0拜访草稿红点 1拜访完成灰点 2订单橙点   state
      const isRecords = this.orderDays.some(o => o.calendarDate === itemStr)
      const red = this.orderDays.some(o => o.calendarDate === itemStr && o.state === '0')
      const info = this.orderDays.some(o => o.calendarDate === itemStr && o.state === '1')
      return {
        is_placeholder: item.isPreMonth || item.isNextMonth,
        is_selected: isSelected,
        is_today: isToday,
        is_records: isRecords,
        red: red,
        info: info
      }
    },

    getStyle(item) {
      const isSelected = item.day === this.date.selectDay && item.month === this.date.month
      const isToday = item.day === this.today.selectDay && item.month === this.today.month

      return {
        background: isSelected ? this.select_bg : isToday ? '#ffce8a' : 'none',
        color: isSelected ? this.select_color : 'black'
      }
    },

    format(item) {
      const month = item.month < 10 ? `0${item.month}` : item.month
      const day = item.day < 10 ? `0${item.day}` : item.day
      return `${item.year}-${month}-${day}`
    }
  }
}
</script>
<style lang="scss" scoped>
.pj-calendar-container {
  padding: 32rpx;

  .header {
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 10rpx 0;

    .h-text {
      margin: 0 30rpx;
      color: $u-main-color;
      font-weight: bold;
    }
  }

  .main {
    .is_placeholder {
      color: #c0c4cc !important;
    }

    .is_today {
      border-radius: 50%;
      background: #808080;
    }

    .is_selected {
      position: relative;
      border-radius: 50%;
    }

    .is_records {
      position: relative;
      border-radius: 50%;
      &:after {
        content: ' ';
        position: absolute;
        left: 50%;
        bottom: -12rpx;
        transform: translateX(-50%);
        width: 8rpx;
        height: 8rpx;
        border-radius: 50%;
        background: #ff9500;
      }

      &.red {
        &::after {
          background: #e96848;
        }
      }

      &.info {
        &::after {
          background: #999693;
        }
      }
    }

    .swiper-box {
      transition: height 0.5s ease 0s;
    }

    .week-box {
      margin: 20rpx 0 10rpx;
      color: $u-tips-color;
    }

    .week-box {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      justify-items: center;
      align-items: center;
    }

    .month-box {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(auto-fill, 1fr);
      justify-items: center;
      align-items: center;
    }

    .month-box {
      .day {
        width: 48rpx;
        height: 48rpx;
        line-height: 48rpx;
        text-align: center;
        color: $u-main-color;
        font-weight: bold;
      }
    }

    .main-date-week {
    }
  }

  .collapsible-btn {
    display: flex;
    width: 100%;
    padding-top: 10px;
    align-content: center;
    justify-content: center;

    .open,
    .close {
      width: 20rpx;
      height: 20rpx;
    }

    .open {
      border-right-color: #808080;
      border-right-style: solid;
      border-right-width: 3rpx;
      border-top-color: #555555;
      border-top-style: solid;
      border-top-width: 3rpx;
      transform: rotate(135deg);
    }

    .close {
      border-right-color: #808080;
      border-right-style: solid;
      border-right-width: 3rpx;
      border-top-color: #555555;
      border-top-style: solid;
      border-top-width: 3rpx;
      transform: rotate(-45deg);
    }
  }
}
</style>
