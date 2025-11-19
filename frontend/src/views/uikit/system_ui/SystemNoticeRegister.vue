<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
// api.js에서 consultationApi 임포트 (가정)
// import { consultationApi } from '@/api/api';

const router = useRouter();
// --- Reactive State ---

// 임시 저장
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
  selected_count: 0,
});

// --- Methods ---

// 입력값 유효성 검사
function validateForm() {
  if (!form.business_name.trim()) {
    alert('지원 사업명을 입력해주세요.');
    return false;
  }
  if (!form.institution_name.trim()) {
    alert('담당 기관명을 입력해주세요.');
    return false;
  }
  if (!form.staff_name.trim()) {
    alert('사업 담당자를 입력해주세요.');
    return false;
  }
  if (!form.business_start || !form.business_end) {
    alert('사업 시작일과 종료일 모두 입력해주세요.');
    return false;
  }
  if (!form.content.trim()) {
    alert('내용을 입력해주세요.');
    return false;
  }
  if (!form.budget || isNaN(form.budget)) {
    alert('지원 예산을 숫자로 입력해주세요');
    return false;
  }
  if (!form.selected_count || isNaN(form.selected_count)) {
    alert('선발 인원 수를 숫자로 입력해 주세요');
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

    console.log('(API) 임시저장 데이터(Schema):', { ...form });
    alert('임시저장 되었습니다.');
  } catch (err) {
    console.error('임시저장 실패:', err);
    alert('임시저장 중 오류가 발생했습니다.');
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
      budget: parseInt(form.budget),
      selected_count: parseInt(form.selected_count),
    };
    // 공고 등록 백엔드 API 호출
    await axios.post('/api/institutions/notices/register', submitData);

    alert('새로운 공고가 등록되었습니다');
    // 등록 후 공고 목록 페이지로 이동
    router.push({ name: 'sysNotice' });
  } catch (error) {
    console.error('공고 등록 실패', error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
    <div class="w-full max-w-4xl">
      <!-- Header -->
      <div class="flex items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">공고 등록</h1>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Grid Container -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <!-- 지원 사업명  -->
            <div class="space-y-2">
              <label for="business_name" class="block text-sm font-bold text-gray-600">
                지원 사업명
              </label>
              <input
                type="text"
                id="business_name"
                v-model="form.business_name"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none transition-colors"
                placeholder="예: 2026 발달 장애인 지원 사업"
              />
            </div>

            <!-- 담당 기관  -->
            <div class="space-y-2">
              <label for="staffName" class="block text-sm font-bold text-gray-600">
                담당 기관
              </label>
              <input
                type="text"
                id="staffName"
                v-model="form.staff_name"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none transition-colors"
                placeholder="예: 대한민국(행정복지부)"
              />
            </div>

            <!-- 사업 담당자 명 (ward_name) -->
            <div class="space-y-2">
              <label for="wardName" class="block text-sm font-bold text-gray-600">
                사업 담당자 명
              </label>
              <input
                type="text"
                id="wardName"
                v-model="form.ward_name"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none transition-colors"
                placeholder="예: 김지수"
              />
            </div>

            <!-- 지원 대상 장애유형 -->
            <div class="space-y-2">
              <label for="wardName" class="block text-sm font-bold text-gray-600"> 지원대상 </label>
              <input
                type="text"
                id="wardName"
                v-model="form.ward_name"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none transition-colors"
                placeholder="예: 만 18세 이상 발달 장애인"
              />
            </div>

            <!-- 시작일자 -->
            <div class="space-y-2">
              <label for="wardName" class="block text-sm font-bold text-gray-600"> 시작일자 </label>
              <input
                type="text"
                id="wardName"
                v-model="form.ward_name"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none transition-colors"
                placeholder="예: 2025-11-12"
              />
            </div>
            <!-- 종료일자 -->
            <div class="space-y-2">
              <label for="wardName" class="block text-sm font-bold text-gray-600"> 종료일자 </label>
              <input
                type="text"
                id="wardName"
                v-model="form.ward_name"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none transition-colors"
                placeholder="예: 2026-11-12"
              />
            </div>

            <!-- 지원 내용 (content) -->
            <div class="col-span-1 md:col-span-2 space-y-2">
              <label for="content" class="block text-sm font-bold text-gray-600">
                상담 내용 (특이사항)
              </label>
              <textarea
                id="content"
                rows="8"
                v-model="form.content"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none resize-none transition-colors"
                placeholder="지원하려는 서비스의 상세 내용을 입력하세요."
              ></textarea>
            </div>

            <!-- 지원 예산 -->
            <div class="space-y-2">
              <label for="wardName" class="block text-sm font-bold text-gray-600">지원예산</label>
              <input
                type="text"
                id="wardName"
                v-model="form.ward_name"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none transition-colors"
                placeholder="예: 총 예산 10억원"
              />
            </div>

            <!-- 선발 인원 수 -->
            <div class="space-y-2">
              <label for="wardName" class="block text-sm font-bold text-gray-600"
                >선발 인원 수</label
              >
              <input
                type="text"
                id="wardName"
                v-model="form.ward_name"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none transition-colors"
                placeholder="예: 100명"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="handleDraft"
              :disabled="isLoading"
              class="px-6 py-2.5 bg-gray-400 text-white text-sm font-medium rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors disabled:opacity-50"
            >
              {{ isLoading ? '저장 중...' : '임시저장' }}
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2.5 bg-[#546BE6] text-white text-sm font-medium rounded-md hover:bg-[#4356b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? '등록 중...' : '등록' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  width: 8px;
}
textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
}
textarea::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
