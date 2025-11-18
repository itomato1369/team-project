<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import SurveyDetailForm from './SurveyDetailForm.vue';

// PrimeVue 컴포넌트
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';

const props = defineProps({
  inquiryId: {
    type: [Number, String],
    required: true,
  },
});

const inquiryDetail = ref(null);
const questions = ref([]);
const loading = ref(true);
const error = ref(null);
const editMode = ref(false);
const existingSurvey = ref(null);
const modificationReason = ref('');
const surveyPurpose = ref('');
const surveyContent = ref('');

const fetchData = async (id) => {
  if (!id) return;
  
  loading.value = true;
  error.value = null;
  editMode.value = false; // Reset state
  existingSurvey.value = null;
  modificationReason.value = '';
  surveyPurpose.value = '';
  surveyContent.value = '';

  try {
    const response = await axios.get(`/api/user/user-inquiries/${id}`);
    inquiryDetail.value = response.data.result;
    if (!inquiryDetail.value) {
      throw new Error('Inquiry not found.');
    }
    inquiryDetail.value.inquiry_writer = 'test';

    const questionsResponse = await axios.get(`/api/user/user-inquiries/${id}/questions`);

    const surveyCheckResponse = await axios.post('/api/user/survey-by-inquiry-content', {
      inquiryName: inquiryDetail.value.inquiry_name,
    });

    let savedAnswersMap = new Map();

    if (surveyCheckResponse.data.result) {
      editMode.value = true;
      existingSurvey.value = surveyCheckResponse.data.result;
      modificationReason.value = existingSurvey.value.modify_reason || '';
      surveyPurpose.value = existingSurvey.value.purpose || '';
      surveyContent.value = existingSurvey.value.content || '';

      const savedAnswersResponse = await axios.get(`/api/user/survey-results/${existingSurvey.value.survey_no}`);
      savedAnswersResponse.data.result.forEach(answer => {
        savedAnswersMap.set(answer.business_no, answer.survey_answer);
      });
    }

    questions.value = questionsResponse.data.result.map((q) => ({
      id: q.question_no,
      text: q.question_content,
      answer: savedAnswersMap.get(q.question_no) || '',
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
};

watch(() => props.inquiryId, (newId) => {
  fetchData(newId);
}, { immediate: true });


const isSaveDisabled = computed(() => {
  const hasUnansweredRequiredQuestions = questions.value.some(q => q.is_required === 1 && (q.answer === null || q.answer.toString().trim() === ''));
  
  if (editMode.value) {
    return hasUnansweredRequiredQuestions || modificationReason.value.trim() === '';
  }
  
  return hasUnansweredRequiredQuestions;
});

const saveInquiry = async () => {
  try {
    const answersToSave = questions.value.map((q) => ({
      business_no: q.id,
      survey_answer: q.answer,
    }));

    const detailToSend = { ...inquiryDetail.value };
    detailToSend.writer = 'test';
    detailToSend.ward_no = 1;
    detailToSend.purpose = surveyPurpose.value;
    detailToSend.content = surveyContent.value;
    detailToSend.status = '접수';

    const saveData = {
      inquiryDetail: detailToSend,
      answers: answersToSave,
    };

    await axios.post('/api/user/user-inquiries/answer', saveData);
    alert('내용이 저장되었습니다.');
    fetchData(props.inquiryId);
  } catch (err) {
    console.error('저장에 실패했습니다:', err);
    alert('저장 중 오류가 발생했습니다.');
  }
};

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
      purpose: surveyPurpose.value,
      content: surveyContent.value,
    };

    await axios.put(`/api/user/survey-results/${existingSurvey.value.survey_no}`, updateData);
    alert('내용이 수정되었습니다.');
    fetchData(props.inquiryId);
  } catch (err) {
    console.error('수정에 실패했습니다:', err);
    alert('수정 중 오류가 발생했습니다.');
  }
};
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner />
    </div>

    <div v-else-if="error">
      <Card>
        <template #title>오류</template>
        <template #content>
          <p>{{ error }}</p>
        </template>
      </Card>
    </div>

    <div v-else-if="inquiryDetail">
      <SurveyDetailForm
        :inquiry-detail="inquiryDetail"
        :questions="questions"
        :edit-mode="editMode"
        v-model:modification-reason="modificationReason"
        v-model:survey-purpose="surveyPurpose"
        v-model:survey-content="surveyContent"
      />

      <div class="flex justify-end gap-2 mt-8">
        <Button v-if="!editMode" label="저장" @click="saveInquiry" :disabled="isSaveDisabled" />
        <Button v-if="editMode" label="수정" @click="updateInquiry" :disabled="isSaveDisabled" />
      </div>
    </div>
  </div>
</template>
