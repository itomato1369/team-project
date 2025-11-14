<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Chip from 'primevue/chip';
// IconField / InputIcon는 전역 또는 상위에서 등록되어 있다고 가정합니다.

// --- 이벤트를 emit 하기 위한 설정 ---
const emit = defineEmits(['search']);

// --- 상태 관리 (ref) ---
const searchQuery = ref(''); // 검색어 상태
const popularTags = ref(['#조사지 작성방법', '#피부양자 등록']); // 데이터 기반으로 태그 관리

// --- 검색 실행 함수 ---
const performSearch = () => {
  // 검색어가 있을 경우, 'search' 이벤트를 발생시켜 부모 컴포넌트로 검색어를 전달
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value);
  }
};

// --- Chip 클릭 시 검색 실행 함수 ---
const searchFromChip = (tag) => {
  if (tag && tag.startsWith('#')) {
    // '#'를 제거하고 검색어 상태를 업데이트
    searchQuery.value = tag.substring(1).trim();
    // 검색 실행
    performSearch();
  }
};
</script>

<template>
  <div class="search-bar-container">
    <!-- 검색 입력창 래퍼 -->
    <div class="search-input-wrapper">
      <!-- 검색창 (가운데 정렬 및 확장) -->
      <IconField iconPosition="left" class="search-field">
        <InputIcon class="pi pi-search" />
        <InputText
          type="text"
          placeholder="무엇이 궁금하신가요?"
          class="full-width"
          v-model="searchQuery"
          @keydown.enter="performSearch"
        />
      </IconField>
    </div>

    <!-- Chip들을 v-for로 렌더링하고 클릭 이벤트 추가 -->
    <div class="chip-row">
      <Chip
        v-for="tag in popularTags"
        :key="tag"
        :label="tag"
        class="clickable-chip"
        @click="searchFromChip(tag)"
      />
    </div>
  </div>
</template>

<style scoped>
.search-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;
}

/* --- 검색창 래퍼 스타일 --- */
.search-input-wrapper {
  width: 100%;
  max-width: 800px; /* 최대 너비 조정 */
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  align-items: stretch;
}

/* 검색창(IconField)이 남은 공간을 채우도록 설정 */
.search-field {
  flex-grow: 1;
  display: flex;
}

/* IconField 내부의 InputText가 100% 너비를 갖도록 함 */
.search-field .p-inputtext {
  width: 100%;
}

.full-width {
  width: 100%;
}

.chip-row {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* 클릭 가능한 Chip 스타일 추가 */
.clickable-chip {
  cursor: pointer;
  transition: background-color 0.2s;
}
.clickable-chip:hover {
  background-color: #e9ecef; /* PrimeVue의 기본 호버 색상과 유사하게 */
}
</style>

