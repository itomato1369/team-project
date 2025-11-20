<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 헤더 컴포넌트
import Breadcrumb from 'primevue/breadcrumb';
import DetailHeader from '@/components/DetailHeader.vue'; // DetailHeader 임포트

// 컨텐츠 컴포넌트
import UserMyPageList from '@/components/UserMyPageList.vue'; // 목록 컴포넌트
import UserSupportPlan from '@/components/UserSupportPlan.vue';
import UserSupportResult from '@/components/UserSupportResult.vue';
import UserMyInfoUpdate from '@/components/UserMyInfoUpdate.vue'; // 내 정보 관리 컴포넌트
import UserWardInfoUpdate from '@/components/UserWardInfoUpdate.vue'; // 피보호자 관리 컴포넌트

// PrimeVue 컴포넌트
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const route = useRoute();
const router = useRouter();

// --- 상태 관리 ---
const viewMode = ref('list');
const selectedProject = ref(null);
const activeTab = ref(0); // 기본값을 0으로 설정
const loggedInUserId = 'test'; // As per instructions

const tabTitles = ['신청 사업 목록', '상담내역', '내 정보 관리', '피보호자 관리'];
const currentTabTitle = computed(() => tabTitles[activeTab.value] || '마이페이지');

// 1. URL 쿼리 변경 감지 -> activeTab 업데이트
watch(
  () => route.query.tab,
  (newTab) => {
    const tabIndex = parseInt(newTab, 10);
    if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < tabTitles.length) {
      activeTab.value = tabIndex;
    }
  },
  { immediate: true }
);

// 2. activeTab 변경 감지 -> URL 쿼리 업데이트
watch(activeTab, (newIndex) => {
  // URL이 이미 동기화된 상태이면 중복 업데이트 방지
  if (route.query.tab !== newIndex.toString()) {
    router.push({ query: { tab: newIndex } });
  }
});

onMounted(() => {
  // 초기 로드 시 URL에 탭 정보가 없으면 첫 번째 탭으로 설정하고 URL 업데이트
  if (route.query.tab === undefined) {
    activeTab.value = 0;
    router.replace({ query: { tab: 0 } });
  }
});

// Breadcrumb 경로 아이템
const breadcrumbItems = ref([{ label: '마이페이지' }]);

// --- 이벤트 핸들러 ---
const goToPlan = (project) => {
  selectedProject.value = project;
  viewMode.value = 'plan';
};
const goToResult = (project) => {
  selectedProject.value = project;
  viewMode.value = 'result';
};
const goBackToList = () => {
  selectedProject.value = null;
  viewMode.value = 'list';
};
</script>

<template>
  <div class="card">
    <!-- 1. 상단 영역: viewMode에 따라 동적으로 헤더 교체 -->
    <template v-if="viewMode === 'list'">
      <Breadcrumb :home="{ icon: 'pi pi-home', url: '/' }" :model="breadcrumbItems" />
      <div class="title-section">
        <h2 class="page-title">{{ currentTabTitle }}</h2>
        <Button label="메인 페이지로" icon="pi pi-arrow-right" icon-pos="right" />
      </div>
    </template>
    <template v-else>
      <!-- 상세 보기 시 DetailHeader를 표시합니다. -->
      <DetailHeader :title="viewMode === 'plan' ? '지원 계획 열람' : '결과 확인'" />
    </template>

    <!-- 2. 탭 메뉴 영역 (항상 표시) -->
    <TabView v-model:activeIndex="activeTab">
      <TabPanel header="신청 사업 목록">
        <!-- '신청 사업 목록' 탭 내부 컨텐츠: viewMode에 따라 동적으로 교체 -->
        <UserMyPageList
          v-if="viewMode === 'list'"
          @go-to-plan="goToPlan"
          @go-to-result="goToResult"
        />
        <UserSupportPlan
          v-else-if="viewMode === 'plan'"
          :project="selectedProject"
          @back="goBackToList"
        />
        <UserSupportResult
          v-else-if="viewMode === 'result'"
          :project="selectedProject"
          @back="goBackToList"
        />
      </TabPanel>
      <TabPanel header="상담내역">
        <p class="placeholder-text">상담내역 컨텐츠가 준비중입니다.</p>
      </TabPanel>
      <TabPanel header="내 정보 관리">
        <UserMyInfoUpdate />
      </TabPanel>
      <TabPanel header="피보호자 관리">
        <UserWardInfoUpdate :userId="loggedInUserId" />
      </TabPanel>
    </TabView>
  </div>
</template>

<style scoped>
/* 기존 스타일과 동일 */
.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow:
    0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.page-title {
  font-size: 2rem;
  font-weight: bold;
}
.placeholder-text {
  margin-top: 2rem;
  text-align: center;
  color: #6c757d;
}
</style>
