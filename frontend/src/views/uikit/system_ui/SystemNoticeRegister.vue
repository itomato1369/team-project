<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
// api.js에서 consultationApi 임포트 (가정)
// import { consultationApi } from '@/api/api';

// NOTE: useRouter는 Vue Router 4에서 사용되며,
// 이 환경에서는 작동하지 않을 수 있으나, 컴포넌트 구조 유지를 위해 포함합니다.
const router = useRouter();

// --- Reactive State ---

// 임시 저장 및 등록 버튼 상태
const isLoading = ref(false);
const isSubmitting = ref(false);

// 폼 데이터 상태 관리 (DB 스키마 기반)
const form = reactive({
  business_name: '', // 지원 사업명
  institution_name: '', // 담당 기관 명
  staff_name: '', // 사업 담당자 명
  disabled_type: '', // 지원 대상 장애 유헝
  business_start: '', // 사업 시작 일자
  business_end: '', // 사업 종료 일자
  content: '', // 지원 내용
  budget: '', // 지원 예산
  selected_count: '', // 선발 인원
});

// --- Methods ---

// 입력값 유효성 검사
function validateForm() {
  // NOTE: Canvas 환경에서는 console.error()로 대체합니다.
  if (!form.business_name.trim()) {
    console.error('지원 사업명을 입력해주세요.');
    return false;
  }
  if (!form.institution_name.trim()) {
    console.error('담당 기관명을 입력해주세요.');
    return false;
  }
  if (!form.staff_name.trim()) {
    console.error('사업 담당자를 입력해주세요.');
    return false;
  }
  if (!form.business_start || !form.business_end) {
    console.error('사업 시작일과 종료일 모두 입력해주세요.');
    return false;
  }
  if (!form.content.trim()) {
    console.error('내용을 입력해주세요.');
    return false;
  }
  // 예산/인원 수 숫자 검사 (빈 문자열이 아닐 경우)
  if (form.budget.trim() !== '' && isNaN(Number(form.budget))) {
    console.error('지원 예산을 숫자로 입력해주세요.');
    return false;
  }
  if (form.selected_count.trim() !== '' && isNaN(Number(form.selected_count))) {
    console.error('선발 인원 수를 숫자로 입력해 주세요.');
    return false;
  }
  return true;
}

// 임시저장 로직
async function handleDraft() {
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    // [API 호출 예시]
    // await consultationApi.saveDraft(form);
    console.log('임시저장 데이터:', { ...form });
    console.log('임시저장 되었습니다.');
  } catch (err) {
    console.error('임시저장 실패:', err);
  } finally {
    isLoading.value = false;
  }
}

// 등록 로직
async function handleSubmit() {
  if (isSubmitting.value) return;

  if (!validateForm()) {
    return;
  }
  isSubmitting.value = true;

  try {
    // budget, selected_count를 숫자로 변환
    const submitData = {
      ...form,
      budget: form.budget ? parseInt(form.budget) : null,
      selected_count: form.selected_count ? parseInt(form.selected_count) : null,
    };
    // 공고 등록 백엔드 API 호출
    await axios.post('/api/institutions/notices/register', submitData);
    console.log('새로운 공고가 등록되었습니다', submitData);
    // 등록 후 공고 목록 페이지로 이동
    goBackNoticeList();
  } catch (error) {
    console.error('공고 등록 실패', error);
  } finally {
    isSubmitting.value = false;
  }
}
const goBackNoticeList = () => {
  router.push({ name: 'sysNotice' });
  console.log('공고 목록 페이지로 이동 시뮬레이션');
};
</script>

