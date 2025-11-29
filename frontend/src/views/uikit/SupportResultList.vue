<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import SupportResultItem from '@/components/staff/SupportResultItem.vue';

const ALLOW_MULTIPLE_ACCORDIONS = ref(false);
const surveys = ref([]);
const loading = ref(false);
const searchKeyword = ref('');
const activeSupportPlanNo = ref(null);

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

// DB에서 support-result 가져오기
onBeforeMount(async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/staff/support-result');
    console.log('API 응답 확인:', res.data); // 🔥 응답 구조 확인
    const list = Array.isArray(res.data) ? res.data : [res.data];

    surveys.value = list.map((item) => ({
      support_result_no: item.support_result_no, // support_result_no를 올바르게 할당
      support_plan_no: item.support_plan_no, // support_plan_no도 함께 전달
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
  } finally {
    loading.value = false;
  }
});

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
    <div v-if="!loading" class="flex flex-col gap-4">
      <SupportResultItem
        v-for="item in filteredSurveys"
        :key="item.support_result_no"
        :item="item"
        :is-active="activeSupportPlanNo === item.support_result_no"
        :allow-multiple="ALLOW_MULTIPLE_ACCORDIONS"
        @toggle-detail="() => handleToggleDetail(item.support_result_no)"
      />
    </div>

    <div v-else class="text-center p-6 text-lg text-gray-500">데이터 불러오는 중...</div>
  </div>
</template>
