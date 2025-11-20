<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { useToast } from 'primevue/usetoast';

const toast = useToast(); // <-- toast 변수 정의
const app = createApp();
app.use(PrimeVue);
app.use(ToastService);
const router = useRouter();
const route = useRoute();

const question_id = route.params.id;
const question = ref(null);

onMounted(async () => {
  try {
    const questionId = req.params.question_no;
    const response = await axios.get(`/api/qna/${question_id}`);
    question.value = response.data;
  } catch (error) {
    console.error('질문 상세 조회 실패:', error);
    toast.add({ severity: 'error', summary: '알림', detail: '질문 상세 조회 실패' });
    router.push('/qna'); // 실패 시 목록으로 이동
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
  <div class="card p-6 flex flex-col gap-4">
    <h2 class="text-2xl font-bold mb-4">질문 상세</h2>

    <div v-if="question">
      <div class="flex flex-col gap-2">
        <span><strong>제목:</strong> {{ question.title }}</span>
        <span><strong>문의자:</strong> {{ question.writer }}</span>
        <span><strong>질문일시:</strong> {{ formatDate(question.created_at) }}</span>
        <span><strong>답변일시:</strong> {{ formatDate(question.answer_created_at) || '-' }}</span>
        <span><strong>질문 내용:</strong></span>
        <div class="p-2 border rounded bg-gray-50">{{ question.content }}</div>
        <span><strong>답변 내용:</strong></span>
        <div class="p-2 border rounded bg-gray-50">{{ question.answer_content || '-' }}</div>
      </div>

      <div class="mt-4">
        <button
          class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          @click="router.push('/qna')"
        >
          목록으로
        </button>
      </div>
    </div>

    <div v-else>Loading...</div>
  </div>
</template>

<style scoped>
/* 필요 시 스타일 커스터마이징 가능 */
</style>
