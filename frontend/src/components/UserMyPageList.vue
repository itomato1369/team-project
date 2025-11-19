<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import BaseDataTable from '@/components/BaseDataTable.vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const router = useRouter();

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
      params: { writer: 'test' },
    });
    myPageSurveys.value = response.data.result;
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
  if (survey.inquiry_no) {
    router.push({ name: 'user-inquiry-detail', params: { id: survey.inquiry_no } });
  } else {
    alert('연결된 조사지 정보가 없습니다.');
  }
};

// Placeholder functions for existing buttons
const showUserSupportPlan = (project) => {
  console.log('project.support_plan_no:', project.inquiry_no);
  router.push({ name: 'user-support-plan-detail', params: { inquiry_no: project.inquiry_no } });
};

const showUserSupportResult = (project) => {
  alert('결과확인 기능은 현재 비활성화되어 있습니다.');
};

// Function to determine the severity of the status tag
const getStatusSeverity = (status) => {
  switch (status) {
    case '접수':
      return 'success';
    case '심사중':
      return 'warning';
    case '반려':
      return 'danger';
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
        <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
      </template>

      <!-- Custom body for the 'view_inquiry' column -->
      <template #body-view_inquiry="{ data }">
        <Button label="열람하기" outlined @click="goToInquiryDetail(data)" />
      </template>

      <!-- Custom body for the 'plan' column -->
      <template #body-plan="{ data }">
        <Button label="열람하기" outlined @click="showUserSupportPlan(data)" />
      </template>

      <!-- Custom body for the 'result' column -->
      <template #body-result="{ data }">
        <Button label="결과확인" outlined @click="showUserSupportResult(data)" />
      </template>
    </BaseDataTable>
  </div>
</template>

<style scoped>
.table-section {
  margin-top: 2rem;
}
</style>
