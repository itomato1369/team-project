<script setup>
import { ref, computed, onMounted } from 'vue';
// api.js에서 staffReservationApi 임포트
import { staffReservationApi } from '@/api/api';
// [신규] 모달 컴포넌트 임포트 (경로 수정 필요)
import ReservationCancelModal from './ReservationCancelModal.vue';

// --- Reactive State ---

// 검색 관련
const searchType = ref('date');
const searchStartDate = ref('');
const searchEndDate = ref('');
const searchKeyword = ref('');

// 목록 데이터
const reservationList = ref([]);
const isLoading = ref(false);
const error = ref(null);

// 모달 관련 (상태는 부모가 계속 관리)
const isModalOpen = ref(false);
const currentReservation = ref(null);
const isCanceling = ref(false);
const modalError = ref(null);

// --- Computed Properties ---

const searchInputPlaceholder = computed(() => {
  if (searchType.value === 'applicant') {
    return '보호자 이름을 입력하세요';
  }
  if (searchType.value === 'reason') {
    return '사유를 입력하세요';
  }
  return '검색어를 입력하세요';
});

// --- Methods ---

// (Helper) 날짜 포맷팅 함수 (테이블에서 사용)
function formatDateTime(isoString) {
  if (!isoString) return '날짜 정보 없음';
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
  } catch (e) {
    return isoString;
  }
}

