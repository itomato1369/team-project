<script setup>
import Button from 'primevue/button';

// [1] 부모로부터 받을 props 정의
defineProps({
  title: String,
  timeSlots: Array, // 예: morningTimes 또는 afternoonTimes
  selectedSlot: Object, // 예: selectedTimeSlot
});

// [2] 부모로 보낼 이벤트 정의
const emit = defineEmits(['select-time']);

// [3] 클릭 시 부모의 selectTime 함수를 호출하도록 이벤트를 emit
function onTimeClick(slot) {
  emit('select-time', slot);
}
</script>

<template>
  <!-- 
    v-if="timeSlots && timeSlots.length > 0" 
    (timeSlots가 null/undefined일 수 있다면 방어 코드를 넣는 것이 좋습니다)
  -->
  <div v-if="timeSlots.length > 0" class="mb-4">
    <div class="font-semibold text-lg mb-3">{{ title }}</div>
    <div class="flex flex-wrap gap-3">
      <Button
        v-for="slot in timeSlots"
        :key="slot.start_time_stamp"
        :label="slot.time"
        :outlined="selectedSlot?.start_time_stamp !== slot.start_time_stamp"
        @click="onTimeClick(slot)"
        style="min-width: 80px"
      />
    </div>
  </div>
</template>
