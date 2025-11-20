<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { consultLogApi } from '@/api/api.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const isSubmitting = ref(false);
const surveyList = ref([]);
const isEditing = ref(false); // 수정 모드 상태

const isViewMode = computed(() => !!route.query.consultNo);

const form = reactive({
  staff_id: '',
  staff_name: '',
  ward_no: '',
  ward_name: '',
  guardian_id: '',
  guardian_name: '',
  consult_datetime: '',
  disabled_level: '중증',
  consult_status: '진행중',
  content: '',
  survey_no: '',
  res_no: null,
});

async function fetchSurveyList(wardId) {
  try {
    const res = await consultLogApi.getSurveysByWard(wardId);
    surveyList.value = res.data.surveys || [];
  } catch (err) {
    console.error('조사지 조회 실패:', err);
  }
}

async function fetchLogDetail(consultNo) {
  try {
    isLoading.value = true;
    const res = await consultLogApi.getLogDetail(consultNo);
    const data = res.data.data || res.data;

    form.staff_id = data.staff_id;
    form.staff_name = data.staff_name;
    form.ward_no = data.ward_no;
    form.ward_name = data.ward_name;
    form.guardian_id = data.guardian_id;
    form.guardian_name = data.guardian_name;

    if (data.consult_datetime) {
      form.consult_datetime = data.consult_datetime.split('T')[0];
    }

    form.disabled_level = data.disabled_level;
    form.consult_status = data.consult_status;
    form.content = data.content;
    form.survey_no = data.survey_no;
    form.res_no = data.res_no;

    if (form.ward_no) await fetchSurveyList(form.ward_no);
  } catch (err) {
    console.error('상세 조회 실패:', err);
    alert('상담 기록을 불러올 수 없습니다.');
    router.back();
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  if (authStore.user && authStore.user.name) {
    form.staff_id = authStore.user.id;
    form.staff_name = authStore.user.name;
  }

  const query = route.query;

  if (isViewMode.value) {
    await fetchLogDetail(query.consultNo);
  } else {
    if (query.wardNo) {
      form.ward_no = query.wardNo;
      await fetchSurveyList(query.wardNo);
    }
    if (query.resNo) form.res_no = query.resNo;
    if (query.wardName) form.ward_name = query.wardName;
    if (query.guardianId) form.guardian_id = query.guardianId;
    if (query.applicantName) form.guardian_name = query.applicantName;

    if (query.reservationDate) {
      try {
        const datePart = query.reservationDate.split('T')[0];
        form.consult_datetime = datePart;
      } catch (e) {
        form.consult_datetime = query.reservationDate;
      }
    }
  }
});

function validateForm() {
  if (!form.staff_name) return alert('담당 직원 정보가 없습니다.');
  if (!form.ward_name) return alert('피보호자 정보가 없습니다.');
  if (!form.consult_datetime) return alert('상담 일시를 입력해주세요.');
  if (!form.content.trim()) return alert('상담 내용을 입력해주세요.');
  return true;
}

async function handleDraft() {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    await consultLogApi.saveDraft({ ...form });
    alert('임시저장 되었습니다.');
  } catch (err) {
    console.error('임시저장 실패:', err);
    alert('오류 발생');
  } finally {
    isLoading.value = false;
  }
}

async function handleSubmit() {
  if (isSubmitting.value) return;
  if (!validateForm()) return;
  if (!confirm('상담 일지를 등록하시겠습니까?')) return;

  try {
    isSubmitting.value = true;
    const payload = {
      content: form.content,
      consult_datetime: form.consult_datetime,
      guardian_id: form.guardian_id || null,
      staff_id: form.staff_id,
      consult_status: form.consult_status,
      disabled_level: form.disabled_level,
      survey_no: form.survey_no ? Number(form.survey_no) : null,
      res_no: form.res_no ? Number(form.res_no) : null,
      ward_no: form.ward_no,
    };
    await consultLogApi.createLog(payload);
    alert('등록 완료');
    router.push('/reservations');
  } catch (err) {
    console.error('등록 실패:', err);
    alert('등록 오류');
  } finally {
    isSubmitting.value = false;
  }
}

function handleEdit() {
  isEditing.value = true;
}

