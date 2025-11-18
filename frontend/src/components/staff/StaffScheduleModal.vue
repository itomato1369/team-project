<script setup>
import { ref, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import api from '@/api/api.js';

const props = defineProps({
  visible: Boolean,
  selectedDate: String,
  scheduledData: Object, // The full scheduledData object from parent
});

const emit = defineEmits(['update:visible', 'schedule-updated', 'schedule-deleted']);

const toast = useToast();

const startTime = ref('09:00');
const endTime = ref('17:00');
const recurrenceOptions = ref([
  { label: '반복 없음', value: 'none' },
  { label: '매주 이 요일', value: 'weekly' },
  { label: '매일 (월-금)', value: 'weekdays' },
]);
const selectedRecurrence = ref(recurrenceOptions.value[0].value);

// Watch for changes in selectedDate to reset time inputs if needed
watch(
  () => props.selectedDate,
  (newDate) => {
    if (newDate) {
      // Optionally reset times or keep them
      startTime.value = '09:00';
      endTime.value = '17:00';
      selectedRecurrence.value = recurrenceOptions.value[0].value;
    }
  }
);

const existingSchedulesForSelectedDate = computed(() => {
  if (!props.selectedDate || !props.scheduledData[props.selectedDate]) {
    return [];
  }
  return props.scheduledData[props.selectedDate].filter((s) => s.type === 'available');
});

function closeModal() {
  emit('update:visible', false);
}

async function deleteSchedule(at_no) {
  if (!at_no) {
    console.error('삭제할 at_no가 없습니다.');
    return;
  }

  try {
    await api.delete(`/api/staff/schedule/delete/${at_no}`);
    toast.add({
      severity: 'info',
      summary: '삭제됨',
      detail: '스케줄이 삭제되었습니다.',
      life: 2000,
    });
    emit('schedule-deleted'); // Notify parent to refresh data
  } catch (error) {
    console.error('스케줄 삭제 실패:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: error.response?.data?.message || '스케줄 삭제 중 오류가 발생했습니다.',
      life: 3000,
    });
  }
}

async function applySchedule() {
  if (!props.selectedDate) return;

  const payload = {
    start_time: `${props.selectedDate}T${startTime.value}:00`,
    end_time: `${props.selectedDate}T${endTime.value}:00`,
    recurring_rules: selectedRecurrence.value,
  };

  console.log('적용할 스케줄 (API Payload):', payload);

  try {
    const response = await api.post('/api/staff/schedule/create', payload);
    toast.add({
      severity: 'success',
      summary: '성공',
      detail: response.data.message || '상담 가능 시간이 설정되었습니다.',
      life: 3000,
    });
    emit('schedule-updated'); // Notify parent to refresh data
    closeModal(); // Close modal after successful application
  } catch (error) {
    console.error('스케줄 설정 실패:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: error.response?.data?.message || '스케줄 설정 중 오류가 발생했습니다.',
      life: 3000,
    });
  }
}
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-40 flex items-center justify-center"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div @click="closeModal" class="absolute inset-0 bg-opacity-60 z-40"></div>

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
                @click="deleteSchedule(sched.at_no)"
                class="text-red-500 hover:text-red-700 font-medium text-xs"
              >
                삭제
              </button>
            </div>
          </div>
        </div>

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
</template>

<style scoped>
/* Styles specific to the modal can go here, or be imported from a shared stylesheet */
/* For now, I'll assume the parent's styles are sufficient or will be handled by Tailwind */
</style>
