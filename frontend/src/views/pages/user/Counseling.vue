<script setup>
// ... (script 태그 내용은 변경 없음) ...
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
// Card 컴포넌트를 import합니다.
import Card from 'primevue/card';

const router = useRouter();
const toast = useToast();

// --- 1. 상태 관리 (State Management) ---

// 오늘 날짜 (시간은 00:00:00으로 설정)
const today = new Date();
today.setHours(0, 0, 0, 0);
const minDate = ref(today); // 오늘 이전 날짜는 비활성화

// 선택된 날짜 및 시간
const selectedDate = ref(null);
const selectedTime = ref(null);

// 상담 신청 완료 알림 팝업 표시 여부
const showConfirmationDialog = ref(false);

// 로딩 상태
const isLoading = ref(false); // '상담 신청' 버튼의 로딩 상태
const isLoadingSchedules = ref(true); // 캘린더 스케줄 로딩 상태

// (Mock Data)
const mockAvailableTimes = ref({});

// [수정] availableDateSet을 ref가 아닌 일반 변수로 선언합니다.
// 반응성(ref)을 제거하여 PrimeVue 컴포넌트와의 충돌을 방지합니다.
let availableDateSet = new Set();

// 선택된 날짜에 해당하는 예약 가능 시간 목록
const availableTimes = ref([]);

// (Mock Data) 로그인한 사용자 이름
const userName = ref('홍길동');

// --- 2. 헬퍼 함수 (Helper Functions) ---

// Date 객체를 'YYYY-MM-DD' 문자열로 변환
function formatDateToISO(date) {
  if (!date) return null;
  return date.toISOString().split('T')[0];
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
 * [고급 구현]
 * 'disabledDates' prop에 전달될 함수.
 */
function isDateDisabled(date) {
  // 1. minDate (오늘) 이전 날짜인지 확인
  const checkDate = new Date(date.year, date.month, date.day);
  if (checkDate < minDate.value) {
    return true; // 오늘 이전이므로 비활성화
  }

  // 2. 예약 가능 목록에 없는 날짜인지 확인
  const dateKey = formatCalendarDateToISO(date);

  // [수정] .value를 제거합니다. (availableDateSet은 더 이상 ref가 아님)
  // availableDateSet에 dateKey가 *없으면* 비활성화 (true 반환)
  return !availableDateSet.has(dateKey);
}

/**
 * 캘린더에서 (활성화된) 날짜를 선택했을 때 호출
 */
function onDateSelect(date) {
  console.log('선택된 날짜:', date);
  selectedDate.value = date;
  selectedTime.value = null; // 날짜가 바뀌면 선택된 시간 초기화

  const dateKey = formatDateToISO(date);
  const times = mockAvailableTimes.value[dateKey];

  if (times && times.length > 0) {
    availableTimes.value = times;
  } else {
    availableTimes.value = [];
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '선택된 날짜의 시간을 찾을 수 없습니다. 관리자에게 문의하세요.',
      life: 3000,
    });
  }
}

/**
 * 시간 슬롯 버튼을 클릭했을 때 호출
 */
function selectTime(time) {
  selectedTime.value = time;
}

/**
 * '상담 신청' 버튼 클릭 시
 */
async function submitApplication() {
  if (!selectedDate.value || !selectedTime.value) {
    toast.add({
      severity: 'warn',
      summary: '신청 불가',
      detail: '날짜와 시간을 모두 선택해주세요.',
      life: 3000,
    });
    return;
  }

  isLoading.value = true;

  // (Simulation)
  console.log('상담 신청:', {
    date: formatDateToISO(selectedDate.value),
    time: selectedTime.value,
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));

  isLoading.value = false;
  showConfirmationDialog.value = true;
}

/**
 * 알림 팝업의 '닫기' 버튼 클릭 시
 */
function closeConfirmationDialog() {
  showConfirmationDialog.value = false;
  // 상태 초기화
  selectedDate.value = null;
  selectedTime.value = null;
  availableTimes.value = [];
}

/**
 * 알림 팝업의 '목록 보기' 버튼 클릭 시
 */
function goToHistory() {
  closeConfirmationDialog();
  router.push('/counseling-history'); // 상담 내역 페이지로 이동
}

// --- 4. 계산된 속성 (Computed Properties) ---

const morningTimes = computed(() =>
  availableTimes.value.filter((t) => parseInt(t.split(':')[0]) < 12)
);
const afternoonTimes = computed(() =>
  availableTimes.value.filter((t) => parseInt(t.split(':')[0]) >= 12)
);

const confirmationDateTime = computed(() => {
  if (!selectedDate.value || !selectedTime.value) return '';
  return `${formatToKoreanDate(selectedDate.value)} ${selectedTime.value}시`;
});

// --- 5. 라이프사이클 (Lifecycle) ---

