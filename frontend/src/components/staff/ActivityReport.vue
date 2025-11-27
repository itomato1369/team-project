<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

const selected = ref('');
const selectedSupPlan = ref('');
watch(selected, (newValue, oldValue) => {
  selectedSupPlan.value = planOptions.value.find((opt) => opt.value === newValue).support_plan_no;
});

// 부모 컴포넌트로부터 wardId 받기
const props = defineProps({
  wardId: { type: [String, Number], required: true },
});

// 전역 고유 id 카운터
let formId = 0;

// 🔥 DB에서 불러온 승인된 사업명 목록
const planOptions = ref([]);

// 🔥 페이지 로딩 시 승인된 사업명 목록 가져오기
onMounted(async () => {
  if (!props.wardId) return;
  try {
    const res = await axios.get(`/api/staff/survey/${props.wardId}`);
    console.log('🔥 승인된 사업명 응답:', res.data);

    // res.data가 배열이면 바로 map
    planOptions.value = res.data.map((item) => ({
      label: item.business_name, // 화면 표시
      value: item.business_name, // 실제 선택값
      notice_no: item.notice_no, // INSERT용으로 필요
      support_plan_no: item.support_plan_no,
    }));
  } catch (err) {
    console.error('사업명 불러오기 실패:', err);
  }
});

// 폼 초기화
const createForm = () => ({
  id: formId++,
  supportTitle: '',
  supportSpend: '',
  supportContent: '',
  supportCategory: null, // 🔥 Dropdown에서 선택한 사업명
  supportNoticeNo: null, // 🔥 선택한 사업의 notice_no
  startedAt: null,
  endedAt: null,
});

// 폼 목록
const forms = ref([createForm()]);

// 금액 콤마 처리
const formatAmount = (form) => {
  const onlyNums = form.supportSpend.replace(/[^0-9]/g, '');
  form.supportSpend = onlyNums ? Number(onlyNums).toLocaleString() : '';
};

// 날짜 SQL 포맷
const formatDateToSQL = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} 00:00:00`;
};

// payload 생성
const makePayload = (form) => ({
  ward_no: Number(props.wardId),
  support_title: form.supportTitle || null,
  support_content: form.supportContent || null,
  support_spend: Number(form.supportSpend.replace(/[^0-9]/g, '')) || 0,

  // 🔥 Dropdown에서 선택한 사업명과 notice_no 포함
  support_category: form.supportCategory || null,
  //support_plan_no: form.support_plan_No || null,
  support_plan_no: selectedSupPlan.value || null,

  support_started_at: formatDateToSQL(form.startedAt) || null,
  support_ended_at: formatDateToSQL(form.endedAt) || null,
});

// 승인 요청
const requestApproval = async (form) => {
  if (!form.supportTitle) {
    alert('지원 제목은 필수입니다.');
    return;
  }

  if (!form.supportCategory || !selectedSupPlan.value) {
    alert('사업을 선택해주세요.');
    return;
  }

  try {
    const payload = makePayload(form);
    console.log('🔥 전송 payload:', payload); // 디버깅
    await axios.post('/api/staff/support-result', payload);
    alert('지원 결과가 저장되었습니다!');
    forms.value = [createForm()];
  } catch (err) {
    console.error('지원 결과 저장 실패:', err);
    alert('저장 실패! 콘솔을 확인하세요.');
  }
};

// 폼 삭제
const deleteForm = (id) => {
  forms.value = forms.value.filter((f) => f.id !== id);
};

// 폼 추가
const addForm = () => forms.value.push(createForm());
</script>

<template>
  <div class="md:1 p-4">
    <h1 class="text-3xl font-extrabold mb-8 text-gray-800 border-b-4 border-indigo-300 pb-2">
      📝 지원 결과 작성
    </h1>

    <div class="space-y-8">
      <div
        v-for="form in forms"
        :key="form.id"
        class="card flex flex-col gap-4 w-full border p-4 rounded-md shadow-sm mt-8"
      >
        <!-- 지원 제목 -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">지원 제목</label>
          <InputText v-model="form.supportTitle" class="w-full" />
        </div>

        <!-- 지원 금액 -->
        <div class="flex flex-col gap-2 w-full">
          <label class="font-medium text-gray-700">지원 금액</label>
          <InputText
            v-model="form.supportSpend"
            @input="formatAmount(form)"
            class="w-full text-right"
          />
        </div>

        <!-- 사업 카테고리 (Dropdown) -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">사업 카테고리</label>
          <Dropdown
            v-model="form.supportCategory"
            :options="planOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="사업을 선택하세요"
            class="w-full"
            @change="
              (e) => {
                // 선택된 사업의 notice_no를 함께 저장
                //const selected = planOptions.value.find((opt) => opt.value === e.value);
                //form.support_plan_No = selected ? selected.support_plan_no : null;
                selected = e.value;
              }
            "
          />
        </div>

        <!-- 시작일자 & 종료일자 -->
        <div class="flex flex-col md:flex-row gap-2">
          <div class="flex flex-col gap-2 w-full md:w-1/2">
            <label class="font-medium text-gray-700">시작 일자</label>
            <Calendar v-model="form.startedAt" dateFormat="yy/mm/dd" class="w-full" />
          </div>
          <div class="flex flex-col gap-2 w-full md:w-1/2">
            <label class="font-medium text-gray-700">종료 일자</label>
            <Calendar v-model="form.endedAt" dateFormat="yy/mm/dd" class="w-full" />
          </div>
        </div>

        <!-- 상세 내역 -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">상세 내역</label>
          <Textarea v-model="form.supportContent" rows="4" class="w-full" />
        </div>

        <!-- 버튼 -->
        <div class="flex justify-end gap-3 mt-4 border-t pt-4">
          <Button
            label="삭제"
            severity="danger"
            :disabled="forms.length === 1"
            @click="() => deleteForm(form.id)"
          />
          <Button label="승인요청" severity="success" @click="() => requestApproval(form)" />
        </div>
      </div>

      <!-- 폼 추가 -->
      <div class="flex justify-end mt-4">
        <Button label="추가" icon="pi pi-plus" severity="info" @click="addForm" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-calendar.p-component {
  width: 100%;
}
label {
  display: block;
  width: 100%;
}
</style>
