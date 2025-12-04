<template>
  <view class="add-page">
    <u-navbar :title="pageTitle" placeholder bgColor="#FAF9F7">
      <view slot="left" class="u-flex">
        <text class="u-info" @click="backEdit">取消</text>
      </view>
      <view slot="right" class="u-flex">
        <text class="u-primary" @click="submit">完成</text>
      </view>
    </u-navbar>
    <u--form labelWidth="110px" :model="form" :rules="rules" ref="form">
      <view class="add-card">
        <view class="title">基本信息</view>
        <u-form-item
          label="姓名"
          prop="name"
          borderBottom
          class="form-required"
        >
          <u-input
            v-model="form.name"
            clearable
            maxlength="32"
            border="none"
            placeholder="请输入老人姓名"
          >
          </u-input>
        </u-form-item>
        <u-form-item label="性别" prop="sex" borderBottom class="form-required">
          <r-select
            :disabled="isCheck"
            v-model="form.sex"
            :list="aDict('vols_sex')"
          />
        </u-form-item>
        <u-form-item label="老人备注" prop="remark" borderBottom>
          <textarea
            v-model="form.remark"
            clearable
            maxlength="2000"
            autoHeight
            placeholder="请输入老人备注"
            class="com-textarea"
            placeholder-class="com-placeholder"
          ></textarea>
        </u-form-item>
        <u-form-item
          label="联系电话"
          prop="mobilephone"
          borderBottom
          class="form-required"
        >
          <u-input
            v-model="form.mobilephone"
            clearable
            :focus="mobilephoneFocus"
            :cursor="mobilephoneCursor"
            type="number"
            maxlength="12"
            border="none"
            placeholder="联系电话与证件必填其一"
            @blur="checkMainPhone"
          >
          </u-input>
        </u-form-item>

        <u-form-item prop="phoneList" borderBottom v-if="form.phoneList.length">
          <view style="width: 100%">
            <view
              class="u-flex phone-item"
              v-for="(item, index) in form.phoneList"
              :key="index"
            >
              <view class="u-flex" style="width: 110px">
                <u-icon
                  :name="aIcon('zhuxiao')"
                  width="24"
                  height="24"
                  @click="openDelPhone(index)"
                ></u-icon>
                <span>联系电话{{ phoneNumberArr[index] }}</span>
              </view>
              <u-input
                v-model="item.mobilephone"
                clearable
                type="number"
                :focus="item.focus"
                :cursor="item.cursor"
                maxlength="12"
                border="none"
                placeholder="请输入联系电话"
                @blur="() => checkOtherPhone(index)"
              ></u-input>
            </view>
          </view>
        </u-form-item>

        <!-- <view v-for="(item, index) in form.phoneList" :key="index">
          <u-form-item
            :prop="`phoneList.${index}.mobilephone`"
            :rules="[
              { required: true, pattern: /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/, message: '请输入正确的手机号码', trigger: 'blur' },
              { validator: mobilephoneCheck, trigger: 'blur' }
            ]"
            borderBottom
          >
            <view slot="label" class="u-flex" style="width: 110px">
              <u-icon :name="aIcon('zhuxiao')" width="24" height="24" @click="openDelPhone(index)"></u-icon>
              <span>联系电话{{ phoneNumberArr[index] }}</span>
            </view>
            <u-input v-model="item.mobilephone" clearable type="number" :focus="item.focus" :cursor="item.cursor" maxlength="12" border="none" placeholder="请输入联系电话" @blur="() => checkOtherPhone(index)"> </u-input>
          </u-form-item>
        </view> -->
        <view class="add-item mobilephone" @click="addPhone">
          <u-icon :name="aIcon('tianjia2')" width="24" height="24"></u-icon>
          <text>添加其他联系方式</text>
        </view>
      </view>
      <view class="add-card">
        <view class="title">证件信息</view>
        <u-form-item label="证件类型" prop="idType" borderBottom>
          <r-select
            :disabled="isCheck"
            v-model="form.idType"
            :list="aDict('document_type')"
          />
        </u-form-item>
        <u-form-item label="发证机关" prop="issuer" borderBottom>
          <u-input
            v-model="form.issuer"
            clearable
            maxlength="32"
            border="none"
            placeholder="请输入发证机关"
          >
          </u-input>
        </u-form-item>
        <u-form-item
          label="证件号码"
          prop="idcard"
          borderBottom
          class="form-required"
        >
          <u-input
            v-model="form.idcard"
            clearable
            type="number"
            maxlength="18"
            border="none"
            placeholder="请输入证件号码"
          >
          </u-input>
        </u-form-item>
        <u-form-item label="证件有效期" prop="remark" borderBottom>
          <u-radio-group
            activeColor="#FF9500"
            v-model="form.idEffective"
            placement="row"
          >
            <u-radio
              :customStyle="{ marginRight: '8px' }"
              v-for="(item, index) in aDict('id_effective')"
              :key="index"
              :label="item.label"
              :name="item.value"
            >
            </u-radio>
          </u-radio-group>
        </u-form-item>
        <u-form-item
          v-if="isXiaMen"
          label="出生年月"
          prop="birthday"
          borderBottom
          @click="openBirthday"
        >
          <text v-if="form.birthday">{{ form.birthday }}</text>
          <text v-else class="u-place-color">请选择</text>
          <u-icon
            slot="right"
            :name="aIcon('xiala-zuo')"
            width="24"
            height="24"
          ></u-icon>
        </u-form-item>
        <u-form-item
          label="户籍地地址"
          prop="domicileAllAddress"
          :class="{ 'form-required': isXiaMen }"
          borderBottom
          @click="handleEditAddress('domicile')"
        >
          <text v-if="form.domicileAllAddress">{{
            form.domicileAllAddress
          }}</text>
          <text v-else class="u-place-color">请选择</text>
          <u-icon
            slot="right"
            :name="aIcon('xiala-zuo')"
            width="24"
            height="24"
          ></u-icon>
        </u-form-item>
        <u-form-item
          label="现居住地地址"
          prop="currentAllAddress"
          :class="{ 'form-required': !isXiaMen }"
          borderBottom
          @click="handleEditAddress('current')"
        >
          <text v-if="form.currentAllAddress">{{
            form.currentAllAddress
          }}</text>
          <text v-else class="u-place-color">请选择</text>
          <u-icon
            slot="right"
            :name="aIcon('xiala-zuo')"
            width="24"
            height="24"
          ></u-icon>
        </u-form-item>
      </view>
      <view class="add-card">
        <view class="title">其他信息</view>
        <u-form-item
          label="文化程度"
          prop="educationLevel"
          borderBottom
          :class="{ 'form-required': !isXiaMen }"
        >
          <r-select
            :disabled="isCheck"
            v-model="form.educationLevel"
            :list="aDict('degree_education')"
          />
        </u-form-item>
        <u-form-item
          label="职业"
          prop="profession"
          borderBottom
          :class="{ 'form-required': !isXiaMen }"
        >
          <r-select
            :disabled="isCheck"
            v-model="form.profession"
            :list="aDict('occupation')"
          />
        </u-form-item>
        <u-form-item
          v-if="isXiaMen"
          label="详细职业"
          prop="detaileProfession"
          borderBottom
        >
          <u-input
            v-model="form.detaileProfession"
            clearable
            maxlength="32"
            border="none"
            placeholder="请输入"
          >
          </u-input>
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="退休" prop="isRetire" borderBottom>
          <r-select
            :disabled="isCheck"
            v-model="form.isRetire"
            :list="aDict('yes_no')"
          />
        </u-form-item>
        <u-form-item
          v-if="isXiaMen"
          label="主要经济来源"
          prop="mainFinancially"
          borderBottom
        >
          <r-select
            :disabled="isCheck"
            v-model="form.mainFinancially"
            :list="aDict('main_economic_source')"
          />
        </u-form-item>
        <u-form-item
          label="收入/月"
          prop="income"
          borderBottom
          :class="{ 'form-required': !isXiaMen }"
        >
          <r-select
            :disabled="isCheck"
            v-model="form.income"
            :list="aDict('income_month')"
          />
        </u-form-item>
        <u-form-item
          label="婚姻状况"
          prop="maritalStatus"
          borderBottom
          :class="{ 'form-required': !isXiaMen }"
        >
          <r-select
            :disabled="isCheck"
            v-model="form.maritalStatus"
            :list="aDict('marital_status')"
          />
        </u-form-item>
        <u-form-item
          v-if="isXiaMen"
          label="子女数量"
          prop="childrennumSection"
          borderBottom
        >
          <u-input
            v-model.number="form.childrennumSection"
            clearable
            type="number"
            maxlength="2"
            border="none"
            placeholder="请输入子女数量(0-19)"
          >
          </u-input>
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="保险" prop="insurance" borderBottom>
          <r-select
            :disabled="isCheck"
            v-model="form.insurance"
            multiple
            :list="aDict('insurance')"
          />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="国籍" prop="nation" borderBottom>
          <r-select
            :disabled="isCheck"
            v-model="form.nation"
            :list="aDict('nation')"
          />
        </u-form-item>
        <u-form-item label="民族" prop="nationality" borderBottom>
          <r-select
            :disabled="isCheck"
            v-model="form.nationality"
            :list="aDict('nationality')"
          />
        </u-form-item>
        <u-form-item
          v-if="isXiaMen"
          label="政治面貌"
          prop="politicalstatus"
          borderBottom
        >
          <r-select
            :disabled="isCheck"
            v-model="form.politicalstatus"
            :list="aDict('political_status')"
          />
        </u-form-item>
        <u-form-item
          v-if="isXiaMen"
          label="会员来源"
          prop="memberSource"
          borderBottom
        >
          <r-select
            :disabled="isCheck"
            v-model="form.memberSource"
            :list="aDict('member_source')"
          />
        </u-form-item>
        <u-form-item
          v-if="isXiaMen"
          label="会员级别"
          prop="memberLevel"
          borderBottom
        >
          <r-select
            :disabled="isCheck"
            v-model="form.memberLevel"
            :list="aDict('member_level')"
          />
        </u-form-item>
        <u-form-item
          label="服务对象来源（一级）"
          prop="serviceObjSource"
          borderBottom
          :class="{ 'form-required': !isXiaMen }"
        >
          <r-select
            :disabled="isCheck"
            v-model="form.serviceObjSource"
            multiple
            :list="aDict('service_obj_source')"
          />
        </u-form-item>
        <u-form-item
          label="服务对象来源（二级）"
          prop="secondServiceSource"
          borderBottom
        >
          <r-select
            :disabled="isCheck"
            v-model="form.secondServiceSource"
            multiple
            :list="belongItemList"
          />
        </u-form-item>
        <u-form-item label="一级服务标签" prop="serviceLabel" borderBottom>
          <r-select
            :disabled="isCheck"
            v-model="form.serviceLabel"
            multiple
            :list="aDict('service_label')"
          />
        </u-form-item>
        <u-form-item
          label="二级服务标签"
          prop="secondServiceLabel"
          borderBottom
        >
          <r-select
            :disabled="isCheck"
            v-model="form.secondServiceLabel"
            multiple
            :list="aDict('second_service_label')"
          />
        </u-form-item>
        <u-form-item label="三级服务标签" prop="thirdServiceLabel" borderBottom>
          <r-select
            :disabled="isCheck"
            v-model="form.thirdServiceLabel"
            multiple
            :list="aDict('third_service_label')"
          />
        </u-form-item>
        <u-form-item label="服务标准" prop="serviceStandards" borderBottom>
          <r-select
            :disabled="isCheck"
            v-model="form.serviceStandards"
            multiple
            :list="aDict('service_standards')"
          />
        </u-form-item>
      </view>
      <view class="add-card u-p-t-0">
        <u-form-item
          label="个人特长"
          prop="speciality"
          borderBottom
          :class="{ 'form-required': !!form.id }"
        >
          <r-textarea
            v-model="form.speciality"
            autoHeight
            placeholder="输入个人特长(50字以内)"
          ></r-textarea>
        </u-form-item>
      </view>
      <view v-if="isXiaMen" class="add-card u-p-t-2">
        <u-form-item
          @click="
            toPage(`/pages/old-man/components/add-contact?index=${index}`)
          "
          v-for="(item, index) in vuex_contactInfoList"
          :key="index"
          :label="`联系人${index + 1}`"
          borderBottom
          :class="{ 'form-required': isXiaMen }"
        >
          <text class="u-content-color">
            {{ item.ownerName }}
            {{ radioDict(item.contactRole, "contact_role") }}
            {{ item.phoneNumber }}
          </text>
          <u-icon
            slot="right"
            :name="aIcon('xiala-zuo')"
            width="24"
            height="24"
          ></u-icon>
        </u-form-item>
        <view
          class="add-item mobilephone"
          @click="toPage('/pages/old-man/components/add-contact')"
        >
          <u-icon :name="aIcon('tianjia2')" width="24" height="24"></u-icon>
          <text>添加联系人</text>
        </view>
      </view>
    </u--form>

    <u-datetime-picker
      v-if="showBirthday"
      @cancel="showBirthday = false"
      @confirm="changeBirthday"
      :show="showBirthday"
      :formatter="formatter"
      v-model="birthday"
      :minDate="-2209017943000"
      closeOnClickOverlay
      @close="showBirthday = false"
      mode="date"
    >
    </u-datetime-picker>

    <!-- 删除某个联系电话弹窗 -->
    <r-dialog
      v-model="showDel"
      title="温馨提示"
      cancelText="否"
      confirmText="是"
      @cancel="showDel = false"
      @confirm="delPhone"
    >
      <view slot="content" class="u-flex">
        <text class="u-text-center">是否确认删除?</text>
      </view>
    </r-dialog>

    <r-dialog
      v-model="show"
      title="监测到未保存信息"
      cancelText="否"
      confirmText="是"
      @cancel="show = false"
      @confirm="dialogConfirm"
    >
      <view slot="content">
        <text class="u-text-center">当前页面已做出修改，是否不保存就退出</text>
      </view>
    </r-dialog>

    <r-dialog
      v-model="showRepeat"
      title="号码重复提示"
      cancelText="继续新建老人"
      confirmText="重新输入号码"
      @cancel="closeRepeat"
      @confirm="dialogRepeat"
    >
      <view slot="content">
        <text class="u-text-center">
          <text class="check-phone"> {{ repeatPhone }} </text> 已有
          <text class="u-primary"> {{ repeatList.length }} </text>
          位老人使用，请选择一位老人完善信息</text
        >
        <view class="check-box">
          <view
            class="repeat-item"
            v-for="item in repeatList"
            :key="item.id"
            @click="toDetail(`/pages/old-man/portfolio?id=${item.id}`)"
          >
            <view class="repeat-name u-line-1">{{ item.name }}</view>
            <view class="repeat-address u-line-1">{{
              item.currentCommunityName
            }}</view>
            <view class="repeat-remark u-line-1">{{
              item.remark || "无备注"
            }}</view>
            <u-icon class="repeat-icon" name="arrow-right"></u-icon>
          </view>
        </view>
      </view>
    </r-dialog>
  </view>