async function handleUpdate() {
  if (isSubmitting.value) return;
  if (!validateForm()) return;
  if (!confirm('상담 일지를 수정하시겠습니까?')) return;

  try {
    isSubmitting.value = true;

    // [수정] API 호출 인자 분리
    // 1. 수정할 상담 번호 추출
    const consultNo = route.query.consultNo;

    // 2. 전송할 데이터 (Payload)
    const payload = {
      content: form.content,
      consult_datetime: form.consult_datetime,
      guardian_id: form.guardian_id || null,
      staff_id: form.staff_id,
      consult_status: form.consult_status,
      disabled_level: form.disabled_level,
      survey_no: form.survey_no ? Number(form.survey_no) : null,
      res_no: form.res_no ? Number(form.res_no) : null,
      ward_no: form.ward_no,
    };

    // 3. API 호출: (ID, Payload) 순서로 전달
    await consultLogApi.updateLog(consultNo, payload);

    alert('수정 완료');
    isEditing.value = false;
    await fetchLogDetail(consultNo);
  } catch (err) {
    console.error('수정 실패:', err);
    alert('수정 오류');
  } finally {
    isSubmitting.value = false;
  }
}

function goBack() {
  router.back();
}

function downloadPdf() {
  alert('PDF 다운로드 기능');
}
</script>

<template>
  <div class="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
    <div class="w-full max-w-4xl">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
          {{ isViewMode ? (isEditing ? '상담 일지 수정' : '상담 일지 상세') : '상담 일지 작성' }}
        </h1>
        <span
          v-if="isViewMode"
          class="px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800"
        >
          {{ form.consult_status }}
        </span>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
        <form @submit.prevent="isViewMode ? handleUpdate() : handleSubmit()" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-600">담당 직원명</label>
              <input
                type="text"
                v-model="form.staff_name"
                readonly
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:border-gray-300 focus:ring-0 sm:text-sm outline-none"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-600">조사지 선택</label>
              <select
                v-model="form.survey_no"
                :disabled="isViewMode && !isEditing"
                :class="isViewMode && !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 sm:text-sm"
              >
                <option value="" disabled>조사지를 선택하세요</option>
                <option v-for="s in surveyList" :key="s.survey_no" :value="s.survey_no">
                  {{ s.business_name }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-600">보호자명</label>
              <input
                type="text"
                v-model="form.guardian_name"
                readonly
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:border-gray-300 focus:ring-0 sm:text-sm outline-none"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-600">보호자 ID</label>
              <input
                type="text"
                v-model="form.guardian_id"
                readonly
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:border-gray-300 focus:ring-0 sm:text-sm outline-none"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-600">피보호자 ID</label>
              <input
                type="text"
                v-model="form.ward_no"
                readonly
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:border-gray-300 focus:ring-0 sm:text-sm outline-none"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-600">피보호자명</label>
              <input
                type="text"
                v-model="form.ward_name"
                readonly
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:border-gray-300 focus:ring-0 sm:text-sm outline-none"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-600">상담 일시</label>
              <input
                type="date"
                v-model="form.consult_datetime"
                :readonly="isViewMode && !isEditing"
                :class="isViewMode && !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 sm:text-sm outline-none"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-600">장애 정도</label>
              <select
                v-model="form.disabled_level"
                :disabled="isViewMode && !isEditing"
                :class="isViewMode && !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 sm:text-sm"
              >
                <option value="중증">중증</option>
                <option value="경증">경증</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-600">상담 상태</label>
              <select
                v-model="form.consult_status"
                :disabled="isViewMode && !isEditing"
                :class="isViewMode && !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 sm:text-sm"
              >
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
                <option value="취소">취소</option>
              </select>
            </div>

            <div class="col-span-1 md:col-span-2 space-y-2">
              <label class="block text-sm font-bold text-gray-600">상담 내용 (특이사항)</label>
              <textarea
                v-model="form.content"
                rows="8"
                :readonly="isViewMode && !isEditing"
                :class="isViewMode && !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'"
                class="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 sm:text-sm outline-none resize-none"
                placeholder="상담 내용을 입력하세요."
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-4">
            <template v-if="isViewMode">
              <button
                type="button"
                @click="goBack"
                class="px-6 py-2.5 bg-gray-400 text-white text-sm font-medium rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
              >
                목록으로
              </button>
              <button
                v-if="!isEditing"
                type="button"
                @click="handleEdit"
                class="px-6 py-2.5 bg-[#546BE6] text-white text-sm font-medium rounded-md hover:bg-[#4356b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                수정
              </button>
              <button
                v-else
                type="button"
                @click="handleUpdate"
                :disabled="isSubmitting"
                class="px-6 py-2.5 bg-[#16a34a] text-white text-sm font-medium rounded-md hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
              >
                {{ isSubmitting ? '수정 중...' : '수정 완료' }}
              </button>
              <button
                type="button"
                @click="downloadPdf"
                class="px-6 py-2.5 bg-[#546BE6] text-white text-sm font-medium rounded-md hover:bg-[#4356b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  ></path>
                </svg>
                PDF 다운로드
              </button>
            </template>

            <template v-else>
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
            </template>
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