<template>
  <div class="notice-register-container">
    <div class="content-wrapper">
      <!-- Header -->
      <div class="header-section">
        <h1 class="header-title">공고 등록</h1>

        <button @click="goBackNoticeList" class="btn-back-list">돌아가기</button>
      </div>

      <!-- Main Form Card -->
      <div class="form-card">
        <form @submit.prevent="handleSubmit" class="form-spacing">
          <div class="form-grid">
            <!-- 지원 사업명 -->
            <div class="form-field">
              <label for="business_name" class="field-label"> 지원 사업명 </label>
              <input
                type="text"
                id="business_name"
                v-model="form.business_name"
                class="input-field"
                placeholder="예: 2026 발달 장애인 지원 사업"
              />
            </div>

            <!-- 담당 기관 -->
            <div class="form-field">
              <label for="institution_name" class="field-label"> 담당 기관 </label>
              <input
                type="text"
                id="institution_name"
                v-model="form.institution_name"
                class="input-field"
                placeholder="예: 대한민국(행정복지부)"
              />
            </div>

            <!-- 사업 담당자 명 -->
            <div class="form-field">
              <label for="staff_name" class="field-label"> 사업 담당자 명 </label>
              <input
                type="text"
                id="staff_name"
                v-model="form.staff_name"
                class="input-field"
                placeholder="예: 김지수"
              />
            </div>

            <!-- 지원 대상 장애유형 -->
            <div class="form-field">
              <label for="disabled_type" class="field-label"> 지원 대상 </label>
              <input
                type="text"
                id="disabled_type"
                v-model="form.disabled_type"
                class="input-field"
                placeholder="예: 만 18세 이상 발달 장애인"
              />
            </div>

            <!-- 시작일자 -->
            <div class="form-field">
              <label for="business_start" class="field-label"> 시작 일자 </label>
              <input
                type="date"
                id="business_start"
                v-model="form.business_start"
                class="input-field"
                placeholder="예: 2025-11-12"
              />
            </div>
            <!-- 종료일자 -->
            <div class="form-field">
              <label for="business_end" class="field-label"> 종료 일자 </label>
              <input
                type="date"
                id="business_end"
                v-model="form.business_end"
                class="input-field"
                placeholder="예: 2026-11-12"
              />
            </div>

            <!-- 지원 내용-->
            <div class="form-field full-width">
              <label for="content" class="field-label">지원 내용</label>
              <textarea
                id="content"
                rows="8"
                v-model="form.content"
                class="textarea-field"
                placeholder="지원하려는 서비스의 상세 내용을 입력하세요."
              ></textarea>
            </div>

            <!-- 지원 예산 -->
            <div class="form-field">
              <label for="budget" class="field-label">지원 예산</label>
              <input
                type="text"
                id="budget"
                v-model="form.budget"
                class="input-field"
                placeholder="예: 총 예산 10억원 (숫자만 입력)"
              />
            </div>

            <!-- 선발 인원 수 -->
            <div class="form-field">
              <label for="selected_count" class="field-label">선발 인원 수</label>
              <input
                type="text"
                id="selected_count"
                v-model="form.selected_count"
                class="input-field"
                placeholder="예: 100명 (숫자만 입력)"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="button-group">
            <button type="button" @click="handleDraft" :disabled="isLoading" class="btn btn-draft">
              {{ isLoading ? '저장 중...' : '임시저장' }}
            </button>
            <button type="submit" :disabled="isSubmitting" class="btn btn-submit">
              {{ isSubmitting ? '등록 중...' : '등록' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ------------------------------------------------ */
/* 1. 글로벌 레이아웃 및 컨테이너 스타일 */
/* ------------------------------------------------ */

.notice-register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem; /* py-12, px-4 */
  background-color: #f9fafb; /* bg-gray-50 */
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.content-wrapper {
  width: 100%;
  max-width: 1024px; /* max-w-4xl */
}

/* ------------------------------------------------ */
/* 2. 헤더 섹션 (제목 및 돌아가기 버튼) */
/* ------------------------------------------------ */

.header-section {
  display: flex;
  justify-content: space-between; /* justify-between */
  align-items: center; /* items-center */
  margin-bottom: 2rem; /* mb-8 */
  padding-bottom: 0.5rem; /* 약간의 여백 추가 */
}

.header-title {
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700; /* font-bold */
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
/* 3. 메인 폼 카드 및 그리드 스타일 */
/* ------------------------------------------------ */

.form-card {
  background-color: white;
  border-radius: 1rem; /* rounded-2xl */
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow-sm */
  border: 1px solid #e5e7eb; /* border border-gray-200 */
  padding: 2rem; /* p-8 */
}

/* Medium 뷰포트 이상 (md:p-10) */
@media (min-width: 768px) {
  .form-card {
    padding: 2.5rem; /* p-10 */
  }
}

.form-spacing {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* space-y-8 */
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr; /* grid-cols-1 */
  gap: 2rem; /* gap-x-8 gap-y-8 */
}

/* Medium 뷰포트 이상 (md:grid-cols-2) */
@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 전체 너비 필드 (md:col-span-2) */
.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
}

/* ------------------------------------------------ */
/* 4. 라벨 및 인풋 필드 스타일 */
/* ------------------------------------------------ */

.field-label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 700; /* font-bold */
  color: #4b5563; /* text-gray-600 */
}

.input-field,
.textarea-field {
  display: block;
  width: 100%;
  border-radius: 0.375rem; /* rounded-md */
  border: 1px solid #d1d5db; /* border border-gray-300 */
  padding: 0.75rem 1rem; /* px-4 py-3 */
  color: #1f2937; /* text-gray-900 */
  font-size: 0.875rem; /* sm:text-sm */
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out; /* transition-colors */
  outline: none;
}

/* 플레이스홀더 스타일 */
.input-field::placeholder,
.textarea-field::placeholder {
  color: #9ca3af; /* placeholder-gray-400 */
}

/* 포커스 스타일 (focus:border-indigo-500 focus:ring-indigo-500) */
.input-field:focus,
.textarea-field:focus {
  border-color: #6366f1; /* indigo-500 */
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5); /* ring-indigo-500 with opacity */
}

