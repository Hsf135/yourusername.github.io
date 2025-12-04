import { baseUrl } from '@/config'

let preUrl = baseUrl

// #ifdef H5
preUrl = '/api'
// #endif

// 拜访信息详情
export const visitDetailUrl = `${preUrl}/customer/app/visitInfo/detail`
// 分页获取拜访信息列表
export const visitPageUrl = `${preUrl}/customer/app/visitInfo/page`
// 删除拜访信息
export const visitRemoveUrl = `${preUrl}/customer/app/visitInfo/remove`
// 新增拜访信息
export const visitSaveUrl = `${preUrl}/customer/app/visitInfo/save`
// 编辑拜访信息
export const visitUpdateUrl = `${preUrl}/customer/app/visitInfo/update`
// 入户排行统计
export const visitRankUrl = `${preUrl}/customer/app/visitInfo/inDoorVisitRanking`
// 入户拜访统计-总计
export const visitStatTotalUrl = `${preUrl}/customer/app/visitInfo/inDoorVisitStat`
// 入户拜访统计-按周期
export const visitStatByTimeUrl = `${preUrl}/customer/app/visitInfo/inDoorVisitStatByTime`

// 拜访标签下拉列表
export const visitTagUrl = `${preUrl}/customer/app/visitInfo/pageLabel`

// 获取用户下拉列表
export const userListUrl = `${preUrl}/system/user/listVO`
// 获取服务人员列表
export const serviceUserListUrl = `${preUrl}/opr/app/staff/page`
