<script setup>
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
  wardId: {
    type: [String, Number],
    default: null,
  },
  applicantData: {
    type: Object,
    default: () => null,
  },
});

const formattedData = ref({
  이름: '...',
  나이: '...',
  성별: '...',
  생년월일: '...',
  장애유형: '...',
  주소: '...',
});

// ⭐ Survey.vue에서 데이터 넘어오는 즉시 자동 반영
watch(
  () => props.applicantData,
  (data) => {
    if (!data) return;

    formattedData.value = {
      이름: data['이름'] || '정보 없음',
      나이: data['나이'] ? `${data['나이']}세` : '정보 없음',
      성별: data['성별'] || '정보 없음',
      생년월일: data['생년월일'] || '정보 없음',
      장애유형: data['장애유형'] || '없음',
      주소: data['주소'] || '정보 없음',
    };
  },
  { immediate: true }
);
</script>

<template>
  <div class="card p-3 rounded-xl bg-white border border-gray-100 transition duration-300">
    <div class="text-lg mb-3 text-indigo-700 border-b pb-2">지원자 상세 정보</div>

    <div v-if="!props.applicantData" class="text-center p-6 text-gray-500">
      상위 데이터 로드 대기 중...
    </div>

    <div v-else class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-4">
      <div
        v-for="(value, key) in formattedData"
        :key="key"
        class="flex flex-col p-2 bg-gray-50 rounded-lg border border-gray-200"
      >
        <span class="text-gray-600 font-bold text-xs uppercase tracking-wider mb-0.5">
          {{ key }}
        </span>
        <span class="text-gray-800 text-xs break-words">{{ value }}</span>
      </div>
    </div>
  </div>
</template>
