<script setup>
import { Column } from 'primevue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// router, route 변수에 할당
const router = useRouter();

// DB에서 기관 목록을 비동기적으로 가져 올 수 있도록 axios
const institutionAllList = ref([]);
// 필터링된 목록 검색 결과를 보여줌
const institutionList = ref([]);

// DB에서 기관 목록을 가져옴
const getInstitutionList = async () => {
  try {
    // backend 서버의 API
    const response = await axios.get('/api/institutions');

    // DB에서 가져온 데이터를 두 배열에 저장
    const data = await response.data;

    institutionAllList.value = data;
    institutionList.value = data;
  } catch (error) {
    console.error('기관 목록 호출에 실패', error);
  }
};

// 검색을 위한 상태 선택
const statusOptions = ref([
  { label: '전체상태', value: '0S' },
  { label: '운영', value: '1s' },
  { label: '휴업', value: '2s' },
  { label: '폐업', value: '3s' },
]);
// 공통코드로 사용한 1s,2s,3s를 변환
const getStatusText = (statusCode) => {
  switch (statusCode) {
    case '운영':
    case '1s':
      return '운영';
    case '휴업':
    case '2s':
      return '휴업';
    case '폐업':
    case '3s':
      return '폐업';
    default:
      return statusCode || '정의되지 않은 코드';
  }
};

// 기본값은 전체 ALL
const selectedStatus = ref(statusOptions.value[0]);
// 기관명 검색
const searchInstitution = ref('');

// 함수
// 기관명 검색 performSearch함수
const performSearch = () => {
  // 상태 필터링
  let filteredList = institutionAllList.value;

  if (selectedStatus.value.value !== '0S') {
    const selectedValue = selectedStatus.value.value.toLowerCase();

    // 필터링 시 데이터의 상태 값과, 선택된 값을 모두 소문자로 변환
    filteredList = filteredList.filter(
      (inst) => inst.status && inst.status.toLowerCase() === selectedValue
    );
  }
  // 기관명 검색 필터링
  if (searchInstitution.value.trim() !== '') {
    const institution = searchInstitution.value.trim().toLowerCase();
    filteredList = filteredList.filter(
      (inst) => inst.institution_name && inst.institution_name.toLowerCase().includes(institution)
    );
    // 최종 결과를 테이블 데이터에 반영
  }
  institutionList.value = filteredList;
};

// 기관 등록하는 페이지로 이동하는 함수
const goToRegisterInstitution = () => {
  router.push({ name: 'sysInstitutionRegister' });
};

// 기관 상세정보 보기 페이지로 이동하는 함수
const goToDetailInstitution = (data) => {
  router.push({ name: 'sysInstitutionDetails', params: { id: data.institution_no } });
};

// vue 컴포넌트가 DOM에 처음 로드 될 때 실행
onMounted(() => {
  getInstitutionList();
});
</script>

<template>
  <div class="institution-container p-6 md:0-10">
    <h2 class="page-subtitle text-2xl font-bold mb-6">등록된 기관 목록</h2>
    <!-- 새로운 기관 등록하는 버튼 -->
    <!-- 맨 오른쪽으로 위치 -->
    <div class="mb-6 flex justify-end">
      <Button
        icon="pi pi-plus"
        label="새로운 기관 등록"
        size="big"
        @click="goToRegisterInstitution"
      ></Button>
    </div>

    <!-- 검색 바 영역 -->
    <div class="search-bar-container">
      <!-- 상태 선택 -->
      <div class="search-item status-select">
        <!-- vue에서 제공하는 Dropdown기능 -->
        <Dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          optionLabel="label"
          placeholder="상태 선택"
        ></Dropdown>
      </div>
      <!-- 기관명 검색창 -->
      <div class="search-item institution-name-input">
        <!-- vue에서 제공하는 InputText -->
        <InputText
          v-model="searchInstitution"
          placeholder="기관명 검색"
          @keyup.enter="performSearch"
        ></InputText>
      </div>
      <!-- 검색 버튼 -->
      <div class="search-item search-button">
        <Button icon="pi pi-search" label="검색" @click="performSearch"></Button>
      </div>
    </div>

    <div class="institution-list mt-6">
      <DataTable :value="institutionList" paginator :rows="10" class="p-datatable-gridlines">
        <Column
          field="institution_name"
          header="기관명"
          style="width: 15%; min-width: 120px"
        ></Column>

        <Column field="phone" header="기관연락처" style="width: 15%; min-width: 120px"></Column>

        <Column field="road_address" header="주소" style="width: 15%; min-width: 120px"></Column>

        <Column field="status" header="운영상태" style="width: 15%; min-width: 120px">
          <template #body="slotProps">
            <Tag :value="getStatusText(slotProps.data.status)"></Tag>
          </template>
        </Column>

        <Column header="상세보기" style="width: 15%; min-width: 120px">
          <!-- Column 컴포넌트에서 특정 셀을 커스터마이징 하러면 
           #body를 활용 직접 디자인 하겠다 slotProps를 정의해야함-->
          <template #body="{ data }">
            <div class="flex justify-center">
              <Button
                icon="pi pi-file-o"
                label="기관상세보기"
                size="small"
                @click="goToDetailInstitution(data)"
              ></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
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
  .search-bar-container {
    flex-direction: row;
    justify-content: flex-end; /* 오른쪽 끝으로 정렬 */
    gap: 0; /* 간격을 완전히 제거하여 요소들이 밀착되도록 함 */
  }

  /* 모든 search-item 내부의 PrimeVue 컴포넌트가 부모 너비를 가득 채우도록 설정 (필수) */
  .search-item :deep(.p-component) {
    width: 100%;
    /* 내부 요소에 마진이 있다면 제거하여 부모 너비를 완전히 채우도록 함 */
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
    /* 다음 요소와 경계선을 공유하기 위해 오른쪽 경계선 제거 */
    border-right: none;
  }

  /* 2. 기관명 검색창 (InputText) - 양쪽 모서리 및 경계선 조정 */
  .institution-name-input :deep(.p-inputtext) {
    border-radius: 0; /* 둥근 모서리 완전히 제거 */
    /* 왼쪽/오른쪽 경계선을 제거하여 인접 요소와 붙도록 함 */
    border-left: none;
    border-right: none;
  }

  /* 3. 검색 버튼 (Button) - 왼쪽 모서리 제거 및 왼쪽 경계선 조정 */
  .search-button :deep(.p-button) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    /* InputText와 붙도록 버튼의 왼쪽 경계선을 제거 */
    border-left: none;
  }
}
</style>
