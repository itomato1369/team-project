<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// router에 변수 할당
const router = useRouter();

// DB에서 지원계획 목록을 비동기적으로 가져옴
const supportPlanAllList = ref([]);
// 기관명으로 검색하는 필터링
const supportPlanList = ref([]);

// DB에서 support_plan테이블 값을 가져옴
const getSupportPlanList = async () => {
  try {
    // 백엔드 API
    const response = await axios.get('/api/supportplans');
    // DB에서 가져온 데이터를 두 배열에 저장
    const data = await response.data;
    // 등록일 날짜 포맷팅
    const formattedData = data.map((plan) => ({
      ...plan,
      registered_at: plan.created_at
        ? new Date(plan.created_at).toLocaleDateString('ko-KR')
        : 'N/A',
    }));
    supportPlanAllList.value = formattedData;
    supportPlanList.value = formattedData;
  } catch (error) {
    console.error('SystemSupportplan.vue 호출 실패', error);
  }
};

// 검색을 위한 상태 선택 공통코드 사업신청상태코드 참조
const statusOptions = ref([
  { label: '전체상태', value: '0F' },
  { label: '승인대기', value: '2f' },
  { label: '반려', value: '3f' },
  { label: '승인', value: '4f' },
]);
// 공통코드로 사용한 2f, 3f, 4f, 변환
const getStatusText = (statusCode) => {
  switch (statusCode.toLowerCase()) {
    case '승인대기':
    case '2f':
      return '승인대기';
    case '반려':
    case '3f':
      return '반려';
    case '승인':
    case '4f':
      return '승인';
    default:
      return statusCode || '공통코드에 없는 코드';
  }
};

// 기본값은 전체 다 조회
const selectedStatus = ref(statusOptions.value[0]);
// 담당 기관명 검색으로 조회
const searchInstitutionName = ref('');

// 기관명 검색 함수
const performSearch = () => {
  // 상태 필터링
  let filteredList = supportPlanAllList.value;

  if (selectedStatus.value.value !== '0F') {
    const selectedValue = selectedStatus.value.value.toLowerCase();
    // 필터링 시 데이터 상대 값
    filteredList = filteredList.filter(
      (plan) => plan.status && plan.status.toLowerCase() === selectedValue
    );
  }
  // 담당 기관명 검색 필터링
  if (searchInstitutionName.value.trim() !== '') {
    const institution = searchInstitutionName.value.trim().toLowerCase();
    // 기관명을 기준으로 필터링
    filteredList = filteredList.filter(
      (plan) => plan.institution_name && plan.institution_name.toLowerCase().includes(institution)
    );
  }
  // 최종 결과를 반영
  supportPlanList.value = filteredList;
};

// 지원계획 등록하는 페이지로 이동
const goToRegisterSupportPlan = () => {
  router.push({ name: 'sysSupportPlanRegister' });
};
// 지원계획 상세정보 보기 페이지로 이동
const goToDetailSupportPlan = (data) => {
  router.push({ name: 'sysSupportPlanDetails', params: { id: data.support_plan_no } });
};

// vue 컴포넌트가 DOM에 처음 로드 될 때 실행
onMounted(() => {
  getSupportPlanList();
});
</script>

<template>
  <div class="support-plan-container">
    <h2 class="page-subtitle">지원계획 목록</h2>

    <div class="button-container">
      <Button
        icon="pi pi-plus"
        label="새로운 지원계획 등록"
        size="small"
        @click="goToRegisterSupportPlan"
      ></Button>
    </div>

    <div class="search-bar-container">
      <div class="search-item status-select">
        <Dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          optionLabel="label"
          placeholder="상태 선택"
        ></Dropdown>
      </div>

      <div class="search-item institution-name-input">
        <InputText
          v-model="searchInstitutionName"
          placeholder="담당 기관명 검색"
          @keyup.enter="performSearch"
        ></InputText>
      </div>

      <div class="search-item search-button">
        <Button icon="pi pi-search" label="검색" @click="performSearch"></Button>
      </div>
    </div>

    <div class="support-plan-list">
      <DataTable :value="supportPlanList" paginator :rows="10" class="p-datatable-gridlines">
        <Column field="support_plan_goal" header="지원사업목표"></Column>
        <Column field="institution_name" header="담당기관"></Column>
        <Column field="ward_name" header="지원대상"></Column>
        <Column field="support_plan_status" header="상태">
          <template #body="slotProps">
            <Tag :value="getStatusText(slotProps.data.status)"></Tag>
          </template>
        </Column>
        <Column field="created_at" header="등록일"></Column>
        <Column header="관리">
          <template #body="{ data }">
            <div class="action-cell">
              <Button
                icon="pi pi-file-o"
                label="상세보기"
                size="small"
                @click="goToDetailSupportPlan(data)"
              ></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
