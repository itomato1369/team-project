<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const approvalCount = ref(0);
const institutionCount = ref(0);
const noticeCount = ref(0);

// DB에서 권한 승인 개수를 가져옴
const getApprovalCount = async () => {
  try {
    // backend 서버의 API
    const response = await axios.get('/api/institutions/approval/count');
    // 응답 데이터는 response.data 객체
    // 백엔드에서 { "total_count": 5 }
    const data = await response.data;

    approvalCount.value = data.total_count;
  } catch (error) {
    console.error('권한 승인 개수 오류', error);
  }
};

// DB에서 등록된 기관 수를 가져옴
const getInstitutionCount = async () => {
  try {
    // backend 서버의 API
    const response = await axios.get('/api/institutions/count');
    // 응답 데이터는 response.data 객체
    // { "total_count" : 5 }
    const data = await response.data;

    institutionCount.value = data.total_count;
  } catch (error) {
    console.error('등록된 기관 수 오류', error);
  }
};

// DB에서 등록된 공고 개수를 가져옴
const getNoticeCount = async () => {
  try {
    // backend 서버의 API
    const response = await axios.get('/api/institutions/notices/count');
    // 응답 데이터는 response.data 객체
    // { "total_count" : 5 }
    const data = await response.data;
    noticeCount.value = data.total_count;
  } catch (error) {
    console.error('등록된 공고 개수 오류', error);
  }
};

// 권한 승인 페이지로 이동
const goToApproval = () => {
  router.push({ name: 'sysApproval' });
};
// 총 기관 등록 열람 및 등록하는 페이지로 이동
const goToInstitutionList = () => {
  router.push({ name: 'sysInstitutionList' });
};
// 지원계획 폼 관리 수정
const goToSupportplan = () => {
  router.push({ name: 'sysNotice' });
};

// vue 컴포넌트가 마운트 된후 데이터를 가져옴
onMounted(() => {
  getApprovalCount();
  getInstitutionCount();
  getNoticeCount();
});
</script>

<template>
  <div class="dashboard-layout">
    <div class="main-content">
      <h1 class="page-title">시스템 관리자 메인페이지</h1>
      <p class="welcome-message">시스템 관리자님, 환영합니다.</p>
      <p class="summary-message">
        <strong>⚡️시스템의 주요 지표와 처리할 작업을 확인하십시오.⚡️</strong>
      </p>

      <div class="stat-cards-container">
        <Card class="stat-card" @click="goToApproval()">
          <template #title>승인 대기</template>
          <template #content>
            <div class="stat-value">
              <span class="count-blue">{{ approvalCount }}</span
              >건
            </div>
          </template>
        </Card>

        <Card class="stat-card" @click="goToInstitutionList()">
          <template #title>등록 기관</template>
          <template #content>
            <div class="stat-value">
              <span class="count-green">{{ institutionCount }}</span
              >건
            </div>
          </template>
        </Card>

        <Card class="stat-card" @click="goToSupportplan()">
          <template #title>사업공고</template>
          <template #content>
            <div class="stat-value">
              <span class="count-red">{{ noticeCount }}</span
              >건
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style>
/* 전체 레이아웃 (Sidebar + Main) */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  /* 전체 배경을 밝게 설정 */
  background-color: #f4f7f9;
  font-family: 'Inter', sans-serif;
}

/* 1. Sidebar 스타일 */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #dee2e6;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05); /* Sidebar에 그림자 추가 */
}

.sidebar .p-button {
  justify-content: flex-start; /* 텍스트 왼쪽 정렬 */
  font-size: 16px;
  color: #495057;
  padding: 12px;
  border-radius: 8px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar .p-button:hover {
  background-color: #f0f4f8;
}

.sidebar .p-button .p-button-icon {
  margin-right: 12px;
  font-size: 1.2rem;
}

/* 활성화된 메뉴(대시보드) 스타일 */
.sidebar .p-button.active {
  background-color: #eff6ff; /* PrimeVue blue-50 */
  color: #3b82f6; /* PrimeVue blue-500 */
  font-weight: 600;
}

/* 2. Main Content 스타일 */
.main-content {
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;
}

/* --- 헤더 강조 디자인 시작 --- */
.page-title {
  /* 크기 대폭 확장 */
  font-size: 3.2rem; /* 약 52px */
  font-weight: 800; /* Extra bold */
  margin-top: 0;
  margin-bottom: 8px;
  color: #1a202c; /* 다크 타이틀 색상 */
  line-height: 1.1;
  /* 아래쪽에 강조 선 추가 */
  border-bottom: 4px solid #3b82f6;
  padding-bottom: 15px;
  display: inline-block;
}

.welcome-message {
  /* 환영 메시지 크기 확장 및 색상 강조 */
  font-size: 1.75rem; /* 약 28px */
  color: #3b82f6; /* PrimeVue Blue-500으로 하이라이트 */
  font-weight: 500;
  margin-top: 25px; /* 제목과의 간격 */
  margin-bottom: 4px;
}

.summary-message {
  /* 요약 메시지 크기 확장 및 간격 조정 */
  font-size: 1.25rem; /* 약 20px */
  color: #495057;
  font-weight: 600; /* 굵게 */
  margin-bottom: 50px; /* 카드와의 간격 확장 */
}
/* --- 헤더 강조 디자인 끝 --- */

/* 3. Stat Cards (PDF 3번 영역) */
.stat-cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  /* P-Card 스타일 대체 */
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px; /* 둥근 모서리 */
  border: 1px solid #dee2e6; /* PDF의 테두리선 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* 더 두드러지는 그림자 */
}

.stat-card .p-card-title {
  font-size: 1.9rem;
  font-weight: 700;
  color: #6c757d; /* 연한 글씨색 */
  margin-bottom: 16px;
}

.stat-card .p-card-content {
  padding: 0;
}

.stat-value {
  font-size: 2.8rem; /* 약간 키움 */
  font-weight: 800; /* 굵게 */
  text-align: right;
  color: #343a40;
}

.stat-value .count-blue {
  color: #3b82f6; /* PrimeVue blue-500 */
  margin-right: 8px;
}

.stat-value .count-green {
  color: #22c55e; /* PrimeVue green-500 */
  margin-right: 8px;
}

.stat-value .count-red {
  color: #ef4444; /* PrimeVue red-500, PDF의 빨간색 */
  margin-right: 8px;
}

/* 4. DataTable (PDF 2번 영역) */
.table-container .p-datatable .p-datatable-thead > tr > th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.table-container .p-datatable .p-datatable-tbody > tr > td {
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 1rem;
}

/* 상태 태그 스타일 */
.p-tag {
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
