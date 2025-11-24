<script setup>
import { ref } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';

// 전역 고유 id 카운터
let formId = 0;

// 폼 초기화
const createForm = () => ({
  id: formId++,
  supportTitle: '',
  supportSpend: '',
  supportContent: '',
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

// 백엔드에게 전달할 payload 생성
const makePayload = (form) => ({
  support_title: form.supportTitle,
  support_content: form.supportContent || null,
  support_spend: Number(form.supportSpend.replace(/[^0-9]/g, '')) || 0,
  support_started_at: formatDateToSQL(form.startedAt),
  support_ended_at: formatDateToSQL(form.endedAt),
});

// SQL 테스트 출력
const generateSQL = (form) => {
  const spend = Number(form.supportSpend.replace(/[^0-9]/g, '')) || 0;
  const started = formatDateToSQL(form.startedAt);
  const ended = formatDateToSQL(form.endedAt);

  return `
INSERT INTO support_result (
  support_title,
  support_content,
  support_spend,
  support_started_at,
  support_ended_at
) VALUES (
  '${form.supportTitle}',
  ${form.supportContent ? `'${form.supportContent}'` : 'NULL'},
  ${spend},
  '${started}',
  '${ended}'
);`;
};

// 임시저장(콘솔만)
const saveTemp = (form) => {
  console.log('==== 임시저장 SQL ====');
  console.log(generateSQL(form));
};

// 승인요청(DB 저장)
const requestApproval = async (form) => {
  console.log('==== 승인요청 SQL ====');
  console.log(generateSQL(form));

  if (!form.supportTitle) {
    alert('지원 제목은 필수입니다.');
    return;
  }

  try {
    const payload = makePayload(form);
    await axios.post('/api/staff/support-result', payload);
    alert('지원 결과가 저장되었습니다!');
  } catch (err) {
    console.error(err);
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
