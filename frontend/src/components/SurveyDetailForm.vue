<script setup>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Textarea from 'primevue/textarea';

defineProps({
  inquiryDetail: { type: Object, required: true },
  questions: { type: Array, required: true },
  editMode: { type: Boolean, default: false },
  modificationReason: { type: String, required: true },
  surveyPurpose: { type: String, required: true },
  surveyContent: { type: String, required: true },
});

defineEmits(['update:modificationReason', 'update:surveyPurpose', 'update:surveyContent']);
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 기본 정보 (입력 불가) -->
    <Card>
      <template #title>
        <div class="font-semibold text-xl">조사지 기본 정보</div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-3">
            <label>조사지명</label>
            <InputText type="text" :value="inquiryDetail.inquiry_name" disabled />
          </div>
          <div class="flex flex-col gap-3">
            <label>사업명</label>
            <InputText type="text" :value="inquiryDetail.business_name || '문의조사'" disabled />
          </div>
          <div class="flex flex-col gap-3">
            <label>작성자</label>
            <InputText type="text" :value="inquiryDetail.inquiry_writer" disabled />
          </div>
          <div class="flex flex-col gap-3">
            <label>작성일</label>
            <InputText type="text" :value="inquiryDetail.created_at" disabled />
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
            <label>목적</label>
            <InputText
              :value="surveyPurpose"
              @update:modelValue="$emit('update:surveyPurpose', $event)"
              placeholder="조사 목적을 입력하세요..."
            />
          </div>
          <div class="flex flex-col gap-3">
            <label>내용</label>
            <Textarea
              :model-value="surveyContent"
              @update:modelValue="$emit('update:surveyContent', $event)"
              rows="3"
              placeholder="조사 내용을 입력하세요..."
            />
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

    <!-- 수정 사유 (수정 모드에서만 보임) -->
    <Card v-if="editMode">
      <template #title>
        <div class="font-semibold text-xl">수정 사유</div>
      </template>
      <template #content>
        <div class="flex flex-col gap-3">
          <Textarea
            :model-value="modificationReason"
            @update:modelValue="$emit('update:modificationReason', $event)"
            rows="3"
            placeholder="수정 사유를 입력하세요..."
            class="w-full"
          />
        </div>
      </template>
    </Card>
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
</style>
