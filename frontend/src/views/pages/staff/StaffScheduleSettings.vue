<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import api from '@/api/api.js'; // API 임포트

// [추가 보완] 템플릿에서 사용하는 컴포넌트 임포트
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import StaffScheduleModal from '@/components/staff/StaffScheduleModal.vue';

// --- 1. 상태 관리 (State) ---
const toast = useToast();
// ... (기존 상태: isLoading, currentDate 등) ...
const isLoading = ref(true);
const currentDate = ref(new Date());
const modalVisible = ref(false);
const selectedDate = ref('');
const scheduledData = reactive({});

// --- 2. 헬퍼 함수 ---
function formatDateISO(date) {
  return date.toISOString().split('T')[0];
}
function formatMonthYear(date) {
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월`;
}

// --- 3. API 로직 ---
async function loadStaffSchedules() {
  isLoading.value = true;
  try {
    const response = await api.get('/api/staff/schedules');
    Object.keys(scheduledData).forEach((key) => {
      delete scheduledData[key];
    });
    Object.assign(scheduledData, response.data);
  } catch (error) {
    console.error('스케줄 로딩 실패:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: error.response?.data?.message || '스케줄을 불러오는 데 실패했습니다.',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadStaffSchedules();
});

// --- 4. 캘린더 로직 ---
const calendarCells = computed(() => {
  const cells = [];
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  let startDayOfWeek = firstDay.getDay(); // 0(일) - 6(토)

  const lastDayPrevMonth = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek; i > 0; i--) {
    const day = lastDayPrevMonth - i + 1;
    cells.push({ key: `prev-${day}`, day, classes: 'calendar-day disabled-day', clickable: false });
  }

  const todayStr = formatDateISO(new Date());
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dateISO = formatDateISO(dateObj);
    const isToday = dateISO === todayStr;

    const cellClasses = ['calendar-day', 'bg-white', 'text-gray-900', 'cursor-pointer'];

    const cellSchedules = scheduledData[dateISO]
      ?.filter((s) => s.type === 'reservation')
      .map((s) => ({
        label: s.label,
        classes: 'schedule-tag tag-reservation',
      }));

    if (scheduledData[dateISO]?.some((s) => s.type === 'available')) {
      cellClasses.push('bg-green-50');
    }

    cells.push({
      key: dateISO,
      day,
      date: dateObj,
      classes: cellClasses.join(' '),
      schedules: cellSchedules,
      isToday: isToday,
      clickable: true,
    });
  }

  const totalCells = startDayOfWeek + daysInMonth;
  const nextDays = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= nextDays; i++) {
    cells.push({
      key: `next-${i}`,
      day: i,
      classes: 'calendar-day disabled-day',
      clickable: false,
    });
  }

  return cells;
});

function prevMonth() {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1));
  loadStaffSchedules();
}
function nextMonth() {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1));
  loadStaffSchedules();
}

function openModal(date) {
  selectedDate.value = formatDateISO(date);
  modalVisible.value = true;
}
</script>

<template>
  <div class="p-4 md:p-8 bg-gray-100 min-h-screen">
    <Toast />

    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-900">상담 스케줄 설정</h2>
      <p class="mt-2 text-lg text-gray-600">날짜를 클릭하여 상담 가능 시간을 설정하세요.</p>

      <div class="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <button @click="prevMonth" class="p-2 rounded-full hover:bg-gray-100">
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <h3 class="text-2xl font-semibold text-gray-800">{{ formatMonthYear(currentDate) }}</h3>
          <button @click="nextMonth" class="p-2 rounded-full hover:bg-gray-100">
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <div
            v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
            :key="day"
            class="py-3 px-2 text-center text-sm font-semibold text-gray-600 bg-gray-50"
          >
            {{ day }}
          </div>
        </div>

        <div v-if="isLoading" class="flex justify-center items-center" style="min-height: 500px">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" />
        </div>

        <div v-else class="grid grid-cols-7 gap-px bg-gray-200">
          <div
            v-for="cell in calendarCells"
            :key="cell.key"
            :class="cell.classes"
            @click="cell.clickable ? openModal(cell.date) : null"
          >
            <span class="day-number" :class="{ 'today-number': cell.isToday }">{{ cell.day }}</span>

            <div v-if="cell.schedules" class="schedule-tags">
              <div v-for="(sched, idx) in cell.schedules" :key="idx" :class="sched.classes">
                {{ sched.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <StaffScheduleModal
      :visible="modalVisible"
      :selectedDate="selectedDate"
      :scheduledData="scheduledData"
      @update:visible="modalVisible = $event"
      @schedule-updated="loadStaffSchedules"
      @schedule-deleted="loadStaffSchedules"
    />
  </div>
</template>

<style scoped>
/* (스타일은 변경 사항 없음) */
.calendar-day {
  min-height: 120px;
  padding: 8px;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
}
.calendar-day:hover {
  background-color: #f9fafb;
}

.day-number.today-number {
  background-color: #2563eb;
  color: white;
  border-radius: 9999px;
  padding: 2px 6px;
  font-weight: 700;
  display: inline-block;
  text-align: center;
  min-width: 28px;
}

.disabled-day {
  color: #d1d5db;
  background-color: #fdfdfd;
  cursor: not-allowed;
}

.schedule-tags {
  margin-top: 4px;
  max-height: calc(120px - 36px);
  overflow-y: auto;
  flex: 1;
}
.schedule-tag {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 500;
  margin-top: 4px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tag-reservation {
  background-color: #dbeafe;
  color: #1e40af;
}
.bg-green-50 {
  background-color: #f0fdf4;
}

@media (max-width: 768px) {
  .calendar-day {
    min-height: 80px;
    padding: 4px;
  }
  .schedule-tags {
    max-height: calc(80px - 28px);
  }
  .schedule-tag {
    font-size: 10px;
    padding: 1px 4px;
  }
  .day-number {
    font-size: 0.875rem;
  }
  .day-number.today-number {
    padding: 1px 5px;
    min-width: 24px;
  }
}
</style>
