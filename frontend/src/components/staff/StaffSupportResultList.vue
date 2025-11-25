<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import StaffSupportResultItem from '@/components/staff/StaffSupportResultItem.vue';

const ALLOW_MULTIPLE_ACCORDIONS = ref(false);
const surveys = ref([]);
const loading = ref(false);
const searchKeyword = ref('');
const activeSupportPlanNo = ref(null);
const props = defineProps(['ward-id', 'selected-survey-no']);

// 상세 토글
const handleToggleDetail = (supportResultNo) => {
  if (!ALLOW_MULTIPLE_ACCORDIONS.value) {
    activeSupportPlanNo.value =
      activeSupportPlanNo.value === supportResultNo ? null : supportResultNo;
  }
};

// 날짜 포맷
const formatDate = (date) => {
  if (!date) return '-';
  try {
    return date.split('T')[0];
  } catch (err) {
    console.warn('날짜 포맷 실패:', date);
    return '-';
  }
};

// 데이터 로딩 함수
const fetchSupportResults = async (wardId, surveyNo) => {
  if (!wardId || !surveyNo) {
    surveys.value = [];
    return;
  }
  loading.value = true;
  try {
    const res = await axios.get('/api/staff/support-result/filtered', {
      params: {
        ward_no: wardId,
        survey_no: surveyNo,
      },
    });
    console.log('API 응답 확인:', res.data); // 🔥 응답 구조 확인
    const list = Array.isArray(res.data) ? res.data : [res.data];

    surveys.value = list.map((item) => ({
      support_plan_no: item.support_result_no,
      title: item.support_title,
      spend: item.support_spend,
      // 상세 보기용 데이터
      support_plan_goal: item.support_title,
      staff_name: item.staff_name || '미지정',
      business_name: item.business_name || '-',
      support_started_at: item.support_started_at ? formatDate(item.support_started_at) : '-',
      support_ended_at: item.support_ended_at ? formatDate(item.support_ended_at) : '-',
      writer_date: item.writer_date ? item.writer_date.split('T')[0] : '',
      support_plan_status: item.status || '',
      plan: item.support_content || '',
      file_names: item.file_names || '',
    }));
  } catch (err) {
    console.error('지원 결과 조회 오류:', err);
    surveys.value = [];
  } finally {
    loading.value = false;
  }
};

// props가 변경될 때마다 데이터 다시 로드
watch(
  () => [props.wardId, props.selectedSurveyNo],
  (newValues) => {
    const [newWardId, newSurveyNo] = newValues;
    fetchSupportResults(newWardId, newSurveyNo);
  },
  { immediate: true } // 컴포넌트가 마운트될 때 즉시 실행
);


// 검색 필터
const filteredSurveys = computed(() => {
  if (!searchKeyword.value) return surveys.value;

  const keyword = searchKeyword.value.toLowerCase();
  return surveys.value.filter(
    (item) =>
      item.title?.toLowerCase().includes(keyword) ||
      item.staff_name?.toLowerCase().includes(keyword)
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
        placeholder="지원 제목, 작성자 검색"
        class="w-full p-inputtext-lg"
      />
    </div>

    <!-- 결과 리스트 -->
    <div v-if="!loading && filteredSurveys.length > 0" class="flex flex-col gap-4">
      <StaffSupportResultItem
        v-for="item in filteredSurveys"
        :key="item.support_plan_no"
        :item="item"
        :is-active="activeSupportPlanNo === item.support_plan_no"
        :allow-multiple="ALLOW_MULTIPLE_ACCORDIONS"
        @toggle-detail="() => handleToggleDetail(item.support_plan_no)"
      />
    </div>

    <div v-else-if="!loading && filteredSurveys.length === 0" class="text-center p-6 text-lg text-gray-500">
      조회된 지원결과서가 없습니다.
    </div>

    <div v-else class="text-center p-6 text-lg text-gray-500">데이터 불러오는 중...</div>
  </div>
</template>
