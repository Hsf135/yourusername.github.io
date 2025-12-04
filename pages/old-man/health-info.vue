<template>
  <view class="u-p-b-20">
    <u-navbar title="健康信息" placeholder bgColor="#FAF9F7">
      <view v-if="isEdit" slot="left" class="u-flex">
        <text class="u-primary" @click="backEdit">取消</text>
      </view>
      <view v-if="isEdit" slot="right" class="u-flex">
        <text class="u-primary" @click="submit">完成</text>
      </view>
      <u-icon v-if="!isEdit" slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
      <view v-if="!isEdit" slot="right" class="u-flex">
        <text v-if="alive !== '0'" class="u-primary" @click="handleEdit">编辑</text>
      </view>
    </u-navbar>
    <view class="unlive-info" v-if="alive === '0'"> 该老人已去世，个人信息不纳入饱和度统计。若需编辑信息，请进入"延伸信息"页面，将"是否健在"改为"是" </view>
    <view v-if="!isEdit">
      <view class="base-box" v-if="isXiaMen">
        <view class="title">基础信息</view>
        <u-cell-group :border="false">
          <u-cell title="身高(cm)" :value="info.height"></u-cell>
          <u-cell title="体重(kg)" :value="info.weight"></u-cell>
          <u-cell title="腰围(cm)" :value="info.waist"></u-cell>
          <u-cell title="体质(BMI)" :value="info.bmi"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box">
        <view class="title">身体状况</view>
        <u-cell-group :border="false">
          <u-cell title="健康状况自评" :value="radioDict(info.healthSelfRating, 'health_self_rating')"></u-cell>
          <u-cell v-if="isXiaMen" title="自理能力自评" :value="radioDict(info.selfCareSelfRating, 'self_care_self_rating')"></u-cell>
          <u-cell title="身体状况" :value="checkDict(info.physicalCondition, 'physical_condition')"></u-cell>
          <u-cell title="慢性病" :value="checkDict(info.chronicDisease, 'chronic_disease')"></u-cell>
          <u-cell v-if="isXiaMen" title="日抽烟情况" :value="radioDict(info.smokingSituationDay, 'smoking_situation_day')"></u-cell>
          <u-cell v-if="isXiaMen" title="饮酒情况" :value="radioDict(info.drinkSituation, 'drink_situation')"></u-cell>
          <u-cell v-if="isXiaMen" title="日睡眠情况" :value="radioDict(info.sleepSituationDay, 'sleep_situation_day')"></u-cell>
          <u-cell v-if="isXiaMen" title="睡眠质量" :value="radioDict(info.sleepQuality, 'sleep_quality')"></u-cell>
          <u-cell title="体育锻炼" :value="checkDict(info.physicalExercise, 'physical_exercise')"></u-cell>
          <u-cell title="周运动量(次)" :value="info.exerciseAmountWeek"></u-cell>
          <u-cell title="次运动量(分钟)" :value="info.exerciseAmountEvery"></u-cell>
          <u-cell title="饮食习惯" :value="radioDict(info.foodHabits, 'food_habits')"></u-cell>
          <u-cell v-if="isXiaMen" title="饮食偏好" :value="checkDict(info.foodPreference, 'food_preference')"></u-cell>
          <u-cell title="心理特征" :value="checkDict(info.psychologicalFeature, 'psychological_feature')"></u-cell>
          <u-cell title="形体特征" :value="radioDict(info.formFeature, 'form_feature')"></u-cell>
          <u-cell title="是否用药" :value="radioDict(info.isMedication, 'yes_no')"></u-cell>
          <u-cell v-if="isXiaMen" title="痴呆前兆" :value="checkDict(info.dementiaPrecursor, 'dementia_precursor')"></u-cell>
          <u-cell v-if="isXiaMen" title="现存症状" :value="checkDict(info.existingSymptoms, 'existing_symptoms')"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box" v-if="isXiaMen">
        <view class="title">生活环境</view>
        <u-cell-group :border="false">
          <u-cell title="厨房排风设施" :value="checkDict(info.exhaustFacilities, 'exhaust_facilities')"></u-cell>
          <u-cell title="燃料类型" :value="checkDict(info.fuelType, 'fuel_type')"></u-cell>
          <u-cell title="饮水类型" :value="checkDict(info.drinkingWater, 'drinking_water')"></u-cell>
          <u-cell title="厕所" :value="checkDict(info.toilet, 'toilet')"></u-cell>
          <u-cell title="宠物" :value="checkDict(info.pet, 'pet')"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box" v-if="isXiaMen">
        <view class="title">病史</view>
        <u-cell-group :border="false">
          <u-cell title="药物过敏史" :value="checkDict(info.drugAllergyHistory, 'drug_allergy_history')"></u-cell>
          <u-cell title="家族病史" :value="checkDict(info.familyMedicalHistory, 'family_history')"></u-cell>
          <u-cell v-for="(item, index) in (Array.isArray(info.hereditMedicalHistory) ? info.hereditMedicalHistory : (info.hereditMedicalHistory ? [info.hereditMedicalHistory] : []))" :key="'heredit' + index" :title="`遗传病史${index + 1}`" :value="item"></u-cell>
          <u-cell v-for="(item, index) in (Array.isArray(info.pastMedicalHistory) ? info.pastMedicalHistory : (info.pastMedicalHistory ? [info.pastMedicalHistory] : []))" :key="'past' + index" :title="`既往病史${index + 1}`" :value="item"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box">
        <view class="title">主要指标</view>
        <u-cell-group :border="false">
          <u-cell title="血压情况" :value="radioDict(info.bloodPressureSituation, 'blood_pressure_situation')"></u-cell>
          <u-cell title="血糖情况" :value="radioDict(info.bloodSugarSituation, 'blood_sugar_situation')"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box" v-if="isXiaMen">
        <view class="title">中医体质特征</view>
        <u-cell-group :border="false">
          <u-cell title="体质" :value="checkDict(info.chineseMedicinePhysique, 'chinese_medicine_physique')"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box">
        <view class="title">现存主要健康问题</view>
        <u-cell-group :border="false">
          <u-cell title="心脑血管疾病" :value="radioDict(info.cardiovascularDisease, 'cardiovascular_disease')"></u-cell>
          <u-cell title="肾脏疾病" :value="radioDict(info.kidneyDisease, 'kidney_disease')"></u-cell>
          <u-cell title="心脏疾病" :value="radioDict(info.heartDisease, 'heart_disease')"></u-cell>
          <u-cell title="眼部疾病" :value="radioDict(info.ocularDisease, 'ocular_disease')"></u-cell>
          <u-cell title="骨骼疾病" :value="checkDict(info.skeletonDisease, 'skeleton_disease')"></u-cell>
          <u-cell title="口腔疾病" :value="checkDict(info.cavityDisease, 'cavity_disease')"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box" v-if="hospitalList.length">
        <view class="title">近期住院史</view>
        <u-cell-group :border="false">
          <u-cell v-for="(item, index) in hospitalList" :key="item.id" :title="`近期住院史${index + 1}`" :value="item.hospitalReason"></u-cell>
        </u-cell-group>
      </view>

      <view class="base-box" v-if="medicationList.length">
        <view class="title">近期用药史</view>
        <u-cell-group :border="false">
          <u-cell v-for="(item, index) in medicationList" :key="item.id" :title="`近期用药史${index + 1}`" :value="item.medicationName"></u-cell>
        </u-cell-group>
      </view>
    </view>

    <u--form v-if="isEdit" labelWidth="110px" :model="info" :rules="rules" ref="info">
      <view class="base-box" v-if="isXiaMen">
        <view class="title">基础信息</view>
        <u-form-item label="身高(cm)" prop="height" borderBottom>
          <u-input type="digit" v-model="info.height" clearable border="none" @blur="changeHeight" placeholder="请输入身高(cm)"> </u-input>
        </u-form-item>
        <u-form-item label="体重(kg)" prop="weight" borderBottom>
          <u-input type="digit" v-model="info.weight" clearable border="none" @blur="changeWeight" placeholder="请输入体重(kg)"> </u-input>
        </u-form-item>
        <u-form-item label="腰围(cm)" prop="waist" borderBottom>
          <u-input type="digit" v-model="info.waist" clearable border="none" @blur="changeWaist" placeholder="请输入腰围(cm)"> </u-input>
        </u-form-item>
        <u-form-item label="体质(BMI)" prop="bmi" borderBottom>
          <text v-if="info.bmi">{{ info.bmi }}</text>
          <text v-else class="u-place-color">根据身高体重计算得出</text>
        </u-form-item>
      </view>

      <view class="base-box">
        <view class="title">身体状况</view>
        <u-form-item label="健康状况自评" prop="healthSelfRating" borderBottom>
          <r-select v-model="info.healthSelfRating" :list="aDict('health_self_rating')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="自理能力自评" prop="selfCareSelfRating" borderBottom>
          <r-select v-model="info.selfCareSelfRating" :list="aDict('self_care_self_rating')" />
        </u-form-item>
        <u-form-item label="身体状况" prop="physicalCondition" borderBottom class="form-required">
          <r-select v-model="info.physicalCondition" multiple :list="aDict('physical_condition')" />
        </u-form-item>
        <u-form-item label="慢性病" prop="chronicDisease" borderBottom class="form-required">
          <r-select v-model="info.chronicDisease" multiple mutual="0,10" :list="aDict('chronic_disease')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="日抽烟情况" prop="smokingSituationDay" borderBottom>
          <r-select v-model="info.smokingSituationDay" :list="aDict('smoking_situation_day')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="饮酒情况" prop="drinkSituation" borderBottom>
          <r-select v-model="info.drinkSituation" :list="aDict('drink_situation')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="日睡眠情况" prop="sleepSituationDay" borderBottom>
          <r-select v-model="info.sleepSituationDay" :list="aDict('sleep_situation_day')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="睡眠质量" prop="sleepQuality" borderBottom>
          <r-select v-model="info.sleepQuality" :list="aDict('sleep_quality')" />
        </u-form-item>
        <u-form-item label="体育锻炼" prop="physicalExercise" borderBottom class="form-required">
          <r-select v-model="info.physicalExercise" multiple mutual="0,8" :list="aDict('physical_exercise')" />
        </u-form-item>
        <u-form-item label="周运动量(次)" prop="exerciseAmountWeek" borderBottom>
          <u-input v-model="info.exerciseAmountWeek" clearable maxlength="32" border="none" placeholder="请输入周运动量(次)"> </u-input>
        </u-form-item>
        <u-form-item label="次运动量(分钟)" prop="exerciseAmountEvery" borderBottom>
          <u-input v-model="info.exerciseAmountEvery" clearable maxlength="32" border="none" placeholder="请输入次运动量(分钟)"> </u-input>
        </u-form-item>
        <u-form-item label="饮食习惯" prop="foodHabits" borderBottom>
          <r-select v-model="info.foodHabits" :list="aDict('food_habits')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="饮食偏好" prop="foodPreference" borderBottom>
          <r-select v-model="info.foodPreference" multiple :list="aDict('food_preference')" />
        </u-form-item>
        <u-form-item label="心理特征" prop="psychologicalFeature" borderBottom>
          <r-select v-model="info.psychologicalFeature" multiple mutual="0,8" :list="aDict('psychological_feature')" />
        </u-form-item>
        <u-form-item label="形体特征" prop="formFeature" borderBottom>
          <r-select v-model="info.formFeature" :list="aDict('form_feature')" />
        </u-form-item>
        <u-form-item label="是否用药" prop="isMedication" borderBottom>
          <r-select v-model="info.isMedication" :list="aDict('yes_no')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="痴呆前兆" prop="dementiaPrecursor" borderBottom>
          <r-select v-model="info.dementiaPrecursor" multiple mutual="0,9" :list="aDict('dementia_precursor')" />
        </u-form-item>
        <u-form-item v-if="isXiaMen" label="现存症状" prop="existingSymptoms" borderBottom>
          <r-select v-model="info.existingSymptoms" multiple mutual="1,24" :list="aDict('existing_symptoms')" />
        </u-form-item>
      </view>

      <view class="base-box" v-if="isXiaMen">
        <view class="title">生活环境</view>
        <u-form-item label="厨房排风设施" prop="exhaustFacilities" borderBottom>
          <r-select v-model="info.exhaustFacilities" multiple mutual="0,5" :list="aDict('exhaust_facilities')" />
        </u-form-item>
        <u-form-item label="燃料类型" prop="fuelType" borderBottom>
          <r-select v-model="info.fuelType" multiple mutual="0,5" :list="aDict('fuel_type')" />
        </u-form-item>
        <u-form-item label="饮水类型" prop="drinkingWater" borderBottom>
          <r-select v-model="info.drinkingWater" multiple mutual="0,6" :list="aDict('drinking_water')" />
        </u-form-item>
        <u-form-item label="厕所" prop="toilet" borderBottom>
          <r-select v-model="info.toilet" multiple mutual="0,6" :list="aDict('toilet')" />
        </u-form-item>
        <u-form-item label="宠物" prop="pet" borderBottom>
          <r-select v-model="info.pet" multiple mutual="0,5" :list="aDict('pet')" />
        </u-form-item>
      </view>

      <view class="base-box" v-if="isXiaMen">
        <view class="title">病史</view>
        <u-form-item label="药物过敏史" prop="drugAllergyHistory" borderBottom>
          <r-select v-model="info.drugAllergyHistory" multiple mutual="0,5" :list="aDict('drug_allergy_history')" />
        </u-form-item>
        <u-form-item label="家族病史" prop="familyMedicalHistory" borderBottom>
          <r-select v-model="info.familyMedicalHistory" multiple mutual="0,13" :list="aDict('family_history')" />
        </u-form-item>
        <view v-for="(item, index) in hereditMedicalHistoryList" :key="'heredit' + index" class="history-item">
          <view class="history-item-content">
            <view class="history-delete" @click="removeHereditMedicalHistory(index)">
              <view class="delete-icon"></view>
            </view>
            <u-form-item :label="`遗传病史${index + 1}`" :prop="`hereditMedicalHistory_${index}`" borderBottom class="history-form-item">
              <u-input v-model="hereditMedicalHistoryList[index]" clearable maxlength="32" border="none" placeholder="请输入遗传病史"> </u-input>
            </u-form-item>
          </view>
        </view>
        <view class="add-history-item" @click="addHereditMedicalHistory">
          <view class="add-icon"></view>
          <text>+添加遗传病史</text>
        </view>
        <view v-for="(item, index) in pastMedicalHistoryList" :key="'past' + index" class="history-item">
          <view class="history-item-content">
            <view class="history-delete" @click="removePastMedicalHistory(index)">
              <view class="delete-icon"></view>
            </view>
            <u-form-item :label="`既往病史${index + 1}`" :prop="`pastMedicalHistory_${index}`" borderBottom class="history-form-item">
              <u-input v-model="pastMedicalHistoryList[index]" clearable maxlength="32" border="none" placeholder="请输入既往病史"> </u-input>
            </u-form-item>
          </view>
        </view>
        <view class="add-history-item" @click="addPastMedicalHistory">
          <view class="add-icon"></view>
          <text>+添加既往病史</text>
        </view>
      </view>

      <view class="base-box">
        <view class="title">主要指标</view>
        <u-form-item label="血压情况" prop="bloodPressureSituation" borderBottom>
          <r-select v-model="info.bloodPressureSituation" :list="aDict('blood_pressure_situation')" />
        </u-form-item>
        <u-form-item label="血糖情况" prop="bloodSugarSituation" borderBottom>
          <r-select v-model="info.bloodSugarSituation" :list="aDict('blood_sugar_situation')" />
        </u-form-item>
      </view>

      <view class="base-box" v-if="isXiaMen">
        <view class="title">中医体质特征</view>
        <u-form-item label="体质" prop="chineseMedicinePhysique" borderBottom>
          <r-select v-model="info.chineseMedicinePhysique" multiple :list="aDict('chinese_medicine_physique')" />
        </u-form-item>
      </view>

      <view class="base-box">
        <view class="title">现存主要健康问题</view>
        <u-form-item label="心脑血管疾病" prop="cardiovascularDisease" borderBottom>
          <r-select v-model="info.cardiovascularDisease" :list="aDict('cardiovascular_disease')" />
        </u-form-item>
        <u-form-item label="肾脏疾病" prop="kidneyDisease" borderBottom>
          <r-select v-model="info.kidneyDisease" :list="aDict('kidney_disease')" />
        </u-form-item>
        <u-form-item label="心脏疾病" prop="heartDisease" borderBottom>
          <r-select v-model="info.heartDisease" :list="aDict('heart_disease')" />
        </u-form-item>
        <u-form-item label="眼部疾病" prop="ocularDisease" borderBottom>
          <r-select v-model="info.ocularDisease" :list="aDict('ocular_disease')" />
        </u-form-item>
        <u-form-item label="骨骼疾病" prop="skeletonDisease" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="info.skeletonDisease" multiple mutual="0" :list="aDict('skeleton_disease')" />
        </u-form-item>
        <u-form-item label="口腔疾病" prop="cavityDisease" borderBottom :class="{ 'form-required': !isXiaMen }">
          <r-select v-model="info.cavityDisease" multiple mutual="0" :list="aDict('cavity_disease')" />
        </u-form-item>
      </view>

      <view class="base-box" v-if="isXiaMen">
        <view class="title">近期住院史</view>
        <u-form-item v-for="(item, index) in hospitalList" :key="item.id" :label="`近期住院史${index + 1}`" borderBottom @click="toPage(`/pages/old-man/components/health-hospital?id=${customerId}&detail=${item.id}`)">
          <text class="u-content-color">{{ item.hospitalReason }}</text>
          <u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
        </u-form-item>
        <view class="add-item mobilephone" @click="toPage(`/pages/old-man/components/health-hospital?id=${customerId}`)">
          <u-icon :name="aIcon('tianjia2')" width="24" height="24"></u-icon>
          <text>添加近期住院史</text>
        </view>
      </view>

      <view class="base-box" v-if="isXiaMen">
        <view class="title">近期用药史</view>
        <u-form-item v-for="(item, idx) in medicationList" :key="item.id" :label="`近期用药史${idx + 1}`" borderBottom @click="toPage(`/pages/old-man/components/health-medication?id=${customerId}&detail=${item.id}`)">
          <text class="u-content-color">{{ item.medicationName }}</text>
          <u-icon slot="right" :name="aIcon('xiala-zuo')" width="24" height="24"></u-icon>
        </u-form-item>
        <view class="add-item mobilephone" @click="toPage(`/pages/old-man/components/health-medication?id=${customerId}`)">
          <u-icon :name="aIcon('tianjia2')" width="24" height="24"></u-icon>
          <text>添加近期用药史</text>
        </view>
      </view>
    </u--form>

    <r-dialog v-model="show" title="监测到未保存信息" cancelText="否" confirmText="是" @cancel="show = false" @confirm="dialogConfirm">
      <view slot="content" class="u-flex">
        <text>当前页面已做出修改，是否不保存就退出</text>
      </view>
    </r-dialog>
  </view>
