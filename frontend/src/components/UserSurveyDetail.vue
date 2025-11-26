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

// 상태 변수 정의
const surveyDetail = ref(null);
const questions = ref([]);
const loading = ref(true);
const error = ref(null);
const modificationReason = ref('');
const surveyPurpose = ref('');
const surveyContent = ref('');
const planStatus = ref(null); // support_plan의 상태

// 읽기 전용 상태를 결정하는 계산된 속성
const isReadOnly = computed(() => {
  // plan_status가 null, undefined, '' 이면 support_plan이 없는 것이므로 수정 가능 (false 반환)
  if (!planStatus.value) {
    return false;
  }
  // plan_status가 존재할 경우, '검토중' 또는 '1f'가 아니면 수정 불가능 (true 반환)
  return planStatus.value !== '검토중' && planStatus.value !== '1f';
});

// 컴포넌트 마운트 시 실행될 로직
onMounted(async () => {
  const surveyNo = route.params.survey_no;
  if (!surveyNo) {
    error.value = '유효하지 않은 접근입니다. 조사지 번호가 없습니다.';
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(`/api/user/survey-detail/${surveyNo}`);
    const { surveyData, questionsData } = response.data.result;

    // 상태 변수 설정
    planStatus.value = surveyData.plan_status; // plan_status 설정
    surveyDetail.value = {
      inquiryName: surveyData.inquiry_name,
      businessName: surveyData.business_name,
      writer: surveyData.writer,
      createdAt: surveyData.created_at,
      wardName: surveyData.ward_name,
    };
    surveyPurpose.value = surveyData.purpose || '';
    surveyContent.value = surveyData.content || '';
    modificationReason.value = surveyData.modify_reason || '';

    questions.value = questionsData.map((q) => ({
      id: q.business_no,
      text: q.question_content,
      answer: q.survey_answer || '',
      response_type: q.response_type,
      is_required: q.is_required,
      priority: q.priority,
    }));
  } catch (err) {
    console.error('조사지 정보를 불러오는 데 실패했습니다:', err);
    error.value = '조사지 정보를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});

// 저장 버튼 활성화 여부
const isSaveDisabled = computed(() => {
  if (isReadOnly.value) return true; // 읽기 전용이면 항상 비활성화

  const hasUnansweredRequiredQuestions = questions.value.some(
    (q) => q.is_required === 1 && (q.answer === null || q.answer.toString().trim() === '')
  );
  return hasUnansweredRequiredQuestions || modificationReason.value.trim() === '';
});

// 질문 그룹화
const groupedQuestions = computed(() => {
  if (!questions.value || questions.value.length === 0) return {};
  return questions.value.reduce((groups, question) => {
    const priority = question.priority || '기타';
    if (!groups[priority]) groups[priority] = [];
    groups[priority].push(question);
    return groups;
  }, {});
});

// 수정 사항 저장
const updateSurvey = async () => {
  const surveyNo = route.params.survey_no;
  if (!surveyNo) {
    alert('오류: 수정할 설문 정보가 없습니다.');
    return;
  }

  try {
    const answersToSave = questions.value.map((q) => ({
      business_no: q.id,
      survey_answer: q.answer,
    }));

    const updateData = {
      answers: answersToSave,
      modificationReason: modificationReason.value,
      purpose: surveyPurpose.value,
      content: surveyContent.value,
    };

    await axios.put(`/api/user/survey-results/${surveyNo}`, updateData);
    alert('내용이 수정되었습니다.');
    router.push({ name: 'umy' }); // 수정 후 마이페이지로 이동
  } catch (err) {
    console.error('수정에 실패했습니다:', err);
    alert('수정 중 오류가 발생했습니다.');
  }
};

// 목록으로 돌아가기
const goBackToList = () => {
  router.go(-1);
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
    <div v-else-if="surveyDetail" class="flex flex-col gap-8">
      <!-- 기본 정보 (입력 불가) -->
      <Card>
        <template #title>
          <div class="font-semibold text-xl">조사지 기본 정보</div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-3">
              <label>조사지명</label>
              <InputText type="text" :value="surveyDetail.inquiryName" disabled />
            </div>
            <div class="flex flex-col gap-3">
              <label>사업명</label>
              <InputText type="text" :value="surveyDetail.businessName" disabled />
            </div>
            <div class="flex flex-col gap-3">
              <label>작성자</label>
              <InputText type="text" :value="surveyDetail.writer" disabled />
            </div>
            <div class="flex flex-col gap-3">
              <label>작성일</label>
              <InputText type="text" :value="surveyDetail.createdAt" disabled />
            </div>
          </div>
        </template>
      </Card>

      <!-- 목적 및 내용 입력 -->
      <Card>
        <template #title>
          <div class="font-semibold text-xl">조사 목적 및 내용</div>
        </template>
        <template #content>
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-3">
              <label>대상자</label>
              <InputText type="text" :value="surveyDetail.wardName" disabled />
            </div>
            <div class="flex flex-col gap-3">
              <label>목적</label>
              <InputText v-model="surveyPurpose" placeholder="조사 목적을 입력하세요..." :disabled="isReadOnly" />
            </div>
            <div class="flex flex-col gap-3">
              <label>내용</label>
              <Textarea v-model="surveyContent" rows="3" placeholder="조사 내용을 입력하세요..." :disabled="isReadOnly" />
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
          <div
            v-for="(questionGroup, priority) in groupedQuestions"
            :key="priority"
            class="flex flex-col gap-6 mb-8"
          >
            <h3 class="text-lg font-bold text-gray-700 border-b pb-2">{{ priority }} 항목</h3>
            <div
              v-for="(question, index) in questionGroup"
              :key="question.id"
              class="flex flex-col gap-3"
            >
              <label :for="'question-' + question.id" class="font-medium flex items-center">
                <span
                  v-if="question.priority"
                  :class="{
                    'priority-urgent': question.priority === '긴급',
                    'priority-important': question.priority === '중점',
                    'priority-plan': question.priority === '계획',
                  }"
                  class="priority-tag"
                >
                  {{ question.priority }}
                </span>
                <span v-if="question.is_required === 1" class="text-red-500 mr-1">[필수]</span>
                <span>질문 {{ index + 1 }}. {{ question.text }}</span>
              </label>
              <Textarea
                v-if="question.response_type === 1"
                :id="'question-' + question.id"
                v-model="question.answer"
                rows="4"
                placeholder="답변을 입력하세요..."
                :disabled="isReadOnly"
              />
              <div v-else-if="question.response_type === 2" class="flex items-center gap-6">
                <div class="flex items-center">
                  <RadioButton
                    :inputId="'question-o-' + question.id"
                    :name="'question-' + question.id"
                    value="O"
                    v-model="question.answer"
                    :disabled="isReadOnly"
                  />
                  <label :for="'question-o-' + question.id" class="ml-2">O</label>
                </div>
                <div class="flex items-center">
                  <RadioButton
                    :inputId="'question-x-' + question.id"
                    :name="'question-' + question.id"
                    value="X"
                    v-model="question.answer"
                    :disabled="isReadOnly"
                  />
                  <label :for="'question-x-' + question.id" class="ml-2">X</label>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 수정 사유 -->
      <Card>
        <template #title>
          <div class="font-semibold text-xl">수정 사유</div>
        </template>
        <template #content>
          <div class="flex flex-col gap-3">
            <Textarea
              v-model="modificationReason"
              rows="3"
              placeholder="수정 사유를 입력하세요..."
              class="w-full"
              :disabled="isReadOnly"
            />
          </div>
        </template>
      </Card>

      <!-- 액션 버튼 -->
      <div class="flex justify-end gap-2">
        <Button label="목록" severity="secondary" @click="goBackToList" />
        <Button label="수정" @click="updateSurvey" :disabled="isSaveDisabled" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.priority-tag {
  margin-left: -0.75rem; /* 왼쪽으로 돌출 효과 */
  margin-right: 0.5rem; /* mr-2 */
  padding: 0.2rem 0.6rem; /* 폰트 크기에 맞춰 패딩 조정 */
  border-radius: 0.375rem; /* rounded-md */
  font-size: 0.95rem; /* 기존보다 약 1.2배 크게 */
  font-weight: 600; /* font-semibold */
  flex-shrink: 0; /* 태그 크기가 줄어들지 않도록 설정 */
}
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
