<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// 기관 정보를 저장할 반응형 변수
const newInstitution = ref({
  institution_name: '',
  phone: '',
  road_address: '',
  detail_address: '',
  status: '1s', // 최초의 기관 등록은 운영
});

// 등록 함수
const registerInstitution = async () => {
  // 유호성 검사
  if (!newInstitution.value.institution_name || !newInstitution.value.road_address) {
    console.warn('필수입력 항목을 입력하세요');
    return;
  }
  // 서버로 데이터 전송
  const load = {
    ...newInstitution.value,
    status: '1s',
  };
  // 백엔드 API
  try {
    await axios.post('/api/institutions/register', load);
    console.log('기관 등록 성공');
    router.push({ name: 'sysInstitutionList' });
  } catch (error) {
    console.error('기관 등록 실패', error);
  }
};

const goToInstitutionList = () => {
  // 현재 라우터 기준으로 뒤로
  router.back();
};
</script>
<template>
  <div class="institution-register-container">
    <h2 class="page-subtitle">새 기관 등록</h2>
    <button @click="goToInstitutionList" class="btn-back-list">돌아가기</button>
  </div>
  <div class="register-card">
    <div class="info-grid">
      <div class="field-full">
        <label class="field-label">기관명</label>
        <InputText
          v-model="newInstitution.institution_name"
          placeholder="기관명 입력"
          class="field-value p-inputtext p-component"
        ></InputText>
      </div>

      <div class="register-field">
        <label class="field-label">기관 연락처</label>
        <InputText
          v-model="newInstitution.phone"
          placeholder="연락처 입력"
          class="filed-value p-inputtext p-component"
        ></InputText>
      </div>

      <div class="field-full">
        <label class="field-label">도로명 주소</label>
        <InputText
          v-model="newInstitution.road_address"
          placeholder="도로명 주소"
          class="field-value p-inputtext p-component"
        ></InputText>
      </div>

      <div class="field-full">
        <label class="field-label">상세주소</label>
        <InputText
          v-model="newInstitution.detail_address"
          placeholder="상세 주소"
          class="field-value p-inputtext p-component"
        ></InputText>
      </div>

      <div class="action-buttons">
        <Button
          label="등록"
          icon="pi pi-check"
          severity="success"
          size="small"
          @click="registerInstitution"
        ></Button>
        <Button
          label="취소"
          icon="pi pi-times"
          severity="secondary"
          size="small"
          @click="goToInstitutionList"
        ></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* -------------------------------------- */
/* 1. 컨테이너 및 기본 레이아웃 스타일 */
/* -------------------------------------- */
.institution-register-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
}

@media (min-width: 768px) {
  .institution-register-container {
    padding: 2.5rem;
  }
}

/* -------------------------------------- */
/* 2. 헤더 섹션 (제목 및 돌아가기 버튼) 스타일 */
/* -------------------------------------- */
.header-section {
  display: flex;
  justify-content: space-between; /* 📢 이 속성으로 버튼이 오른쪽 끝으로 이동합니다. */
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.025em;
  margin: 0;
}

/* 돌아가기 버튼 스타일 */
.btn-back-list {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.5rem;
  background-color: #e5e7eb;
  color: #374151;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-back-list:hover {
  background-color: #d1d5db;
}

/* -------------------------------------- */
/* 3. 카드 스타일 (register-card) */
/* -------------------------------------- */
.register-card {
  background-color: white;
  padding: 1rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 0.75rem;
}

/* -------------------------------------- */
/* 4. 그리드 레이아웃 및 필드 스타일 */
/* -------------------------------------- */
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 3rem;
  row-gap: 1rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* 전체 너비 필드 */
.field-full {
  grid-column: span 1;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .field-full {
    grid-column: span 2;
  }
}

/* 1칸 필드 */
.register-field {
  padding-bottom: 1rem;
}

.field-label {
  font-weight: 600;
  color: #4b5563;
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

/* 입력 필드 크기 및 스타일 */
.p-inputtext {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  outline: none;
}
.p-inputtext:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 1px #6366f1;
}

.field-value {
  font-size: 1rem;
  color: #1f2937;
}

/* 기관명 입력 필드 */
.field-full .field-value {
  max-width: 400px;
}

/* 도로명 주소, 상세 주소 필드 */
.field-full:nth-child(4) .field-value,
.field-full:nth-child(5) .field-value {
  max-width: 600px;
}

/* 기관 연락처 필드 */
.register-field .field-value {
  width: 220px;
  min-width: 200px;
  max-width: 100%;
}

/* -------------------------------------- */
/* 5. 액션 버튼 및 하단 스타일 */
/* -------------------------------------- */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

@media (min-width: 768px) {
  .action-buttons {
    grid-column: span 2;
  }
}

/* PrimeVue Button 기본 스타일 오버라이드 (Tailwind 느낌으로) */
.p-button {
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.15s ease-in-out;
}
</style>