</template>

<script>
import { getCustomerHealthDetailUrl, getHospitalUrl, getMedicationUrl, updateCustomerHealthUrl } from '../../api'
export default {
  data() {
    return {
      info: {
        physicalCondition: [],
        chronicDisease: [],
        physicalExercise: [],
        foodPreference: [],
        psychologicalFeature: [],
        dementiaPrecursor: [],
        existingSymptoms: [],
        exhaustFacilities: [],
        fuelType: [],
        drinkingWater: [],
        toilet: [],
        pet: [],
        drugAllergyHistory: [],
        familyMedicalHistory: [],
        chineseMedicinePhysique: [],
        skeletonDisease: [],
        cavityDisease: []
      },
      customerId: undefined,
      alive: undefined,
      isEdit: false,
      unsave: false,
      show: false,

      hospitalList: [],
      medicationList: [],
      hereditMedicalHistoryList: [],
      pastMedicalHistoryList: []
    }
  },
  computed: {
    rules() {
      return {
        physicalCondition: [
          {
            required: true,
            type: 'array',
            message: '身体状况不可为空',
            trigger: ['blur', 'change']
          }
        ],
        chronicDisease: [
          {
            required: true,
            type: 'array',
            message: '慢性病不可为空',
            trigger: ['blur', 'change']
          }
        ],
        physicalExercise: [
          {
            required: true,
            type: 'array',
            message: '体育锻炼不可为空',
            trigger: ['blur', 'change']
          }
        ],
        skeletonDisease: [
          {
            required: !this.isXiaMen,
            type: 'array',
            message: '骨骼疾病不可为空',
            trigger: ['blur', 'change']
          }
        ],
        cavityDisease: [
          {
            required: !this.isXiaMen,
            type: 'array',
            message: '口腔疾病不可为空',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  watch: {
    info: {
      handler: function () {
        if (this.info.height && this.info.weight) {
          this.info.bmi = ((this.info.weight / (this.info.height * this.info.height)) * 10000).toFixed(2)
        } else {
          this.info.bmi = undefined
        }
        this.unsave = true
      },
      deep: true
    },
    hereditMedicalHistoryList: {
      handler: function () {
        this.unsave = true
      },
      deep: true
    },
    pastMedicalHistoryList: {
      handler: function () {
        this.unsave = true
      },
      deep: true
    }
  },
  onLoad(option) {
    this.customerId = option.id
    this.alive = option.alive || undefined
    this.loadData()
  },
  onShow() {
    this.loadHospital()
  },
  methods: {
    async loadData() {
      const { data } = await uni.$u.http.post(`${getCustomerHealthDetailUrl}?customerId=${this.customerId}`)
      this.info = data
      // 处理遗传病史和既往病史，转换为数组格式
      if (data.hereditMedicalHistory) {
        if (Array.isArray(data.hereditMedicalHistory)) {
          this.hereditMedicalHistoryList = [...data.hereditMedicalHistory]
        } else if (typeof data.hereditMedicalHistory === 'string') {
          // 字符串格式如 '遗传1,遗传2,' 需要分割并过滤空字符串
          this.hereditMedicalHistoryList = data.hereditMedicalHistory.split(',').filter(item => item.trim() !== '')
        } else {
          this.hereditMedicalHistoryList = [data.hereditMedicalHistory]
        }
      } else {
        this.hereditMedicalHistoryList = []
      }
      if (data.pastMedicalHistory) {
        if (Array.isArray(data.pastMedicalHistory)) {
          this.pastMedicalHistoryList = [...data.pastMedicalHistory]
        } else if (typeof data.pastMedicalHistory === 'string') {
          // 字符串格式如 '既往1,既往2,' 需要分割并过滤空字符串
          this.pastMedicalHistoryList = data.pastMedicalHistory.split(',').filter(item => item.trim() !== '')
        } else {
          this.pastMedicalHistoryList = [data.pastMedicalHistory]
        }
      } else {
        this.pastMedicalHistoryList = []
      }
      setTimeout(() => {
        this.unsave = false
      }, 10)
    },
    async loadHospital() {
      const resH = await uni.$u.http.post(getHospitalUrl, { customerId: this.customerId })
      const resM = await uni.$u.http.post(getMedicationUrl, { customerId: this.customerId })
      this.hospitalList = resH.data.list
      this.medicationList = resM.data.list
    },
    toPage(url) {
      uni.navigateTo({ url })
    },
    handleBack() {
      uni.navigateBack()
    },
    submit() {
      this.$refs.info
        .validate()
        .then(res => {
          if (this.isEdit) {
            this.edit()
            return
          }
        })
        .catch(errors => {
          // console.log(errors)
          uni.$u.toast('请完善必填项')
        })
    },
    async edit() {
      try {
        // 将数组转换为字符串（如果后端需要字符串格式）或保持数组
        const submitData = {
          ...this.info,
          hereditMedicalHistory: this.hereditMedicalHistoryList.length > 0 ? this.hereditMedicalHistoryList : undefined,
          pastMedicalHistory: this.pastMedicalHistoryList.length > 0 ? this.pastMedicalHistoryList : undefined,
          customerId: this.customerId,
          isHospitalInfo: this.hospitalList.length ? true : false,
          isMedicationInfo: this.medicationList.length ? true : false
        }
        const res = await uni.$u.http.post(updateCustomerHealthUrl, submitData)
        if (res.code === 200) { 
          uni.$u.toast('修改成功')
          this.isEdit = false
          this.loadData()
        }
      } catch (e) {
        uni.$u.toast(e.msg)
      }
    },
    addHereditMedicalHistory() {
      this.hereditMedicalHistoryList.push('')
      this.unsave = true
    },
    removeHereditMedicalHistory(index) {
      this.hereditMedicalHistoryList.splice(index, 1)
      this.unsave = true
    },
    addPastMedicalHistory() {
      this.pastMedicalHistoryList.push('')
      this.unsave = true
    },
    removePastMedicalHistory(index) {
      this.pastMedicalHistoryList.splice(index, 1)
      this.unsave = true
    },
    backEdit() {
      if (this.unsave) {
        this.show = true
        return
      }
      this.isEdit = false
      this.loadData()
    },
    dialogConfirm() {
      if (this.isEdit) {
        this.isEdit = false
        this.loadData()
        return
      }
      uni.navigateBack()
    },
    changeHeight(val) {
      if (val > 300 || val < 55) {
        this.info.height = undefined
        uni.$u.toast('请输入正确身高，输入范围55~300')
      }
    },
    changeWeight(val) {
      if (val > 300 || val < 5) {
        this.info.weight = undefined
        uni.$u.toast('请输入正确体重，输入范围5~300')
      }
    },
    changeWaist(val) {
      if (val > 244 || val < 33) {
        this.info.waist = undefined
        uni.$u.toast('请输入正确腰围，输入范围33~244')
      }
    },
    handleEdit() {
      console.log('11111111111')
      if (!this.isSingleProject) {
        uni.showToast({ title: '您的账号包含多个项目，不支持编辑。可进人后台选择单一项日后进行编辑', icon: 'none' })
        return
      }
      this.isEdit = true
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

.add-item {
  display: flex;
  align-items: center;
  color: #ff9500;
  margin-top: 12px;

  text {
    padding-left: 5px;
  }
}

/deep/ .u-form-item__body__left {
  line-height: 22px;
}

/deep/ .u-cell__body {
  padding: 10px 0;
  min-height: 44px;
  align-items: flex-start;
}

/deep/ .u-cell__body__content {
  width: 110px;
  flex: inherit;
}

/deep/ .u-cell__value {
  text-align: left;
}

.history-item {
  margin-bottom: 0;
}

.history-item-content {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 0;
}

.history-delete {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff3b30;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  margin-top: 12px;
  flex-shrink: 0;
  cursor: pointer;
}

.delete-icon {
  width: 12px;
  height: 2px;
  background-color: #ffffff;
  border-radius: 1px;
}

.history-form-item {
  flex: 1;
  margin: 0;
}

.add-history-item {
  display: flex;
  align-items: center;
  color: #ff9500;
  margin-top: 12px;
  padding: 12px 0;
  cursor: pointer;

  text {
    padding-left: 8px;
    font-size: 16px;
  }
}

.add-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff9500;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 2px;
    background-color: #ffffff;
    border-radius: 1px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 12px;
    background-color: #ffffff;
    border-radius: 1px;
  }
}
</style>
