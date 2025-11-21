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
const isLoading = ref(true);
const currentDate = ref(new Date()); // 로컬 시간 기준
const modalVisible = ref(false);
const selectedDate = ref(''); // YYYY-MM-DD 로컬 포맷
const scheduledData = reactive({});

// --- 2. 헬퍼 함수 ---
// 로컬 시간 기준으로 YYYY-MM-DD 문자열 생성 (UTC 변환 사용하지 않음)
function formatDateISO_Local(date) {
  if (!(date instanceof Date)) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 기존의 월/연도 포맷(표시용)
function formatMonthYear(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월`;
}

// --- 3. API 로직 ---
async function loadStaffSchedules() {
  isLoading.value = true;
  try {
    const response = await api.get('/api/staff/schedules');
    // scheduledData를 덮어쓰기 대신 안전하게 갱신
    Object.keys(scheduledData).forEach((k) => delete scheduledData[k]);
    // API에서 오는 데이터가 이미 'YYYY-MM-DD' 키 구조라면 그대로 사용
    // 만약 API가 타임스탬프 리스트를 준다면 여기서 키를 formatDateISO_Local로 변환해 맞춰줘야 함
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
// calendarCells에서 사용하는 날짜 키는 모두 formatDateISO_Local로 통일
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
    cells.push({
      key: `prev-${day}`,
      day,
      classes: 'calendar-day disabled-day',
      clickable: false,
    });
  }

  const todayStr = formatDateISO_Local(new Date());
  for (let day = 1; day <= daysInMonth; day++) {
    // 로컬 날짜 객체 (로컬 자정)
    const dateObj = new Date(year, month, day);
    const dateISO = formatDateISO_Local(dateObj); // 로컬 기준 포맷
    const isToday = dateISO === todayStr;

    const cellClasses = ['calendar-day', 'bg-white', 'text-gray-900', 'cursor-pointer'];

    // scheduledData 키가 이미 'YYYY-MM-DD' 로컬 포맷이라 가정
    const rawSchedules = scheduledData[dateISO];
    const cellSchedules = rawSchedules
      ? rawSchedules
          .filter((s) => s.type === 'reservation')
          .map((s) => ({
            label: s.label,
            classes: 'schedule-tag tag-reservation',
          }))
      : undefined;

    if (rawSchedules?.some((s) => s.type === 'available')) {
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
  // 안전하게 월만 변경 (일자가 엉키지 않도록 1일로 정규화)
  const y = currentDate.value.getFullYear();
  const m = currentDate.value.getMonth() - 1;
  currentDate.value = new Date(y, m, 1);
  loadStaffSchedules();
}
function nextMonth() {
  const y = currentDate.value.getFullYear();
  const m = currentDate.value.getMonth() + 1;
  currentDate.value = new Date(y, m, 1);
  loadStaffSchedules();
}

function openModal(date) {
  // date는 Date 객체 (calendarCells에서 전달)
  selectedDate.value = formatDateISO_Local(date); // 로컬 기준 YYYY-MM-DD
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
