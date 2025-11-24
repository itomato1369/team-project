<script setup>
import { computed } from 'vue';
import StaffSupportResultListInfo from './StaffSupportResultListInfo.vue';

const props = defineProps({
  item: Object, // 서버에서 받아온 한 건의 서포트 플랜
  isActive: Boolean, // 아코디언 상태
  allowMultiple: Boolean,
});

const emit = defineEmits(['toggle-detail']);

// 상세 토글
const handleButtonClick = () => {
  emit('toggle-detail', props.item.support_plan_no);
};
</script>

<template>
  <div class="w-full bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
    <!-- 제목 / 작성자 -->
    <div class="flex justify-between items-start">
      <div>
        <!-- 제목 = support_plan_goal 재사용 -->
        <h2 class="text-2xl font-bold text-gray-900">
          {{ item.support_plan_goal }}
          <span class="text-gray-500 text-base ml-2">{{ item.created_at }}</span>
        </h2>
        <p class="text-gray-500 text-base mt-1">{{ item.plan }}</p>
      </div>
      <button class="px-4 py-2 text-base border rounded-lg hover:bg-gray-100">
        {{ item.staff_name }}
      </button>
    </div>

    <!-- 우선순위 / 요청일 / 자세히보기 -->
    <div class="flex justify-between items-center mt-6">
      <div class="flex items-center gap-4">
        <button
          @click="handleButtonClick"
          class="px-4 py-2 border rounded-lg text-base hover:bg-gray-100"
        >
          자세히보기
        </button>
      </div>
    </div>

    <!-- 아코디언 상세 정보 -->
    <div v-if="isActive">
      <StaffSupportResultListInfo :item="item" />
    </div>
  </div>
</template>
