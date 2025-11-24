<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import BaseDataTable from '@/components/BaseDataTable.vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// Data and state refs
const myPageSurveys = ref([]);
const loading = ref(true);
const error = ref(null);

// Columns for BaseDataTable
const columns = ref([
  { field: 'business_name', header: '사업명' },
  { field: 'institution_name', header: '기관명' },
  { field: 'created_at', header: '작성일' },
  { field: 'status', header: '상태' },
  { field: 'view_inquiry', header: '조사지열람' },
  { field: 'plan', header: '지원계획서' },
  { field: 'result', header: '결과확인' },
]);

// Fetch data from the new endpoint
const fetchMyPageSurveys = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/api/user/my-page-surveys', {
      params: { writer: authStore.user.id },
    });
    myPageSurveys.value = response.data.result;
    console.log('======================== \n My Page Surveys Response:', myPageSurveys.value);
  } catch (err) {
    console.error('Failed to fetch my page surveys:', err);
    error.value = '데이터를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
};

// Load data before component mounts
onMounted(() => {
  fetchMyPageSurveys();
});

// --- Event Handlers ---
const goToInquiryDetail = (survey) => {
  if (survey.survey_no) {
    router.push({ name: 'user-survey-detail', params: { survey_no: survey.survey_no } });
  } else {
    alert('연결된 조사지 정보가 없습니다.');
  }
};

// Placeholder functions for existing buttons
const showUserSupportPlan = (project) => {
  console.log('project.support_plan_no:', project.support_plan_no);
  router.push({
    name: 'user-support-plan-detail',
    params: { support_plan_no: project.support_plan_no },
  });
};

const showUserSupportResult = (project) => {
  if (project.support_result_no) {
    router.push({
      name: 'user-support-result-detail',
      params: { support_result_no: project.support_result_no },
    });
  }
};

const getDisplayStatus = (item) => {
  const statusMap = {
    '1f': '검토중',
    '2f': '승인대기',
    '3f': '반려',
    '4f': '승인',
    '5f': '지원종료',
    '접수': '접수',
    '심사중': '심사중',
    '검토중': '검토중',
    '승인대기': '승인대기',
    '반려': '반려',
    '승인': '승인',
    '지원종료': '지원종료',
    '접수중': '접수중'
  };
  const rawStatus = item.plan_status || '접수중';
  return statusMap[rawStatus] || rawStatus;
};

// Function to determine the severity of the status tag
const getStatusSeverity = (status) => {
  switch (status) {
    // --- survey 테이블의 enum 상태 ---
    case '접수':
      return 'info';
    case '심사중':
      return 'warning';

    // --- common 테이블의 코드(0F) 및 텍스트 상태 ---
    case '검토중':
    case '1f':
      return 'warning';

    case '승인대기':
    case '2f':
      return 'warning';

    case '반려':
    case '3f':
      return 'danger';

    case '승인':
    case '4f':
      return 'success';

    case '지원종료':
    case '5f':
      return 'secondary';

    default:
      return 'info';
  }
};
</script>

<template>
  <div class="table-section">
    <BaseDataTable :data="myPageSurveys" :columns="columns" :loading="loading" :rows="5">
      <!-- Custom body for the 'status' column -->
      <template #body-status="{ data }">
        <Tag :value="getDisplayStatus(data)" :severity="getStatusSeverity(getDisplayStatus(data))" />
      </template>

      <!-- Custom body for the 'view_inquiry' column -->
      <template #body-view_inquiry="{ data }">
        <Button label="열람하기" outlined @click="goToInquiryDetail(data)" />
      </template>

      <!-- Custom body for the 'plan' column -->
      <template #body-plan="{ data }">
        <Button label="열람하기" outlined @click="showUserSupportPlan(data)" :disabled="!data.support_plan_no" />
      </template>

      <!-- Custom body for the 'result' column -->
      <template #body-result="{ data }">
        <Button label="결과확인" outlined @click="showUserSupportResult(data)" :disabled="!data.support_result_no" />
      </template>
    </BaseDataTable>
  </div>
</template>

<style scoped>
.table-section {
  margin-top: 2rem;
}

/* 비활성화된 버튼 스타일 */
button:disabled {
  background-color: #cccccc !important; /* 회색 배경 */
  color: #666666 !important; /* 글자색도 어둡게 */
  border-color: #999999 !important; /* 테두리색 */
  cursor: not-allowed;
}

</style>
