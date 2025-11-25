<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// router에 변수 할당
const router = useRouter();

// DB에서 공고 목록을 비동기적으로 가져옴
const noticeAllList = ref([]);
// 기관명으로 검색하는 필터링
const noticeList = ref([]);

// 기관명 검색
const searchInstitution = ref('');

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '유효하지 않은 날짜';
    }
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {
    return '날짜 포맷 오류';
  }
};

// DB에서 notice 테이블 값을 가져옴
const getNoticeList = async () => {
  try {
    // 백엔드 API
    const response = await axios.get('/api/institutions/allnotice');
    // DB에서 가져온 데이터를 두 배열에 저장
    const data = await response.data;
    // 등록일 날짜 포맷팅
    const formattedDate = data.map((plan) => ({
      ...plan,
      start_at: formatDate(plan.business_start),
    }));
    noticeAllList.value = formattedDate;
    noticeList.value = formattedDate;
  } catch (error) {
    console.error('SystemNotice.vue 호출 실패', error);
  }
};

// 기관명 검색 함수
const performSearch = () => {
  // 전체 데이터를 기준으로 필터링
  let filteredList = noticeAllList.value;
  // 상태 필터링

  // 담당 기관명 검색 필터링
  if (searchInstitution.value.trim() !== '') {
    const institution = searchInstitution.value.trim().toLowerCase();
    // 기관명을 기준으로 필터링
    filteredList = filteredList.filter(
      (plan) => plan.institution_name && plan.institution_name.toLowerCase().includes(institution)
    );
  }
  // 최종 결과를 반영
  noticeList.value = filteredList;
};

// 공고 등록하는 페이지로 이동
const goToRegisterNotice = () => {
  router.push({ name: 'sysNoticeRegister' });
};
// 공고 상세정보 보기 페이지로 이동
const goToDetailNotice = (data) => {
  router.push({ name: 'sysNoticeDetails', params: { id: data.notice_no } });
};

// vue 컴포넌트가 DOM에 처음 로드 될 때 실행
onMounted(() => {
  getNoticeList();
});
</script>

<template>
  <div class="support-plan-container">
    <h2 class="page-subtitle">공고 목록</h2>

    <div class="button-container">
      <Button
        icon="pi pi-plus"
        label="새로운 공고 등록"
        size="small"
        @click="goToRegisterNotice"
      ></Button>
    </div>

    <div class="search-bar-container">
      <div class="search-item institution-name-input">
        <InputText
          v-model="searchInstitution"
          placeholder="담당 기관명 검색"
          @keyup.enter="performSearch"
        ></InputText>
      </div>

      <div class="search-item search-button">
        <Button icon="pi pi-search" label="검색" @click="performSearch"></Button>
      </div>
    </div>

    <div class="support-plan-list">
      <DataTable :value="noticeList" paginator :rows="10" class="p-datatable-gridlines">
        <Column field="institution_name" header="담당기관"></Column>
        <Column field="staff_name" header="사업 담당자 명"></Column>
        <Column field="disabled_type" header="지원 대상 장애 유형"></Column>
        <Column field="business_name" header="지원사업 명"> </Column>
        <Column field="start_at" header="사업 시작 일자"></Column>
        <Column header="관리">
          <template #body="{ data }">
            <div class="action-cell">
              <Button
                icon="pi pi-file-o"
                label="상세보기"
                size="small"
                @click="goToDetailNotice(data)"
              ></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
/* ======================================= */
/* 0. 기본 컨테이너 및 제목 스타일 */
/* ======================================= */
.support-plan-container {
  padding: 30px 20px;
  background-color: #f7f9fc; /* 부드러운 배경 */
  min-height: 100vh;
}

.page-subtitle {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e6ed;
}

/* 등록 버튼 컨테이너 */
.button-container {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end; /* 맨 오른쪽으로 위치 */
}

/* 관리 컬럼 버튼 중앙 정렬 */
.action-cell {
  display: flex;
  justify-content: center;
  gap: 0.5rem; /* 버튼 간격 추가 */
}

/* ======================================= */
/* 1. 검색 바 컨테이너 (반응형 유지) */
/* ======================================= */

