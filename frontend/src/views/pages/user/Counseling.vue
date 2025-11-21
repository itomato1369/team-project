<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import api, { userApi } from '@/api/api.js';
import { useAuthStore } from '@/stores/authStore';

// 컴포넌트 임포트
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import TimeSlotList from '@/components/TimeSlotList.vue';

const router = useRouter();
const toast = useToast();

// --- State ---
const wardList = ref([]);
const selectedWard = ref(null);

// 팝업에 표시할 피보호자명
const wardName = ref('');

// 날짜 설정
const today = new Date();
today.setHours(0, 0, 0, 0);
const minDate = ref(today);
const minDateValue = new Date(today.getTime());

const selectedDate = ref(null);
const selectedTimeSlot = ref(null);

// 팝업
const showConfirmationDialog = ref(false);

// 로딩 상태
const isLoading = ref(false);
const isLoadingSchedules = ref(true);

// 예약 가능 일정 데이터
const availableScheduleData = ref({});
let availableDateSet = new Set();

// 선택된 날짜의 시간 목록
const availableTimes = ref([]);

// 사용자 정보
const authStore = useAuthStore();
const userId = computed(() => authStore.user?.user_id);
const userName = computed(() => authStore.user?.name);

// --- Helper Functions ---

// 날짜를 yyyy-mm-dd 문자열로 변환
function formatDateToISO(date) {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 캘린더에서 넘어오는 날짜 객체 가공
function formatCalendarDateToISO(dateObj) {
  const year = dateObj.year;
  const month = (dateObj.month + 1).toString().padStart(2, '0');
  const day = dateObj.day.toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 한국식 날짜 포맷
function formatToKoreanDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// --- Event Handlers ---

// 예약 불가능한 날짜 비활성화
function isDateDisabled(date) {
  const checkDate = new Date(date.year, date.month, date.day);
  if (checkDate < minDateValue) return true;

  const key = formatCalendarDateToISO(date);
  return !availableDateSet.has(key);
}

// 날짜 선택 시
function onDateSelect(date) {
  const dateKey = formatDateToISO(date);
  const times = availableScheduleData.value[dateKey];

  console.log('선택된 날짜:', dateKey);
  console.log('times:', times);

  selectedDate.value = date;
  selectedTimeSlot.value = null;

  availableTimes.value = times || [];
}

// 시간 선택
function selectTime(slotObject) {
  selectedTimeSlot.value = slotObject;
}

// 상담 신청
async function submitApplication() {
  if (!selectedWard.value) {
    toast.add({
      severity: 'warn',
      summary: '신청 불가',
      detail: '먼저 상담받을 피보호자를 선택해주세요.',
      life: 3000,
    });
    return;
  }

  if (!selectedDate.value || !selectedTimeSlot.value) {
    toast.add({
      severity: 'warn',
      summary: '신청 불가',
      detail: '날짜와 시간을 모두 선택해주세요.',
      life: 3000,
    });
    return;
  }

  // --- 선택된 ward 번호 → wardName 설정 ---
  const ward = wardList.value.find((w) => w.ward_no === selectedWard.value);
  if (ward) {
    wardName.value = ward.name;
  }

  isLoading.value = true;
  try {
    const payload = {
      at_no: selectedTimeSlot.value.at_no,
      start_time_stamp: selectedTimeSlot.value.start_time_stamp,
      ward_no: selectedWard.value,
    };

    await api.post('/api/user/schedule/reserve', payload);
    showConfirmationDialog.value = true;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '예약 실패',
      detail: error.response?.data?.message || '상담 신청 중 오류 발생',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

// 팝업 닫기
function closeConfirmationDialog() {
  showConfirmationDialog.value = false;
  selectedDate.value = null;
  selectedTimeSlot.value = null;
  availableTimes.value = [];
  refreshSchedules();
}

// 상담 내역 이동
function goToHistory() {
  closeConfirmationDialog();
  router.push('/counseling-history');
}

// --- Computed ---

// 오전/오후 시간 분리
const morningTimes = computed(() =>
  availableTimes.value.filter((t) => parseInt(t.time.split(':')[0]) < 12)
);

const afternoonTimes = computed(() =>
  availableTimes.value.filter((t) => parseInt(t.time.split(':')[0]) >= 12)
);

// 팝업에 표시될 날짜·시간
const confirmationDateTime = computed(() => {
  if (!selectedDate.value || !selectedTimeSlot.value) return '';
  return `${formatToKoreanDate(selectedDate.value)} ${selectedTimeSlot.value.time}시`;
});

// --- Lifecycle ---

// 예약 가능한 날짜/시간 새로고침
async function refreshSchedules() {
  isLoadingSchedules.value = true;
  selectedDate.value = null;
  selectedTimeSlot.value = null;
  availableTimes.value = [];

  try {
    const response = await api.get('/api/user/schedule/available');
    availableScheduleData.value = response.data;

    availableDateSet = new Set(Object.keys(response.data));

    console.log('예약 가능 날짜:', availableDateSet);
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '예약 가능한 시간을 불러올 수 없습니다.',
    });
    availableScheduleData.value = {};
    availableDateSet = new Set();
  } finally {
    isLoadingSchedules.value = false;
  }
}

// 초기 데이터 로딩
onMounted(async () => {
  await refreshSchedules();

  try {
    const response = await userApi.getMyWards();
    wardList.value = response.data.result;

    // 피보호자가 하나일 때 자동 선택
    if (wardList.value.length === 1) {
      selectedWard.value = wardList.value[0].ward_no;
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '피보호자 목록을 불러오는 데 실패했습니다.',
    });
  }
});
</script>

<template>
  <div class="dashboard-layout">
    <div class="main-content">
      <h1 class="page-title">상담 신청</h1>

      <p class="welcome-message">
        '예약 가능'한 날짜 중 하루를 선택하세요. (오늘: {{ formatToKoreanDate(new Date()) }})
      </p>

      <!-- 0. 피보호자 선택 -->
      <div
        class="table-container flex justify-center items-center w-full"
        v-if="wardList.length > 0"
      >
        <Card class="w-full">
          <template #content>
            <div class="mb-4 text-center max-w-xl mx-auto">
              <label for="ward-select" class="block text-xl font-medium mb-2">
                상담받을 피보호자 선택
              </label>

              <Dropdown
                id="ward-select"
                v-model="selectedWard"
                :options="wardList"
                optionLabel="name"
                optionValue="ward_no"
                placeholder="피보호자를 선택하세요"
                class="w-full"
              />
            </div>
          </template>
        </Card>
      </div>

      <!-- 1. 날짜 선택 -->
      <div class="table-container">
        <Card>
          <template #content>
            <div class="flex justify-content-center">
              <!-- 로딩 스피너 -->
              <ProgressSpinner
                v-if="isLoadingSchedules"
                style="width: 50px; height: 50px"
                strokeWidth="8"
              />

              <!-- 캘린더 -->
              <Calendar
                v-else
                v-model="selectedDate"
                inline
                :minDate="minDate"
                dateFormat="yy-mm-dd"
                @date-select="onDateSelect"
                class="w-full"
              />
            </div>

            <!-- 예약 가능한 날짜 없음 -->
            <template v-if="!isLoadingSchedules && availableDateSet.size === 0">
              <div class="mt-4 text-center text-gray-500">
                현재 예약 가능한 상담 일정이 없습니다.
              </div>
            </template>
          </template>
        </Card>
      </div>

      <!-- 2. 시간 선택 -->
      <div class="table-container" v-if="selectedDate && availableTimes.length > 0">
        <Card>
          <template #content>
            <div class="mt-0">
              <Divider />
              <h6 class="text-center mb-4">{{ formatToKoreanDate(selectedDate) }}</h6>

              <!-- 오전 -->
              <TimeSlotList
                title="오전"
                :time-slots="morningTimes"
                :selected-slot="selectedTimeSlot"
                @select-time="selectTime"
              />

              <!-- 오후 -->
              <TimeSlotList
                title="오후"
                :time-slots="afternoonTimes"
                :selected-slot="selectedTimeSlot"
                @select-time="selectTime"
              />

              <!-- 신청 버튼 -->
              <div class="text-center mt-5">
                <Button
                  label="상담 신청"
                  icon="pi pi-check"
                  :loading="isLoading"
                  :disabled="!selectedTimeSlot"
                  @click="submitApplication"
                  class="p-button-lg w-full md:w-auto"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- 선택된 날짜에 예약 가능한 시간이 없을 때 -->
      <div
        class="table-container"
        v-if="selectedDate && availableTimes.length === 0 && !isLoadingSchedules"
      >
        <Card>
          <template #content>
            <div class="text-center text-gray-500 py-4">
              선택하신 날짜에는 예약 가능한 시간이 없습니다. 다른 날짜를 선택해주세요.
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>

  <!-- 상담 신청 완료 팝업 -->
  <ConfirmationDialog
    :visible="showConfirmationDialog"
    :wardName="wardName"
    :confirmationDateTime="confirmationDateTime"
    @close="closeConfirmationDialog"
    @goToHistory="goToHistory"
  />
</template>

<style>
.dashboard-layout {
  min-height: 100vh;
}

.main-content {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  overflow-y: auto;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #212529;
}

.welcome-message {
  font-size: 1.125rem;
  color: #495057;
  margin-bottom: 32px;
}

.table-container {
  margin-top: 2rem;
}

.table-container:first-of-type {
  margin-top: 0;
}

.table-container .p-card .p-card-body {
  padding: 2rem;
}

.table-container .p-card .p-card-content {
  padding: 0;
}

/* 캘린더 스타일 조정 */
:deep(.p-datepicker-today > .p-datepicker-button) {
  border: 1px solid var(--primary-color);
}

:deep(.p-datepicker table td > .p-datepicker-button) {
  width: 3rem;
  height: 3rem;
}

:deep(.p-datepicker .p-datepicker-header .p-datepicker-title) {
  font-size: 1.25rem;
}

/* 다이얼로그 스타일 */
:deep(.p-dialog .p-dialog-header .p-dialog-title) {
  font-weight: 600;
  font-size: 1.25rem;
  color: #212529;
}
</style>