</template>

<script>
import {
  addCustomerUrl,
  checkPhoneUrl,
  getCustomerBaseDetailUrl,
  updateCustomerUrl,
  belongItemlabelListUrl,
} from "../../api";
export default {
  data() {
    return {
      isCheck: false,
      form: {
        name: "",
        memberLevel: "1",
        domicileAllAddress: "",
        currentAllAddress: "",
        insurance: [],
        serviceObjSource: [],
        secondServiceSource: [],
        serviceLabel: [],
        secondServiceLabel: [],
        thirdServiceLabel: [],
        serviceStandards: [],
        phoneList: [],
      },
      loading: false,
      showBirthday: false,
      showRepeat: false,
      noCheckPhoneArr: [], // 不要校验重复的号码
      showDel: false,
      delPhoneIndex: undefined,
      birthday: "",
      show: false,
      isEdit: false,
      customerId: undefined,

      phoneNumberArr: ["二", "三", "四", "五", "六", "七", "八", "九", "十"],
      repeatPhone: "",
      repeatList: [],
      mobilephoneFocus: false,
      mobilephoneCursor: 0,
      belongItemList: [], //服务对象来源 下拉数据（二级）
      scrollTimer: null,
      isCheckingScroll: false, // 防止循环触发  
      isFocusing: false,
    };
  },
  computed: {
    pageTitle() {
      return this.customerId ? "编辑基础信息" : "新增基础信息";
    },
    rules() {
      const idcardValidator = (rule, value) => {
        if (this.form.idType === "1" && value) {
          return uni.$u.test.idCard(value);
        }
        return true;
      };
      return {
        name: [
          {
            required: true,
            message: "姓名不可为空",
            trigger: ["blur", "change"],
          },
        ],
        sex: [
          {
            required: true,
            message: "性别不可为空",
            trigger: ["blur", "change"],
          },
        ],
        mobilephone: [
          {
            required: true,
            // pattern: /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/,
            pattern: /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/,
            message: "请输入正确的手机号码",
            trigger: ["blur"],
          },
        ],
        phoneList: [
          {
            type: "array",
            required: true,
            validator: (rule, value, callback) => {
              const pattern =
                /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/;
              const allPhoneArr = [
                this.form.mobilephone,
                ...value.map((item) => item.mobilephone),
              ];
              for (let i = 0; i < value.length; i++) {
                if (!value[i].mobilephone) {
                  return callback(
                    new Error(`请输入联系电话${this.phoneNumberArr[i]}`)
                  );
                }
                if (!pattern.test(value[i].mobilephone)) {
                  return callback(
                    new Error(`请输入正确的联系电话${this.phoneNumberArr[i]}`)
                  );
                }
                const remainArr = allPhoneArr.filter(
                  (item, index) => index - 1 !== i
                );
                if (remainArr.includes(value[i].mobilephone)) {
                  return callback(
                    new Error(
                      `联系电话${this.phoneNumberArr[i]}重复，请重新输入`
                    )
                  );
                }
              }

              callback();
            },
            trigger: ["blur"],
          },
        ],
        idcard: [
          {
            required: true,
            message: "请输入证件号码",
            trigger: ["blur", "change"],
          },
          {
            validator: idcardValidator,
            message: "请输入正确的证件号码",
            trigger: ["change", "blur"],
          },
        ],
        childrennumSection: [
          {
            type: "number",
            min: 0,
            max: 19,
            message: "请输入0-19",
            trigger: ["blur"],
          },
        ],
        domicileAllAddress: [
          {
            required: this.isXiaMen,
            message: "户籍地不可为空",
            trigger: ["blur", "change"],
          },
        ],
        currentAllAddress: [
          {
            required: !this.isXiaMen,
            message: "现居住地不可为空",
            trigger: ["blur", "change"],
          },
        ],
        speciality: [
          {
            required: !!this.form.id,
            message: "个人特长不可为空",
            trigger: ["blur", "change"],
          },
          {
            type: "string",
            max: 50,
            message: "不能超过50字",
            trigger: ["blur", "change"],
          },
        ],

        educationLevel: [
          {
            required: !this.isXiaMen,
            message: "文化程度不可为空",
            trigger: ["blur", "change"],
          },
        ],
        profession: [
          {
            required: !this.isXiaMen,
            message: "职业不可为空",
            trigger: ["blur", "change"],
          },
        ],
        income: [
          {
            required: !this.isXiaMen,
            message: "收入/月不可为空",
            trigger: ["blur", "change"],
          },
        ],
        maritalStatus: [
          {
            required: !this.isXiaMen,
            message: "婚姻状况不可为空",
            trigger: ["blur", "change"],
          },
        ],
        serviceObjSource: [
          {
            type: "array",
            required: !this.isXiaMen,
            message: "服务对象来源（一级）不可为空",
            trigger: ["blur", "change"],
          },
        ],
      };
    },
  },
  watch: {
    form: {
      handler: function () {
        this.unsave = true;
      },
      deep: true,
    },
  },
  created() {
    this.birthday = new Date().getTime();
  },
  onShow() {
    if (this.vuex_contactInfoList) {
      this.form.contactInfoList = this.vuex_contactInfoList;
    }
    this.unsave = false;
    this.addressCallback();
  },
  onReady() {
    //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
    this.$refs.form.setRules(this.rules);
  },

  onPageScroll() {
  // 如果正在处理，直接返回
  if (this.isCheckingScroll) return;
  
  // 节流
  if (this.scrollTimer) {
    clearTimeout(this.scrollTimer);
  }
  
  this.scrollTimer = setTimeout(() => {
    this.isCheckingScroll = true; // 标记开始处理
    
    const pattern = /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/;
    const mainPhone = this.form.mobilephone;
    
    if (mainPhone && !pattern.test(mainPhone)) {
      this.mobilephoneFocus = false;
      this.form.phoneList.forEach(item => item.focus = false);
      this.$nextTick(() => {
        this.mobilephoneCursor = mainPhone.length;
        this.mobilephoneFocus = true;
        // 处理完成后等待一段时间再解除标记
        setTimeout(() => {
          this.isCheckingScroll = false;
        }, 500);
      });
      return;
    }
    
    for (let i = 0; i < this.form.phoneList.length; i++) {
      const phone = this.form.phoneList[i].mobilephone;
      if (phone && !pattern.test(phone)) {
        this.mobilephoneFocus = false;
        this.form.phoneList.forEach(item => item.focus = false);
        this.$nextTick(() => {
          this.$set(this.form.phoneList[i], 'cursor', phone.length);
          this.$set(this.form.phoneList[i], 'focus', true);
          setTimeout(() => {
            this.isCheckingScroll = false;
          }, 500);
        });
        return;
      }
    }
    
    // 没有错误，立即解除标记
    this.isCheckingScroll = false;
  }, 200);
},
  onUnload() {
    this.$u.vuex("vuex_contactInfoList", []);
    this.$u.vuex("vuex_addressInfo", {});
    this.$u.vuex("vuex_addressInfoCopy", {});
  },
  onLoad(option) {
    if (option.id) {
      this.customerId = option.id;
      this.loadData();
      this.isEdit = true;
    }
    this.getBelongList();
  },
  methods: {
    async getBelongList() {
      // const { data } = await belongItemlabelListUrl({ labelType: 'serviceObject', deleted: false })
      const { data } = await uni.$u.http.post(belongItemlabelListUrl, {
        labelType: "serviceObject",
        deleted: false,
      });
      this.belongItemList = data.map((item) => {
        return {
          value: item.id.toString(),
          label: item.name,
        };
      });
    },

    mobilephoneCheck(rule, value, callback) {
      const pattern = /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/;
      for (const item of value) {
        if (pattern.test(item.mobilephone)) {
          return callback(new Error("请输入正确的手机号码"));
        }
        // 可以添加更多针对 b 字段的校验逻辑
      }
      callback();
    },

    async loadData() {
      const { data } = await uni.$u.http.post(
        `${getCustomerBaseDetailUrl}?id=${this.customerId}`
      );
      data.phoneList = data.mobilephone
        .split(",")
        .filter((e, index) => index)
        .map((item) => {
          return { mobilephone: item, focus: false };
        });
      data.mobilephone = data.mobilephone.split(",")[0];
      data.insurance = data.insurance || [];
      data.serviceObjSource = data.serviceObjSource || [];
      data.secondServiceSource = data.secondServiceSource || [];
      data.serviceLabel = data.serviceLabel || [];
      data.secondServiceLabel = data.secondServiceLabel || [];
      data.thirdServiceLabel = data.thirdServiceLabel || [];
      data.serviceStandards = data.serviceStandards || [];
      this.form = data;
      this.birthday = data.birthday;
      this.$u.vuex("vuex_contactInfoList", data.contactInfoList);
      setTimeout(() => {
        this.unsave = false;
      }, 10);
    },
    toPage(url) {
      if (this.isCheck) return;
      uni.navigateTo({ url });
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      if (type === "day") {
        return `${value}日`;
      }
      return value;
    },
    changeBirthday(e) {
      const timeFormat = uni.$u.timeFormat;
      this.form.birthday = timeFormat(e.value, "yyyy-mm-dd");
      this.birthday = timeFormat(e.value, "yyyy-mm-dd");
      this.showBirthday = false;
    },
    openBirthday() {
      if (this.isCheck) return;
      this.showBirthday = true;
    },
    submit() {
      if (
        this.form.childrennumSection &&
        (this.form.childrennumSection < 0 || this.form.childrennumSection > 19)
      ) {
        uni.$u.toast("子女数量只能在0-19");
        return;
      }

      this.$refs.form
        .validate()
        .then((res) => {
          if (this.isEdit) {
            this.edit();
            return;
          }
          this.add();
        })
        .catch((errors) => {
          // console.log(errors)
          uni.$u.toast("请完善必填项");
        });
    },
    async add() {
      let phones = "";
      try {
        if (this.form.phoneList.length) {
          phones =
            this.form.mobilephone +
            "," +
            this.form.phoneList.map((item) => item.mobilephone).join(",");
        }
        const res = await uni.$u.http.post(addCustomerUrl, {
          ...this.form,
          mobilephone: this.form.phoneList.length
            ? phones
            : this.form.mobilephone,
        });
        if (res.code === 200) {
          uni.$u.toast("新增成功");
          this.toDetail(`/pages/old-man/portfolio?id=${res.data}`);
        }
      } catch (e) {
        uni.$u.toast(e.msg);
      }
    },
    async edit() {
      let phones = "";
      try {
        if (this.form.phoneList.length) {
          phones =
            this.form.mobilephone +
            "," +
            this.form.phoneList.map((item) => item.mobilephone).join(",");
        }
        const res = await uni.$u.http.post(updateCustomerUrl, {
          ...this.form,
          mobilephone: this.form.phoneList.length
            ? phones
            : this.form.mobilephone,
        });
        if (res.code === 200) {
          uni.$u.toast("修改成功");
          this.toBack();
        }
      } catch (e) {
        uni.$u.toast(e.msg);
      }
    },
    handleEditAddress(type) {
      if (this.isCheck) return;
      this.$refs.form.clearValidate();
      const addrCur = {};
      const addrDom = {};
      for (let key in this.form) {
        if (key.includes("current")) {
          addrCur[key] = this.form[key];
        }
      }
      for (let key in this.form) {
        if (key.includes("domicile")) {
          addrDom[key] = this.form[key];
        }
      }
      if (type === "current") {
        this.$u.vuex("vuex_addressInfo", addrCur);
        this.$u.vuex("vuex_addressInfoCopy", addrDom);
      } else {
        this.$u.vuex("vuex_addressInfo", addrDom);
        this.$u.vuex("vuex_addressInfoCopy", addrCur);
      }
      this.toPage(`/pages/old-man/components/add-address?type=${type}`);
    },
    addressCallback() {
      const type = this.vuex_addressInfo.addrType;
      if (type && this.vuex_addressInfo[`${type}AllAddress`]) {
        Object.assign(this.form, { ...this.vuex_addressInfo });
      }
    },
    backEdit() {
      if (this.unsave) {
        this.show = true;
        return;
      }
      this.toBack();
    },
    dialogConfirm() {
      this.toBack();
    },
    toBack() {
      uni.navigateBack();
    },
    toDetail(url) {
      uni.navigateTo({ url });
    },
    //添加其他联系方式
    // addPhone() {
    //   if (this.isCheck) return
    //   if (this.form.mobilephone) {
    //     // const pattern = /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/
    //     const pattern = /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/
    //     let isValid = pattern.test(this.form.mobilephone)
    //     if (!isValid) {
    //       this.mobilephoneFocus = true
    //       this.mobilephoneCursor = this.form.mobilephone.length
    //       return
    //     }
    //     const emptyIndex = this.form.phoneList.findIndex(item => !item.mobilephone)
    //     const index = this.form.phoneList.findIndex(item => !pattern.test(item.mobilephone))
    //     if (emptyIndex > -1) {
    //       uni.$u.toast(`请输入联系电话${this.phoneNumberArr[emptyIndex]}`)
    //       this.form.phoneList[emptyIndex].focus = true
    //       this.form.phoneList[emptyIndex].cursor = ''
    //       return
    //     }
    //     if (index > -1) {
    //       uni.$u.toast(`请输入正确的联系电话${this.phoneNumberArr[index]}`)
    //       this.form.phoneList[index].focus = true
    //       this.form.phoneList[index].cursor = this.form.phoneList[index].mobilephone
    //       return
    //     }
    //     this.form.phoneList.push({ mobilephone: '', focus: true })
    //     return
    //   }
    //   uni.$u.toast('请输入联系电话')
    //   this.mobilephoneFocus = true
    // },

    addPhone() {
  if (this.isCheck) return;

  const pattern = /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/;

  if (this.form.mobilephone) {
    let isValid = pattern.test(this.form.mobilephone);

    if (!isValid) {
      uni.$u.toast("请输入正确的联系电话");
      // 设置标记，防止聚焦触发滚动导致循环
      this.isCheckingScroll = true;
      this.keepMainPhoneFocus();
      // 延迟解除标记
      setTimeout(() => {
        this.isCheckingScroll = false;
      }, 500);
      return;
    }

    const emptyIndex = this.form.phoneList.findIndex(
      (item) => !item.mobilephone
    );
    if (emptyIndex > -1) {
      // 设置标记
      this.isCheckingScroll = true;
      this.keepOtherPhoneFocus(emptyIndex);
      setTimeout(() => {
        this.isCheckingScroll = false;
      }, 500);
      return;
    }

    const invalidIndex = this.form.phoneList.findIndex(
      (item) => item.mobilephone && !pattern.test(item.mobilephone)
    );
    if (invalidIndex > -1) {
      uni.$u.toast(
        `请输入正确的联系电话${this.phoneNumberArr[invalidIndex]}`
      );
      // 设置标记
      this.isCheckingScroll = true;
      this.keepOtherPhoneFocus(invalidIndex);
      setTimeout(() => {
        this.isCheckingScroll = false;
      }, 500);
      return;
    }

    this.form.phoneList.push({ mobilephone: "", focus: false, cursor: 0 });
    return;
  }

  uni.$u.toast("请输入联系电话");
},
    // 新增:主联系电话检查
    async checkMainPhone() {
      const phone = this.form.mobilephone;
      if (!phone) return;

      const pattern = /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/;
      const isValid = pattern.test(phone);

      if (!isValid) {
        uni.$u.toast("请输入正确的联系电话");
        this.keepMainPhoneFocus();
        return;
      }

      if (!this.noCheckPhoneArr.includes(phone) && !this.form.id) {
        this.isCheck = true;
        try {
          const res = await uni.$u.http.post(checkPhoneUrl, {
            mobilephone: phone,
            id: this.form.id,
          });
          this.isCheck = false;
          if (res.data.list.length) {
            this.showRepeat = true;
            this.repeatList = res.data.list;
            this.repeatPhone = phone;
          }
        } catch (e) {
          this.isCheck = false;
        }
      }
    },

    // 新增:其他联系电话检查
    async checkOtherPhone(index) {
      const phone = this.form.phoneList[index].mobilephone;
      if (!phone) return;

      const pattern = /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/;
      const isValid = pattern.test(phone);

      if (!isValid) {
        uni.$u.toast(`请输入正确的联系电话${this.phoneNumberArr[index] || ""}`);
        this.keepOtherPhoneFocus(index);
        return;
      }

      if (!this.noCheckPhoneArr.includes(phone) && !this.form.id) {
        this.isCheck = true;
        try {
          const res = await uni.$u.http.post(checkPhoneUrl, {
            mobilephone: phone,
            id: this.form.id,
          });
          this.isCheck = false;
          if (res.data.list.length) {
            this.showRepeat = true;
            this.repeatList = res.data.list;
            this.repeatPhone = phone;
          }
        } catch (e) {
          this.isCheck = false;
        }
      }
    },
    // 输入的联系电话回调
    async checkPhone(p, index) {
      this.mobilephoneFocus = false;
      this.form.phoneList.forEach((p) => {
        p.focus = false;
      });
      // const pattern = /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/
      const pattern = /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/;
      const isValid = pattern.test(p);
      // 确认了继续新建人员和编辑的时候不需要判断号码重复
      if (isValid && !this.noCheckPhoneArr.includes(p) && !this.form.id) {
        this.isCheck = true;
        try {
          const res = await uni.$u.http.post(checkPhoneUrl, {
            mobilephone: p,
            id: this.form.id,
          });
          this.isCheck = false;
          if (res.data.list.length) {
            this.showRepeat = true;
            this.repeatList = res.data.list;
            this.repeatPhone = p;
          }
        } catch (e) {
          this.isCheck = false;
        }
        return;
      }
      if (index > -1) {
        this.keepOtherPhoneFocus(index);
        return;
      }
      this.keepMainPhoneFocus();
    },
    closeRepeat() {
      this.noCheckPhoneArr.push(this.repeatPhone);
      this.showRepeat = false;
      this.repeatList = [];
      this.repeatPhone = "";
    },
    dialogRepeat() {
      // uni.$u.toast('请输入正确的手机号码')
    },
    openDelPhone(index) {
      // if (this.isCheck) return;
      // this.showDel = true;
      // this.delPhoneIndex = index;
      if (this.isCheck) return;
      // 先重置所有焦点状态
      this.mobilephoneFocus = false;
      this.form.phoneList.forEach((item) => {
        this.$set(item, "focus", false);
      });
      this.showDel = true;
      this.delPhoneIndex = index;
    },
    //删除联系电话
    delPhone() {
      // this.form.phoneList.splice(this.delPhoneIndex, 1);
      // this.delPhoneIndex = undefined;
      // this.$refs.form.validateField("phoneList");
      this.form.phoneList.splice(this.delPhoneIndex, 1);
      this.showDel = false; // 关闭弹窗
      this.delPhoneIndex = undefined;
      // 重置所有联系电话的焦点状态
      this.form.phoneList.forEach((item) => {
        this.$set(item, "focus", false);
      });
      // 触发表单验证
      this.$nextTick(() => {
        this.$refs.form.validateField("phoneList");
      });
    },
    validatePhonesOnScroll() {
      const pattern = /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/;
      const mainPhone = this.form.mobilephone;
      if (mainPhone && !pattern.test(mainPhone)) {
        this.keepMainPhoneFocus();
        console.log('111111')
        return;
      }
      const invalidIndex = this.form.phoneList.findIndex(
        (item) => item.mobilephone && !pattern.test(item.mobilephone)
      );
      if (invalidIndex > -1) {
        uni.$u.toast(
          `请输入正确的联系电话${this.phoneNumberArr[invalidIndex] || ""}`
        );
        console.log('22222')

        this.keepOtherPhoneFocus(invalidIndex);
      }
    },
   
keepMainPhoneFocus() {
  // 如果正在聚焦，直接返回
  if (this.isFocusing) return;
  
  this.isFocusing = true;
  
  // 先清除其他电话的焦点
  this.form.phoneList.forEach((item) => {
    this.$set(item, "focus", false);
  });

  this.$nextTick(() => {
    this.mobilephoneFocus = false;
    this.$nextTick(() => {
      this.mobilephoneCursor = (this.form.mobilephone || "").length;
      this.mobilephoneFocus = true;
      
      // 聚焦完成后延迟解除标记
      setTimeout(() => {
        this.isFocusing = false;
      }, 300);
    });
  });
},

keepOtherPhoneFocus(index) {
  // 如果正在聚焦，直接返回
  if (this.isFocusing) return;
  
  this.isFocusing = true;
  
  const target = this.form.phoneList[index];
  if (!target) {
    this.isFocusing = false;
    return;
  }

  // 先清除主电话和其他电话的焦点
  this.mobilephoneFocus = false;
  this.form.phoneList.forEach((item, i) => {
    if (i !== index) {
      this.$set(item, "focus", false);
    }
  });

  this.$nextTick(() => {
    this.$set(target, "focus", false);
    this.$nextTick(() => {
      this.$set(target, "cursor", (target.mobilephone || "").length);
      this.$set(target, "focus", true);
      
      // 聚焦完成后延迟解除标记
      setTimeout(() => {
        this.isFocusing = false;
      }, 300);
    });
  });
},
  },
};
</script>

