<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import api, { userApi } from '@/api/api.js';

import ConfirmationDialog from '@/components/ConfirmationDialog.vue';

const router = useRouter();
const toast = useToast();

// --- 1. 상태 관리 (State Management) ---

const wardList = ref([]); // 피보호자 목록
const selectedWard = ref(null); // 선택된 피보호자 (ward_no)

const today = new Date();
today.setHours(0, 0, 0, 0);

// [v11 수정] 1. <Calendar> prop에 전달할 반응형 ref
const minDate = ref(today);
// [v11 수정] 2. isDateDisabled 함수가 사용할 비-반응형 상수 (오류 해결용)
const minDateValue = new Date(today.getTime());

// 선택된 날짜 및 시간
const selectedDate = ref(null);
const selectedTimeSlot = ref(null); // [v12 수정] { time: '10:30', at_no: 9, start_time_stamp: '...' }

// 상담 신청 완료 알림 팝업 표시 여부
const showConfirmationDialog = ref(false);

// 로딩 상태
const isLoading = ref(false); // '상담 신청' 버튼의 로딩 상태
const isLoadingSchedules = ref(true); // 캘린더 스케줄 로딩 상태

// [연동] 백엔드 데이터를 저장할 변수
const availableScheduleData = ref({});

// [해결] 비-반응형(Non-reactive) Set 선언
let availableDateSet = new Set();

// 선택된 날짜에 해당하는 예약 가능 시간 목록
const availableTimes = ref([]);

// [참고] 실제로는 로그인 스토어(authStore)에서 가져와야 합니다.
const userName = ref('홍길동');

// --- 2. 헬퍼 함수 (Helper Functions) ---

// Date 객체를 'YYYY-MM-DD' 문자열로 변환 (KST 기준)
function formatDateToISO(date) {
  if (!date) return null;
  const offset = date.getTimezoneOffset() * 60000;
  const dateInKST = new Date(date.getTime() - offset);
  return dateInKST.toISOString().split('T')[0];
}

