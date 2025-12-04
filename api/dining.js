import { baseUrl } from '@/config'

let preUrl = baseUrl

// #ifdef H5
preUrl = '/api'
// #endif

// 确认选择老人详情页
export const oldManDetailUrl = `${preUrl}/srv/app/diningOrder/detail`
// 就餐订单详情
export const diningDetailUrl = `${preUrl}/srv/app/diningOrder/diningOrderDetail`
// 点餐记录列表
export const diningListUrl = `${preUrl}/srv/app/diningOrder/diningOrderList`
// 点餐记录分页
export const diningPageUrl = `${preUrl}/srv/app/diningOrder/diningOrderPage`
// 选择养老卡补贴方式
export const subsidyUrl = `${preUrl}/srv/app/diningOrder/getSubsidyByMonth`
// 选择老人列表
export const oldManListUrl = `${preUrl}/srv/app/diningOrder/list`
// 选择老人分页
export const oldManPageUrl = `${preUrl}/srv/app/diningOrder/page`
// 新建助餐
export const diningSaveUrl = `${preUrl}/srv/app/diningOrder/save`
// 选择菜单树
export const menuTreeUrl = `${preUrl}/srv/app/diningOrder/tree`
// 获取人员站点所属区域
export const getRegionByAccountUrl = `${preUrl}/opr/app/diningStation/detailByUserId`
