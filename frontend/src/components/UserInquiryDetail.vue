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
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const inquiryId = route.params.id;

const inquiryDetail = ref(null); // 문의 기본 정보를 담을 ref
const questions = ref([]); // 질문 목록을 담을 ref
const loading = ref(true);
const error = ref(null);
const editMode = ref(false); // 수정 모드 여부
const existingSurvey = ref(null); // 기존 survey 데이터
const modificationReason = ref(''); // 수정 사유
const surveyPurpose = ref(''); // 서베이 목적
const surveyContent = ref(''); // 서베이 내용

const selectedWardNo = ref(null);
const wards = ref([]);

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
    inquiryDetail.value.inquiry_writer = authStore.user.id;
    console.log('조회 해 온 조사지 상세정보:', inquiryDetail.value);

    // 2. 백엔드에서 질문 목록 가져오기
    const questionsResponse = await axios.get(`/api/user/user-inquiries/${inquiryId}/questions`);
    console.log('조사지의 질문 및 중요도 상세정보:', questionsResponse.data.result);

    // 3. 기존에 작성한 survey가 있는지 확인
    const surveyCheckResponse = await axios.post('/api/user/survey-by-inquiry-content', {
      inquiryNo: inquiryId,
    });

    // 4. 작성될 survey로 지원받을 피보호자 목록 조회
    const wardsResponse = await axios.get('/api/user/surveys/create', {
      params: {
        guardianId: authStore.user.id,
        inquiryNo: inquiryId
      }
    });
    const fetchedWards = wardsResponse.data.result;

    if (fetchedWards && fetchedWards.length > 0) {
      wards.value = fetchedWards;
    } else {
      wards.value = [{ name: '조회 대상이 없습니다.', ward_no: null }];
    }
    let savedAnswersMap = new Map();

    if (surveyCheckResponse.data.result) {
      // 3-1. 기존 survey가 있으면 수정 모드로 설정
      editMode.value = true;
      existingSurvey.value = surveyCheckResponse.data.result;
      modificationReason.value = existingSurvey.value.modify_reason || ''; // 기존 수정 사유 로드
      surveyPurpose.value = existingSurvey.value.purpose || ''; // 기존 목적 로드
      surveyContent.value = existingSurvey.value.content || ''; // 기존 내용 로드
      console.log('기존에 작성한 내용이 있습니다 (수정모드):', existingSurvey.value);

      // 3-2. 기존 답변들을 가져옴
      const savedAnswersResponse = await axios.get(
        `/api/user/survey-results/${existingSurvey.value.survey_no}`
      );
      savedAnswersResponse.data.result.forEach((answer) => {
        savedAnswersMap.set(answer.business_no, answer.survey_answer);
      });
      console.log('기존 답변 정보:', savedAnswersMap);
    }

    // 4. 질문 목록을 구성 (기존 답변이 있으면 채워넣음)
    questions.value = questionsResponse.data.result.map((q) => ({
      id: q.question_no,
      text: q.question_content,
      answer: savedAnswersMap.get(q.question_no) || '', // 기존 답변이 있으면 사용, 없으면 빈 문자열
      response_type: q.response_type,
      is_required: q.is_required,
      priority: q.priority,
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
  // 필수 질문에 답변이 비어있는지 확인
  const hasUnansweredRequiredQuestions = questions.value.some(
    (q) => q.is_required === 1 && (q.answer === null || q.answer.toString().trim() === '')
  );

  // 대상이 선택되지 않은 경우
  const isWardNotSelected = selectedWardNo.value === null;

  // 수정 모드일 경우, 수정 사유도 비어있는지 확인
  if (editMode.value) {
    return hasUnansweredRequiredQuestions || modificationReason.value.trim() === '' || isWardNotSelected;
  }

  return hasUnansweredRequiredQuestions || isWardNotSelected;
});

// priority를 기준으로 질문들을 그룹화하는 계산된 속성
const groupedQuestions = computed(() => {
  // questions 배열이 비어있으면 빈 객체 반환
  if (!questions.value || questions.value.length === 0) {
    return {};
  }

  // reduce 함수를 사용해 priority를 key로 하는 객체로 그룹화
  return questions.value.reduce((groups, question) => {
    const priority = question.priority || '기타'; // priority가 없는 경우 '기타'로 분류

    if (!groups[priority]) {
      groups[priority] = []; // 해당 priority 그룹이 없으면 새로 생성
    }

    groups[priority].push(question); // 현재 질문을 그룹에 추가
    return groups;
  }, {});
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
    detailToSend.writer = authStore.user.id;
    detailToSend.ward_no = selectedWardNo.value;
    detailToSend.purpose = surveyPurpose.value; // Add purpose from input
    detailToSend.content = surveyContent.value; // Add content from input
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

// 수정 버튼 클릭 시 함수
const updateInquiry = async () => {
  if (!existingSurvey.value) {
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
      purpose: surveyPurpose.value, // Add purpose
      content: surveyContent.value, // Add content
    };

    await axios.put(`/api/user/survey-results/${existingSurvey.value.survey_no}`, updateData);
    alert('내용이 수정되었습니다.');
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

      <!-- 목적 및 내용 입력 -->
      <Card>
        <template #title>
          <div class="font-semibold text-xl " > 조사 목적 및 내용  </div>
        </template>
        <template #content>
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-3" >
              <label>대상</label>
              <Dropdown
              v-model="selectedWardNo"
              :options="wards"
              optionLabel="name"
              optionValue="ward_no"
              placeholder="대상 선택"
              class="w-full md:w-56"
              />
            </div>
            <div class="flex flex-col gap-3">
              <label>목적</label>
              <InputText v-model="surveyPurpose" placeholder="조사 목적을 입력하세요..." />
            </div>
            
            <div class="flex flex-col gap-3">
              <label>내용</label>
              <Textarea v-model="surveyContent" rows="3" placeholder="조사 내용을 입력하세요..." />
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
          <!-- v-for를 이중으로 사용하여 그룹별로 렌더링 -->
          <div
            v-for="(questionGroup, priority) in groupedQuestions"
            :key="priority"
            class="flex flex-col gap-6 mb-8"
          >
            <!-- 그룹 제목 (예: 긴급, 중점) -->
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
                    'priority-plan': question.priority === '계획'
                  }"
                  class="priority-tag"
                >
                  {{ question.priority }}
                </span>
                <span v-if="question.is_required === 1" class="text-red-500 mr-1">[필수]</span>
                <span>질문 {{ index + 1 }}. {{ question.text }}</span>
              </label>
              <!-- 서술형 질문 -->
              <Textarea
                v-if="question.response_type === 1"
                :id="'question-' + question.id"
                v-model="question.answer"
                rows="4"
                placeholder="답변을 입력하세요..."
              />

              <!-- O/X 질문 -->
              <div v-else-if="question.response_type === 2" class="flex items-center gap-6">
                <div class="flex items-center">
                  <RadioButton
                    :inputId="'question-o-' + question.id"
                    :name="'question-' + question.id"
                    value="O"
                    v-model="question.answer"
                  />
                  <label :for="'question-o-' + question.id" class="ml-2">O</label>
                </div>
                <div class="flex items-center">
                  <RadioButton
                    :inputId="'question-x-' + question.id"
                    :name="'question-' + question.id"
                    value="X"
                    v-model="question.answer"
                  />
                  <label :for="'question-x-' + question.id" class="ml-2">X</label>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 수정 사유 (수정 모드에서만 보임) -->
      <Card v-if="editMode">
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
            />
          </div>
        </template>
      </Card>

      <!-- 액션 버튼 -->
      <div class="flex justify-end gap-2">
        <Button label="목록" severity="secondary" @click="goBackToList" />
        <Button v-if="!editMode" label="저장" @click="saveInquiry" :disabled="isSaveDisabled" />
        <Button v-if="editMode" label="수정" @click="updateInquiry" :disabled="isSaveDisabled" />
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
