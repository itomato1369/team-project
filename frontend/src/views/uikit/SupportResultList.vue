<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';

const supportResults = ref([]);
const loading = ref(false);

// 필터 초기화
const filters = ref({});
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};
initFilters();

// 금액 표시 포맷
const formatAmount = (amount) => amount.toLocaleString();

// 날짜 표시 포맷
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '-');

// 상세보기 클릭
const viewDetails = (row) => {
  alert(`상세보기: ${row.supportTitle}`);
};

// ✅ DB에서 데이터 로딩
const loadSupportResults = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/support-result'); // 백엔드 API 호출
    // API에서 오는 데이터 형태에 맞게 매핑
    supportResults.value = res.data.map((item) => ({
      id: item.support_result_no, // DB PK
      supportTitle: item.support_title,
      supportSpend: item.support_spend,
      startedAt: item.support_started_at,
      endedAt: item.support_ended_at,
    }));
  } catch (err) {
    console.error('지원 결과 조회 오류:', err);
  } finally {
    loading.value = false;
  }
};

// 마운트 시 데이터 로드
onMounted(loadSupportResults);
</script>

<template>
  <div class="card">
    <!-- 검색창 -->
    <div class="p-input-icon-left w-full mb-4">
      <i class="pi pi-search" />
      <InputText
        v-model="filters.global.value"
        placeholder="지원 제목, 금액 등 검색"
        class="w-full p-inputtext-lg"
      />
    </div>

    <DataTable :value="supportResults" ...>
      <Column field="supportTitle" header="지원 제목" ... />
      <Column field="supportSpend" header="지원 금액" ...>
        <template #body="slotProps">{{ formatAmount(slotProps.data.supportSpend) }}</template>
      </Column>
      <Column field="startedAt" header="시작 일자" ...>
        <template #body="slotProps">{{ formatDate(slotProps.data.startedAt) }}</template>
      </Column>
      <Column field="endedAt" header="종료 일자" ...>
        <template #body="slotProps">{{ formatDate(slotProps.data.endedAt) }}</template>
      </Column>
      <Column header="보기" ...>
        <template #body="slotProps">
          <Button
            label="상세보기"
            size="small"
            outlined
            @click="() => viewDetails(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.card {
  padding: 1.5rem;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
