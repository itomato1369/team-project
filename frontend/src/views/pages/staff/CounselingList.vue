<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast'; // Toast 추가
import { consultLogApi } from '@/api/api';

const router = useRouter();
const toast = useToast(); // Toast 인스턴스

// --- State ---
const searchType = ref('guardian'); // 검색 기준
const searchKeyword = ref(''); // 텍스트 검색어
const searchDate = ref(''); // 날짜 검색어
const isLoading = ref(false);
const recordList = ref([]); // API 응답 데이터

// --- Methods ---

// 날짜 포맷팅 (YYYY년 MM월 DD일 HH:mm)
function formatDateTime(isoString) {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

// 목록 조회 (API 호출)
async function fetchRecords() {
  isLoading.value = true;
  try {
    const params = {
      searchType: searchType.value,
      keyword: searchType.value === 'date' ? undefined : searchKeyword.value,
      searchDate: searchType.value === 'date' ? searchDate.value : undefined,
    };

    const res = await consultLogApi.getLogs(params);
    recordList.value = res.data.data || [];
  } catch (err) {
    console.error('목록 조회 실패:', err);
    toast.add({
      severity: 'error',
      summary: '조회 실패',
      detail: '상담 기록을 불러오는데 실패했습니다.',
      life: 3000,
    });
    recordList.value = [];
  } finally {
    isLoading.value = false;
  }
}

// 검색 버튼 클릭
function handleSearch() {
  fetchRecords();
}

// 상세 보기 이동
function goToDetail(consultNo) {
  toast.add({
    severity: 'info',
    summary: '상세 보기',
    detail: `${consultNo}번 기록 상세 페이지로 이동합니다.`,
    life: 3000,
  });
  router.push({ path: '/counseling-logform', query: { consultNo: consultNo } });
}

// 초기 로딩
onMounted(() => {
  fetchRecords();
});
</script>

<template>
  <div class="dashboard-layout">
    <div class="main-content">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 class="page-title">상담 기록 관리</h1>
          <p class="welcome-message">완료된 상담 일지를 조회하고 관리합니다.</p>
        </div>
      </div>

      <!-- Search Section (Custom styled to fit dashboard) -->
      <div class="search-container mb-6 p-4 bg-surface-0 border-round shadow-1 border-1 border-200">
        <div class="flex flex-col md:flex-row gap-3 items-end">
          <!-- 검색 기준 -->
          <div class="w-full md:w-auto flex flex-col gap-2">
            <label class="text-sm font-bold text-600">검색 기준</label>
            <Dropdown
              v-model="searchType"
              :options="[
                { label: '신청인(보호자)', value: 'guardian' },
                { label: '상담일시', value: 'date' },
                { label: '피보호자', value: 'ward' },
              ]"
              optionLabel="label"
              optionValue="value"
              class="w-full md:w-12rem"
            />
          </div>

          <!-- 검색어 입력 -->
          <div class="w-full md:flex-1 flex flex-col gap-2">
            <label class="text-sm font-bold text-600">
              {{ searchType === 'date' ? '날짜 선택' : '검색어 입력' }}
            </label>

            <InputText
              v-if="searchType !== 'date'"
              v-model="searchKeyword"
              placeholder="검색어를 입력하세요"
              class="w-full"
              @keyup.enter="handleSearch"
            />
            <InputText
              v-else
              type="date"
              v-model="searchDate"
              class="w-full"
              @keyup.enter="handleSearch"
            />
          </div>

          <!-- 검색 버튼 -->
          <Button
            label="검색"
            icon="pi pi-search"
            class="w-full md:w-auto p-button-outlined p-button-secondary"
            @click="handleSearch"
          />
        </div>
      </div>

      <!-- Table Container -->
      <div class="table-container">
        <Toast />

        <DataTable
          :value="recordList"
          :loading="isLoading"
          responsiveLayout="scroll"
          paginator
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          class="p-datatable-sm"
        >
          <template #empty>
            <div class="text-center p-4">등록된 상담 기록이 없습니다.</div>
          </template>
          <template #loading> 데이터 로딩 중... </template>

          <!-- 상담 일시 -->
          <Column
            field="consult_datetime"
            header="상담 일시"
            :sortable="true"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              {{ formatDateTime(data.consult_datetime) }}
            </template>
          </Column>

          <!-- 신청인(보호자) -->
          <Column field="guardian_name" header="신청인(보호자)" style="min-width: 10rem"></Column>

          <!-- 피보호자 -->
          <Column field="ward_name" header="피보호자" style="min-width: 8rem">
            <template #body="{ data }">
              <Tag :value="data.ward_name" severity="info" rounded></Tag>
            </template>
          </Column>

          <!-- 조사지 종류 -->
          <Column field="survey_type" header="조사지 종류" style="min-width: 10rem"></Column>

          <!-- 관리 -->
          <Column header="관리" style="min-width: 12rem; text-align: center">
            <template #body="{ data }">
              <div> <!-- flex justify-content-center gap-2 제거 -->
                <Button
                  label="보기"
                  icon="pi pi-eye"
                  class="p-button-text p-button-sm p-button-info"
                  @click="goToDetail(data.consult_no)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.dashboard-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Main Content */
.main-content {
  width: 95%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 0.5rem 0;
}

.welcome-message {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
}

/* Search Container */
.search-container {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

/* Table Container (Reference Style) */
.table-container {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

/* Deep Selector for PrimeVue DataTable styling corrections */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  text-align: center;
}

:deep(.p-datatable .p-datatable-thead > tr > th .p-column-header-content) {
  justify-content: center;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: center;
  vertical-align: middle;
  padding: 1rem;
}

/* Column specific alignments if needed override */
:deep(.p-column-title) {
  font-weight: bold;
}
</style>
