<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Card from 'primevue/card';

// --- 상태 관리 ---
const query = ref('');
const searchResults = ref([]); // API 검색 결과를 담을 ref
const isLoading = ref(false);
const error = ref(null);

const selectedCategories = ref(['지원 계획', '사이트 메뉴명', '자료실']);
const sortBy = ref('recent'); // 기본 정렬
const page = ref(1);

// --- API 호출 ---
const performApiSearch = async () => {
  isLoading.value = true;
  error.value = null;
  
  const searchTerm = query.value.trim();
  let params = {};

  if (searchTerm) {
    if (searchTerm.startsWith('#')) {
      params.type = 'hashtag';
      params.term = searchTerm.substring(1);
    } else {
      params.type = 'general';
      params.term = searchTerm;
    }
  }
  
  try {
    const response = await axios.get('/api/user-board', { params });
    searchResults.value = response.data.result;
  } catch (err) {
    console.error("API search failed:", err);
    error.value = '검색 결과를 불러오는 데 실패했습니다.';
    searchResults.value = []; // 에러 발생 시 결과 초기화
  } finally {
    isLoading.value = false;
  }
};

// --- 생명주기 훅 ---
onMounted(() => {
  const queryFromState = history.state.searchQuery;
  if (queryFromState) {
    query.value = queryFromState;
  }
  performApiSearch(); // 컴포넌트 마운트 시 초기 검색 실행
});

// --- 클라이언트 측 필터링 및 정렬 ---
function resetFilters() {
  selectedCategories.value = ['지원 계획', '사이트 메뉴명', '자료실'];
}

const displayResults = computed(() => {
  let list = [...searchResults.value]; // 원본 배열을 변경하지 않기 위해 복사

  // 1. 카테고리 필터링 (클라이언트 측)
  const cats = selectedCategories.value;
  list = list.filter((r) => cats.includes(r.category));

  // 2. 정렬 (클라이언트 측)
  if (sortBy.value === 'recent') {
    list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  } else if (sortBy.value === 'oldest') {
    list.sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
  }
  
  return list;
});

const totalResults = computed(() => displayResults.value.length);

