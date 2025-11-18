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
}

@media (min-width: 768px) {
  .institution-register-container {
    padding: 2.5rem;
  }
}

.page-subtitle {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #374151;
}

/* -------------------------------------- */
/* 2. 카드 스타일 (register-card) */
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
/* 3. 그리드 레이아웃 및 필드 스타일 */
/* -------------------------------------- */
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 3rem;
  row-gap: 1rem;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* 전체 너비 필드 (기관명, 도로명 주소, 상세주소) */
.field-full {
  grid-column: span 1;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .field-full {
    grid-column: span 2; /* 데스크톱: 2열 모두 차지 */
  }
}

/* 1칸 필드 (연락처, 상태 등) */
.register-field {
  padding-bottom: 1rem;
}

.field-label {
  font-weight: 600;
  color: #6b7280;
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

/* ====================================== */
/* 📢 입력 필드 크기 수정 부분 (중간 크기) */
/* ====================================== */

/* PrimeVue InputText 컴포넌트의 기본 너비를 100%로 설정한 뒤 개별 필드에서 최대/고정 너비를 지정합니다. */
.p-inputtext {
  width: 100%;
}

/* 기관명 입력 필드: 15글자 이상 보이고, 화면이 너무 넓어도 적당한 크기를 유지 */
/* .field-value는 InputText에 적용된 클래스 */
.field-full .field-value {
  /* 모바일에서는 100% 유지. 데스크톱에서 최대 400px로 제한 */
  max-width: 400px;
}

/* 도로명 주소, 상세 주소 필드: 20자 이상 보이고, 화면이 넓어도 적당한 크기를 유지 */
/* 주소는 기관명보다 길 수 있으므로 넉넉하게 설정 */
.field-full:nth-child(4) .field-value, /* 도로명 주소 (field-full 중 4번째) */
.field-full:nth-child(5) .field-value {
  /* 상세 주소 (field-full 중 5번째) */
  max-width: 600px;
}

/* 기관 연락처 필드: 010-1123-5555를 여유롭게 표시하는 고정 너비 */
.register-field .field-value {
  width: 220px; /* 넉넉하게 220px로 설정 */
  min-width: 200px;
  max-width: 100%;
}

/* 입력 필드 폰트 크기 */
.field-value {
  font-size: 1.125rem;
  color: #1f2937;
}

/* -------------------------------------- */
/* 4. 액션 버튼 및 하단 스타일 */
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
</style>
