<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// 라우터 및 라우트 객체 사용

const route = useRoute();
const router = useRouter();

// 상세 정보를 저장할 반응형 변수
// 데이터를 받아올 때 까지 데이터 없음 상태
const noticeDetail = ref(null);

// 날짜 문자열 포맷팅하는 함수
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    // 날짜 객체가 유효하지 않는 오류 방지
    if (isNaN(date.getTime())) {
      return '유효하지 않은 날짜';
    }
    return date.toLocaleDateString();
  } catch (error) {
    console.error('날짜 포맷팅 함수 오류', error);
    return '날짜 포맷팅 함수 오류';
  }
};

// 공고 상세 정보를 불러옴
const getNoticeDetail = async () => {
  // URL 파라미터에서 ID값을 가져옴
  const id = route.params.id;

  if (!id) {
    console.error('notice_no가 URL에 없습니다');
    // 없다면 다시 돌아감
    router.push({ name: 'sysNotice' });
    return;
  }
  // 상세정보 API 호출
  try {
    const response = await axios.get(`/api/institutions/notices/${id}`);
    noticeDetail.value = response.data;
  } catch (error) {
    console.error('상세정보 호출 실패', error);
    if (error.response && error.response.status === 404) {
      console.error('해당 기관 정보 없음');
    }
  }
};

const goBackNoticeList = () => {
  router.push({ name: 'sysNotice' });
};
// vue가 처음 실행될 때
onMounted(() => {
  getNoticeDetail();
});
</script>

<template>
  <div class="notice-detail-container">
    <div class="content-wrapper">
      <div class="header-section">
        <h1 class="header-title">공고 상세보기</h1>
        <button @click="goBackNoticeList" class="btn-back-list">돌아가기</button>
      </div>

      <div v-if="noticeDetail" class="detail-card">
        <div class="detail-grid">
          <!-- 지원사업명 -->
          <div class="field-full">
            <label class="field-label">지원 사업명</label>
            <p class="business_name">{{ noticeDetail.business_name }}</p>
          </div>
          <!-- 담당기관 -->
          <div class="field-full">
            <label class="field-label">담당 기관</label>
            <p class="institution_name">{{ noticeDetail.institution_name }}</p>
          </div>
          <!-- 사업담당자명 -->
          <div class="field-full">
            <label class="field-label">사업 담당자명</label>
            <p class="staff_name">{{ noticeDetail.staff_name }}</p>
          </div>
          <!-- 지원대상 -->
          <div class="field-full">
            <label class="field-label">지원 대상</label>
            <p class="disabled_type">{{ noticeDetail.disabled_type }}</p>
          </div>
          <!-- 시작일자 -->
          <div class="field-full">
            <label class="field-label">시작 일자</label>
            <p class="business_start">{{ formatDate(noticeDetail.business_start) }}</p>
          </div>
          <!-- 종료일자 -->
          <div class="field-full">
            <label class="field-label">종료 일자</label>
            <p class="business_end">{{ formatDate(noticeDetail.business_end) }}</p>
          </div>
          <!-- 지원내용 -->
          <div class="field-full">
            <label class="field-label">지원 내용</label>
            <p class="content">{{ noticeDetail.content }}</p>
          </div>
          <!-- 지원 예산 -->
          <div class="field-full">
            <label class="field-label">지원 예산</label>
            <p class="budget">{{ noticeDetail.budget }}</p>
          </div>
          <!-- 선발인원 -->
          <div class="field-full">
            <label class="field-label">선발 인원</label>
            <p class="selected_count">{{ noticeDetail.selected_count }}</p>
          </div>
        </div>
      </div>

      <!-- 데이터가 없을 시 -->
      <div v-else class="loading-message">
        <svg
          class="loading-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p>상세 정보를 불러오는 중이거나 데이터가 없습니다</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ------------------------------------------------ */
/* 1. 글로벌 레이아웃 및 컨테이너 스타일 */
/* ------------------------------------------------ */

.notice-detail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem; /* py-12 px-4 */
  background-color: #f9fafb; /* bg-gray-50 */
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.content-wrapper {
  width: 100%;
  max-width: 1024px; /* max-w-4xl */
}

