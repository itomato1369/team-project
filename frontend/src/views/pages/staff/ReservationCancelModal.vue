<script setup>
import { computed } from 'vue';

// --- Props ---
// v-model 대신 :is-open과 @close 이벤트를 사용합니다.
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  reservation: {
    type: Object,
    default: null,
  },
  isCanceling: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

// --- Emits ---
const emit = defineEmits(['close', 'confirm']);

// --- Methods ---

// (Helper) 날짜 포맷팅 함수 (자식 컴포넌트에서 독립적으로 사용)
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

// 닫기 버튼 클릭 시 'close' 이벤트 발생
function onClose() {
  emit('close');
}

// 확정 버튼 클릭 시 'confirm' 이벤트 발생
function onConfirm() {
  emit('confirm');
}
</script>

<template>
  <!-- 예약 취소 확인 모달 -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-medium leading-6 text-gray-900">예약 취소 확인</h3>
      </div>
      <div class="p-6">
        <p class="text-sm text-gray-700">정말로 이 예약을 취소하시겠습니까?</p>
        <div v-if="reservation" class="mt-2 text-sm text-gray-600">
          <!-- props.reservation을 사용하고, formatDateTime 헬퍼 호출 -->
          <p><strong>일시:</strong> {{ formatDateTime(reservation.start_time) }}</p>
          <p><strong>신청인:</strong> {{ reservation.applicantName }}</p>
        </div>
        <p class="mt-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
          취소 시, 해당 시간은 '상담불가' 상태로 변경되며 신청자에게 알림이 전송됩니다.
        </p>
        <!-- 취소 API 에러 메시지 (prop으로 받음) -->
        <p v-if="error" class="mt-4 text-sm text-red-600">취소 실패: {{ error }}</p>
      </div>
      <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
        <!-- 'close' 이벤트 emit -->
        <button
          type="button"
          @click="onClose"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          닫기
        </button>
        <!-- 'confirm' 이벤트 emit -->
        <button
          type="button"
          @click="onConfirm"
          :disabled="isCanceling"
          class="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {{ isCanceling ? '취소 중...' : '예약 취소' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 모달 관련 스타일 (필요한 경우) */
</style>