.textarea-field {
  resize: vertical; /* resize-none 대신 vertical */
}

/* ------------------------------------------------ */
/* 5. 버튼 그룹 및 개별 버튼 스타일 */
/* ------------------------------------------------ */

.button-group {
  display: flex;
  justify-content: flex-end; /* justify-end */
  gap: 0.75rem; /* space-x-3 */
  padding-top: 1rem; /* pt-4 */
}

.btn {
  padding: 0.625rem 1.5rem; /* px-6 py-2.5 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  border-radius: 0.375rem; /* rounded-md */
  color: white; /* text-white */
  border: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    opacity 0.15s ease-in-out;
  outline: none;
}

.btn:focus {
  box-shadow:
    0 0 0 2px white,
    0 0 0 4px; /* focus:ring-2 focus:ring-offset-2 */
}

/* 임시저장 버튼 스타일 */
.btn-draft {
  background-color: #9ca3af; /* bg-gray-400 */
}
.btn-draft:hover {
  background-color: #6b7280; /* hover:bg-gray-500 */
}
.btn-draft:focus {
  box-shadow:
    0 0 0 2px white,
    0 0 0 4px #9ca3af; /* focus:ring-gray-400 */
}

/* 등록 버튼 스타일 (커스텀 인디고 색상) */
.btn-submit {
  background-color: #546be6;
}
.btn-submit:hover {
  background-color: #4356b8; /* 약간 어두운 호버 색상 */
}
.btn-submit:focus {
  box-shadow:
    0 0 0 2px white,
    0 0 0 4px #6366f1; /* focus:ring-indigo-500 */
}

/* Disabled 상태 스타일 */
.btn:disabled {
  opacity: 0.5; /* disabled:opacity-50 */
  cursor: not-allowed;
}

/* ------------------------------------------------ */
/* 6. 텍스트 에리어 스크롤바 스타일 */
/* ------------------------------------------------ */
.textarea-field::-webkit-scrollbar {
  width: 8px;
}
.textarea-field::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.textarea-field::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.textarea-field::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