/* ------------------------------------------------ */
/* 2. 헤더 섹션 (제목 및 버튼) */
/* ------------------------------------------------ */

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem; /* mb-8 */
  border-bottom: 1px solid #e5e7eb; /* border-b pb-4 */
  padding-bottom: 1rem;
}

.header-title {
  font-size: 1.875rem; /* text-3xl */
  font-weight: 800; /* font-extrabold */
  color: #1f2937; /* text-gray-900 */
  letter-spacing: -0.025em; /* tracking-tight */
}

.btn-back-list {
  padding: 0.625rem 1.25rem; /* px-5 py-2.5 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 600; /* font-semibold */
  border-radius: 0.5rem; /* rounded-lg */
  background-color: #e5e7eb; /* bg-gray-200 */
  color: #374151; /* text-gray-700 */
  border: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
}

.btn-back-list:hover {
  background-color: #d1d5db; /* hover:bg-gray-300 */
}

/* ------------------------------------------------ */
/* 3. 상세 카드 및 그리드 스타일 */
/* ------------------------------------------------ */

.detail-card {
  background-color: white;
  border-radius: 1rem; /* rounded-2xl */
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
  border: 1px solid #f3f4f6; /* border border-gray-100 */
  overflow: hidden;
  padding: 2.5rem; /* p-10 */
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr; /* Default to 1 column */
  gap: 2rem; /* gap-8 */
}

/* Medium/Desktop 뷰포트 (md:grid-cols-2) */
@media (min-width: 768px) {
  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 2rem; /* gap-x-8 gap-y-8 */
  }
}

/* 지원 내용 섹션을 전체 너비로 확장 (CSS만 사용) */
/* .content-section을 명시적으로 추가하여 grid-column을 지정 */
.detail-grid .content-section {
  grid-column: 1 / -1;
  margin-top: 1.5rem; /* 섹션 간 간격 */
}

/* ------------------------------------------------ */
/* 4. 필드 및 라벨 스타일 */
/* ------------------------------------------------ */

.field-full {
  display: flex;
  flex-direction: column;
  /* space-y-1 equivalent */
}

.field-label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 700; /* font-bold */
  color: #4b5563; /* text-gray-600 */
  margin-bottom: 0.25rem;
}

/* 주요 정보 (지원 사업명, 담당 기관) 라벨 강조 */
.label-prominent {
  color: #4f46e5; /* text-indigo-600 */
}

/* 모든 데이터 값 텍스트 스타일 (.data-value) */
.data-value {
  font-size: 1rem;
  color: #1f2937; /* text-gray-900 */
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb; /* border-b-2 border-gray-200 */
  line-height: 1.5;
  margin: 0;
  /* 사업명/기관명은 좀 더 크게 */
}

.field-business-name .data-value,
.field-institution-name .data-value {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
}

/* ------------------------------------------------ */
/* 5. 지원 내용 섹션 스타일 */
/* ------------------------------------------------ */

.content-box {
  background-color: #f9fafb; /* bg-gray-50 */
  border-radius: 0.5rem; /* rounded-lg */
  padding: 1.25rem; /* p-5 */
  border: 1px solid #e5e7eb; /* border border-gray-200 */
  min-height: 100px; /* min-h-32 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06); /* shadow-inner */
  overflow-y: auto;
}

.data-content {
  color: #1f2937; /* text-gray-800 */
  white-space: pre-line; /* 줄바꿈 유지 */
  line-height: 1.75;
  padding: 0; /* content-box 안의 p 태그 패딩 제거 */
  border-bottom: none; /* content-box 안의 p 태그 경계선 제거 */
  margin: 0;
}

/* 스크롤바 스타일 (내용 섹션의 가독성 향상) */
.content-box::-webkit-scrollbar {
  width: 8px;
}
.content-box::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.content-box::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.content-box::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ------------------------------------------------ */
/* 6. 데이터 없음 메시지 스타일 */
/* ------------------------------------------------ */
.loading-message {
  text-align: center;
  padding: 5rem 0; /* py-20 */
  background-color: white;
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  font-size: 1.25rem; /* text-xl */
  font-weight: 500; /* font-medium */
  color: #6b7280; /* text-gray-500 */
}

.loading-icon {
  width: 2rem; /* w-8 */
  height: 2rem; /* h-8 */
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5rem;
  color: #818cf8; /* text-indigo-400 */
}
</style>
