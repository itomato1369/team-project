<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// route, router 에 변수 할당
const route = useRoute();
const router = useRouter();

// 수정할 데이터를 저장할 반응형 객체
const updateInstitution = ref({
  institution_name: '',
  phone: '',
  status: '',
  road_address: '',
  detail_address: '',
});

// 운영 상태 변경 (Dropdown 사용)
const statusOptions = ref([
  { name: '운영', code: '1s' },
  { name: '휴업', code: '2s' },
  { name: '폐업', code: '3s' },
]);

// 기존 상세 페이지에서 데이터 불러오기
const getInstitutionDetail = async () => {
  const id = route.params.id;
  if (!id) {
    console.error('기관 ID가 없습니다');
    router.back();
    return;
  }
  try {
    // 상세 페이지 API
    const response = await axios.get(`/api/institutions/${id}`);
    const data = response.data;
    // 수정할 필드 바인딩
    updateInstitution.value = {
      institution_name: data.institution_name,
      phone: data.phone,
      status: data.status,
      road_address: data.road_address,
      detail_address: data.detail_address,
    };
  } catch (error) {
    console.error('SystemInstitutionUpdate 오류', error);
    router.back();
  }
};

// DB수정 PUT 요청
const updateInstitutionData = async () => {
  const id = route.params.id;
  // 백엔드로 보낼 데이터
  const load = {
    institution_name: updateInstitution.value.institution_name,
    phone: updateInstitution.value.phone,
    status: updateInstitution.value.status,
  };

  try {
    // PUT 요청을 사용해여 업데이트 API
    await axios.put(`/api/institutions/${id}`, load);
    // 성공 시 바로 상세 정보 페이지로 이동
    router.push({ name: 'sysInstitutionDetails', params: { id: id } });
  } catch (error) {
    console.error('기관 정보 수정 실패', error);
  }
};

// 수정 취소 버튼
const goToDetail = () => {
  router.back();
};

// vue 컴포넌트가 DOM에 처음 로드 될 때 실행
onMounted(() => {
  getInstitutionDetail();
});
</script>

<template>
  <div class="institution-update-container">
    <h2 class="page-subtitle">기관 정보 수정</h2>
  </div>
  <div class="update-card">
    <div class="info-grid">
      <div class="field-full">
        <label class="field-label">기관명</label>
        <InputText
          v-model="updateInstitution.institution_name"
          placeholder="기관명 수정"
          class="field-value p-inputtext p-component"
        ></InputText>
      </div>

      <div class="detail-field">
        <label class="field-label">기관 연락처</label>
        <InputText
          v-model="updateInstitution.phone"
          placeholder="연락처 수정"
          class="field-value p-inputtext p-component"
        ></InputText>
      </div>

      <div class="detail-field">
        <label class="field-label">운영 상태</label>
        <!-- primevue에서 제공하는 기능 -->
        <Dropdown
          v-model="updateInstitution.status"
          :options="statusOptions"
          optionLabel="name"
          optionValue="code"
          placeholder="상태 수정"
          class="field-value"
        ></Dropdown>
      </div>

      <div class="field-full">
        <label class="field-label">도로명 주소</label>
        <p class="field-value">{{ updateInstitution.road_address }}</p>
      </div>

      <div class="field-full">
        <label class="field-label">상세주소</label>
        <p class="field-value">{{ updateInstitution.detail_address }}</p>
      </div>

      <div class="action-buttons field-full">
        <Button
          label="수정하기"
          icon="pi pi-check"
          severity="success"
          size="small"
          @click="updateInstitutionData"
        ></Button>
        <Button
          label="취소하기"
          icon="pi pi-times"
          severity="secondary"
          size="smaill"
          @click="goToDetail"
        ></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* -------------------------------------- */
/* 1. 컨테이너 및 기본 레이아웃 스타일 (클래스 이름: institution-update-container) */
/* -------------------------------------- */
.institution-update-container {
  /* 최대 너비: 900px */
  max-width: 900px;
  /* 중앙 정렬 */
  margin: 0 auto;
  /* 기본 패딩: 1.5rem (24px) */
  padding: 1.5rem;
}

/* 768px 이상일 때 패딩 증가 */
@media (min-width: 768px) {
  .institution-update-container {
    padding: 2.5rem; /* 40px */
  }
}

.page-subtitle {
  /* 글꼴 크기: 1.5rem (24px) */
  font-size: 1.5rem;
  /* 굵게 */
  font-weight: bold;
  /* 하단 마진: 2rem (32px) */
  margin-bottom: 2rem;
  /* 글꼴 색상: 어두운 회색 */
  color: #374151;
}

/* -------------------------------------- */
/* 2. 카드 스타일 (클래스 이름: update-card) */
/* -------------------------------------- */
.update-card {
  /* 배경색 흰색 */
  background-color: white;
  /* 내부 패딩: 1rem (16px) */
  padding: 1rem;
  /* 그림자 효과 (그림자-xl) */
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  /* 둥근 모서리: 0.75rem (12px) */
  border-radius: 0.75rem;
}

/* -------------------------------------- */
/* 3. 그리드 레이아웃 및 필드 스타일 */
/* -------------------------------------- */
.info-grid {
  /* CSS Grid 활성화 */
  display: grid;
  /* 모바일 기본: 1열 */
  grid-template-columns: 1fr;
  /* 열 간격: 3rem */
  column-gap: 3rem;
  /* 행 간격: 1rem */
  row-gap: 1rem;
}

/* 768px 이상일 때 2열 그리드 적용 */
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
.detail-field {
  padding-bottom: 1rem;
}

.field-label {
  font-weight: 600;
  color: #6b7280;
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

/* -------------------------------------- */
/* 4. 입력 필드 크기 및 값 스타일 (수정 및 읽기 전용) */
/* -------------------------------------- */

/* PrimeVue InputText, Dropdown의 기본 너비를 100%로 설정 */
.p-inputtext,
.p-dropdown {
  width: 100%;
}

/* 기관명 입력 필드: 화면이 너무 넓어도 적당한 크기를 유지 */
.field-full .field-value {
  max-width: 400px;
}

/* 도로명 주소, 상세 주소 (읽기 전용 <p> 태그) */
.field-full p.field-value {
  max-width: 600px;
}

/* 기관 연락처, 운영 상태 필드: 적당한 고정 너비 */
.detail-field .p-inputtext,
.detail-field .p-dropdown {
  width: 220px;
  min-width: 200px;
  max-width: 100%;
}

/* 입력/읽기 전용 필드 값 폰트 크기 */
.field-value {
  font-size: 1.125rem;
  color: #1f2937;
  /* 읽기 전용 <p> 태그가 InputText와 높이를 맞추도록 약간의 패딩 추가 */
  padding-top: 0.2rem;
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
</style>