// (API) 예약 목록 조회
async function fetchReservations() {
  isLoading.value = true;
  error.value = null;

  const params = {
    searchType: searchType.value,
  };

  if (searchType.value === 'date') {
    params.startDate = searchStartDate.value || null;
    params.endDate = searchEndDate.value || null;
  } else {
    params.keyword = searchKeyword.value;
  }

  try {
    const response = await staffReservationApi.getReservations(params);

    // (수정) 백엔드 응답 스키마에 맞게 컬럼명 수정
    // (atNo, start_time, status, id, reason, counselingType, applicantName, patientName)
    reservationList.value = response.data.map((item) => ({
      ...item,
      // create (2).sql 스키마에 맞게 컬럼명 재확인
      start_time: item.start_time,
      applicantName: item.applicantName, // (m.user_name)
      patientName: item.patientName, // (res.name)
      reason: item.reason, // (res.res_reason)
      atNo: item.atNo, // (at.at_no)
      id: item.id, // (res.res_no)
    }));
  } catch (err) {
    console.error('예약 목록 조회 실패:', err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
}

// 검색 버튼 클릭
function executeSearch() {
  fetchReservations();
}

// 컴포넌트 마운트 시 초기 목록 조회
onMounted(() => {
  fetchReservations();
});

// 기록 작성
function writeRecord(reservation) {
  console.log(`(Action) 기록 작성 페이지로 이동:`);
  console.log(`Available Time No (at_no): ${reservation.atNo}`);

  // location.href = `/counseling/record/new?at_no=${reservation.atNo}`;
  alert(`'기록 작성' 클릭 (at_no: ${reservation.atNo}). 상담일지 작성 페이지로 이동합니다.`);
}

// --- [수정] 모달 로직 ---

// 예약 취소 모달 열기 (상태 설정)
function openCancelModal(reservation) {
  currentReservation.value = reservation;
  modalError.value = null;
  isModalOpen.value = true;
}

// 예약 취소 모달 닫기 (상태 초기화)
function closeCancelModal() {
  isModalOpen.value = false;
  currentReservation.value = null;
  isCanceling.value = false;
  modalError.value = null; // 닫을 때 모달 에러도 초기화
}

// 예약 취소 확정 (API 호출)
async function confirmCancel() {
  if (!currentReservation.value || isCanceling.value) return;

  const reservationToCancel = currentReservation.value;
  const atNo = reservationToCancel.atNo;

  if (!atNo) {
    modalError.value = '취소할 예약 ID(at_no)가 없습니다.';
    return;
  }

  isCanceling.value = true;
  modalError.value = null;

  try {
    await staffReservationApi.cancelReservationByStaff(atNo);
    console.log(`(DB) UPDATE available_time SET status = '상담불가' WHERE at_no = ${atNo};`);

    // (옵션 2: 목록 새로고침 - 추천)
    await fetchReservations();

    // 3. 모달 닫기 (상태 초기화)
    closeCancelModal();
  } catch (err) {
    console.error('예약 취소 실패:', err);
    modalError.value = err.response?.data?.message || err.message || '알 수 없는 오류 발생';
  } finally {
    isCanceling.value = false; // 에러 발생 시에도 로딩 해제
  }
}
</script>

<template>
  <!-- 2-2. 컨텐츠 영역 (스크롤) -->
  <div class="flex-1 overflow-y-auto p-8 bg-gray-100">
    <!-- 검색 및 필터 영역 -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div class="flex flex-col md:flex-row md:items-end md:space-x-4 gap-4">
        <!-- 검색 조건 선택 -->
        <div class="flex-none">
          <label for="search-type" class="block text-sm font-medium text-gray-700 mb-1"
            >검색 조건</label
          >
          <select
            id="search-type"
            v-model="searchType"
            class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="date">상담일시</option>
            <option value="applicant">보호자이름</option>
            <option value="reason">사유</option>
          </select>
        </div>

        <!-- 검색 값 입력 -->
        <div class="flex-1 min-w-0">
          <label for="search-value" class="block text-sm font-medium text-gray-700 mb-1"
            >검색 값</label
          >

          <!-- 상담일시 검색 -->
          <div v-if="searchType === 'date'" class="flex space-x-2">
            <input
              type="date"
              v-model="searchStartDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span class="flex items-center text-gray-500">~</span>
            <input
              type="date"
              v-model="searchEndDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- 텍스트 검색 -->
          <div v-else>
            <input
              type="text"
              v-model="searchKeyword"
              :placeholder="searchInputPlaceholder"
              @keyup.enter="executeSearch"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <!-- 검색 버튼 -->
        <div class="flex-none">
          <button
            @click="executeSearch"
            :disabled="isLoading"
            class="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ isLoading ? '검색 중...' : '검색' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 상담 예약 목록 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                상담 일시
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                신청인(보호자)
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                피보호자
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                요청 사유
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- 로딩 중 -->
            <tr v-if="isLoading">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                목록을 불러오는 중입니다...
              </td>
            </tr>
            <!-- 에러 발생 -->
            <tr v-else-if="error">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-red-600">
                목록을 불러오는데 실패했습니다: {{ error.message }}
              </td>
            </tr>
            <!-- 데이터 없음 -->
            <tr v-else-if="reservationList.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                표시할 예약 내역이 없습니다.
              </td>
            </tr>
            <!-- 데이터 있음 -->
            <tr v-else v-for="reservation in reservationList" :key="reservation.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatDateTime(reservation.start_time) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ reservation.applicantName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ reservation.patientName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 truncate max-w-xs">
                {{ reservation.reason }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button
                  @click="writeRecord(reservation)"
                  class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  기록 작성
                </button>
                <button
                  @click="openCancelModal(reservation)"
                  class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  예약 취소
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 (Static) -->
      <div
        class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
      >
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              총 <span class="font-medium">{{ reservationList.length }}</span> 건
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <a
                href="#"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-current="page"
                class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                1
              </a>
              <a
                href="#"
                class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- [수정] 분리된 모달 컴포넌트 사용 -->
  <ReservationCancelModal
    :is-open="isModalOpen"
    :reservation="currentReservation"
    :is-canceling="isCanceling"
    :error="modalError"
    @confirm="confirmCancel"
    @close="closeCancelModal"
  />
</template>

<style scoped>
/* 메인 페이지 스타일 (필요한 경우) */
</style>
