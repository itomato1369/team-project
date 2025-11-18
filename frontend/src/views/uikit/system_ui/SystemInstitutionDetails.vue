<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// router, route에 변수 할당
const route = useRoute();
const router = useRouter();

// 상세 정보를 저장할 반응형 변수
// 데이터를 받아올 때까지 명확하게 '데이터 없음' 상태를 나타내도록 함
const institutionDetail = ref(null);

// 날짜 문자열을 포맷팅 하는 유틸리티 함수
// 2025-11-17T06:08:00.000Z 날짜와 시간이 복잡하게 섞인 문자열을
// Date String 날짜 문자열
// 포맷팅은 사용자가 이해할 수 있는 변환과정 2025년 11월 17일
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
    console.error('날짜 포맷팅 오류', error);
    return '날짜 포맷 오류';
  }
};

// 공통코드의 상태에 따라 텍스트 반환
const getStatusText = (status) => {
  if (!status) return '알 수 없음';

  const cleanStatus = status.trim().toLowerCase();

  switch (cleanStatus) {
    case '1s':
      return '운영';
    case '2s':
      return '휴업';
    case '3s':
      return '폐업';
    default:
      return cleanStatus;
  }
};

// 기관의 상세 정보를 DB에서 가져옴 PrimeVue 사용
const getInstitutionDetail = async () => {
  // URL 파라미터에서 ID 값을 가져옴
  const id = route.params.id;

  if (!id) {
    console.error('institution_no가 URL에 없습니다');
    // ID를 가져오지 못 했다면 목록으로 돌아감
    router.push({ name: 'sysInstitutionList' });
    return;
  }
  // 상세조회 API 호출
  try {
    const response = await axios.get(`/api/institutions/${id}`);
    institutionDetail.value = response.data;
  } catch (error) {
    console.error(`기관 상세정보 호출 실패(ID: ${id})`, error);
    // 에러 404가 아니면 에러 메시지 표시
    if (error.response && error.response.status === 404) {
      console.error('해당 기관 정보 없음');
    } else {
      console.error('SystemInstitutionDetails.vue 서버 오류 발생');
    }
    // 오류 발생 시 다시 목록으로 돌아감
    router.push({ name: 'sysInstitutionList' });
  }
};
// 등록된 기관 목록 보기 화면으로 돌아가기
const goToInstitutionList = () => {
  router.back();
};

const goToInstitutionUpdate = () => {
  // institution_no를 URL 파라미터로 넘겨줌
  const id = route.params.id;
  if (id) {
    router.push({ name: 'sysInstitutionUpdate', params: { id: id } });
  } else {
    console.error('수정 기관 ID가 없습니다');
  }
};
// vue 컴포넌트가 DOM에 처음 로드 될 때 실행
onMounted(() => {
  getInstitutionDetail();
});
</script>

<template>
  <div class="institution-detail-container">
    <h2 class="page-subtitle">기관 상세 정보</h2>
  </div>
  <!-- 상세 정보 표시 -->
  <div v-if="institutionDetail" class="detail-card">
    <div class="info-grid">
      <!-- 기관명 -->
      <div class="field-full">
        <label class="field-label">기관명</label>
        <p class="institution-name">{{ institutionDetail.institution_name }}</p>
      </div>

      <!-- 연락처 -->
      <div class="detail-field">
        <label class="field-label">기관 연락처</label>
        <p class="field-value">{{ institutionDetail.phone }}</p>
      </div>

      <!-- 운영 상태 -->
      <div class="detail-field">
        <label class="field-label">운영 상태</label>
        <Tag
          :value="getStatusText(institutionDetail.status)"
          :severity="
            institutionDetail.status === '1s'
              ? 'success'
              : institutionDetail.status === '2s'
                ? 'warning'
                : 'danger'
          "
        ></Tag>
      </div>

      <!-- 도로명 주소 -->
      <div class="field-full">
        <label class="field-label">도로명 주소</label>
        <p class="field-value">{{ institutionDetail.road_address }}</p>
      </div>
      <!-- 상세 주소 -->
      <div class="field-full">
        <label class="field-label">상세 주소</label>
        <p class="field-value">{{ institutionDetail.detail_address }}</p>
      </div>

      <!-- 상태 수정 일자 -->
      <div class="detail-field">
        <label class="field-label">기관정보 수정 일자</label>
        <p class="field-value">{{ formatDate(institutionDetail.updated_at) }}</p>
      </div>

      <div class="detail-field">
        <label class="field-label">폐업 일자</label>
        <p class="field-value">
          {{ institutionDetail.closed_at ? formatDate(institutionDetail.closed_at) : '' }}
        </p>
      </div>
      <!-- 수정 돌아가기 -->
      <div class="action-buttons">
        <Button
          label="수정"
          icon="pi pi-pencil"
          severity="secondary"
          size="small"
          @click="goToInstitutionUpdate"
        ></Button>
        <Button
          label="돌아가기"
          icon="pi pi-arrow-left"
          severity="primary"
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
.institution-detail-container {
  max-width: 900px; /* 최대 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  padding: 1.5rem; /* 기본 패딩 (p-6) */
}

