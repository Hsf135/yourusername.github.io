import { baseUrl } from '@/config'

let preUrl = baseUrl

// #ifdef H5
preUrl = '/api'
// #endif

// 活动信息详情
export const activityDetailUrl = `${preUrl}/customer/app/activity/detail`
// 分页获取活动信息列表
export const activityPageUrl = `${preUrl}/customer/app/activity/page`
// 删除活动信息
export const activityRemoveUrl = `${preUrl}/customer/app/activity/remove`
// 新增活动信息
export const activitySaveUrl = `${preUrl}/customer/app/activity/save`
// 编辑活动信息
export const activityUpdateUrl = `${preUrl}/customer/app/activity/update`
// 获取本职部门街道信息
export const getStreetTreeUrl = `${preUrl}/customer/app/activity/getStreetTree`