// 캘린더의 date 객체({day, month, year})를 'YYYY-MM-DD' 문자열로 변환
function formatCalendarDateToISO(dateObj) {
  const year = dateObj.year;
  const month = (dateObj.month + 1).toString().padStart(2, '0'); // month는 0-indexed
  const day = dateObj.day.toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Date 객체를 'YYYY년 MM월 DD일' 문자열로 변환
function formatToKoreanDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// --- 3. 이벤트 핸들러 (Event Handlers) ---

/**
 * [v11 수정] 'disabledDates' prop에 전달될 함수.
 */
function isDateDisabled(date) {
  const checkDate = new Date(date.year, date.month, date.day);

  // [v11 수정] minDate.value (ref) 대신 비-반응형 minDateValue (상수) 사용
  if (checkDate < minDateValue) {
    return true;
  }

  // 2. 예약 가능 목록(비-반응형 Set)에 없는 날짜인지 확인
  const dateKey = formatCalendarDateToISO(date);
  // availableDateSet에 dateKey가 *없으면* 비활성화 (true 반환)
  return !availableDateSet.has(dateKey);
}

/**
 * 캘린더에서 (활성화된) 날짜를 선택했을 때 호출
 */
function onDateSelect(date) {
  const dateKey = formatDateToISO(date);
  const times = availableScheduleData.value[dateKey];

  // [로그 복원]
  console.log('--- onDateSelect ---');
  console.log('선택된 날짜 (Date Object):', date);
  console.log('변환된 Key (YYYY-MM-DD):', dateKey);
  console.log('찾아낸 시간 목록 (Times):', times);

  selectedDate.value = date;
  selectedTimeSlot.value = null; // 날짜가 바뀌면 선택된 시간 초기화

  if (times) {
    // times가 undefined가 아닌지 확인 (빈 배열 []도 포함)
    availableTimes.value = times;
  } else {
    // [수정] isDateDisabled가 정확하다면 이 코드는 실행되지 않아야 합니다.
    // (만약 :disabledDates가 주석처리되면 이 코드가 실행될 수 있습니다)
    availableTimes.value = [];
    console.warn('선택된 날짜에 대한 시간 정보가 없습니다 (isDateDisabled 확인 필요).');
  }
}

/**
 * [v12 수정] 시간 슬롯 버튼 클릭
 * @param {object} slotObject - 예: { time: '10:30', at_no: 9, start_time_stamp: '...' }
 */
function selectTime(slotObject) {
  selectedTimeSlot.value = slotObject;
}

/**
 * [v12 수정] '상담 신청' 버튼 클릭 시
 */
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

  isLoading.value = true;

  try {
    // [v12 수정] at_no와 start_time_stamp를 전송
    // [v15] 참고: consult_category, name, res_reason 등은 현재 UI에서
    // 받지 않으므로, 백엔드(scheduleService.js)에서 임시 처리합니다.
    const payload = {
      at_no: selectedTimeSlot.value.at_no,
      start_time_stamp: selectedTimeSlot.value.start_time_stamp,
      ward_no: selectedWard.value, // [추가] 선택된 피보호자 ID
    };

    // [로그 복원]
    console.log('--- submitApplication ---');
    console.log('API 요청 Payload:', payload);

    // API 경로를 사용자가 수정한 '/api/user/schedule/reserve'로 사용
    await api.post('/api/user/schedule/reserve', payload);

    showConfirmationDialog.value = true;
  } catch (error) {
    console.error('예약 실패:', error);
    toast.add({
      severity: 'error',
      summary: '예약 실패',
      detail: error.response?.data?.message || '상담 신청 중 오류가 발생했습니다.',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

/**
 * 알림 팝업의 '닫기' 버튼 클릭 시
 */
function closeConfirmationDialog() {
  showConfirmationDialog.value = false;
  // 상태 초기화
  selectedDate.value = null;
  selectedTimeSlot.value = null;
  availableTimes.value = [];

  // [연동] 예약이 완료되었으므로 스케줄을 새로고침합니다.
  refreshSchedules();
}

/**
 * 알림 팝업의 '목록 보기' 버튼 클릭 시
 */
function goToHistory() {
  closeConfirmationDialog();
  router.push('/counseling-history'); // 상담 내역 페이지로 이동
}

// --- 4. 계산된 속성 (Computed Properties) ---

// [v12 수정] availableTimes.value는 이제 [{time: 'HH:MM', at_no: 9, start_time_stamp: '...'}, ...] 입니다.
const morningTimes = computed(() =>
  availableTimes.value.filter((t) => parseInt(t.time.split(':')[0]) < 12)
);
const afternoonTimes = computed(() =>
  availableTimes.value.filter((t) => parseInt(t.time.split(':')[0]) >= 12)
);

const confirmationDateTime = computed(() => {
  if (!selectedDate.value || !selectedTimeSlot.value) return '';
  // [v10 수정] selectedTimeSlot.time (객체의 time 속성) 을 사용
  return `${formatToKoreanDate(selectedDate.value)} ${selectedTimeSlot.value.time}시`;
});

// --- 5. 라이프사이클 (Lifecycle) ---

// [연동] 스케줄 로딩 로직
async function refreshSchedules() {
  isLoadingSchedules.value = true;
  // [수정] 상태 초기화 (새로고침 시)
  selectedDate.value = null;
  selectedTimeSlot.value = null;
  availableTimes.value = [];

  try {
    // API 경로를 사용자가 수정한 '/api/user/schedule/available'로 사용
    const response = await api.get('/api/user/schedule/available');

    // [연동] 3. 백엔드 응답(response.data)으로 상태를 설정합니다.
    availableScheduleData.value = response.data;
    // [해결] 캘린더 렌더링 전에 비-반응형 Set을 채웁니다.
    availableDateSet = new Set(Object.keys(availableScheduleData.value));

    // [로그 복원]
    console.log('--- refreshSchedules (API 응답) ---');
    console.log('Raw Response Data:', response.data);
    console.log('Created Date Set:', availableDateSet);
  } catch (error) {
    console.error('스케줄 로딩 실패:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '예약 가능한 시간을 불러오는 데 실패했습니다.',
      life: 3000,
    });
    availableScheduleData.value = {}; // [수정] 오류 시 빈 객체
    availableDateSet = new Set(); // 오류 시 빈 Set
  } finally {
    // [해결] 데이터 로드가 완료된 후 렌더링을 true로 변경합니다.
    isLoadingSchedules.value = false;
  }
}

onMounted(async () => {
  await refreshSchedules();

  // Fetch user's wards
  try {
    const response = await userApi.getMyWards();
    console.log('Fetched Wards Data:', JSON.stringify(response.data.result, null, 2)); // 데이터 확인용 로그
    wardList.value = response.data.result;
    // If there is only one ward, pre-select it
    if (wardList.value.length === 1) {
      selectedWard.value = wardList.value[0].ward_no;
    }
  } catch (error) {
    console.error('피보호자 목록 로딩 실패:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '피보호자 목록을 불러오는 데 실패했습니다.',
      life: 3000,
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
      <div class="table-container" v-if="wardList.length > 0">
        <Card>
          <template #content>
            <div class="mb-4">
              <label for="ward-select" class="block text-xl font-medium mb-2"
                >상담받을 피보호자 선택</label
              >
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

      <!-- 1. 캘린더 카드 -->
      <div class="table-container">
        <Card>
          <template #content>
            <!-- 1단계: 날짜 선택 (캘린더) -->
            <div class="flex justify-content-center">
              <!-- [v10 수정] v-if는 isLoadingSchedules (반응형 ref)를 사용합니다. -->
              <ProgressSpinner
                v-if="isLoadingSchedules"
                style="width: 50px; height: 50px"
                strokeWidth="8"
              />
              <!-- [v10 수정] v-else: 데이터가 준비된 후에 캘린더를 렌더링합니다. -->
              <Calendar
                v-else
                v-model="selectedDate"
                inline
                :minDate="minDate"
                dateFormat="yy-mm-dd"
                @date-select="onDateSelect"
                class="w-full"
              >
                <!--
                    [v15 수정] 이 속성의 주석을 제거하여
                    예약 불가능한 날짜를 클릭할 수 없도록 합니다.
                  -->
                :disabledDates="isDateDisabled"
              </Calendar>
            </div>
            <!-- (대안) 예약 가능 날짜가 아예 없는 경우 -->
            <template v-if="!isLoadingSchedules && availableDateSet.size === 0">
              <div class="mt-4 text-center text-gray-500">
                현재 예약 가능한 상담 일정이 없습니다.
              </div>
            </template>
          </template>
        </Card>
      </div>

      <!-- 2. 시간 슬롯 카드 (날짜 선택 및 시간이 있을 때) -->
      <!-- [수정] availableTimes.length > 0 조건 추가 -->
      <div class="table-container" v-if="selectedDate && availableTimes.length > 0">
        <Card>
          <template #content>
            <!-- 2단계: 시간 선택 (시간 슬롯) -->
            <div class="mt-0">
              <Divider />
              <h6 class="text-center mb-4">
                {{ formatToKoreanDate(selectedDate) }}
              </h6>

              <!-- 오전 -->
              <div v-if="morningTimes.length > 0" class="mb-4">
                <div class="font-semibold text-lg mb-3">오전</div>
                <div class="flex flex-wrap gap-3">
                  <!-- [v12 수정] v-for="slot in morningTimes" / :key="slot.start_time_stamp" -->
                  <Button
                    v-for="slot in morningTimes"
                    :key="slot.start_time_stamp"
                    :label="slot.time"
                    :outlined="selectedTimeSlot?.start_time_stamp !== slot.start_time_stamp"
                    @click="selectTime(slot)"
                    style="min-width: 80px"
                  />
                </div>
              </div>

              <!-- 오후 -->
              <div v-if="afternoonTimes.length > 0" class="mb-4">
                <div class="font-semibold text-lg mb-3">오후</div>
                <div class="flex flex-wrap gap-3">
                  <!-- [v12 수정] v-for="slot in afternoonTimes" / :key="slot.start_time_stamp" -->
                  <Button
                    v-for="slot in afternoonTimes"
                    :key="slot.start_time_stamp"
                    :label="slot.time"
                    :outlined="selectedTimeSlot?.start_time_stamp !== slot.start_time_stamp"
                    @click="selectTime(slot)"
                    style="min-width: 80px"
                  />
                </div>
              </div>

              <!-- 상담 신청 버튼 -->
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

      <!-- [추가] 시간이 없는 날짜를 선택했을 때의 메시지 카드 -->
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

  <!-- 3단계: 상담 신청 완료 알림 (팝업) -->
  <ConfirmationDialog
    :visible="showConfirmationDialog"
    :userName="userName"
    :confirmationDateTime="confirmationDateTime"
    @close="closeConfirmationDialog"
    @goToHistory="goToHistory"
  />
</template>

<style>
/* 전역 폰트 및 배경 설정 (layout.scss 등에서 관리되어야 함) */
/*
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    background-color: #f8f9fa;
    margin: 0;
}
*/

/* 전체 레이아웃 */
.dashboard-layout {
  min-height: 100vh;
}

/* 1. Sidebar 스타일 (참고용으로 남겨둠) */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #dee2e6;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 2. Main Content 스타일 */
.main-content {
  width: 90%;
  max-width: 1200px; /* 최대 너비를 1200px로 설정 */
  margin: 0 auto; /* 상하 0, 좌우 auto (중앙 정렬) */
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
  margin-bottom: 32px;
}

/* 3. Stat Cards (참고용으로 남겨둠) */
.stat-cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

/* 4. DataTable / Content 컨테이너 */
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

/*
    .table-container는 Card를 감싸는 용도로도 사용되었으므로,
    Card 내부의 패딩을 별도로 설정합니다.
    또한, table-container끼리의 상단 여백을 추가합니다.
*/
.table-container {
  margin-top: 2rem; /* 카드 간의 수직 여백 */
}
.table-container:first-of-type {
  margin-top: 0; /* 첫 번째 카드는 여백 없음 */
}

.table-container .p-card .p-card-body {
  padding: 2rem; /* Card 기본 패딩 적용 */
}
.table-container .p-card .p-card-content {
  padding: 0; /* Card content의 기본 패딩 제거 */
}

/* --- 기존 CounselingApplication.vue의 스타일 --- */

/* PrimeVue 캘린더의 오늘 날짜 표시에 강한 테두리 추가 */
:deep(.p-datepicker-today > .p-datepicker-button) {
  border: 1px solid var(--primary-color);
}

/* 캘린더 내부의 날짜 버튼 크기를 키워 가독성을 높입니다. */
:deep(.p-datepicker table td > .p-datepicker-button) {
  width: 3rem;
  height: 3rem;
}

/* 캘린더 헤더(월, 연도) 폰트 크기 */
:deep(.p-datepicker .p-datepicker-header .p-datepicker-title) {
  font-size: 1.25rem;
}

/* Dialog 팝업의 헤더 스타일을 page-title과 유사하게 조정 */
:deep(.p-dialog .p-dialog-header .p-dialog-title) {
  font-weight: 600;
  font-size: 1.25rem;
  color: #212529;
}
</style>
