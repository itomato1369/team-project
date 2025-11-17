<script setup>
import { onMounted, ref } from 'vue';

// 헤더 컴포넌트
import Breadcrumb from 'primevue/breadcrumb';
import DetailHeader from '@/components/DetailHeader.vue'; // DetailHeader 임포트

// 컨텐츠 컴포넌트
import UserMyPageList from '@/components/UserMyPageList.vue'; // 목록 컴포넌트
import UserSupportPlan from '@/components/UserSupportPlan.vue';
import UserSupportResult from '@/components/UserSupportResult.vue';

// PrimeVue 컴포넌트
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

// --- 상태 관리 ---
// 1. 현재 보여줄 화면을 결정하는 상태 ('list', 'plan', 'result')
const viewMode = ref('list'); 
// 2. 상세 보기에 사용할 데이터
const selectedProject = ref(null);
// 3. PrimeVue TabView가 사용할 활성 탭 인덱스
const activeTab = ref(1);

onMounted(() => {
  activeTab.value = 0;
});

// Breadcrumb 경로 아이템
const breadcrumbItems = ref([{ label: '마이페이지' }]);


// --- 이벤트 핸들러 ---
// 목록(UserMyPageList)에서 '조사지열람 > 열람하기' 버튼을 누르면 호출될 함수
const goToInquiry = (project) => {
    selectedProject.value = project;
    viewMode.value = 'inquiry';
}

// 목록(UserMyPageList)에서 '지원계획서 > 열람하기' 버튼을 누르면 호출될 함수
const goToPlan = (project) => {
  selectedProject.value = project;
  viewMode.value = 'plan';
};

// 목록(UserMyPageList)에서 '지원계획서 > 열람하기' 버튼을 누르면 호출될 함수
const goToResult = (project) => {
  selectedProject.value = project;
  viewMode.value = 'result';
};

// 상세 보기에서 '목록으로' 버튼을 누르면 호출될 함수
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
                <h2 class="page-title">신청 사업 목록</h2>
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
                <!-- UserMyPageList @go-to-inquiry="goToInquiry" -->
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
                <!-- 여기서 inquiry페이지 컴포넌트호출해야함 -->
            </TabPanel>
            <TabPanel header="상담내역">
                <p class="placeholder-text">상담내역 컨텐츠가 준비중입니다.</p>
            </TabPanel>
            <TabPanel header="내 정보 관리">
                <p class="placeholder-text">내 정보 관리 컨텐츠가 준비중입니다.</p>
            </TabPanel>
            <TabPanel header="피보호자 관리">
                <p class="placeholder-text">피보호자 관리 컨텐츠가 준비중입니다.</p>
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
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
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