/* 768px 이상일 때 패딩 증가 (md:p-10) */
@media (min-width: 768px) {
  .institution-detail-container {
    padding: 2.5rem;
  }
}

.page-subtitle {
  font-size: 1.5rem; /* text-2xl */
  font-weight: bold; /* font-bold */
  margin-bottom: 2rem; /* mb-8 (1rem = 16px 이므로 2rem = 32px) */
  color: #374151; /* 임의의 어두운 회색 */
}

/* -------------------------------------- */
/* 2. 카드 스타일 (상세 정보 표시 영역) */
/* -------------------------------------- */
.detail-card {
  background-color: white; /* surface-card */
  padding: 1rem; /* p-4 */
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
  border-radius: 0.75rem; /* rounded-xl (PrimeVue 기본값과 유사하게 설정) */
}

/* -------------------------------------- */
/* 3. 그리드 레이아웃 및 필드 스타일 */
/* -------------------------------------- */
.info-grid {
  display: grid;
  grid-template-columns: 1fr; /* 모바일: 1열 */
  column-gap: 3rem; /* gap-x-12 (3 * 0.25rem = 3rem) */
  row-gap: 1rem; /* gap-y-4 (1 * 0.25rem = 1rem) */
}

/* 768px 이상일 때 2열 그리드 적용 (md:grid-cols-2) */
@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.field-full {
  grid-column: span 1; /* col-span-2 대신 모바일에서 1열이므로 기본값 */
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .field-full {
    grid-column: span 2; /* 데스크톱에서 2열 사용 */
  }
}

.detail-field {
  padding-bottom: 1rem; /* 원래 필드 간격 유지 */
}

.field-label {
  font-weight: 600; /* font-semibold */
  color: #6b7280; /* text-gray-500 */
  display: block; /* block */
  margin-bottom: 0.25rem; /* mb-1 */
  font-size: 0.9rem;
}

.institution-name {
  font-size: 1.25rem; /* text-xl */
  font-weight: bold; /* font-bold */
  color: #1f2937; /* text-gray-800 */
}

.field-value {
  font-size: 1.125rem; /* text-lg */
  color: #1f2937; /* text-gray-800 */
}

/* -------------------------------------- */
/* 4. 액션 버튼 및 하단 스타일 */
/* -------------------------------------- */
.action-buttons {
  display: flex;
  justify-content: flex-end; /* justify-end */
  gap: 0.75rem; /* gap-3 */
  margin-top: 2rem; /* mt-8 */
  padding-top: 1rem; /* pt-4 */
  border-top: 1px solid #e5e7eb; /* border-t */
}

/* -------------------------------------- */
/* 5. 로딩 및 데이터 없음 상태 스타일 */
/* -------------------------------------- */
.loading-state {
  display: flex; /* flex */
  justify-content: center; /* justify-center */
  align-items: center; /* items-center */
  height: 10rem; /* h-40 */
}

.no-data-card {
  text-align: center; /* text-center */
  padding: 2.5rem; /* p-10 */
  background-color: #f9fafb; /* bg-gray-50 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow */
}

.no-data-icon {
  font-size: 2.5rem; /* text-4xl */
  color: #9ca3af; /* text-gray-400 */
}

.no-data-text {
  margin-top: 1rem; /* mt-4 */
  color: #4b5563; /* text-gray-600 */
}
</style>
