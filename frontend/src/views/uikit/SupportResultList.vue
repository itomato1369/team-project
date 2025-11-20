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

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// 금액 표시 포맷
const formatAmount = (amount) => amount?.toLocaleString() || '-';

// 날짜 표시 포맷 (YYYY-MM-DD)
const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return isNaN(d) ? '-' : d.toLocaleDateString();
};

// 상세보기 클릭
const viewDetails = (row) => {
  alert(`상세보기: ${row.supportTitle}`);
};

// API로 데이터 로딩
const loadSupportResults = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/staff/support-result');

    // 안전하게 배열로 변환
    const data = Array.isArray(res.data) ? res.data : [res.data];

    supportResults.value = data.map((item) => ({
      id: item.support_result_no,
      supportTitle: item.support_title,
      supportSpend: item.support_spend,
      startedAt: item.support_started_at,
      endedAt: item.support_ended_at,
    }));

    console.log('지원 결과:', supportResults.value);
  } catch (err) {
    console.error('지원 결과 조회 오류:', err);
    supportResults.value = []; // 오류 시 빈 배열
  } finally {
    loading.value = false;
  }
};

onMounted(loadSupportResults);
</script>

<template>
  <div class="card">
    <div class="p-input-icon-left w-full mb-4">
      <i class="pi pi-search" />
      <InputText
        v-model="filters.global.value"
        placeholder="지원 제목, 금액 등 검색"
        class="w-full p-inputtext-lg"
      />
    </div>

    <DataTable
      :value="supportResults"
      :loading="loading"
      :filters="filters"
      :global-filter-fields="['supportTitle', 'supportSpend']"
      paginator
      :rows="10"
      tableStyle="min-width: 50rem"
    >
      <Column field="supportTitle" header="지원 제목" sortable />

      <Column field="supportSpend" header="지원 금액" sortable>
        <template #body="slotProps">
          {{ formatAmount(slotProps.data.supportSpend) }}
        </template>
      </Column>

      <Column field="startedAt" header="시작 일자" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.startedAt) }}
        </template>
      </Column>

      <Column field="endedAt" header="종료 일자" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.endedAt) }}
        </template>
      </Column>

      <Column header="보기">
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
