<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const props = defineProps({
  item: Object, // 부모에서 전달하는 서포트 플랜
});

// localForm 초기값
const localForm = ref({
  support_plan_no: null,
  support_plan_goal: '',
  staff_name: '',
  business_name: '',
  spend: 0,
  created_at: '',
  writer_date: '',
  priority_no: '',
  plan: '',
  file_names: '',
  support_plan_status: '',
});

// 서버 데이터 기반으로 localForm 세팅
const setLocalForm = (data) => {
  if (!data) return;
  localForm.value = {
    support_plan_no: data.support_plan_no || null,
    support_plan_goal: data.support_plan_goal || '',
    staff_name: data.support_title || '김스탭',
    business_name: data.business_name || '',
    spend: data.spend || 0,
    created_at: data.created_at || '',
    writer_date: data.writer_date || '',
    priority_no: data.priority_no || '',
    plan: data.plan || '',
    file_names: data.file_names || '',
    support_plan_status: data.support_plan_status || data.status || '', // status 키 대비
  };
};

// 초기 마운트 시
onMounted(() => {
  if (props.item) {
    setLocalForm(props.item);
  }
});

// props.item 변경 감지 (비동기 업데이트 대응)
watch(
  () => props.item,
  (newVal) => {
    setLocalForm(newVal);
  },
  { immediate: true, deep: true }
);

// 금액 포맷
const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '';
  return Number(amount).toLocaleString();
};

// 승인 처리
const approvePlan = async () => {
  if (!localForm.value.support_plan_no) return;

  try {
    const res = await axios.post(
      `/api/staff/support-plan/SupportPlanDetail/${localForm.value.support_plan_no}`
    );
    alert(res.data.message || '승인 완료');
    // 승인 후 상태 업데이트
    localForm.value.support_plan_status = '승인';
  } catch (err) {
    console.error(err);
    alert('승인 중 오류 발생');
  }
};
</script>

<template>
  <div class="border rounded-md p-4 mt-2 shadow-sm bg-gray-50">
    <div class="flex flex-col gap-4">
      <div>
        <label class="font-semibold text-gray-700">목표</label>
        <InputText v-model="localForm.support_plan_goal" readonly class="w-full bg-gray-100" />
      </div>

      <div>
        <label class="font-semibold text-gray-700">작성자</label>
        <InputText v-model="localForm.staff_name" readonly class="w-full bg-gray-100" />
      </div>

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
      <div>
        <label class="font-semibold text-gray-700">내용</label>
        <Textarea v-model="localForm.plan" rows="4" readonly class="w-full bg-gray-100" />
      </div>

      <div v-if="localForm.file_names && localForm.file_names.length">
        <label class="font-semibold text-gray-700">업로드 PDF</label>
        <ul class="list-disc ml-5 text-sm text-gray-600">
          <li v-for="(file, idx) in localForm.file_names.split(',')" :key="idx">{{ file }}</li>
        </ul>
      </div>
      <div v-else class="text-sm text-gray-400">첨부 파일 없음</div>
    </div>
  </div>
</template>
