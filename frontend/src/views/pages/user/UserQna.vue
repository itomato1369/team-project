<script setup>
// 1. [삭제] CustomerService import 제거
// import { CustomerService } from '@/service/system_service/Institution';

import { QnaService } from '@/service/QnaService';

import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';
import axios from 'axios'; // 👈 2. [추가] axios import

const router = useRouter();
const qna1 = ref([]);

const loading1 = ref(true); // 로딩 초기값 true로 설정

const qnalist = ref([]);

onMounted(async () => {
  QnaService.getQnaService().then((data) => (qnalist.value = data));

  // 👇 3. [수정] 백엔드 API 호출 로직으로 변경
  try {
    // 백엔드 서버 주소 (포트 3000 확인 필요)

    const response = await axios.get('/api/qna');

    const dbData = response.data;

    // 4. [중요] DB 데이터(inquiry 테이블)를 프론트엔드 테이블 구조에 맞게 변환
    qna1.value = dbData.map((item, index) => {
      // 1️⃣ 안전한 날짜 변환 함수
      const parseDate = (value) => {
        if (!value) return null; // null 또는 undefined면 그냥 null 반환
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date; // Invalid Date 방지
      };

      return {
        id: item.question_no ?? index, // null/undefined면 인덱스로 대체
        name: item.question_no ?? '-', // 질문번호
        country: {
          name: item.title || '제목없음', // 질문명
        },
        representative: {
          name: item.writer,
        },
        date: parseDate(item.created_at), // ✅ 안전한 날짜 변환
        balance: 0, // 더미 데이터
        status: item.answer_yn || 'N', // 상태값 기본값
      };
    });

    console.log('DB 데이터 로드 성공:', qna1.value);
  } catch (error) {
    console.error('백엔드 API 호출 실패:', error);
    // 에러 발생 시 빈 배열로 초기화하여 테이블이 깨지지 않게 함
    qna1.value = [];
  } finally {
    loading1.value = false; // 로딩 종료
  }
});

function goToQuestion() {
  router.push({
    name: 'question',
  });
}

function formatDate(value) {
  if (!value) return '';
  return value.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
function goToQuestionDetail(question_no) {
  router.push({
    name: 'questionDetail', // 라우터에 정의된 상세페이지 이름
    params: {
      question_no,
    },
  });
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Q&A</div>
    <DataTable
      :value="qna1"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      showGridlines
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            type="button"
            icon="pi pi-fw pi-pencil"
            label="질문하기"
            outlined
            @click="goToQuestion()"
          />
        </div>
      </template>
      <template #empty> No Q&A found. </template>
      <template #loading> Loading Q&A data. Please wait. </template>
      <Column field="name" header="번호" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
      </Column>
      <Column header="질문명" style="min-width: 12rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2" @click="goToQuestionDetail(data.id)">
            <span>{{ data.country.name }}</span>
          </div>
        </template>
      </Column>
      <Column header="작성자" style="min-width: 14rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.representative.name }}</span>
          </div>
        </template>
      </Column>
      <Column header="작성일" filterField="date" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
      </Column>
      <Column header="답변여부" style="min-width: 10rem">
        <template #body="{ data }">
          {{ data.status == 1 ? '답변완료' : '미응답' }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
