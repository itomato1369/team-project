<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const props = defineProps({
  item: Object,
  dropdownItems: Array,
});

// localForm 초기값
const localForm = ref({
  support_plan_no: null,
  support_plan_goal: '',
  staff_name: '',
  business_name: '',
  spend: 0,
  support_created_at: '',
  support_ended_at: '',
  priority_no: '',
  plan: '',
  file_names: '',
  support_plan_status: '',
});

// props.item이 들어오면 서버 상태로 덮어쓰기
watch(
  () => props.item,
  (newVal) => {
    if (newVal) {
      localForm.value = {
        support_plan_no: null,
        support_plan_goal: '',
        staff_name: '',
        business_name: '',
        spend: 0,
        support_created_at: '',
        support_ended_at: '',
        priority_no: '',
        plan: '',
        file_names: '',
        support_plan_status: '', // 초기값
        ...newVal, // 서버에서 받은 값 덮어쓰기
      };
    }
  },
  { immediate: true }
);

const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '';
  const onlyNums = String(amount).replace(/[^0-9]/g, '');
  return onlyNums ? Number(onlyNums).toLocaleString() : '';
};

// 승인 처리
// const approvePlan = async () => {
//   if (!localForm.value.support_plan_no) return;

//   try {
//     const res = await axios.post(
//       `/api/staff/support-plan/SupportPlanDetail/${localForm.value.support_plan_no}`
//     );
//     alert(res.data.message || '승인 완료');
//     // 승인 버튼 누르면 바로 상태 업데이트
//     localForm.value.support_plan_status = '승인';
//   } catch (err) {
//     console.error(err);
//     alert('승인 중 오류 발생');
//   }
// };
</script>

<template>
  <div class="border rounded-md p-4 mt-2 shadow-sm bg-gray-50">
    <div class="flex flex-col gap-4">
      <!-- 목표 -->
      <div>
        <label class="font-semibold text-gray-700">목표</label>
        <InputText v-model="localForm.support_plan_goal" readonly class="w-full bg-gray-100" />
      </div>

      <!-- 작성자 -->
      <!-- <div>
        <label class="font-semibold text-gray-700">작성자</label>
        <InputText v-model="localForm.staff_name" readonly class="w-full bg-gray-100" />
      </div> -->

      <!-- 지원계획 & 예상지원금액 -->
      <div class="flex gap-4">
        <div class="w-full">
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
          <label class="font-semibold text-gray-700">시작일</label>
          <InputText v-model="localForm.support_started_at" readonly class="w-full bg-gray-100" />
        </div>
        <div class="w-1/2">
          <label class="font-semibold text-gray-700">종료일</label>
          <InputText v-model="localForm.support_ended_at" readonly class="w-full bg-gray-100" />
        </div>
      </div>

      <!-- 내용 -->
      <div>
        <label class="font-semibold text-gray-700">내용</label>
        <Textarea v-model="localForm.plan" rows="10" readonly class="w-full bg-gray-100" />
      </div>

      <!-- PDF 목록 -->
      <div v-if="localForm.file_names && localForm.file_names.length">
        <label class="font-semibold text-gray-700">업로드 PDF</label>
        <ul class="list-disc ml-5 text-sm text-gray-600">
          <li v-for="(file, idx) in localForm.file_names.split(',')" :key="idx">{{ file }}</li>
        </ul>
      </div>
      <div v-else class="text-sm text-gray-400">첨부 파일 없음</div>

      <!-- 승인 버튼 -->
      <div class="flex justify-end gap-4 mt-6">
        <button
          @click="approvePlan"
          class="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
        >
          승인
        </button>
      </div>
    </div>
  </div>
</template>
