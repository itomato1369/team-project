<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import { staffReservationApi } from '@/api/api.js';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/authStore'; // authStore 임포트
import axios from 'axios';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore(); // authStore 인스턴스 생성

// --- 상태 변수 ---
const reservations = ref([]);
const isLoading = ref(true);

// 오늘의 상담일정 개수
const getTodayConsult = async () => {
  try {
    const response = await axios.get('/api/staff/todays-count');
    const data = await response.data;
    reservations.value = data.total_count;
  } catch (error) {
    console.error('오늘 상담 개수 오류', error);
  }
};

// 신규 예약 신청 개수
// 미작성 상담일지 개수

// [수정] staffName을 authStore에서 가져오는 computed 속성으로 변경
const staffName = computed(() => authStore.user?.name || '담당자');

// --- API 호출 ---
onMounted(() => {
  fetchDashboardData();
  stats;
});

function fetchDashboardData() {
  isLoading.value = true;
  try {
    const response = staffReservationApi.getReservations();
    reservations.value = response.data;
    console.log('Fetched Reservations Data:', JSON.stringify(reservations.value, null, 2));
  } catch (error) {
    console.error('대시보드 데이터 로딩 실패:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '대시보드 데이터를 불러오는 중 오류가 발생했습니다.',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

// --- 계산된 속성 (Computed Properties) for Stat Cards ---
// [수정] trim()을 추가하여 문자열의 양 끝 공백을 제거하고 비교
const stats = computed(() => {
  if (!reservations.value || reservations.value.length === 0) {
    return { today: 0, new: 0, pending: 0 };
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const todayScheduleCount = reservations.value.filter((r) => {
    if (!r.start_time || !r.status) return false;
    const resDate = new Date(r.start_time);
    return r.status.trim() === '예약확정' && resDate >= todayStart && resDate < todayEnd;
  }).length;

  const newReservationsCount = reservations.value.filter(
    (r) => r.status && r.status.trim() === '예약확정'
  ).length;

  const pendingReportsCount = reservations.value.filter(
    (r) => r.status && r.status.trim() === '상담완료'
  ).length;

  return {
    today: todayScheduleCount,
    new: newReservationsCount,
    pending: pendingReportsCount,
  };
});

const summaryMessage = computed(() => {
  if (isLoading.value) {
    return '데이터를 불러오는 중입니다...';
  }
  const count = stats.value.today;
  return count > 0
    ? `오늘 처리해야 할 ${count}건의 상담 일정이 있습니다.`
    : '오늘 예정된 상담 일정이 없습니다.';
});

// --- 헬퍼 함수 ---
const getStatusSeverity = (status) => {
  // [수정] trim() 추가
  const trimmedStatus = status ? status.trim() : '';
  switch (trimmedStatus) {
    case '상담완료':
      return 'success';
    case '예약확정':
      return 'info';
    case '취소':
      return 'danger';
    default:
      return 'secondary';
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const navigateTo = (routeName) => {
  if (routeName === 'today-schedule') {
    router.push({ name: 'reservations' });
  }
  if (routeName === 'new-reservations') {
    router.push({ name: 'reservations' });
  }
  if (routeName === 'pending-reports') {
    router.push({ name: 'counselinglist' });
  }
};
</script>

<template>
  <div class="dashboard-layout">
    <div class="main-content">
      <h1 class="page-title">대시보드</h1>
      <p class="welcome-message">{{ staffName }} 담당자님, 환영합니다.</p>
      <p class="summary-message">
        <strong>{{ summaryMessage }}</strong>
      </p>

      <div class="stat-cards-container">
        <Card class="stat-card" @click="navigateTo('today-schedule')">
          <template #title>오늘의 상담 일정</template>
          <template #content>
            <div class="stat-value">
              <span class="count-blue">{{ getTodayConsult }}</span
              >건
            </div>
          </template>
        </Card>

        <Card class="stat-card" @click="navigateTo('new-reservations')">
          <template #title>신규 예약 신청</template>
          <template #content>
            <div class="stat-value">
              <span class="count-green">{{ stats.new }}</span
              >건
            </div>
          </template>
        </Card>

        <Card class="stat-card" @click="navigateTo('pending-reports')">
          <template #title>미작성 상담일지</template>
          <template #content>
            <div class="stat-value">
              <span class="count-red">{{ stats.pending }}</span
              >건
            </div>
          </template>
        </Card>
      </div>

      <div class="table-container">
        <DataTable :value="reservations" :loading="isLoading" responsiveLayout="scroll">
          <template #header>
            <div class="text-xl font-bold">최근 예약 목록</div>
          </template>
          <template #empty> 예약 내역이 없습니다. </template>
          <Column field="start_time" header="시간" style="width: 15%">
            <template #body="slotProps">
              {{ formatDateTime(slotProps.data.start_time) }}
            </template>
          </Column>
          <Column field="applicantName" header="신청인(보호자)" style="width: 25%"></Column>
          <Column field="wardName" header="피보호자" style="width: 25%"></Column>
          <Column field="res_reason" header="상담사유" style="width: 20%"></Column>
          <Column field="status" header="상태" style="width: 15%">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.status"
                :severity="getStatusSeverity(slotProps.data.status)"
              ></Tag>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style>
/* 기존 스타일 유지 */
body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  background-color: #f8f9fa;
  margin: 0;
}
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}
.main-content {
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;
}
.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 12px;
  color: #212529;
}
.welcome-message {
  font-size: 1.125rem;
  color: #495057;
  margin-bottom: 8px;
}
.summary-message {
  font-size: 1.125rem;
  color: #495057;
  margin-bottom: 32px;
}
.stat-cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}
.stat-card {
  border: 1px solid #dee2e6;
  box-shadow: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.stat-card .p-card-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #6c757d;
}
.stat-card .p-card-content {
  padding: 0;
}
.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: right;
  color: #343a40;
}
.stat-value .count-blue {
  color: #3b82f6;
  margin-right: 8px;
}
.stat-value .count-green {
  color: #22c55e;
  margin-right: 8px;
}
.stat-value .count-red {
  color: #ef4444;
  margin-right: 8px;
}
.table-container .p-datatable .p-datatable-thead > tr > th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
.table-container .p-datatable .p-datatable-tbody > tr > td {
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 1rem;
}
.p-tag {
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
