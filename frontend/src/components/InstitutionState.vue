<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const authStore = useAuthStore();

// --- 상태 관리 ---
const institutionInfo = ref(null); // 기관 및 관리자 정보를 저장할 변수
const isEditing = ref(false); // '변경하기' 모드 활성화 상태
const logInUserId = ref('');
logInUserId.value = authStore.user.id; // 로그인사용자 id 정보 피니아로 받아옴

const statusOptions = ref([
  { value: '1s', label: '운영' },
  { value: '2s', label: '휴업' },
  { value: '3s', label: '폐업' },
]);

// status 코드를 받아 해당하는 옵션 객체를 반환하는 헬퍼 함수
const mapStatusToOption = (statusCode) => {
  return statusOptions.value.find((s) => s.value === statusCode) || statusOptions.value[0]; // 기본값 '운영'
};

const institutionStatus = ref(mapStatusToOption('1s')); // 현재 기관 상태 (초기값)
const tempStatus = ref(mapStatusToOption('1s')); // 드롭다운에서 선택한 임시 상태 (초기값)

const breakDate = ref(null);
const closingNotice = ref('');

const isApplyButtonDisabled = computed(() => {
  if (tempStatus.value.value === '2s') {
    return !breakDate.value;
  }
  if (tempStatus.value.value === '3s') {
    return !closingNotice.value;
  }
  return false;
});

// --- 데이터 로딩 ---
const loadInstitutionInfo = async () => {
  if (!logInUserId.value) return;
  try {
    const response = await axios.get(`/api/user/institution-info/${logInUserId.value}`);
    institutionInfo.value = response.data.result;

    // 데이터 로딩 후 상태 업데이트
    if (institutionInfo.value) {
      if (institutionInfo.value.status) {
        institutionStatus.value = mapStatusToOption(institutionInfo.value.status);
        tempStatus.value = institutionStatus.value;
      }
      // closed_at 값이 있으면 breakDate에 설정
      if (institutionInfo.value.closed_at) {
        breakDate.value = new Date(institutionInfo.value.closed_at);
      }
    }
  } catch (error) {
    console.error('기관 정보를 불러오는 데 실패했습니다:', error);
  }
};

onMounted(() => {
  loadInstitutionInfo();
});

// --- 함수 ---
function startEditing() {
  isEditing.value = true;
}

function cancelEditing() {
  isEditing.value = false;
  tempStatus.value = institutionStatus.value; // 취소 시 원래 상태로 복구
}

async function applyStatusChange() {
  const institutionNo = institutionInfo.value?.institution_no;
  if (!institutionNo) {
    alert('기관 번호를 찾을 수 없습니다.');
    return;
  }

  // '운영' 상태일 때는 closed_at을 null로, 그 외에는 날짜 값으로 설정
  let closedDate = null;
  if ((tempStatus.value.value === '2s' || tempStatus.value.value === '3s') && breakDate.value) {
    // KST(UTC+9)를 고려하여 yyyy-MM-dd HH:mm:ss 형식으로 포맷
    const date = new Date(breakDate.value);
    const offset = date.getTimezoneOffset() * 60000;
    const kstDate = new Date(date.getTime() - offset);
    closedDate = kstDate.toISOString().slice(0, 19).replace('T', ' ');
  }

  const payload = {
    status: tempStatus.value.value,
    closed_at: closedDate,
  };

  if (tempStatus.value.value === '3s') {
    payload.closed_notice = closingNotice.value;
  }

  try {
    await axios.put(`/api/user/institution/${institutionNo}/status`, payload);

    alert('기관 상태가 성공적으로 변경되었습니다.');

    // UI 즉시 반영
    institutionStatus.value = tempStatus.value;
    isEditing.value = false;

    // 변경 후 데이터 다시 로드하여 최신 상태 확인
    loadInstitutionInfo();
  } catch (error) {
    console.error('기관 상태 변경에 실패했습니다:', error);
    alert('기관 상태 변경 중 오류가 발생했습니다.');
  }
}
</script>

<template>
  <div class="institution-state-container" v-if="institutionInfo">
    <h2 class="section-title">기관 상태 관리</h2>

    <!-- Display View (isEditing = false) -->
    <div v-if="!isEditing" class="display-section">
      <div class="status-display">
        <i class="pi pi-power-off status-icon"></i>
        <p v-if="institutionStatus.value === '2s'">
          {{ breakDate ? breakDate.toLocaleDateString() : '미정' }}까지 휴업입니다
        </p>
        <p v-else>
          현재 {{ institutionInfo.institution_name }}은
          <span :class="`status-text-${institutionStatus.value}`"
            >({{ institutionStatus.label }})</span
          >
          상태입니다
        </p>
      </div>
      <Button
        v-if="institutionInfo.role === 'ADMIN'"
        label="기관 상태 변경하기"
        @click="startEditing"
      />
    </div>

    <!-- Edit View (isEditing = true) -->
    <div v-else class="edit-section">
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12 p-md-6">
          <label for="status-dropdown">상태 목록</label>
          <Dropdown
            id="status-dropdown"
            v-model="tempStatus"
            :options="statusOptions"
            optionLabel="label"
            placeholder="상태 선택"
          ></Dropdown>
        </div>
      </div>

      <!-- Conditional Inputs -->
      <div v-if="tempStatus.value === '2s'" class="conditional-input">
        <label for="break-date">휴업 기간 입력</label>
        <Calendar id="break-date" v-model="breakDate" showIcon />
      </div>

      <div v-if="tempStatus.value === '3s'" class="conditional-input">
        <label for="closing-notice">기관 종료 공지</label>
        <Textarea
          id="closing-notice"
          v-model="closingNotice"
          rows="5"
          placeholder="공지 내용을 입력하세요."
        />
      </div>

      <div class="edit-actions" v-if="institutionInfo.role === 'ADMIN'">
        <Button label="취소" class="p-button-secondary" @click="cancelEditing" />
        <Button label="변경하기" @click="applyStatusChange" :disabled="isApplyButtonDisabled" />
      </div>
    </div>
  </div>
  <div v-else>
    <p>기관 정보를 불러오는 중입니다...</p>
  </div>
</template>

<style scoped>
.institution-state-container {
  padding: 2rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

/* Display View */
.display-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}
.status-display {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}
.status-icon {
  font-size: 3rem;
  margin-right: 1.5rem;
  color: #6c757d;
}
.status-display p {
  font-size: 1.25rem;
  margin: 0;
}
.status-text-1s {
  color: #28a745; /* green-500 for 운영 */
  font-weight: bold;
}
.status-text-2s {
  color: #ffc107; /* yellow-500 for 휴업 (or another appropriate color) */
  font-weight: bold;
}
.status-text-3s {
  color: #dc3545; /* red-500 for 폐업 */
  font-weight: bold;
}

/* Edit View */
.edit-section {
  padding: 1rem;
}
.conditional-input {
  margin-top: 1.5rem;
}
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 2rem;
}
label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}
</style>