onMounted(async () => {
  // (Simulation)
  // 실제 구현: 여기서 API를 호출하여 mockAvailableTimes.value를 채웁니다.
  // await fetchAvailableSchedules().then(data => { mockAvailableTimes.value = data; ... });

  // 시뮬레이션을 위해 0.5초 대기
  await new Promise((resolve) => setTimeout(resolve, 500));

  // API 호출 완료 후 데이터 설정
  mockAvailableTimes.value = {
    [formatDateToISO(new Date(Date.now() + 86400000))]: [
      '10:30',
      '11:00',
      '11:30',
      '14:00',
      '14:30',
      '15:00',
    ],
    [formatDateToISO(new Date(Date.now() + 172800000))]: ['10:00', '10:30', '11:00', '14:00'],
    [formatDateToISO(new Date(Date.now() + 259200000))]: [
      '09:30',
      '10:00',
      '16:00',
      '16:30',
      '17:00',
    ],
  };

  // [수정] .value를 제거합니다. 일반 변수에 Set을 할당합니다.
  availableDateSet = new Set(Object.keys(mockAvailableTimes.value));

  // 데이터 로드가 완료되었으므로 캘린더를 표시
  isLoadingSchedules.value = false;
});
</script>

<template>
  <div class="dashboard-layout">
    <div class="main-content">
      <h1 class="page-title">상담 신청</h1>
      <p class="welcome-message">
        '예약 가능'한 날짜 중 하루를 선택하세요. (오늘: {{ formatToKoreanDate(new Date()) }})
      </p>

      <!-- [레이아웃 수정] 1. 캘린더 카드 -->
      <div class="table-container">
        <Card>
          <template #content>
            <!-- 1단계: 날짜 선택 (캘린더) -->
            <div class="flex justify-content-center">
              <ProgressSpinner
                v-if="isLoadingSchedules"
                style="width: 50px; height: 50px"
                strokeWidth="8"
              />
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
                :disabledDates="isDateDisabled" -->
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

      <!-- [레이아웃 수정] 2. 시간 슬롯 카드 (날짜 선택 시 나타남) -->
      <div class="table-container" v-if="selectedDate">
        <Card>
          <template #content>
            <!-- 2단계: 시간 선택 (시간 슬롯) -->
            <!-- 이 부분이 사용자가 제공한 스니펫입니다. -->
            <div class="mt-0">
              <!-- mt-5에서 0으로 변경 (Card가 이미 여백을 가짐) -->
              <Divider />
              <h6 class="text-center mb-4">
                {{ formatToKoreanDate(selectedDate) }}
              </h6>

              <!-- 오전 -->
              <div v-if="morningTimes.length > 0" class="mb-4">
                <div class="font-semibold text-lg mb-3">오전</div>
                <div class="flex flex-wrap gap-3">
                  <Button
                    v-for="time in morningTimes"
                    :key="time"
                    :label="time"
                    :outlined="selectedTime !== time"
                    @click="selectTime(time)"
                    style="min-width: 80px"
                  />
                </div>
              </div>

              <!-- 오후 -->
              <div v-if="afternoonTimes.length > 0" class="mb-4">
                <div class="font-semibold text-lg mb-3">오후</div>
                <div class="flex flex-wrap gap-3">
                  <Button
                    v-for="time in afternoonTimes"
                    :key="time"
                    :label="time"
                    :outlined="selectedTime !== time"
                    @click="selectTime(time)"
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
                  :disabled="!selectedTime"
                  @click="submitApplication"
                  class="p-button-lg w-full md:w-auto"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>

  <!-- 3단계: 상담 신청 완료 알림 (팝업) -->
  <Dialog
    v-model:visible="showConfirmationDialog"
    modal
    header="상담 신청 완료"
    :style="{ width: '450px' }"
    :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
    @hide="closeConfirmationDialog"
  >
    <div class="align-items-center text-center w-full">
      <p class="line-height-3">
        {{ userName }}님 {{ confirmationDateTime }} <br />
        상담이 예약되었습니다.
      </p>
    </div>
    <template #footer>
      <div class="flex w-full gap-2">
        <Button label="목록보기" @click="goToHistory" class="p-button-text flex-1" />
        <Button label="닫기" @click="closeConfirmationDialog" autofocus class="flex-1" />
      </div>
    </template>
  </Dialog>
</template>

<style>
/* 전체 레이아웃 */
.dashboard-layout {
  /* [수정] display: flex; 제거 */
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
  /* [수정] flex-grow: 1; 제거 */
  /* [수정] 너비와 마진을 추가하여 중앙 정렬 */
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
  margin-bottom: 32px; /* .summary-message의 여백을 가져옴 */
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

/* [스타일 수정]
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
/* [스타일 추가] Dialog 팝업의 헤더 스타일을 page-title과 유사하게 조정 */
:deep(.p-dialog .p-dialog-header .p-dialog-title) {
  font-weight: 600;
  font-size: 1.25rem;
  color: #212529;
}
</style>
