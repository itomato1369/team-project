<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// PrimeVue 컴포넌트
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

const route = useRoute();
const router = useRouter();
const inquiryId = route.params.id;

const inquiryDetail = ref(null); // 문의 기본 정보를 담을 ref
const questions = ref([]); // 질문 목록을 담을 ref
const loading = ref(true);
const error = ref(null);

// 컴포넌트가 마운트될 때 실행
onMounted(async () => {
  if (!inquiryId) {
    error.value = '유효하지 않은 접근입니다. ID가 없습니다.';
    loading.value = false;
    return;
  }

  try {
    // 1. 백엔드에서 조사지 상세 정보 가져오기
    const response = await axios.get(`/api/user/user-inquiries/${inquiryId}`);
    inquiryDetail.value = response.data.result;
    inquiryDetail.value.inquiry_writer = 'test';
    console.log('조회 해 온 조사지 상세정보:', inquiryDetail.value);

    // 2. 백엔드에서 질문 목록 가져오기
    const questionsResponse = await axios.get(`/api/user/user-inquiries/${inquiryId}/questions`);
    console.log('조사지의 질문 및 중요도 상세정보:', questionsResponse.data.result);

    questions.value = questionsResponse.data.result.map((q) => ({
      id: q.question_no,
      text: q.question_content,
      answer: '',
      response_type: q.response_type,
      is_required: q.is_required,
    }));
  } catch (err) {
    console.error('데이터를 불러오는 데 실패했습니다:', err);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});

// 저장 버튼 활성화 여부를 결정하는 계산된 속성
const isSaveDisabled = computed(() => {
  // questions 배열에서 is_required가 1이고, answer가 비어있는 질문이 하나라도 있는지 확인
  return questions.value.some(
    (q) => q.is_required === 1 && (q.answer === null || q.answer.toString().trim() === '')
  );
});

// 저장 버튼 클릭 시 함수
const saveInquiry = async () => {
  try {
    const answersToSave = questions.value.map((q) => ({
      business_no: q.id,
      survey_answer: q.answer,
    }));

    // Populate default/hardcoded values before sending
    const detailToSend = { ...inquiryDetail.value };
    detailToSend.writer = 'test';
    detailToSend.ward_no = 1;
    detailToSend.purpose = '조사지 답변 저장';
    detailToSend.status = '접수';

    const saveData = {
      inquiryDetail: detailToSend,
      answers: answersToSave,
    };

    console.log('Payload to be sent:', saveData);

    await axios.post('/api/user/user-inquiries/answer', saveData);
    alert('내용이 저장되었습니다.');
  } catch (err) {
    console.error('저장에 실패했습니다:', err);
    alert('저장 중 오류가 발생했습니다.');
  }
};

// 목록으로 돌아가기
const goBackToList = () => {
  router.push({ name: 'ui' }); // 'ui'는 UserInquiry 목록 페이지의 라우트 이름
};
</script>

<template>
  <div>
    <!-- 로딩 중일 때 스피너 표시 -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner />
    </div>

    <!-- 에러 발생 시 메시지 표시 -->
    <div v-else-if="error">
      <Card>
        <template #title>오류</template>
        <template #content>
          <p>{{ error }}</p>
          <Button label="목록으로 돌아가기" @click="goBackToList" class="mt-4" />
        </template>
      </Card>
    </div>

    <!-- 데이터 로딩 성공 시 -->
    <div v-else-if="inquiryDetail" class="flex flex-col gap-8">
      <!-- 기본 정보 (입력 불가) -->
      <Card>
        <template #title>
          <div class="font-semibold text-xl">조사지 기본 정보</div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-3">
              <label>조사지명</label>
              <InputText type="text" v-model="inquiryDetail.inquiry_name" disabled />
            </div>
            <div class="flex flex-col gap-3">
              <label>사업명</label>
              <InputText type="text" :value="inquiryDetail.business_name || '문의조사'" disabled />
            </div>
            <div class="flex flex-col gap-3">
              <label>작성자</label>
              <InputText type="text" v-model="inquiryDetail.inquiry_writer" disabled />
            </div>
            <div class="flex flex-col gap-3">
              <label>작성일</label>
              <InputText type="text" v-model="inquiryDetail.created_at" disabled />
            </div>
          </div>
        </template>
      </Card>

      <!-- 질문 목록 (입력 가능) -->
      <Card>
        <template #title>
          <div class="font-semibold text-xl">질문 및 답변</div>
        </template>
        <template #content>
          <div class="flex flex-col gap-6">
            <div
              v-for="(question, index) in questions"
              :key="question.id"
              class="flex flex-col gap-3"
            >
              <label :for="'question-' + index" class="font-medium">
                질문 {{ index + 1 }}. {{ question.text }}
                <span
                  v-if="question.priority"
                  :class="{
                    'priority-urgent': question.priority === '긴급',
                    'priority-important': question.priority === '중점',
                    'priority-plan': question.priority === '계획',
                  }"
                  class="ml-2 px-2 py-1 rounded-md text-xs font-semibold"
                >
                  {{ question.priority }}
                </span>
              </label>
              <!-- 서술형 질문 (response_type: 1) -->
              <Textarea
                v-if="question.response_type === 1"
                :id="'question-' + index"
                v-model="question.answer"
                rows="4"
                placeholder="답변을 입력하세요..."
              />

              <!-- O/X 질문 (response_type: 2) -->
              <div v-else-if="question.response_type === 2" class="flex items-center gap-6">
                <div class="flex items-center">
                  <RadioButton
                    :inputId="'question-o-' + index"
                    :name="'question-' + index"
                    value="O"
                    v-model="question.answer"
                  />
                  <label :for="'question-o-' + index" class="ml-2">O</label>
                </div>
                <div class="flex items-center">
                  <RadioButton
                    :inputId="'question-x-' + index"
                    :name="'question-' + index"
                    value="X"
                    v-model="question.answer"
                  />
                  <label :for="'question-x-' + index" class="ml-2">X</label>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 액션 버튼 -->
      <div class="flex justify-end gap-2">
        <Button label="목록" severity="secondary" @click="goBackToList" />
        <Button label="저장" @click="saveInquiry" :disabled="isSaveDisabled" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.priority-urgent {
  background-color: #ef4444; /* red-500 */
  color: white;
}
.priority-important {
  background-color: #3b82f6; /* blue-500 */
  color: white;
}
.priority-plan {
  background-color: #22c55e; /* green-500 */
  color: white;
}

/* 읽기 전용 InputText 스타일 */
:deep(.p-inputtext:disabled) {
  opacity: 0.7;
  background-color: #f9fafb;
}
</style>
