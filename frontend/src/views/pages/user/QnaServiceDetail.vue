<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/authStore';

import Toast from 'primevue/toast';
import Card from 'primevue/card';
import Fieldset from 'primevue/fieldset';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const question_id = route.params.question_no;
const question = ref(null);
const isLoading = ref(true);
const answerContent = ref('');

onMounted(async () => {
  try {
    const response = await axios.get(`/api/qna/question-detail/${question_id}`);
    question.value = response.data;
  } catch (error) {
    console.error('질문 상세 조회 실패:', error);
    toast.add({
      severity: 'error',
      summary: '알림',
      detail: '질문 상세 조회에 실패했습니다.',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
});

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function saveAnswer() {
  if (!answerContent.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: '알림',
      detail: '답변 내용을 입력하세요.',
      life: 3000,
    });
    return;
  }

  try {
    await axios.post(`/api/qna/answer`, {
      question_no: question_id, // 질문 번호
      content: answerContent.value, // 답변 내용
      writer: authStore.user.name, // 작성자 이름
      user_id: authStore.user.id, // 작성자 ID
    });

    toast.add({
      severity: 'success',
      summary: '알림',
      detail: '답변이 성공적으로 저장되었습니다.',
      life: 3000,
    });

    // 화면 업데이트
    question.value.answer_content = answerContent.value;
    question.value.answer_created_at = new Date();
    answerContent.value = '';
  } catch (err) {
    console.error(err);
    toast.add({
      severity: 'error',
      summary: '알림',
      detail: '답변 저장에 실패했습니다.',
      life: 3000,
    });
  }
}
</script>

<template>
  <Toast />
  <div class="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
    <Card class="rounded-xl shadow-2xl p-fluid">
      <template #title>
        <div class="flex items-center text-primary-600 dark:text-primary-400">
          <i class="pi pi-question-circle text-2xl mr-3"></i>
          <h2 class="text-2xl font-bold">질문 상세 정보</h2>
        </div>
      </template>

      <template #content>
        <div v-if="isLoading" class="flex flex-col items-center justify-center h-64">
          <ProgressSpinner />
          <span class="mt-3 text-lg text-gray-600">데이터 로딩 중...</span>
        </div>

        <div v-else-if="question" class="flex flex-col gap-6">
          <!-- 1. Question Metadata -->
          <Fieldset legend="기본 정보" :toggleable="false">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="font-semibold mb-1">제목</label>
                <div class="p-3 border rounded-lg bg-surface-50 shadow-sm text-lg font-medium">
                  {{ question.title }}
                </div>
              </div>
              <div class="flex flex-col">
                <label class="font-semibold mb-1">문의자</label>
                <div class="p-3 border rounded-lg bg-surface-50 shadow-sm">
                  {{ question.writer }}
                </div>
              </div>
              <div class="flex flex-col">
                <label class="font-semibold mb-1">질문일시</label>
                <div class="p-3 border rounded-lg bg-surface-50 shadow-sm">
                  {{ formatDate(question.created_at) }}
                </div>
              </div>
              <div class="flex flex-col">
                <label class="font-semibold mb-1">답변일시</label>
                <div
                  class="p-3 border rounded-lg shadow-sm"
                  :class="
                    question.answer_created_at
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-orange-100 text-orange-800 border-orange-300'
                  "
                >
                  {{ formatDate(question.answer_created_at) || '미답변' }}
                </div>
              </div>
            </div>
          </Fieldset>

          <!-- 2. Question Content -->
          <Panel header="질문 내용" class="mt-4 shadow-md">
            <div
              class="whitespace-pre-wrap text-base p-4 bg-surface-50 border rounded-lg min-h-[100px]"
            >
              {{ question.content }}
            </div>
          </Panel>

          <!-- 3. Answer Content -->
          <Panel header="답변 내용" class="mt-4 shadow-md">
            <!-- 답변이 이미 있는 경우 -->
            <div
              v-if="question.answer_content"
              class="whitespace-pre-wrap text-base p-4 bg-blue-50 border rounded-lg min-h-[100px]"
            >
              {{ question.answer_content }}
            </div>

            <!-- staff/admin 답변 작성 UI -->
            <div v-else-if="['2a', '3a'].includes(authStore.user.role)">
              <Fieldset legend="답변 작성">
                <textarea
                  v-model="answerContent"
                  class="p-inputtextarea w-full h-32"
                  placeholder="여기에 답변을 작성하세요."
                ></textarea>
                <Button label="답변 저장" icon="pi pi-check" class="mt-2" @click="saveAnswer" />
              </Fieldset>
            </div>

            <!-- 일반 사용자용 미답변 메시지 -->
            <div
              v-else
              class="text-gray-500 italic p-4 bg-surface-50 border rounded-lg min-h-[100px] flex items-center justify-center"
            >
              <i class="pi pi-info-circle mr-2"></i>
              아직 답변이 등록되지 않았습니다. 관리자의 답변을 기다려 주세요.
            </div>
          </Panel>

          <!-- 4. Back Button -->
          <div class="flex justify-end pt-4">
            <Button
              label="목록으로 돌아가기"
              icon="pi pi-arrow-left"
              severity="secondary"
              class="p-button-sm p-button-outlined rounded-full"
              @click="router.push('/qna')"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* 필요 시 추가 스타일링 가능 */
</style>
