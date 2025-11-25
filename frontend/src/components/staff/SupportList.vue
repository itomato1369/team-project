<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import SupportPlanItem2 from '@/components/staff/SupportPlanItem2.vue';

const ALLOW_MULTIPLE_ACCORDIONS = ref(false);
const surveys = ref([]);
const loading = ref(false);
const searchKeyword = ref('');
const activeSupportPlanNo = ref(null);
const props = defineProps(['ward-id', 'selected-survey-no']);

// 우선순위 매핑
const mapPriority = (no) => {
  switch (no) {
    case 1:
      return '긴급';
    case 2:
      return '중점';
    case 3:
      return '준비';
    default:
      return '준비';
  }
};

// 상세 토글
const handleToggleDetail = (supportPlanNo) => {
  if (!ALLOW_MULTIPLE_ACCORDIONS.value) {
    activeSupportPlanNo.value = activeSupportPlanNo.value === supportPlanNo ? null : supportPlanNo;
  }
};

// 데이터 로딩 함수
const fetchSupportPlans = async (wardId, surveyNo) => {
  console.log('[SupportList] Fetching data with:', { wardId, surveyNo });
  if (!wardId || !surveyNo) {
    surveys.value = [];
    return;
  }
  loading.value = true;
  try {
    const res = await axios.get('/api/staff/support-plan/filtered', {
      params: {
        ward_no: wardId,
        survey_no: surveyNo
      }
    });
    console.log('[SupportList] Backend response data:', res.data);

    surveys.value = res.data.map((item) => ({
      support_plan_no: item.support_plan_no,
      support_plan_goal: item.support_plan_goal || '',
      staff_name: item.staff_name || '',
      created_at: item.created_at ? item.created_at.split('T')[0] : '',
      writer_date: item.writer_date ? item.writer_date.split('T')[0] : '',
      priority_no: item.priority_no,
      priority: mapPriority(item.priority_no),
      business_name: item.business_name || '',
      spend: item.spend || 0,
      plan: item.plan || '',
      file_names: item.file_names || '',
      support_plan_status: item.support_plan_status || item.status || '',
    }));
    console.log('[SupportList] Mapped surveys:', surveys.value);
  } catch (err) {
    console.error('Support Plan 조회 오류:', err);
    surveys.value = []; // 에러 발생 시 목록 비우기
  } finally {
    loading.value = false;
  }
};

// props가 변경될 때마다 데이터 다시 로드
watch(
  () => [props.wardId, props.selectedSurveyNo],
  (newValues) => {
    const [newWardId, newSurveyNo] = newValues;
    fetchSupportPlans(newWardId, newSurveyNo);
  },
  { immediate: true } // 컴포넌트가 마운트될 때 즉시 실행
);

// 검색 필터 적용
const filteredSurveys = computed(() => {
  if (!searchKeyword.value) return surveys.value;
  const keyword = searchKeyword.value.toLowerCase();
  return surveys.value.filter(
    (item) =>
      item.support_plan_goal.toLowerCase().includes(keyword) ||
      item.staff_name.toLowerCase().includes(keyword) ||
      item.priority.toLowerCase().includes(keyword)
  );
});
</script>

<template>
  <div class="card">
    <!-- 검색창 -->
    <div class="p-input-icon-left w-full mb-4">
      <i class="pi pi-search" />
      <InputText
        v-model="searchKeyword"
        placeholder="지원제목, 작성자, 우선순위 등으로 검색"
        class="w-full p-inputtext-lg"
      />
    </div>

    <!-- 리스트 -->
    <div v-if="!loading && filteredSurveys.length > 0" class="flex flex-col gap-4">
      <SupportPlanItem2
        v-for="item in filteredSurveys"
        :key="item.support_plan_no"
        :item="item"
        :is-active="activeSupportPlanNo === item.support_plan_no"
        :allow-multiple="ALLOW_MULTIPLE_ACCORDIONS"
        @toggle-detail="() => handleToggleDetail(item.support_plan_no)"
      />
    </div>

    <div v-else-if="!loading && filteredSurveys.length === 0" class="text-center p-6 text-lg text-gray-500">
      조회된 지원계획서가 없습니다.
    </div>

    <div v-else class="text-center p-6 text-lg text-gray-500">데이터 불러오는 중...</div>
  </div>
</template>
