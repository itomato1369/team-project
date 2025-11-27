<script setup>
import { ref, computed, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
const authStore = useAuthStore();
const staffName = computed(() => authStore.user?.name);

// ⭐ 부모로부터 받은 wardId (ward_no)
const props = defineProps({
  wardId: {
    type: [String, Number],
    required: false,
  },
});

// 폼 생성
let formId = 0;
const createForm = () => ({
  id: formId++,
  writer: '',
  staff: '',
  dropdownItem: null,
  amount: '',
  plan: '',
  selectedFiles: [],
  priority: null,
});

const forms = ref([createForm()]);

// ⭐ 사업 목록 (notice)
const dropdownItems = ref([]);

const fetchBusinessNames = async () => {
  try {
    const res = await axios.get('/api/staff/ApplicationPlanForm'); // ✅ URL 수정
    const list = res.data?.result || [];

    dropdownItems.value = list
      .filter((n) => n.business_name)
      .map((n) => ({
        name: n.business_name,
        code: n.notice_no,
      }));

    console.log('사업명 드롭다운 로딩 완료:', dropdownItems.value);
  } catch (err) {
    console.error('사업명 불러오기 실패:', err);
  }
};

// 금액 입력 포맷팅
const formatAmount = (form) => {
  const onlyNums = form.amount.replace(/[^0-9]/g, '');
  form.amount = onlyNums ? Number(onlyNums).toLocaleString() : '';
};

// 파일 선택 (현재 미사용)
const handleFiles = (event, form) => {
  form.selectedFiles = Array.from(event.target.files);
};

// ⭐ 승인요청 API
const requestApproval = async (form) => {
  if (!form.writer || !form.dropdownItem || !form.plan) {
    alert('필수 항목(목표, 사업, 내용)을 모두 입력해주세요.');
    return;
  }

  if (!props.wardId) {
    alert('피보호자 정보가 아직 준비되지 않았습니다.');
    return;
  }

  try {
    const payload = {
      ward_no: Number(props.wardId),
      notice_no: form.dropdownItem?.code,
      support_plan_goal: form.writer,
      plan: form.plan,
      business_name: form.dropdownItem?.name || null,
      spend: parseInt(form.amount.replace(/,/g, '')) || 0,
      file_no: null, // 필요 시 변경
      support_plan_status: '승인대기',
      staff_name: staffName.value,
      priority_no: form.priority || 1, // ⭐ DB에 필요한 priority_no 추가
    };

    console.log('payload:', payload);

    await axios.post('/api/staff/support-plan', payload);

    alert(`폼 ${form.id} 승인요청 완료!`);
    forms.value = [createForm()]; // 초기화
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

onMounted(() => {
  fetchBusinessNames();
});
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
            <Textarea
              v-model="form.plan"
              rows="12"
              placeholder="예시) 피보호자 및 보호자 이름 ,  우선순위 , 지원내용 , 중점 항목 등 작성"
            />
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
