<script setup>
import { Column } from 'primevue';
import { ref } from 'vue';

// DB에서 기관 목록을 가져 올 수 있도록
const institutionAllList = ref([
  {
    institution_name: 'a기관',
    phone: '010-1234-5678',
    road_address: '도로명주소',
    detail_address: '상세주소',
    status: '1s', // 공통코드 참조
  },
]);
// 필터링된 목록 검색 결과를 보여줌
const institutionList = ref([...institutionAllList.value]);

// 검색을 위한 상태 선택
const statusOptions = ref([
  { label: '전체상태', value: '0S' },
  { label: '운영', value: '1s' },
  { label: '휴업', value: '2s' },
  { label: '폐업', value: '3s' },
]);

// 기본값은 전체 ALL
const selectedStatus = ref(statusOptions.value[0]);
// 기관명 검색
const searchInstitution = ref('');

// 함수
// 기관 등록하는 페이지로 이동하는 함수
const goToRegisterInstitution = () => {};
// 기관명 검색 performSearch함수
const performSearch = () => {
  // 상태 필터링
  let filteredList = institutionAllList.value;

  if (selectedStatus.value.value !== '0S') {
    filteredList = filteredList.filter((inst) => inst.status === selectedStatus.value.value);
  }
  // 기관명 검색 필터링
  if (searchInstitution.value.trim() !== '') {
    const institution = searchInstitution.value.trim().toLowerCase();
    filteredList = filteredList.filter((inst) =>
      inst.institution_name.toLowerCase().includes(institution)
    );
  }
  // 최종 결과를 테이블 데이터에 반영
  institutionList.value = filteredList;
};
// 기관 상세정보 보기 페이지로 이동하는 함수
const goToDetailInstitution = () => {};
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
    <div class="search-bar md:flex-row gap-2">
      <!-- 상태 선택 -->
      <div class="flex-shrink-0 w-full md:w-52">
        <!-- vue에서 제공하는 Dropdown기능 -->
        <Dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          optionLabel="label"
          placeholder="상태 선택"
        ></Dropdown>
      </div>
      <!-- 기관명 검색창 -->
      <div class="flex-grow">
        <!-- vue에서 제공하는 InputText -->
        <InputText
          v-model="searchInstitution"
          placeholder="기관명 검색"
          @keyup.enter="performSearch"
        ></InputText>
      </div>
      <!-- 검색 버튼 -->
      <div class="flex-shrink-0 w-full md:w-28">
        <Button icon="pi pi-search" label="검색" @click="performSearch"></Button>
      </div>
    </div>

    <div class="institution-list">
      <DataTable :value="institutionList" paginator :rows="10" class="p-datatable-gridlines">
        <Column
          field="institution_name"
          header="기관명"
          style="width: 15%; min-width: 120px"
        ></Column>

        <Column field="phone" header="기관번호" style="width: 15%; min-width: 120px"></Column>

        <Column field="road_address" header="주소" style="width: 15%; min-width: 120px"></Column>

        <Column field="status" header="운영상태" style="width: 15%; min-width: 120px">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status"></Tag>
          </template>
        </Column>

        <Column header="상세보기" style="width: 15%; min-width: 120px">
          <!-- #body는 직접 디자인 하겠다 -->
          <template #body="slotProps">
            <div class="flex justify-center">
              <Button
                icon="pi pi-file-o"
                label="기관상세보기"
                size="small"
                @click="goToDetailInstitution"
              ></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
