<script setup>
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';

const props = defineProps({
  item: Object, // 부모에서 전달받는 한 건의 서포트 플랜
  dropdownItems: Array, // 사업 선택 드롭다운
});

// 로컬 복사 (읽기 전용)
const localForm = ref({ ...props.item });

// props.item이 바뀌면 localForm 갱신
watch(
  () => props.item,
  (newVal) => {
    localForm.value = { ...newVal };
  }
);

// 금액 3자리 콤마 포맷
const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '';
  const onlyNums = String(amount).replace(/[^0-9]/g, '');
  return onlyNums ? Number(onlyNums).toLocaleString() : '';
};
</script>

<template>
  <div class="border rounded-md p-4 mt-2 shadow-sm bg-gray-50">
    <div class="flex flex-col gap-4">
      <!-- 목표 -->
      <div>
        <label class="font-semibold text-gray-700">목표</label>
        <InputText v-model="localForm.support_plan_goal" readonly class="w-full bg-gray-100" />
      </div>

      <!-- 담당자 -->
      <div>
        <label class="font-semibold text-gray-700">작성자</label>
        <InputText v-model="localForm.staff_name" readonly class="w-full bg-gray-100" />
      </div>

      <!-- 지원계획 & 예상지원금액 -->
      <div class="flex gap-4">
        <div class="w-1/2">
          <label class="font-semibold text-gray-700">지원계획</label>
          <InputText v-model="localForm.business_name" readonly class="w-full bg-gray-100" />
        </div>
        <div class="w-1/2">
          <label class="font-semibold text-gray-700">예상지원금액</label>
          <InputText
            :value="formatAmount(localForm.spend)"
            readonly
            class="w-full text-right bg-gray-100"
          />
        </div>
      </div>

      <!-- 작성일 & 요청일 -->
      <div class="flex gap-4">
        <div class="w-1/2">
          <label class="font-semibold text-gray-700">작성일</label>
          <InputText v-model="localForm.created_at" readonly class="w-full bg-gray-100" />
        </div>
        <div class="w-1/2">
          <label class="font-semibold text-gray-700">요청일</label>
          <InputText v-model="localForm.writer_date" readonly class="w-full bg-gray-100" />
        </div>
      </div>

      <!-- 우선순위 -->
      <div>
        <label class="font-semibold text-gray-700">우선순위</label>
        <InputText v-model="localForm.priority_no" readonly class="w-full bg-gray-100" />
      </div>

      <!-- 내용 -->
      <div>
        <label class="font-semibold text-gray-700">내용</label>
        <Textarea v-model="localForm.plan" rows="4" readonly class="w-full bg-gray-100" />
      </div>

      <!-- PDF 목록 -->
      <div v-if="localForm.file_names && localForm.file_names.length">
        <label class="font-semibold text-gray-700">업로드 PDF</label>
        <ul class="list-disc ml-5 text-sm text-gray-600">
          <li v-for="(file, idx) in localForm.file_names.split(',')" :key="idx">{{ file }}</li>
        </ul>
      </div>
      <div v-else class="text-sm text-gray-400">첨부 파일 없음</div>

      <!-- 승인/반려 버튼 -->
      <div class="flex justify-end gap-4 mt-6">
        <!-- 반려 버튼 -->
        <button
          class="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          반려
        </button>

        <!-- 승인 버튼 -->
        <button
          class="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
        >
          승인
        </button>
      </div>
    </div>
  </div>
</template>
