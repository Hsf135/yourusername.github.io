import { baseUrl } from '@/config'

let preUrl = baseUrl

// #ifdef H5
preUrl = '/api'
// #endif

/* 基础模块 */
// 获取路由
export const getRouters = `${preUrl}/getRouters`
// 登陆
export const loginUrl = `${preUrl}/login`
// 登陆
export const phoneLoginUrl = `${preUrl}/mobileLogin`
// 退出登录
export const loginOutUrl = `${preUrl}/loginOut`
// 修改用户联系方式
export const savePasswordUrl = `${preUrl}/system/user/profile/savePassword`
// 修改密码
export const changeMobileUrl = `${preUrl}/system/user/profile/saveMobile`
// 发送手机验证码
export const sendCodeUrl = `${preUrl}/commonRelease/loginSendCode`
// 手机验证码验证
export const validatePhoneCodeUrl = `${preUrl}/commonRelease/validatePhoneCode`
// 重置密码
export const resetPasswordUrl = `${preUrl}/system/user/profile/resetPassword`
// 获取服务器时间
export const getNowDataUrl = `${preUrl}/commonRelease/getNewDate`
// 获取账号数据
export const getInfoUrl = `${preUrl}/getInfo`
// 获取全部字典
export const getDictUrl = `${preUrl}/system/dict/type/listAll`
// 获取地址
export const getRegionUrl = `${preUrl}/system/region/search`
// 省份数据
export const provincesUrl = `${preUrl}/system/region/provinces`
// 城市数据
export const citysUrl = `${preUrl}/system/region/citys`
// 区数据
export const countysUrl = `${preUrl}/system/region/countys`
// 上传附件
export const uploadUrl = `${preUrl}/minio/endpoint/uploadToSysAttach`
// 获取共同服务人员
export const getCommonUsersUrl = `${preUrl}/srv/app/staffInfo/getCommonUsers`
// 获取隐私协议
export const getPrivacyAgreementUrl = `${preUrl}/opr/app/info/list`

/* APP版本更新接口 */
// 获取APP版本更新列表
export const appUpdateListUrl = `${preUrl}/mm/web/appVersion/appList`

/* 老人模块 */
// 获取老人列表
export const getCustomerPageUrl = `${preUrl}/customer/app/info/page`
// 客户搜索记录保存
export const saveSearchUrl = `${preUrl}/customer/app/info/saveSearch`
// 新增老人
export const addCustomerUrl = `${preUrl}/customer/app/info/save`
// 快速新增老人
export const addCustomerFastUrl = `${preUrl}/customer/app/info/fastSave`
// 检查手机号码重复
export const checkPhoneUrl = `${preUrl}/customer/web/info/servePage`
// 修改老人基础信息详情
export const updateCustomerUrl = `${preUrl}/customer/app/info/update`
// 获取老人基础信息详情
export const getCustomerBaseDetailUrl = `${preUrl}/customer/app/info/baseDetail`
// 收藏客户
export const saveCollectionUrl = `${preUrl}/customer/app/info/saveCollection`
// 获取老人档案信息详情
export const getCustomerArchivesUrl = `${preUrl}/customer/app/info/archives`
// 获取老人血压信息列表
export const getCustomerBpDataUrl = `${preUrl}/customer/app/bpData/page`
export const getCustomerBpDataListUrl = `${preUrl}/customer/app/bpData/list`
// 获取老人需求信息详情
export const getCustomerDemandDetailUrl = `${preUrl}/customer/app/oldman/detailBycustomerId`
// 修改老人需求信息详情
export const updateCustomerDemandUrl = `${preUrl}/customer/app/oldman/update`
// 获取老人延伸信息详情
export const getCustomerExtendDetailUrl = `${preUrl}/customer/app/extend/detailByCustomerId`
// 修改老人延伸信息详情
export const updateCustomerExtendUrl = `${preUrl}/customer/app/extend/update`
// 获取老人健康信息详情
export const getCustomerHealthDetailUrl = `${preUrl}/customer/app/health/detailByCustomerId`
// 修改老人健康信息详情
export const updateCustomerHealthUrl = `${preUrl}/customer/app/health/update`
// 获取老人家庭信息列表
export const getCustomerFamilyDetailUrl = `${preUrl}/customer/app/family/list`
// 添加家庭信息列表
export const addFamilyUrl = `${preUrl}/customer/app/family/save`
// 编辑家庭信息列表
export const updateFamilyUrl = `${preUrl}/customer/app/family/update`
// 删除家庭信息列表
export const delFamilyUrl = `${preUrl}/customer/app/family/remove`
// 获取家庭成员详情
export const getFamilyDetailUrl = `${preUrl}/customer/app/family/detail`
// 录入健康数据
export const addBpDataUrl = `${preUrl}/customer/app/bpData/save`
// 录入健康数据-历史数据
export const bpDataHistoryDateUrl = `${preUrl}/customer/app/bpData/historyDate`

