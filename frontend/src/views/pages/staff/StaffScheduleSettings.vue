<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import api from '@/api/api.js'; // API 임포트

// [추가 보완] 템플릿에서 사용하는 컴포넌트 임포트
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';

// --- 1. 상태 관리 (State) ---
const toast = useToast();
// ... (기존 상태: isLoading, currentDate 등) ...
const isLoading = ref(true);
const currentDate = ref(new Date());
const modalVisible = ref(false);
const selectedDate = ref('');
const startTime = ref('09:00');
const endTime = ref('17:00');
const recurrenceOptions = ref([
  { label: '반복 없음', value: 'none' },
  { label: '매주 이 요일', value: 'weekly' },
  { label: '매일 (월-금)', value: 'weekdays' },
]);
const selectedRecurrence = ref(recurrenceOptions.value[0].value);
const scheduledData = reactive({});

// --- 2. 헬퍼 함수 ---
// ... (formatDateISO, formatMonthYear 함수는 변경 없음) ...
function formatDateISO(date) {
  return date.toISOString().split('T')[0];
}
function formatMonthYear(date) {
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월`;
}

// --- 3. API 로직 ---
// ... (loadCommonCode, loadStaffSchedules, onMounted 등은 변경 없음) ...
async function loadStaffSchedules() {
  isLoading.value = true;
  try {
    // (시뮬레이션) API 응답 대기
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // (시뮬레이션) 목업 데이터 로드 (오늘 날짜 기준)
    const todayKey = formatDateISO(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = formatDateISO(tomorrow);

    scheduledData[todayKey] = [{ type: 'reservation', label: '1건 예약' }];
    scheduledData[tomorrowKey] = [
      { type: 'available', label: '09:00 - 11:00 상담가능' },
      { type: 'reservation', label: '2건 예약' },
    ];
  } catch (error) {
    console.error('스케줄 로딩 실패:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '스케줄을 불러오는 데 실패했습니다.',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadStaffSchedules();
  // loadCommonCode('XX');
});

// --- 4. 캘린더 로직 ---

const calendarCells = computed(() => {
  const cells = [];
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // [수정 2] '일월화...' 형식 (일요일 = 0)
  // startDayOfWeek = (startDayOfWeek === 0) ? 6 : startDayOfWeek - 1; // (월요일 시작) -> 이 줄을 삭제
  let startDayOfWeek = firstDay.getDay(); // 0(일) - 6(토)

  const lastDayPrevMonth = new Date(year, month, 0).getDate();
  // (일요일=0이므로 0~6회 반복)
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
}
function nextMonth() {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1));
}

// --- 5. 모달 로직 ---
// ... (existingSchedulesForSelectedDate computed 속성은 변경 없음) ...
const existingSchedulesForSelectedDate = computed(() => {
  if (!selectedDate.value || !scheduledData[selectedDate.value]) {
    return [];
  }
  return scheduledData[selectedDate.value].filter((s) => s.type === 'available');
});

function openModal(date) {
  selectedDate.value = formatDateISO(date);
  modalVisible.value = true;
}
function closeModal() {
  modalVisible.value = false;
}

// ... (deleteSchedule, applySchedule 함수는 변경 없음) ...
function deleteSchedule(scheduleLabel) {
  // (API 호출) await api.delete('/api/staff/schedule', { data: { label: scheduleLabel, date: selectedDate.value } });

  // (로컬 데이터 업데이트)
  const schedules = scheduledData[selectedDate.value];
  if (schedules) {
    const index = schedules.findIndex((s) => s.label === scheduleLabel);
    if (index > -1) {
      schedules.splice(index, 1);
      toast.add({
        severity: 'info',
        summary: '삭제됨',
        detail: '스케줄이 삭제되었습니다.',
        life: 2000,
      });
    }
  }
}

async function applySchedule() {
  if (!selectedDate.value) return;

  const payload = {
    start_time: `${selectedDate.value}T${startTime.value}:00`,
    end_time: `${selectedDate.value}T${endTime.value}:00`,
    staff_name: '담당자이름', // (임시)
    recurring_rules: selectedRecurrence.value,
    status: '상담가능',
  };

  console.log('적용할 스케줄 (API Payload):', payload);

  try {
    // (가정) await api.post('/api/staff/schedule/create', payload);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!scheduledData[selectedDate.value]) {
      scheduledData[selectedDate.value] = [];
    }
    scheduledData[selectedDate.value].push({
      type: 'available',
      label: `${startTime.value} - ${endTime.value} 상담가능`,
    });

    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '상담 가능 시간이 설정되었습니다.',
      life: 3000,
    });
  } catch (error) {
    console.error('스케줄 설정 실패:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: error.response?.data?.message || '스케줄 설정 중 오류가 발생했습니다.',
      life: 3000,
    });
  } finally {
    // closeModal();
  }
}
</script>

<template>
  <div class="p-4 md:p-8 bg-gray-100 min-h-screen">
    <Toast />

    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-900">상담 스케줄 설정</h2>
      <p class="mt-2 text-lg text-gray-600">날짜를 클릭하여 상담 가능 시간을 설정하세요.</p>

      <div class="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- 캘린더 헤더 -->
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

        <!-- [수정 2] 요일 헤더: '일월화수목금토' -->
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <div
            v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
            :key="day"
            class="py-3 px-2 text-center text-sm font-semibold text-gray-600 bg-gray-50"
          >
            {{ day }}
          </div>
        </div>

        <!-- 로딩 스피너 -->
        <div v-if="isLoading" class="flex justify-center items-center" style="min-height: 500px">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" />
        </div>

        <!-- 날짜 그리드 -->
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

    <!-- 
      [수정 1] 모달 수정 
      - v-if="modalVisible"을 최상위 래퍼(Wrapper)로 이동
      - 래퍼: z-index 40, flex, center
      - 오버레이: absolute, z-40, bg-gray-900, bg-opacity-60
      - 컨텐츠: relative, z-50
    -->
    <div
      v-if="modalVisible"
      class="fixed inset-0 z-40 flex items-center justify-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- 1. 모달 오버레이 (클릭 시 닫기) -->
      <div @click="closeModal" class="absolute inset-0 bg-opacity-60 z-40"></div>

      <!-- 2. 모달 컨텐츠 (z-50) -->
      <div class="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center p-5 border-b">
          <h4 id="modal-title" class="text-xl font-bold text-gray-800">스케줄 설정</h4>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- 모달 폼 -->
        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">선택한 날짜</label>
            <input
              type="text"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-lg font-semibold text-gray-900"
              :value="selectedDate"
            />
          </div>

          <!-- 등록된 스케줄 목록 -->
          <div v-if="existingSchedulesForSelectedDate.length > 0">
            <label class="block text-sm font-medium text-gray-700">등록된 스케줄</label>
            <div
              class="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md max-h-32 overflow-y-auto space-y-2"
            >
              <div
                v-for="(sched, idx) in existingSchedulesForSelectedDate"
                :key="idx"
                class="flex justify-between items-center text-sm p-2 bg-white rounded shadow-sm"
              >
                <span class="text-gray-800 font-medium">{{ sched.label }}</span>
                <button
                  @click="deleteSchedule(sched.label)"
                  class="text-red-500 hover:text-red-700 font-medium text-xs"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>

          <!-- 신규 스케줄 등록 -->
          <div>
            <label
              class="block text-sm font-bold text-gray-800"
              :class="{ 'border-t pt-4 mt-4': existingSchedulesForSelectedDate.length > 0 }"
            >
              신규 스케줄 등록
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">시작 시간</label>
            <input
              type="time"
              v-model="startTime"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">종료 시간</label>
            <input
              type="time"
              v-model="endTime"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">반복 설정</label>
            <select
              v-model="selectedRecurrence"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option v-for="option in recurrenceOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- 모달 푸터 -->
        <div class="flex justify-end items-center p-5 bg-gray-50 border-t">
          <button
            @click="closeModal"
            class="px-6 py-2 mr-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            닫기
          </button>
          <button
            @click="applySchedule"
            class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* (스타일은 이전과 동일, 변경 없음) */
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