<style scoped>
/* -------------------------------------- */
/* 1. 컨테이너 및 기본 간격 스타일 (Tailwind 대체) */
/* -------------------------------------- */
.support-plan-container {
  /* Tailwind p-6 대체 */
  padding: 1.5rem;
}

/* h2 타이틀 하단 마진 */
.page-subtitle {
  font-size: 1.5rem; /* text-2xl */
  font-weight: bold; /* font-bold */
  margin-bottom: 1.5rem; /* mb-6 */
}

/* 등록 버튼 컨테이너 */
.button-container {
  margin-bottom: 1.5rem; /* mb-6 */
  display: flex;
  justify-content: flex-end; /* 맨 오른쪽으로 위치 */
}

/* 데이터 테이블 상단 마진 */
.support-plan-list {
  margin-top: 1.5rem; /* mt-6 */
}

/* 관리 컬럼 버튼 중앙 정렬 */
.action-cell {
  display: flex;
  justify-content: center;
}

/* -------------------------------------- */
/* 2. 검색 바 스타일 (반응형 및 밀착 디자인) */
/* -------------------------------------- */

/* 모바일 (768px 미만) 스타일: 기본적으로 세로로 쌓이고 전체 너비를 차지 */
.search-bar-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-item {
  width: 100%; /* 모바일에서 전체 너비를 차지 */
}

/* 768px 이상 (데스크톱) 스타일: 오른쪽 끝에 가로 정렬 및 완전 밀착 */
@media (min-width: 768px) {
  .support-plan-container {
    padding: 2.5rem; /* md:0-10 에 가까운 값 */
  }

  .search-bar-container {
    flex-direction: row;
    justify-content: flex-end; /* 오른쪽 끝으로 정렬 */
    gap: 0; /* 간격을 완전히 제거하여 요소들이 밀착되도록 함 */
  }

  /* 모든 search-item 내부의 PrimeVue 컴포넌트가 부모 너비를 가득 채우도록 설정 (필수) */
  .search-item :deep(.p-component) {
    width: 100%;
    margin: 0 !important;
  }

  /* Dropdown (상태 선택) 너비 고정 */
  .status-select {
    width: 110px;
    flex-shrink: 0;
  }

  /* InputText (기관명 검색) 너비 확장 및 고정 */
  .institution-name-input {
    width: 400px; /* 필드 너비를 400px로 확장 */
    flex-shrink: 0;
  }

  /* Button (검색 버튼) 너비 고정 */
  .search-button {
    width: 112px;
    flex-shrink: 0;
  }

  /* ------------------------------------------------ */
  /* --- 컴포넌트 경계선 및 모서리 조정 (완전 밀착을 위해 필수) --- */
  /* ------------------------------------------------ */

  /* 1. 상태 선택 (Dropdown) - 오른쪽 모서리 제거 및 오른쪽 경계선 제거 */
  .status-select :deep(.p-dropdown) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }

  /* 2. 기관명 검색창 (InputText) - 양쪽 모서리 및 경계선 조정 */
  .institution-name-input :deep(.p-inputtext) {
    border-radius: 0; /* 둥근 모서리 완전히 제거 */
    border-left: none;
    border-right: none;
  }

  /* 3. 검색 버튼 (Button) - 왼쪽 모서리 제거 및 왼쪽 경계선 조정 */
  .search-button :deep(.p-button) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }
}
</style>