<style scoped lang="scss">
.add-page {
  background-color: #faf9f7;
  position: relative;
  min-height: 100vh;
  padding: 12px 16px 24px;
}

.title {
  padding-bottom: 12px;
  color: $u-main-color;
  font-size: 16px;
  font-weight: bold;
}

.add-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

/deep/ uni-text {
  font-size: 14px !important;
}

/deep/ .u-navbar__content__title {
  font-size: 16px !important;
}

.add-item {
  display: flex;
  align-items: center;
  color: #ff9500;

  text {
    padding-left: 5px;
  }
}

.mobilephone {
  margin-top: 12px;
}

.check-phone {
  color: #e96848;
}

.u-text-center {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-box {
  margin-top: 16px;
  border: 1px solid #f5f3f0;
  border-radius: 8px;
  min-height: 40px;
  background-color: #fff;
  overflow: hidden;

  .repeat-item {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    min-height: 40px;
    padding: 11px 8px;
    border-bottom: 1px solid #f5f3f0;
    font-size: 12px;

    .repeat-name,
    .repeat-address,
    .repeat-remark {
      width: 31%;
    }

    .repeat-name {
      color: #333231;
    }

    .repeat-icon {
      width: 7%;
    }
  }
}

/deep/ .u-textarea {
  padding: 0;
}

.phone-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}
</style>
