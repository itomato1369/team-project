<script setup>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
const authStore = useAuthStore(); // authStore 인스턴스 생성
const staffName = computed(() => authStore.user?.name);

// ⭐ 부모로부터 받은 wardId (ward_no)
const props = defineProps({
  wardId: {
    type: [String, Number],
    required: false, // optional로 변경
  },
});

// 전역 고유 id 카운터
let formId = 0;

// 폼 초기화 함수
const createForm = () => ({
  id: formId++,
  writer: '',
  staff: '', // 담당자
  dropdownItem: null, // 사업선택
  amount: '', // 금액
  plan: '', // 내용
  selectedFiles: [], // pdf파일
  priority: null, // 우선순위
});

// 폼 배열
const forms = ref([createForm()]);

// 드롭다운 항목
const dropdownItems = ref([
  { name: '1번 사업', code: 'Option 1' },
  { name: '2번 사업', code: 'Option 2' },
  { name: '3번 사업', code: 'Option 3' },
  { name: '4번 사업', code: 'Option 4' },
  { name: '5번 사업', code: 'Option 5' },
  { name: '6번 사업', code: 'Option 6' },
]);

// 금액 3자리 콤마
const formatAmount = (form) => {
  const onlyNums = form.amount.replace(/[^0-9]/g, '');
  form.amount = onlyNums ? Number(onlyNums).toLocaleString() : '';
};

// 파일 선택
const handleFiles = (event, form) => {
  form.selectedFiles = Array.from(event.target.files);
};

// ⭐ 승인요청 (ward_no 포함)
const requestApproval = async (form) => {
  if (!form.writer || !form.dropdownItem || !form.plan) {
    alert('필수 항목(목표, 사업, 내용)을 모두 입력해주세요.');
    return;
  }

  if (!props.wardId) {
    alert('피보호자 정보가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
    return;
  }

  try {
    const payload = {
      ward_no: Number(props.wardId), // 필수
      support_plan_goal: form.writer, // 폼 입력
      plan: form.plan, // 폼 입력
      business_name: form.dropdownItem?.name || null, // 선택값
      spend: parseInt(form.amount.replace(/,/g, '')) || 0, // 입력
      file_no: '1',
      support_plan_status: '승인대기', // 고정
      staff_name: staffName.value,
    };

    console.log('payload:', payload);

    await axios.post('/api/staff/support-plan', payload);

    alert(`폼 ${form.id} 승인요청 완료!`);
    forms.value = [createForm()];
  } catch (err) {
    console.error('승인요청 오류:', err.response?.data || err);
    alert('승인요청 실패. 서버 로그를 확인하세요.');
  }
};

const saveTemp = (form) => alert(`폼 ${form.id} 임시저장 완료!`);

const deleteForm = (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    forms.value = forms.value.filter((f) => f.id !== id);
  }
};

const addForm = () => forms.value.push(createForm());
</script>

<template>
  <div class="md:1">
    <h1 class="text-3xl font-extrabold mb-8 text-gray-800 border-b-4 border-indigo-300 pb-2">
      📝 지원 계획 작성
    </h1>
    <Fluid>
      <div v-for="form in forms" :key="form.id" class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full border p-4 rounded-md shadow-sm">
          <!-- 목표 -->
          <div class="flex flex-col md:flex-row gap-2 mt-2">
            <div class="flex flex-wrap gap-2 w-full">
              <label>목표</label>
              <InputText v-model="form.writer" type="text" />
            </div>
          </div>

          <!-- 지원계획 / 금액 -->
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-wrap gap-2 w-full">
              <label>지원계획</label>
              <Select
                v-model="form.dropdownItem"
                :options="dropdownItems"
                optionLabel="name"
                placeholder="Select One"
                class="w-full"
              />
              <label>예상지원금액</label>
              <InputText
                v-model="form.amount"
                type="text"
                class="text-right"
                placeholder="예: 50,000"
                @input="formatAmount(form)"
              />
            </div>
          </div>

          <!-- 내용 -->
          <div class="flex flex-wrap">
            <label>내용</label>
            <Textarea v-model="form.plan" rows="4" />
          </div>

          <!-- 버튼 -->
          <div class="flex justify-end gap-3 mt-6 border-t pt-4">
            <Button
              label="삭제"
              icon="pi pi-trash"
              severity="danger"
              @click="() => deleteForm(form.id)"
            />
            <Button
              label="승인요청"
              icon="pi pi-send"
              severity="success"
              @click="() => requestApproval(form)"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-4">
        <Button label="추가" icon="pi pi-plus" severity="info" @click="addForm" />
      </div>
    </Fluid>
  </div>
</template>