/* 住院历史 */
// 获取老人住院信息
export const getHospitalUrl = `${preUrl}/customer/app/hospital/page`
// 获取老人住院信息详情
export const getHospitalDetailUrl = `${preUrl}/customer/app/hospital/detail`
// 删除老人住院信息详情
export const delHospitalDetailUrl = `${preUrl}/customer/app/hospital/remove`
// 新增或修改老人住院信息
export const addHospitalUrl = `${preUrl}/customer/app/hospital/save`

/* 用药信息 */
// 获取老人用药信息
export const getMedicationUrl = `${preUrl}/customer/app/medication/page`
// 获取老人用药信息详情
export const getMedicationDetailUrl = `${preUrl}/customer/app/medication/detail`
// 删除老人用药信息详情
export const delMedicationDetailUrl = `${preUrl}/customer/app/medication/remove`
// 新增或修改老人用药信息
export const addMedicationUrl = `${preUrl}/customer/app/medication/save`

/* 自建订单 */
// 新增自建订单
export const addStaffInfoUrl = `${preUrl}/srv/app/staffInfo/save`
// 自建订单分页
export const staffInfoPageUrl = `${preUrl}/srv/app/staffInfo/page`
// 自建订单详情
export const getStaffInfoDetailUrl = `${preUrl}/srv/app/staffInfo/detail`
// 自建订单取消订单
export const staffInfoCancelUrl = `${preUrl}/srv/app/staffInfo/cancelOrder`
// 自建订单状态统计
export const getOperatorStatusStatlUrl = `${preUrl}/srv/app/staffInfo/getOperatorStatusStat`
// 自建订单开始服务
export const startServiceUrl = `${preUrl}/srv/app/staffInfo/startService`
// 自建订单完成服务
export const finishServiceUrl = `${preUrl}/srv/app/staffInfo/finishService`
// 自建订单提交审核
export const submitExamineUrl = `${preUrl}/srv/app/staffInfo/submitExamine`
// 机构审核
export const orgAuditUrl = `${preUrl}/srv/app/staffInfo/orgAudit`
// 获取服务项目树
export const getOptionTreeUrl = `${preUrl}/srv/app/option/tree`
// 添加服务项目
export const saveServeItemUrl = `${preUrl}/srv/app/staffInfo/saveServeItem`
// 修改服务项目
export const updateServeItemUrl = `${preUrl}/srv/app/staffInfo/updateServeItem`
// 删除服务项目
export const removeServeItemUrl = `${preUrl}/srv/app/staffInfo/removeServeItem`
// 删除服务项目
export const uploadServeItemPhotoUrl = `${preUrl}/srv/app/staffInfo/uploadServeItemPhoto`
// 语音评价
export const uploadVoiceUrl = `${preUrl}/srv/app/staffInfo/uploadVoice`
// 选择机构自审-选择所属服务商用户
export const getOrgUsersUrl = `${preUrl}/srv/app/staffInfo/getOrgUsers`
// 自定义项目接口
export const customServeListUrl = `${preUrl}/opr/app/customServe/list`
// 获取自建订单二级归属项目列表
export const belongItemlabelListUrl = `${preUrl}/opr/web/belongItemlabel/list`

/* 会员联系地址信息 */
// 获取会员联系地址信息列表
export const memberAddressListUrl = `${preUrl}/mc/app/memberAddress/list`
// 会员联系地址信息保存
export const memberAddressSaveUrl = `${preUrl}/mc/app/memberAddress/save`
// 会员联系地址信息修改
export const memberAddressUpdateUrl = `${preUrl}/mc/app/memberAddress/update`

/* 平台派单 */
// 获取平台订单分页
export const orderPageUrl = `${preUrl}/srv/app/order/page`
// 状态流程操作
export const serveOrderStatusUrl = `${preUrl}/opr/app/serveorderstatus/operate`
// 平台订单详情
export const getOrderDetailUrl = `${preUrl}/srv/app/order/detail`
// 平台订单信息数量
export const orderStatusCountUrl = `${preUrl}/srv/app/order/statusCount`
// 获取订单状态列表
export const getServeorderstatusUrl = `${preUrl}/opr/web/serveorderstatus/list`
// 工单号修改
export const updateServeNoUrl = `${preUrl}/srv/app/order/updateServeNo`
// 订单状态操作
export const statusOperateUrl = `${preUrl}/opr/app/serveorderstatus/operate`
// 获取客户服务包列表
export const getServePacketListUrl = `${preUrl}/srv/web/servePacketCustomer/list`
// 语音评价修改
export const updateVoiceByIdUrl = `${preUrl}/srv/app/order/updateVoiceById`
/* 日历 */
// APP获取日历订单列表
export const calendarListUrl = `${preUrl}/srv/app/order/calendar`
