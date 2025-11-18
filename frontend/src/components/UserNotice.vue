<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // axios 임포트

// PrimeVue 컴포넌트 임포트
import Button from 'primevue/button';
import Tag from 'primevue/tag';

// 공통 테이블 컴포넌트 임포트
import BaseDataTable from '@/components/BaseDataTable.vue';

const router = useRouter();

// 데이터 및 상태 ref
const userSurveys = ref([]);
const loading = ref(true);
const error = ref(null); // 에러 상태 추가

// BaseDataTable에 전달할 컬럼 정의
const userColumns = ref([
  { field: 'business_name', header: '조사지명', style: 'min-width: 20rem' },
  { field: 'ward_name', header: '대상자', style: 'min-width: 10rem' },
  { field: 'submission_status', header: '상태', style: 'min-width: 8rem' },
  { field: 'deadline', header: '제출기한', style: 'min-width: 10rem' },
  { field: 'management', header: '관리', style: 'min-width: 15rem' },
]);

// API를 통해 사용자 조사지 목록을 가져오는 함수
const fetchUserSurveys = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/api/user/user-surveys', {
      params: { writer: 'test' }
    });
    userSurveys.value = response.data.result;
  } catch (err) {
    console.error('Failed to fetch user surveys:', err);
    error.value = '데이터를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
};

// 컴포넌트가 마운트되기 전에 데이터 로드
onBeforeMount(() => {
  fetchUserSurveys();
});

// "작성하기" 버튼 클릭 시 실행될 함수
const doSurvey = (survey) => {
  alert(`'${survey.name}' 조사를 시작합니다.`);
};

// "결과보기" 버튼 클릭 시 실행될 함수
const viewResult = (survey) => {
  alert(`'${survey.name}' 조사 결과를 봅니다.`);
};

// 상태(status)에 따라 Tag의 색상을 결정하는 함수
const getStatusSeverity = (status) => {
  const currentStatus = status || '미제출';
  switch (currentStatus) {
    case '미제출':
      return 'info';
    case '접수':
      return 'success';
    case '심사중':
      return 'warning';
    case '반려':
      return 'danger';
    default:
      return 'contrast';
  }
};
</script>

<template>
  <div class="card">
    <div class="flex items-center mb-5">
      <i class="pi pi-file-text" style="font-size: 2.5rem; color: var(--primary-color)"></i>
      <h2 class="text-3xl font-bold ml-4">사업 신청서 조회</h2>
    </div>

    <div class="survey-list-box">
      <h3 class="text-xl font-semibold mb-4">사업 신청서 목록</h3>

      <!-- 공통 테이블 컴포넌트 사용 -->
      <BaseDataTable :data="userSurveys" :columns="userColumns" :loading="loading" :rows="5">
        <!-- 'submission_status' 컬럼의 body를 커스터마이징 -->
        <template #body-submission_status="{ data }">
          <Tag
            :value="data.submission_status || '미제출'"
            :severity="getStatusSeverity(data.submission_status)"
          />
        </template>

        <!-- 'management' 컬럼의 body를 커스터마이징 -->
        <template #body-management="{ data }">
          <div class="flex gap-2">
            <Button
              v-if="!data.submission_status"
              label="작성하기"
              outlined
              @click="doSurvey(data)"
            />
            <Button
              v-else
              label="결과보기"
              severity="secondary"
              outlined
              @click="viewResult(data)"
            />
          </div>
        </template>
      </BaseDataTable>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow:
    0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

.survey-list-box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}
</style>
