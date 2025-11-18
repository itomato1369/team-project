<script setup>
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

// --- 1. Props & Emits ---

// v-model:visible, selectedDate를 부모로부터 받음
const props = defineProps({
  visible: Boolean,
  selectedDate: String, // YYYY-MM-DD
});

// v-model:visible 업데이트, applySchedule 이벤트(폼 데이터) 전송
const emit = defineEmits(['update:visible', 'applySchedule']);

// --- 2. 상태 관리 (Form State) ---

const startTime = ref('09:00');
const endTime = ref('17:00');

// PDF의 '반복 없음'에 해당하는 옵션
const recurrenceOptions = ref([
  { label: '반복 없음', value: 'none' },
  { label: '매주 이 요일', value: 'weekly' },
  { label: '매일 (월-금)', value: 'weekdays' },
]);
const selectedRecurrence = ref(recurrenceOptions.value[0]);

// --- 3. 이벤트 핸들러 ---

// '적용' 버튼 클릭 시
function onApply() {
  const scheduleData = {
    dateISO: props.selectedDate,
    startTime: startTime.value,
    endTime: endTime.value,
    recurrence: selectedRecurrence.value.value, // 'none'
  };
  emit('applySchedule', scheduleData);
}

// '취소' 또는 'X' 버튼 클릭 시 (모달 닫기)
function onClose() {
  emit('update:visible', false);
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="onClose"
    modal
    header="스케줄 설정"
    :style="{ width: '450px' }"
    :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
  >
    <!-- 모달 본문 (Form) -->
    <div class="p-4 space-y-6">
      <!-- 선택된 날짜 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> 선택한 날짜 </label>
        <InputText
          :modelValue="selectedDate"
          readonly
          disabled
          class="w-full bg-gray-100 text-lg font-semibold"
        />
      </div>

      <!-- 시작 시간 -->
      <div>
        <label for="start-time" class="block text-sm font-medium text-gray-700 mb-1">
          시작 시간
        </label>
        <InputText id="start-time" type="time" v-model="startTime" class="w-full" />
      </div>

      <!-- 종료 시간 -->
      <div>
        <label for="end-time" class="block text-sm font-medium text-gray-700 mb-1">
          종료 시간
        </label>
        <InputText id="end-time" type="time" v-model="endTime" class="w-full" />
      </div>

      <!-- 반복 설정 -->
      <div>
        <label for="recurrence" class="block text-sm font-medium text-gray-700 mb-1">
          반복 설정
        </label>
        <Dropdown
          id="recurrence"
          v-model="selectedRecurrence"
          :options="recurrenceOptions"
          optionLabel="label"
          placeholder="반복 설정 선택"
          class="w-full"
        />
      </div>
    </div>

    <!-- 모달 푸터 (버튼) -->
    <template #footer>
      <div class="flex justify-end gap-2 pt-4">
        <Button label="취소" @click="onClose" severity="secondary" text />
        <Button label="적용" @click="onApply" />
      </div>
    </template>
  </Dialog>
</template>

<style>
/* PrimeVue Dialog 내부 폼의 간격을 조정합니다. */
.p-dialog .p-dialog-content {
  padding-top: 1rem;
  padding-bottom: 0.5rem;
}
.p-dialog .p-dialog-footer {
  padding-top: 0.5rem;
  padding-bottom: 1.5rem;
}
</style>
