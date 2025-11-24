<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // axios 임포트

// PrimeVue 컴포넌트 임포트
import Button from 'primevue/button';

// 공통 테이블 컴포넌트 임포트
import BaseDataTable from '@/components/BaseDataTable.vue';

const router = useRouter();

// 데이터 및 상태 ref
const userInquiries = ref([]);
const loading = ref(true);
const error = ref(null); // 에러 상태 추가

// BaseDataTable에 전달할 컬럼 정의
const inquiryColumns = ref([
  { field: 'inquiry_name', header: '조사지명', style: 'min-width: 20rem' },
  { field: 'business_name', header: '사업명', style: 'min-width: 20rem' },
  { field: 'created_at', header: '작성일', style: 'min-width: 10rem' },
  { field: 'management', header: '신청', style: 'min-width: 10rem' },
]);

// API를 통해 사용자 문의 목록을 가져오는 함수
const fetchUserInquiries = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/api/user/user-inquiries');
    userInquiries.value = response.data.result;
  } catch (err) {
    console.error('Failed to fetch user inquiries:', err);
    error.value = '데이터를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
};

// 컴포넌트가 마운트되기 전에 데이터 로드
onBeforeMount(() => {
  fetchUserInquiries();
});

// "상세보기" 버튼 클릭 시 실행될 함수
const goToInquiryDetail = (inquiry) => {
  router.push({ name: 'user-inquiry-detail', params: { id: inquiry.inquiry_no } });
};
</script>

<template>
  <div class="card">
    <div class="flex items-center mb-5">
      <i class="pi pi-file-text" style="font-size: 2.5rem; color: var(--primary-color)"></i>
      <h2 class="text-3xl font-bold ml-4">📝사업 신청</h2>
    </div>

    <div class="inquiry-list-box">
      <h3 class="text-xl font-semibold mb-4">신청 가능한 사업 목록</h3>

      <!-- 공통 테이블 컴포넌트 사용 -->
      <BaseDataTable :data="userInquiries" :columns="inquiryColumns" :loading="loading" :rows="5">
        <!-- 'management' 컬럼의 body를 커스터마이징 -->
        <template #body-management="{ data }">
          <Button label="신청하기" outlined @click="goToInquiryDetail(data)" />
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

.inquiry-list-box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}
</style>