/* 모바일 (768px 미만) 스타일: 기본적으로 세로로 쌓이고 전체 너비를 차지 */
.search-bar-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 간격 조금 늘림 */
  margin-bottom: 1.5rem;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 은은한 그림자 추가 */
}

.search-item {
  width: 100%;
}

/* 768px 이상 (데스크톱) 스타일: 오른쪽 끝에 가로 정렬 및 완전 밀착 */
@media (min-width: 768px) {
  .search-bar-container {
    flex-direction: row;
    justify-content: flex-end; /* 오른쪽 끝으로 정렬 */
    gap: 0; /* 간격을 완전히 제거하여 요소들이 밀착되도록 함 */
    padding: 0; /* 데스크톱에서 요소들이 밀착되도록 패딩 제거 */
    box-shadow: none; /* 데스크톱에서 카드 그림자 제거 (테이블에만 적용) */
    background-color: transparent;
  }

  /* PrimeVue 컴포넌트 내부를 :deep()로 타겟팅하여 부모 너비를 채우도록 설정 */
  .search-item :deep(.p-component) {
    width: 100%;
    margin: 0;
  }

  /* Dropdown (상태 선택) 너비 고정 */
  .status-select {
    width: 110px;
    flex-shrink: 0;
  }

  /* InputText (담당 기관명 검색) 너비 확장 및 고정 */
  .institution-name-input {
    width: 300px; /* 필드 너비 조정 */
    flex-shrink: 0;
  }

  /* Button (검색 버튼) 너비 고정 */
  .search-button {
    width: 100px;
    flex-shrink: 0;
  }

  /* ------------------------------------------------ */
  /* --- 컴포넌트 경계선 및 모서리 조정 (완전 밀착을 위해 보강) --- */
  /* ------------------------------------------------ */

  /* 1. 상태 선택 (Dropdown) */
  .status-select :deep(.p-dropdown) {
    /* 오른쪽 모서리 둥글게 제거 */
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    /* 다음 요소와 경계선을 공유하기 위해 오른쪽 경계선 제거 */
    border-right: none;
  }

  /* 2. 기관명 검색창 (InputText) */
  .institution-name-input :deep(.p-inputtext) {
    border-radius: 0; /* 둥근 모서리 완전히 제거 */
    /* 왼쪽/오른쪽 경계선 제거 */
    border-left: none;
    border-right: none;
  }

  /* 3. 검색 버튼 (Button) */
  .search-button :deep(.p-button) {
    /* 왼쪽 모서리 둥글게 제거 */
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    /* InputText와 붙도록 버튼의 왼쪽 경계선을 제거 */
    border-left: 1px solid #e0e6ed; /* 안정적인 회색 사용 */
  }
}

/* ======================================= */
/* 2. 데이터 테이블 스타일 (카드 디자인 적용) */
/* ======================================= */
.support-plan-list {
  /* 템플릿의 mt-6 클래스를 대체/보강 */
  margin-top: 1.5rem;
  background-color: #ffffff;
  border-radius: 10px; /* 둥근 모서리 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); /* 깊이감 있는 그림자 */
  overflow: hidden; /* 테이블의 둥근 모서리를 위해 */
}

/* DataTable 헤더 스타일 */
.support-plan-list :deep(.p-datatable-thead th) {
  background-color: #4a6fa5; /* 헤더 배경색: 세련된 파란색 */
  color: #ffffff; /* 헤더 텍스트: 흰색 */
  font-weight: 600;
  text-align: center;
  border-color: #3f6093; /* 헤더 경계선 색상 조정 */
  padding: 12px 10px;
}

/* DataTable 바디 셀 스타일 */
.support-plan-list :deep(.p-datatable-tbody td) {
  font-size: 14px;
  color: #495057;
  vertical-align: middle;
  border-color: #e9ecef;
  padding: 10px;
}

/* 테이블 행 호버 효과 */
.support-plan-list :deep(.p-datatable-tbody tr:not(.p-highlight):hover) {
  background-color: #f0f7ff; /* 마우스 오버 시 연한 하늘색 배경 */
  transition: background-color 0.2s ease;
  cursor: pointer;
}

/* 상세보기 버튼 스타일 보강 */
.support-plan-list .action-cell button {
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 4px;
}
</style>