// --- 유틸리티 함수 ---
function highlightText(text, term) {
  if (!term) return escapeHtml(text);
  // 해시태그 검색 시 # 제거 후 하이라이트
  const cleanTerm = term.startsWith('#') ? term.substring(1) : term;
  if (!cleanTerm) return escapeHtml(text);
  
  const t = String(cleanTerm).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${t})`, 'gi');
  return escapeHtml(text).replace(re, '<strong class="hl">$1</strong>');
}
function escapeHtml(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function submitSearch() {
  page.value = 1;
  performApiSearch(); // Enter 키 입력 시 API 검색 실행
}

function doRefresh() {
  performApiSearch();
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

const categories = ['지원 계획', '사이트 메뉴명', '자료실'];
const filterCollapsed = ref(false);
function toggleFilterCollapsed() {
  filterCollapsed.value = !filterCollapsed.value;
}
</script>

<template>
  <section class="ts-search-root">
    <!-- 1. Breadcrumb -->
    <nav class="breadcrumb">
      <a href="/" class="crumb">홈</a>
      <span class="sep">›</span>
      <span class="crumb current">통합검색</span>
    </nav>

    <!-- 2. Search bar -->
    <div class="search-row">
      <div class="search-input">
        <InputText v-model="query" placeholder="무엇이 궁금하신가요? (#태그 검색 가능)" @keyup.enter="submitSearch" />
      </div>
      <div class="search-meta">
        <div class="applied">
          적용된 검색어: '{{ query || '전체' }}' · 검색 결과: {{ totalResults }}
        </div>
      </div>
    </div>

    <!-- 레이아웃: 사이드필터 + 메인결과 -->
    <div class="layout">
      <!-- 사이드 필터 (왼쪽) -->
      <aside class="side-filter" :class="{ collapsed: filterCollapsed }">
        <div class="filter-header">
          <h4>검색 필터</h4>
          <div>
            <button class="reset" @click="resetFilters" title="필터 초기화">⟲</button>
            <button class="collapse" @click="toggleFilterCollapsed" title="접기/펼치기">▾</button>
          </div>
        </div>
        <div class="filter-body" v-show="!filterCollapsed">
          <div class="filter-group">
            <label v-for="cat in categories" :key="cat" class="filter-item">
              <Checkbox v-model="selectedCategories" :inputId="cat" :value="cat" />
              <span class="label">{{ cat }}</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- 메인 콘텐츠 -->
      <main class="main-results">
        <!-- 정렬 옵션 (우측 상단) -->
        <div class="sort-row">
          <div class="sort-options">
            <a href="#" :class="{ active: sortBy === 'recent' }" @click.prevent="sortBy = 'recent'">최신순</a>
            <a href="#" :class="{ active: sortBy === 'oldest' }" @click.prevent="sortBy = 'oldest'">오래된 순</a>
          </div>
        </div>

        <!-- 로딩 및 에러 상태 표시 -->
        <div v-if="isLoading" class="status-message">검색 중...</div>
        <div v-else-if="error" class="status-message error">{{ error }}</div>
        
        <!-- 결과 그리드 -->
        <div v-else class="results-grid">
          <div v-if="displayResults.length === 0" class="no-results">검색 결과가 없습니다.</div>
          <div v-else class="grid">
            <Card v-for="item in displayResults" :key="item.board_no" class="result-card">
              <template #subtitle>
                <div class="card-subtitle">
                  <span>{{ item.institution_name }}</span>
                  <span v-if="item.writer"> | {{ item.writer }}</span>
                </div>
              </template>
              <template #title>
                <div class="card-title" v-html="highlightText(item.title, query)"></div>
              </template>
              <div class="card-body">
                <div class="excerpt" v-html="highlightText(item.content, query)"></div>
              </div>
              <template #footer>
                <div class="card-footer">
                  <div class="meta">
                    <span class="cat">{{ item.category }}</span>
                    <span class="date" v-if="item.updated_at">{{ item.updated_at.substring(0, 10) }}</span>
                  </div>
                  <div class="actions">
                    <!-- path가 없으므로 상세 페이지 이동은 비활성화 -->
                    <Button icon="pi pi-external-link" label="상세보기" class="p-button-text" disabled />
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </main>
    </div>
    
    <!-- 플로팅 버튼들 -->
    <div class="fab-group">
      <button class="fab" title="새로고침" @click="doRefresh">⟲</button>
      <button class="fab" title="위로" @click="scrollToTop">▲</button>
      <button class="fab" title="아래로" @click="scrollToBottom">▼</button>
    </div>
  </section>
</template>

<style scoped>
/* 기존 스타일 유지 */
.ts-search-root { padding: 1rem; max-width: 1200px; margin: 0 auto; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #222; }
.breadcrumb { display: flex; gap: 0.5rem; align-items: center; font-size: 0.95rem; margin-bottom: 0.75rem; }
.breadcrumb .crumb { color: #333; text-decoration: none; }
.breadcrumb .crumb.current { color: #666; pointer-events: none; }
.search-row { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
.search-input { flex: 1; }
.search-input :deep(.p-inputtext) { width: 100%; padding: 0.6rem 0.75rem; box-sizing: border-box; }
.search-meta .applied { color: #666; font-size: 0.9rem; }
.layout { display: flex; gap: 16px; align-items: flex-start; }
.side-filter { width: 280px; background: #fafafa; border: 1px solid #eee; padding: 12px; border-radius: 8px; box-sizing: border-box; }
.side-filter.collapsed .filter-body { display: none; }
.filter-header { display: flex; gap: 8px; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.reset, .collapse { background: transparent; border: none; cursor: pointer; font-size: 1rem; }
.filter-group { display: flex; flex-direction: column; gap: 8px; }
.filter-item { display: flex; gap: 8px; align-items: center; cursor: pointer; user-select: none; }
.main-results { flex: 1; min-width: 0; }
.sort-row { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.sort-options a { margin-left: 8px; color: #666; text-decoration: none; cursor: pointer; }
.sort-options a.active { font-weight: 700; color: #007ad9; }
.results-grid .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (max-width: 880px) { .results-grid .grid { grid-template-columns: 1fr; } }
.result-card { padding: 0; }
.result-card :deep(.p-card-subtitle) { padding: 12px 16px 0; } /* subtitle 패딩 추가 */
.result-card :deep(.p-card-title) { padding: 8px 16px; font-size: 1.1rem; border: none; }
.card-body { display: flex; gap: 12px; padding: 0 16px 12px; align-items: flex-start; }
.excerpt { color: #444; font-size: 0.95rem; }
.card-footer { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px 12px 12px; border-top: 1px solid #f2f2f2; }
.card-footer .meta { color: #777; font-size: 0.85rem; }
.hl { background: #fffbcc; padding: 0 2px; border-radius: 2px; }
.fab-group { position: fixed; right: 20px; bottom: 20px; display: flex; flex-direction: column; gap: 8px; z-index: 1200; }
.fab { width: 44px; height: 44px; border-radius: 50%; background: #111; color: #fff; border: none; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); }
.no-results, .status-message { padding: 24px; color: #777; text-align: center; }
.status-message.error { color: #d90000; }
@media (max-width: 980px) { .layout { flex-direction: column; } .side-filter { order: -1; width: 100%; } }
</style>


<style scoped>
/* 전체 레이아웃 */
.ts-search-root {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  color: #222;
}

/* 1. Breadcrumb */
.breadcrumb {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}
.breadcrumb .crumb {
  color: #333;
  text-decoration: none;
}
.breadcrumb .crumb.current {
  color: #666;
  pointer-events: none;
}

/* 2. Search row */
.search-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}
.search-input {
  flex: 1;
}
.search-input :deep(.p-inputtext) {
  width: 100%;
  padding: 0.6rem 0.75rem;
  box-sizing: border-box;
}
.search-meta .applied {
  color: #666;
  font-size: 0.9rem;
}

/* 레이아웃: 사이드 + 메인 */
.layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.side-filter {
  width: 280px;
  background: #fafafa;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 8px;
  box-sizing: border-box;
}
.side-filter.collapsed .filter-body {
  display: none;
}
.filter-header {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.reset,
.collapse {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.filter-item {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

/* main */
.main-results {
  flex: 1;
  min-width: 0;
}
.sort-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
.sort-options a {
  margin-left: 8px;
  color: #666;
  text-decoration: none;
  cursor: pointer;
}
.sort-options a.active {
  font-weight: 700;
  color: #007ad9;
}

/* 결과 그리드: 데스크톱 2열, 모바일 1열 */
.results-grid .grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (max-width: 880px) {
  .results-grid .grid {
    grid-template-columns: 1fr;
  }
}

/* 카드 내부 스타일 (primevue Card 확장) */
.result-card {
  padding: 0;
}
.result-card .p-card-title {
  padding: 12px 16px;
  font-size: 1rem;
  border-bottom: 1px solid #f0f0f0;
}
.card-body {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  align-items: flex-start;
}
.excerpt {
  color: #444;
  font-size: 0.95rem;
}

/* footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px 12px 12px;
  border-top: 1px solid #f2f2f2;
}
.card-footer .meta {
  color: #777;
  font-size: 0.85rem;
}
.actions {
}

/* 하이라이트 */
.hl {
  background: #fffbcc;
  padding: 0 2px;
  border-radius: 2px;
}

/* 플로팅 버튼 그룹 */
.fab-group {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1200;
}
.fab {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #111;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* no results */
.no-results {
  padding: 24px;
  color: #777;
}

/* 반응형: 필터가 상단으로 이동 (모바일) */
@media (max-width: 980px) {
  .layout {
    flex-direction: column;
  }
  .side-filter {
    order: -1;
    width: 100%;
  }
}
</style>
