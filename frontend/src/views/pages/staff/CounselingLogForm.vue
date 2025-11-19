<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // 1. authStore 임포트
import { consultLogApi } from '@/api/api.js';

// --- Reactive State ---
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore(); // authStore 인스턴스 생성
const isLoading = ref(false);
const isSubmitting = ref(false);
const surveyList = ref([]); // [신규] 조사지 목록 저장

// 폼 데이터 (DB 스키마 1:1 매핑)
const form = reactive({
  staff_id: '', // [변경] staff_name -> staff_id (DB 스키마 기준)
  staff_name: '', // (화면 표시용)
  ward_id: '', // 피보호자 ID
  ward_name: '', // 피보호자명
  guardian_id: '', // 보호자 ID (Nullable)
  consult_datetime: '',
  disabled_level: '중증', // [변경] 기본값 '중증'
  consult_status: '진행중',
  content: '',
  survey_no: '', // [신규] 조사지 번호 (FK, NOT NULL)
  res_no: null, // [신규] 예약 번호 (FK, Nullable)
});

// 상담예약목록에서 넘어온 데이터 반영
onMounted(() => {
  // 2. 로그인된 사용자(담당자) 이름 자동 할당
  if (authStore.user && authStore.user.name) {
    form.staff_name = authStore.user.name;
  }

  const query = route.query;

  // 1. 피보호자명 (wardName) -> form.ward_name
  if (query.wardName) {
    form.ward_name = query.wardName;
  }
  if (query.guardianId) {
    form.guardian_id = query.guardianId;
  }
  // 2. 상담 일시 (reservationDate) -> form.consult_datetime
  // HTML date 타입은 'YYYY-MM-DD' 형식을 요구하므로 포맷팅 필요
  if (query.reservationDate) {
    try {
      // ISO String (2024-01-01T10:00:00) -> 2024-01-01 추출
      const datePart = query.reservationDate.split('T')[0];
      form.consult_datetime = datePart;
    } catch (e) {
      console.error('Date parsing error:', e);
      form.consult_datetime = query.reservationDate;
    }
  }

  // 3. 신청인(보호자) 이름 (applicantName)
  // 스키마에 별도 컬럼이 없으므로, '상담 내용'에 자동으로 기입해두거나 참고용으로 사용
  if (query.applicantName) {
    form.guardian_name = query.applicantName;
  }

  // 4. 예약 번호 (atNo)
  // 추후 등록 API 호출 시 예약 상태 업데이트를 위해 필요하다면 별도 변수에 저장
  if (query.atNo) {
    console.log('Linked Reservation ID:', query.atNo);
  }
});

// --- Methods ---

// 입력값 유효성 검사
function validateForm() {
  if (!form.staff_name.trim()) {
    alert('담당 직원명을 입력해주세요.');
    return false;
  }
  if (!form.ward_name.trim()) {
    alert('피보호자명을 입력해주세요.');
    return false;
  }
  if (!form.consult_datetime) {
    alert('상담 일시를 입력해주세요.');
    return false;
  }
  if (!form.content.trim()) {
    alert('상담 내용을 입력해주세요.');
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
  if (!validateForm()) return;

  if (!confirm('상담 일지를 등록하시겠습니까?')) return;

  try {
    isSubmitting.value = true;

    await consultLogApi.createLog(form);

    alert('상담 일지가 성공적으로 등록되었습니다.');

    // 등록 성공 후 초기화 또는 이동
    router.push('/staff/reservations');
  } catch (err) {
    console.error('등록 실패:', err);
    alert('등록 중 오류가 발생했습니다.');
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
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">상담 일지 작성</h1>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Grid Container -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <!-- 담당 직원명 (staff_name) -->
            <div class="space-y-2">
              <label for="staffName" class="block text-sm font-bold text-gray-600">
                담당 직원명
              </label>
              <input
                type="text"
                id="staffName"
                v-model="form.staff_name"
                readonly
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:border-gray-300 focus:ring-0 sm:text-sm outline-none"
              />
            </div>

            <!-- 상담 일시 (consult_datetime) -->
            <div class="space-y-2">
              <label for="consultDatetime" class="block text-sm font-bold text-gray-600">
                상담 일시
              </label>
              <input
                type="date"
                id="consultDatetime"
                v-model="form.consult_datetime"
                readonly
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:border-gray-300 focus:ring-0 sm:text-sm outline-none"
              />
            </div>
            <!-- 보호자명 (guardian_name) -->
            <div class="space-y-2">
              <label for="guardianName" class="block text-sm font-bold text-gray-600">
                보호자명
              </label>
              <input
                type="text"
                id="guardianName"
                v-model="form.guardian_name"
                readonly
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:border-gray-300 focus:ring-0 sm:text-sm outline-none"
                placeholder="보호자 이름"
              />
            </div>

            <!-- 보호자 ID (guardian_id) -->
            <div class="space-y-2">
              <label for="guardianId" class="block text-sm font-bold text-gray-600">
                보호자 ID
              </label>
              <input
                type="text"
                id="guardianId"
                v-model="form.guardian_id"
                readonly
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:border-gray-300 focus:ring-0 sm:text-sm outline-none"
                placeholder="보호자 ID"
              />
            </div>

            <!-- 피보호자명 (ward_name) -->
            <div class="space-y-2">
              <label for="wardName" class="block text-sm font-bold text-gray-600">
                피보호자명 (발달장애인)
              </label>
              <input
                type="text"
                id="wardName"
                v-model="form.ward_name"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:border-gray-300 focus:ring-0 sm:text-sm outline-none"
              />
            </div>

            <!-- 장애 정도 (disabled_level) -->
            <div class="space-y-2">
              <label for="disabledLevel" class="block text-sm font-bold text-gray-600">
                장애 정도
              </label>
              <div class="relative">
                <select
                  id="disabledLevel"
                  v-model="form.disabled_level"
                  class="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors cursor-pointer"
                >
                  <option value="심함">심함</option>
                  <option value="심하지 않음">심하지 않음</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                >
                  <svg
                    class="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- 상담 상태 (consult_status) - New -->
            <div class="space-y-2">
              <label for="consultStatus" class="block text-sm font-bold text-gray-600">
                상담 상태
              </label>
              <div class="relative">
                <select
                  id="consultStatus"
                  v-model="form.consult_status"
                  class="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors cursor-pointer"
                >
                  <option value="진행중">진행중</option>
                  <option value="완료">완료</option>
                  <option value="보류">보류</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                >
                  <svg
                    class="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- 상담 내용 (content) -->
            <div class="col-span-1 md:col-span-2 space-y-2">
              <label for="content" class="block text-sm font-bold text-gray-600">
                상담 내용 (특이사항)
              </label>
              <textarea
                id="content"
                rows="8"
                v-model="form.content"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none resize-none transition-colors"
                placeholder="상담 내용을 입력하세요."
              ></textarea>
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
