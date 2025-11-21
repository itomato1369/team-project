<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { useToast } from 'primevue/usetoast';

// PrimeVue Component Imports for <template>
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import Fieldset from 'primevue/fieldset';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner'; // For loading state

const toast = useToast(); // PrimeVue Toast Hook
const app = createApp();
// Note: Initializing PrimeVue within a component file is often unnecessary
// if it's initialized globally, but kept for compatibility with the original script structure.
app.use(PrimeVue);
app.use(ToastService);
const router = useRouter();
const route = useRoute();

const question_id = route.params.question_no;
const question = ref(null);
const isLoading = ref(true);

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
    // router.push('/qna'); // 실패 시 목록으로 이동
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
</script>

<template>
  <Toast />
  <!-- Center the content on larger screens and add responsive padding -->
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
          <!-- 1. Question Metadata (Fieldset) -->
          <Fieldset legend="기본 정보" :toggleable="false">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Title -->
              <div class="flex flex-col">
                <label class="font-semibold text-surface-600 dark:text-surface-400 mb-1"
                  >제목</label
                >
                <div
                  class="p-3 border rounded-lg bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 shadow-sm text-lg font-medium"
                >
                  {{ question.title }}
                </div>
              </div>

              <!-- Writer -->
              <div class="flex flex-col">
                <label class="font-semibold text-surface-600 dark:text-surface-400 mb-1"
                  >문의자</label
                >
                <div
                  class="p-3 border rounded-lg bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 shadow-sm"
                >
                  {{ question.writer }}
                </div>
              </div>

              <!-- Question Date -->
              <div class="flex flex-col">
                <label class="font-semibold text-surface-600 dark:text-surface-400 mb-1"
                  >질문일시</label
                >
                <div
                  class="p-3 border rounded-lg bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 shadow-sm"
                >
                  {{ formatDate(question.created_at) }}
                </div>
              </div>

              <!-- Answer Date -->
              <div class="flex flex-col">
                <label class="font-semibold text-surface-600 dark:text-surface-400 mb-1"
                  >답변일시</label
                >
                <div
                  class="p-3 border rounded-lg shadow-sm"
                  :class="
                    question.answer_created_at
                      ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                      : 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700'
                  "
                >
                  {{ formatDate(question.answer_created_at) || '미답변' }}
                </div>
              </div>
            </div>
          </Fieldset>

          <!-- 2. Question Content (Panel) -->
          <Panel header="질문 내용" class="mt-4 shadow-md">
            <div
              class="whitespace-pre-wrap text-base p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg min-h-[100px]"
            >
              {{ question.content }}
            </div>
          </Panel>

          <!-- 3. Answer Content (Panel) -->
          <Panel
            header="답변 내용"
            class="mt-4 shadow-md"
            :class="question.answer_content ? 'border-primary-500' : 'border-surface-300'"
          >
            <div
              v-if="question.answer_content"
              class="whitespace-pre-wrap text-base p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg min-h-[100px]"
            >
              {{ question.answer_content }}
            </div>
            <div
              v-else
              class="text-gray-500 italic p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg min-h-[100px] flex items-center justify-center"
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
/*
  PrimeVue uses Tailwind CSS utility classes heavily, 
  making custom CSS mostly unnecessary unless complex overrides are needed.
  The p-fluid class on the Card ensures forms/elements inside take full width.
*/
</style>
